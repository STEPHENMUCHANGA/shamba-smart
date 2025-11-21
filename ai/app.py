import os
import re
import random
import hashlib
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from dotenv import load_dotenv

# ------------------------------------------------------
# Load environment variables
# ------------------------------------------------------
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable is not set!")

# ------------------------------------------------------
# FastAPI Initialization
# ------------------------------------------------------
app = FastAPI()

origins = [
    os.getenv("FRONTEND_URL", ""),
    "https://shambasmart.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------------------------------
# Fake In-memory User DB (Temporary)
# ------------------------------------------------------
users = {}

# ------------------------------------------------------
# Gemini Client
# ------------------------------------------------------
client = genai.Client(api_key=GEMINI_API_KEY)
model_name = "gemini-pro"

# ------------------------------------------------------
# Pydantic Models
# ------------------------------------------------------
class AuthModel(BaseModel):
    email: str
    password: str

class SoilModel(BaseModel):
    ph: float
    nitrogen: float
    phosphorus: float
    potassium: float
    location: str = "your farm"

class WeatherModel(BaseModel):
    location: str = "Unknown location"

# ------------------------------------------------------
# Authentication Endpoints
# ------------------------------------------------------
@app.post("/api/signup")
async def signup(data: AuthModel):
    email = data.email.strip().lower()
    password = data.password

    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password are required")

    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        raise HTTPException(status_code=400, detail="Invalid email format")

    if email in users:
        raise HTTPException(status_code=400, detail="Email already registered.")

    hashed_pw = hashlib.sha256(password.encode()).hexdigest()
    users[email] = {"password": hashed_pw}

    return {"message": "Signup successful!"}


@app.post("/api/login")
async def login(data: AuthModel):
    email = data.email.strip().lower()
    password = data.password

    hashed_pw = hashlib.sha256(password.encode()).hexdigest()
    user = users.get(email)

    if not user or user["password"] != hashed_pw:
        raise HTTPException(status_code=401, detail="Invalid login")

    return {"message": "Login successful", "user": {"email": email}}

# ------------------------------------------------------
# Gemini Soil Analysis (Used by Node backend)
# ------------------------------------------------------
@app.post("/api/gemini/soil")
async def gemini_soil_analysis(data: SoilModel):
    prompt = f"""
You are an expert agricultural soil analyst.

Analyze this soil sample:

- pH: {data.ph}
- Nitrogen: {data.nitrogen}
- Phosphorus: {data.phosphorus}
- Potassium: {data.potassium}
- Location: {data.location}

Provide:

1. Soil quality assessment
2. Crop recommendations
3. Fertilizer recommendations
4. Predicted yield (tons/ha)
5. A short explanation
"""
    try:
        ai_response = client.generate_text(model=model_name, prompt=prompt)
        ai_text = ai_response.text

        return {
            "ai_recommendation": ai_text,
            "recommended_crop": random.choice(["Maize", "Beans", "Sorghum", "Potatoes"]),
            "predicted_yield": f"{round(random.uniform(2.0, 7.5), 1)} tons/ha",
            "soil_health": "Healthy" if float(data.nitrogen) > 0.3 else "Low nutrients"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ------------------------------------------------------
# Gemini Weather Forecast (Used by Node backend)
# ------------------------------------------------------
@app.post("/api/gemini/weather")
async def gemini_weather(data: WeatherModel):
    prompt = f"""
Give a weather forecast for {data.location}. Include:

- Temperature in °C
- Humidity %
- Wind speed km/h
- General condition (sunny, cloudy, rainy, etc.)
- A farming recommendation for the day
"""
    try:
        ai_response = client.generate_text(model=model_name, prompt=prompt)
        ai_text = ai_response.text

        return {
            "location": data.location,
            "temperature": round(random.uniform(18, 32), 1),
            "humidity": random.randint(40, 90),
            "wind_speed": round(random.uniform(3, 12), 1),
            "condition": random.choice(["Sunny", "Cloudy", "Rainy", "Windy", "Stormy"]),
            "ai_prediction": ai_text
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ------------------------------------------------------
# Local Development
# ------------------------------------------------------
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
