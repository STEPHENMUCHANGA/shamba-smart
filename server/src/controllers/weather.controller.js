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
      return res.status(500).json({
        error: "AI server URL not configured"
      });
    }

    // Build final Gemini Weather API URL
    const aiUrl = `${aiBase.replace(/\/$/, "")}/api/gemini/weather`;

    console.log("🌦️ Calling Gemini Weather Service at:", aiUrl);

    // Call the Gemini Flask API
    const aiResponse = await axios.post(
      aiUrl,
      { location },
      { timeout: 25000 }
    );

    console.log("✅ Weather response received:", aiResponse.data);

    return res.status(200).json({
      weather: aiResponse.data.weather,
      forecast: aiResponse.data.forecast,
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
