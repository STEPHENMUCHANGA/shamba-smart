from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import re
import hashlib
import os
import requests

# ------------------------------
# Flask App Initialization
# ------------------------------
app = Flask(__name__)

CORS(app, origins=[
    os.getenv("FRONTEND_URL"),
    "https://shambasmart.vercel.app",
], supports_credentials=True)

# ------------------------------
# Simple in-memory user "database"
# ------------------------------
users = {}

# ------------------------------
# Gemini API Setup
# ------------------------------
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable is missing!")

GEMINI_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    "gemini-pro:generateContent?key=" + GEMINI_API_KEY
)

# ------------------------------
# Authentication Routes
# ------------------------------
@app.route("/api/signup", methods=["POST"])
def signup():
    data = request.get_json()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return jsonify({"error": "Invalid email format"}), 400

    if email in users:
        return jsonify({"error": "Email already registered."}), 400

    hashed_pw = hashlib.sha256(password.encode()).hexdigest()
    users[email] = {"password": hashed_pw}

    return jsonify({"message": "Signup successful!"}), 200


@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    hashed_pw = hashlib.sha256(password.encode()).hexdigest()
    user = users.get(email)

    if not user or user["password"] != hashed_pw:
        return jsonify({"error": "Invalid login"}), 401

    return jsonify({"message": "Login successful", "user": {"email": email}}), 200

# ------------------------------
# Soil Analysis Endpoint
# ------------------------------
@app.route("/api/analyze", methods=["POST"])
def analyze():
    data = request.get_json()
    soil_ph = data.get("ph", 6.5)
    nitrogen = data.get("nitrogen", 0.3)

    # Basic logic
    if soil_ph < 5.5:
        crop = "Beans"
    elif 5.5 <= soil_ph <= 7.5:
        crop = "Maize"
    else:
        crop = "Sorghum"

    return jsonify({
        "recommendation": crop,
        "predicted_yield": f"{round(random.uniform(3.0, 7.0), 2)} tons/ha",
        "soil_status": "Fertile" if nitrogen > 0.3 else "Needs fertilizer"
    })

# ------------------------------
# Weather Gemini Endpoint
# ------------------------------
@app.route("/api/weather", methods=["POST"])
def weather():
    data = request.get_json()
    location = data.get("location", "Unknown")

    prompt = (
        f"Give a short weather forecast for {location} with farming advice. "
        "Keep it under 100 words."
    )

    try:
        # Call Gemini API (Google)
        gemini_payload = {
            "contents": [
                {"parts": [{"text": prompt}]}
            ]
        }

        response = requests.post(GEMINI_URL, json=gemini_payload, timeout=20)

        if response.status_code != 200:
            raise Exception(f"Gemini API error: {response.text}")

        gemini_text = response.json()["candidates"][0]["content"]["parts"][0]["text"]

        return jsonify({
            "location": location,
            "temperature": round(random.uniform(18, 32), 1),
            "humidity": random.randint(40, 90),
            "wind_speed": round(random.uniform(2, 10), 1),
            "condition": random.choice(["Sunny", "Partly Cloudy", "Rainy", "Stormy"]),
            "ai_prediction": gemini_text
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ------------------------------
# Main Entry
# ------------------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port)
