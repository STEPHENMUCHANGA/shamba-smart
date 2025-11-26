const axios = require('axios');

const getWeather = async (req, res) => {
  try {
    console.log("🌍 Weather request received:", req.body);

    const { location } = req.body;

    if (!location || location.trim() === "") {
      return res.status(400).json({ error: "Location is required" });
    }

    // Example weather API: OpenWeatherMap or any other
    const apiKey = process.env.OPENWEATHER_KEY;

    if (!apiKey) {
      console.error("❌ OPENWEATHER_KEY missing in environment!");
      return res.status(500).json({ error: "Weather API key not configured" });
    }

    // Build request URL (OpenWeatherMap)
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      location
    )}&appid=${apiKey}&units=metric`;

    console.log("📡 Fetching from weather API:", apiUrl);

    const response = await axios.get(apiUrl, { timeout: 20000 });

    console.log("✅ Weather API response:", response.data);

    return res.status(200).json({
      location: response.data.name,
      temperature: response.data.main.temp,
      humidity: response.data.main.humidity,
      description: response.data.weather?.[0]?.description || "N/A",
      wind_speed: response.data.wind?.speed || null,
      message: "Weather retrieved successfully"
    });

  } catch (err) {
    console.error("❌ Weather fetch error:", err.response?.data || err.message);

    return res.status(500).json({
      error: "Failed to fetch weather",
      details: err.response?.data || err.message
    });
  }
};

module.exports = { getWeather };
