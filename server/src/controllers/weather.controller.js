const axios = require("axios");

const getWeather = async (req, res) => {
  try {
    const { location } = req.body;

    if (!location) {
      return res.status(400).json({ error: "Location is required" });
    }

    const aiBase = process.env.AI_API_URL?.trim();
    const aiUrl = `${aiBase}/api/gemini/weather`;

    console.log("🌦️ Calling Gemini Weather Service at:", aiUrl);

    const aiResponse = await axios.post(
      aiUrl,
      { location },
      { timeout: 25000 }
    );

    return res.status(200).json(aiResponse.data);

  } catch (err) {
    console.error("❌ Weather error:", err.message);

    return res.status(500).json({
      error: "Failed to fetch weather",
      details: err.message
    });
  }
};

module.exports = { getWeather };
