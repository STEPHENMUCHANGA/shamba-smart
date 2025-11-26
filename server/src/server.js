// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

// -------------------------------------------
// CORS
// -------------------------------------------
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://shambasmart.vercel.app",
      "https://shamba-smart-tjf8.onrender.com",
    ],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

// Parse JSON
app.use(express.json());

// --------------------------------------------------------
// ROOT TEST ROUTE
// --------------------------------------------------------
app.get("/", (req, res) => {
  res.json({ message: "ShambaSmart Node Backend is running." });
});

// --------------------------------------------------------
// SOIL ANALYSIS (NODE-ONLY LOGIC)
// --------------------------------------------------------
app.post("/api/soil/analyze", (req, res) => {
  console.log("📥 Incoming soil analysis:", req.body);

  const { ph, nitrogen, phosphorus, potassium } = req.body;

  if (!ph || !nitrogen || !phosphorus || !potassium) {
    return res.status(400).json({
      error: "Missing required soil input values",
    });
  }

  // Basic soil logic
  let soilStatus =
    ph < 6.0
      ? "Acidic"
      : ph >= 6.0 && ph <= 7.5
      ? "Optimal"
      : "Alkaline";

  let recommendedCrop =
    ph < 5.5 ? "Sweet Potatoes" : ph < 7.5 ? "Maize" : "Sorghum";

  let expectedYield =
    recommendedCrop === "Maize" ? "4.5 tons/ha" : "3.1 tons/ha";

  let fertilizerAdvice =
    nitrogen < 100
      ? "Apply CAN fertilizer (100kg/ha)"
      : "Nitrogen levels are adequate";

  return res.json({
    soilStatus,
    recommendedCrop,
    expectedYield,
    fertilizerAdvice,
    received: req.body,
  });
});

// --------------------------------------------------------
// WEATHER ENDPOINT (NODE-ONLY)
// --------------------------------------------------------
const OPENWEATHER_KEY = process.env.OPENWEATHER_KEY; // Set this in your .env

app.get("/api/weather/get", async (req, res) => {
  const { county } = req.query;

  if (!county) {
    return res.status(400).json({ error: "County is required" });
  }

  try {
    console.log("🌦 Fetching weather for:", county);

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${county}&units=metric&appid=${OPENWEATHER_KEY}`;

    const { data } = await axios.get(weatherUrl);

    const response = {
      location: county,
      temperature: data.main.temp,
      humidity: data.main.humidity,
      wind_speed: data.wind.speed,
      condition: data.weather[0].main,
    };

    res.json(response);
  } catch (err) {
    console.error("❌ Weather API error:", err.response?.data || err.message);
    res.status(500).json({
      error: "Failed to fetch weather",
      details: err.response?.data || err.message,
    });
  }
});

// --------------------------------------------------------
// START SERVER
// --------------------------------------------------------
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`🚀 Node server running on port ${PORT}`);
  console.log("🌍 Weather API Key Loaded:", OPENWEATHER_KEY ? "Yes" : "No ❌");
});
