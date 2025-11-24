import os
import random
import hashlib
import re
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from google import genai  # Gemini SDK
import traceback

# ------------------------------
# Load environment variables
# ------------------------------
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
FRONTEND_URL = os.getenv("FRONTEND_URL") or "http://localhost:5173"

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable is not set!")

# ------------------------------
# Flask app initialization
# ------------------------------
app = Flask(__name__)
CORS(
    app,
    resources={r"/*": {"origins": ["http://localhost:5173", "https://shambasmart.vercel.app"]}},
    supports_credentials=True,
)

@app.after_request
def add_cors_headers(response):
    allowed_origins = ["http://localhost:5173", "https://shambasmart.vercel.app"]
    origin = request.headers.get("Origin")
    if origin in allowed_origins:
        response.headers["Access-Control-Allow-Origin"] = origin
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return response

# ------------------------------
# Gemini client setup
# ------------------------------
client = genai.Client(api_key=GEMINI_API_KEY)
model_name = "gemini-1.5-flash"

# ------------------------------
# In-memory user storage
# ------------------------------
users = {}

# ------------------------------
# Helper functions
# ------------------------------
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def validate_email(email: str) -> bool:
    return bool(re.match(r"[^@]+@[^@]+\.[^@]+", email))

# ------------------------------
# Authentication endpoints
# ------------------------------
@app.route("/api/signup", methods=["POST"])
def signup():
    data = request.json
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
    if not validate_email(email):
        return jsonify({"error": "Invalid email format"}), 400
    if email in users:
        return jsonify({"error": "Email already registered"}), 400
    users[email] = {"password": hash_password(password)}
    return jsonify({"message": "Signup successful!"})

@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    hashed_pw = hash_password(password)
    user = users.get(email)
    if not user or user["password"] != hashed_pw:
        return jsonify({"error": "Invalid login"}), 401
    return jsonify({"message": "Login successful", "user": {"email": email}})

# ------------------------------
# Soil analysis endpoint
# ------------------------------
@app.route("/api/analyze", methods=["POST"])
def analyze_soil():
    data = request.json
    print("🔔 Received soil analysis request:", data)

    required_fields = ["ph", "nitrogen", "phosphorus", "potassium"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"{field} is required"}), 400

    prompt = f"""
You are an expert agricultural soil analyst.

Analyze this soil sample:
- pH: {data['ph']}
- Nitrogen: {data['nitrogen']}
- Phosphorus: {data['phosphorus']}
- Potassium: {data['potassium']}
- Location: {data.get('location', 'your farm')}

Provide:
1. Soil quality assessment
2. Crop recommendations
3. Fertilizer recommendations
4. Yield prediction (in tons/ha)
5. Short explanation
"""

    try:
        response = client.models.generate_content(
            model="gemini-1.5-flash",
            prompt=prompt
        )

        # Use response.last.output_text safely
        analysis_text = response.output_text

        try:
            nitrogen_val = float(data.get("nitrogen", 0))
        except (ValueError, TypeError):
            nitrogen_val = 0.0

        return jsonify({
            "analysis": analysis_text,
            "recommendation": random.choice(["Maize", "Beans", "Sorghum", "Potatoes"]),
            "predicted_yield": f"{round(random.uniform(2.0, 7.5), 1)} tons/ha",
            "soil_status": "Healthy" if nitrogen_val > 0.3 else "Low nutrients"
        })
    except Exception as e:
        print("❌ AI analyze_soil error:\n", traceback.format_exc())
        return jsonify({"error": "AI processing failed", "details": str(e)}), 500

# ------------------------------
# Weather forecast endpoint
# ------------------------------
@app.route("/api/gemini/weather", methods=["POST"])
def gemini_weather():
    data = request.json
    location = data.get("location", "Unknown location")
    print("🔔 Weather request received for location:", location)

    prompt = f"""
Provide a short weather forecast for {location}. Include:
- Temperature in °C
- Humidity %
- Wind speed km/h
- General weather condition
- Farming recommendation for the day
"""

    try:
        response = client.models.generate_content(
            model="gemini-1.5-flash",
            prompt=prompt
        )

        analysis_text = response.output_text

        return jsonify({
            "location": location,
            "temperature": round(random.uniform(18, 32), 1),
            "humidity": random.randint(40, 90),
            "wind_speed": round(random.uniform(3, 12), 1),
            "condition": random.choice(["Sunny", "Cloudy", "Rainy", "Windy", "Stormy"]),
            "ai_prediction": analysis_text
        })
    except Exception as e:
        print("❌ AI weather error:\n", traceback.format_exc())
        return jsonify({"error": "AI weather failed", "details": str(e)}), 500

# ------------------------------
# HOME ROUTE (added)
# ------------------------------
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "ShambaSmart AI Backend is running"}), 200

# ------------------------------
# Main entry point
# ------------------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10001))
    print(f"🚀 Backend running on port {port}")
    print(f"🌍 Allowed FRONTEND URL: {FRONTEND_URL}")
    print(f"🤖 Gemini Model: {model_name}")
    app.run(host="0.0.0.0", port=port)
