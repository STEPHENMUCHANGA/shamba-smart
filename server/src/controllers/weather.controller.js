const axios = require("axios");

const getWeather = async (req, res) => {
  try {
    console.log("🔔 Received weather request:", req.body);

    const { location } = req.body;

    if (!location || location.trim() === "") {
      return res.status(400).json({ error: "Location is required" });
    }

    // Read AI Base URL
    const aiBase = process.env.AI_API_URL?.trim();
    if (!aiBase) {
      console.error("❌ AI_API_URL missing in server environment!");
      return res.status(500).json({ error: "AI server URL not configured" });
    }

    // FastAPI Gemini Weather endpoint
    const aiUrl = `${aiBase.replace(/\/$/, "")}/api/gemini/weather`;
    console.log("🌦️ Calling Gemini Weather Service at:", aiUrl);

    // Call FastAPI with timeout
    const aiResponse = await axios.post(aiUrl, { location }, { timeout: 30000 });

    console.log("✅ Weather response received:", aiResponse.data);

    return res.status(200).json({
      location: location,
      temperature: aiResponse.data.temperature,
      humidity: aiResponse.data.humidity,
      wind_speed: aiResponse.data.wind_speed,
      condition: aiResponse.data.condition,
      ai_prediction: aiResponse.data.ai_prediction,
      message: "Weather retrieved successfully"
    });

  } catch (err) {
    console.error("❌ Weather error:", err.response?.data || err.message);

    return res.status(500).json({
      error: "Failed to fetch weather",
      details: err.response?.data || err.message
    });
  }
};

module.exports = { getWeather };
