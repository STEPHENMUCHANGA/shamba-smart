from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import re
import hashlib
import os
from openai import OpenAI

# ------------------------------
# Flask App Initialization
# ------------------------------
app = Flask(__name__)

# CORS: allow frontend URLs
frontend_urls = [
    os.getenv("FRONTEND_URL", "https://shambasmart.vercel.app"),
]
CORS(app, origins=frontend_urls, supports_credentials=True)

# ------------------------------
# Simple in-memory user "database"
# ------------------------------
users = {}

# ------------------------------
# Initialize OpenAI Client
# ------------------------------
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY environment variable is not set!")

openai_client = OpenAI(api_key=OPENAI_API_KEY)

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
@app.route("/api/soil/analyze", methods=["POST"])
def analyze_soil():
    data = request.get_json()
    soil_ph = data.get("ph", 6.5)
    nitrogen = data.get("nitrogen", 0.3)
    rainfall = data.get("rainfall", 800)

    # Basic AI-like crop recommendation logic
    if soil_ph < 5.5:
        crop = "Beans"
    elif 5.5 <= soil_ph <= 7.5:
        crop = "Maize"
    else:
        crop = "Sorghum"

    soil_status = "Fertile" if nitrogen > 0.3 else "Needs fertilizer"
    predicted_yield = f"{round(random.uniform(3.0, 7.0), 2)} tons/ha"

    return jsonify({
        "recommendation": crop,
        "predicted_yield": predicted_yield,
        "soil_status": soil_status
    })

# ------------------------------
# Weather AI Endpoint
# ------------------------------
@app.route("/api/weather", methods=["POST"])
def weather():
    data = request.get_json()
    location = data.get("location", "Unknown")

    try:
        prompt = (
            f"Provide a brief AI-generated weather forecast for {location}. "
            "Include temperature, humidity, wind speed, condition, and farming advice."
        )

        # Use GPT-3.5-turbo for wider access
        response = openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=150
        )

        ai_text = response.choices[0].message.content.strip()

        # Mock numeric values for simplicity
        return jsonify({
            "location": location,
            "temperature": round(random.uniform(18, 32), 1),
            "humidity": random.randint(40, 90),
            "wind_speed": round(random.uniform(2, 10), 1),
            "condition": random.choice(["Sunny", "Partly Cloudy", "Rainy", "Stormy"]),
            "ai_prediction": ai_text
        })

    except Exception as e:
        print("Weather API error:", str(e))
        return jsonify({"error": "Failed to fetch weather", "details": str(e)}), 500

# ------------------------------
# Main Entry Point
# ------------------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    print(f"🚀 Flask server running on port {port}")
    app.run(host="0.0.0.0", port=port)
