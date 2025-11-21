const axios = require("axios");

const getWeather = async (req, res) => {
  try {
    console.log("🔔 Received weather request:", req.body);
    const { location } = req.body;

    if (!location || location.trim() === "") {
      return res.status(400).json({ error: "Location is required" });
    }

    // Use the Flask backend URL
    const flaskBase = process.env.FLASK_API_URL?.trim();
    if (!flaskBase) {
      console.error("❌ FLASK_API_URL missing in server environment!");
      return res.status(500).json({ error: "Flask backend URL not configured" });
    }

    const flaskUrl = `${flaskBase.replace(/\/$/, "")}/api/gemini/weather`;

    console.log("🌦️ Calling Flask Gemini Weather Service at:", flaskUrl);

    const aiResponse = await axios.post(flaskUrl, { location }, { timeout: 25000 });

    console.log("✅ Weather response received:", aiResponse.data);

    return res.status(200).json({
      location: aiResponse.data.location,
      temperature: aiResponse.data.temperature,
      humidity: aiResponse.data.humidity,
      wind_speed: aiResponse.data.wind_speed,
      condition: aiResponse.data.condition,
      ai_prediction: aiResponse.data.ai_prediction,
      message: "Weather retrieved successfully"
    });

  } catch (err) {
    console.error("❌ Weather error:", err.message);
    return res.status(500).json({
      error: "Failed to fetch weather",
      details: err.message
    });
  }
};

module.exports = { getWeather };
