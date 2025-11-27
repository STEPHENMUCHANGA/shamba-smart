const express = require("express");
const router = express.Router();
const axios = require("axios");

// ------------------------------
// WEATHER ROUTE (Node-only with OpenWeather)
// ------------------------------
router.post("/get", async (req, res) => {
  try {
    const { location } = req.body;
    console.log("🌍 Weather request received:", location);

    if (!location || location.trim() === "") {
      return res.status(400).json({ error: "Location is required" });
    }

    const apiKey = process.env.OPENWEATHER_KEY;

    if (!apiKey) {
      console.error("❌ OPENWEATHER_KEY missing in environment!");
      return res.status(500).json({ error: "Weather API key not configured" });
    }

    // OpenWeather API request
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      location
    )}&appid=${apiKey}&units=metric`;

    console.log("📡 Fetching weather from OpenWeather:", apiUrl);

    const response = await axios.get(apiUrl, { timeout: 20000 });

    console.log("✅ Weather API response:", response.data);

    res.status(200).json({
      location: response.data.name,
      temperature: response.data.main.temp,
      humidity: response.data.main.humidity,
      condition: response.data.weather?.[0]?.main || "N/A",
      wind_speed: response.data.wind?.speed || null,
      message: "Weather retrieved successfully"
    });
  } catch (err) {
    console.error("❌ Weather fetch error:", err.response?.data || err.message);

    res.status(500).json({
      error: "Failed to fetch weather",
      details: err.response?.data || err.message,
    });
  }
});

module.exports = router;
