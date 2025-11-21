import os
import re
import random
import hashlib
from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
from dotenv import load_dotenv

# ------------------------------
# Load environment variables
# ------------------------------
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable is not set!")

# ------------------------------
# Flask App Initialization
# ------------------------------
app = Flask(__name__)
CORS(app, origins=[os.getenv("FRONTEND_URL", ""), "https://shambasmart.vercel.app"])

# ------------------------------
# In-memory user "database"
# ------------------------------
users = {}

# ------------------------------
# Create Gemini client
# ------------------------------
client = genai.Client(api_key=GEMINI_API_KEY)
model_name = "gemini-pro"

# ------------------------------
# Authentication Routes
# ------------------------------
@app.route("/api/signup", methods=["POST"])
def signup():
    data = request.json
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return jsonify({"error": "Invalid email format"}), 400

    if email in users:
        return jsonify({"error": "Email already registered"}), 400

    hashed_pw = hashlib.sha256(password.encode()).hexdigest()
    users[email] = {"password": hashed_pw}

    return jsonify({"message": "Signup successful!"})


@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    hashed_pw = hashlib.sha256(password.encode()).hexdigest()
    user = users.get(email)

    if not user or user["password"] != hashed_pw:
        return jsonify({"error": "Invalid login"}), 401

    return jsonify({"message": "Login successful", "user": {"email": email}})

# ------------------------------
# Soil Analysis Route
# ------------------------------
@app.route("/api/analyze", methods=["POST"])
def analyze_soil():
    data = request.json

    prompt = f"""
You are an expert agricultural soil analyst.

Analyze this soil sample:

- pH: {data.get('ph')}
- Nitrogen: {data.get('nitrogen')}
- Phosphorus: {data.get('phosphorus')}
- Potassium: {data.get('potassium')}
- Location: {data.get('location', 'your farm')}

Provide:

1. Soil quality assessment
2. Crop recommendations
3. Fertilizer recommendations
4. Yield prediction (in tons/ha)
5. Short explanation
"""

    try:
        ai_response = client.generate_text(model=model_name, prompt=prompt)
        ai_text = ai_response.text

        return jsonify({
            "analysis": ai_text,
            "recommendation": random.choice(["Maize", "Beans", "Sorghum", "Potatoes"]),
            "predicted_yield": f"{round(random.uniform(2.0, 7.5), 1)} tons/ha",
            "soil_status": "Healthy" if float(data.get('nitrogen', 0)) > 0.3 else "Low nutrients"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ------------------------------
# Weather Forecast Route
# ------------------------------
@app.route("/api/gemini/weather", methods=["POST"])
def gemini_weather():
    data = request.json
    location = data.get("location", "Unknown location")

    prompt = f"""
Give a short weather forecast for {location}. Include:

- Temperature in °C
- Humidity %
- Wind speed km/h
- General weather condition (sunny, cloudy, rainy, etc.)
- A farming recommendation for the day
"""

    try:
        ai_response = client.generate_text(model=model_name, prompt=prompt)
        ai_text = ai_response.text

        return jsonify({
            "location": location,
            "temperature": round(random.uniform(18, 32), 1),
            "humidity": random.randint(40, 90),
            "wind_speed": round(random.uniform(3, 12), 1),
            "condition": random.choice(["Sunny", "Cloudy", "Rainy", "Windy", "Stormy"]),
            "ai_prediction": ai_text
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ------------------------------
# Main Entry Point
# ------------------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port)
