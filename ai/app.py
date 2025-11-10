from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import re
import hashlib

app = Flask(__name__)
CORS(app)

# ---------------------------------
# Simple in-memory user "database"
# ---------------------------------
users = {}

# ---------------------------------
# AUTHENTICATION ROUTES
# ---------------------------------
@app.route("/api/signup", methods=["POST"])
def signup():
    data = request.get_json()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    # Basic validation
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return jsonify({"error": "Invalid email format"}), 400

    if email in users:
        return jsonify({"error": "Email already registered. Please log in instead."}), 400

    # Hash password before storing
    hashed_pw = hashlib.sha256(password.encode()).hexdigest()
    users[email] = {"password": hashed_pw}

    return jsonify({"message": "Signup successful! You can now log in."}), 200


@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    hashed_pw = hashlib.sha256(password.encode()).hexdigest()
    user = users.get(email)

    if not user or user["password"] != hashed_pw:
        return jsonify({"error": "Invalid email or password"}), 401

    return jsonify({"message": "Login successful", "user": {"email": email}}), 200


# ---------------------------------
# SOIL ANALYSIS ENDPOINT
# ---------------------------------
@app.route('/api/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    soil_ph = data.get('ph', 6.5)
    nitrogen = data.get('nitrogen', 0.3)
    rainfall = data.get('rainfall', 800)

    # Simple AI-like logic for crop recommendation
    if soil_ph < 5.5:
        crop = 'Beans'
    elif 5.5 <= soil_ph <= 7.5:
        crop = 'Maize'
    else:
        crop = 'Sorghum'

    response = {
        "recommendation": crop,
        "predicted_yield": f"{round(random.uniform(3.0, 7.0), 2)} tons/ha",
        "soil_status": "Fertile" if nitrogen > 0.3 else "Needs fertiliser"
    }
    return jsonify(response)


# ---------------------------------
# WEATHER ANALYSIS ENDPOINT
# ---------------------------------
@app.route('/api/weather', methods=['POST'])
def weather():
    data = request.get_json()
    location = data.get('location', 'Unknown')

    # Mocked AI + geospatial weather logic
    temperature = round(random.uniform(18, 32), 1)
    humidity = random.randint(40, 90)
    wind_speed = round(random.uniform(2, 10), 1)
    condition = random.choice(["Sunny", "Partly Cloudy", "Rainy", "Stormy"])
    ai_prediction = random.choice([
        "Favourable for maize growth",
        "Expect rainfall within 48 hours",
        "Hot and dry — irrigation recommended",
        "Mild weather suitable for planting"
    ])

    response = {
        "location": location,
        "temperature": temperature,
        "humidity": humidity,
        "wind_speed": wind_speed,
        "condition": condition,
        "ai_prediction": ai_prediction
    }

    return jsonify(response)


# ---------------------------------
# MAIN ENTRY POINT
# ---------------------------------
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
