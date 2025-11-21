const axios = require('axios');

const getWeather = async (req, res) => {
  try {
    console.log('🔔 Received weather request:', req.body);
    const { location } = req.body;

    if (!location || location.trim() === '') {
      return res.status(400).json({ error: 'Location is required' });
    }

    // Read AI backend URL
    const aiBase = process.env.AI_API_URL?.trim();
    if (!aiBase) {
      console.error('❌ AI_API_URL missing in environment!');
      return res.status(500).json({ error: 'AI server URL not configured' });
    }

    const aiUrl = `${aiBase.replace(/\/$/, '')}/api/gemini/weather`;
    console.log('🌦️ Calling Gemini Weather Service at:', aiUrl);

    // Call AI backend with increased timeout
    const aiResponse = await axios.post(
      aiUrl,
      { location },
      { timeout: 60000 }
    );

    console.log('✅ Weather response received:', aiResponse.data);

    return res.status(200).json({
      weather: aiResponse.data.weather || null,
      forecast: aiResponse.data.forecast || null,
      ai_prediction: aiResponse.data.ai_prediction || null,
      message: 'Weather retrieved successfully'
    });

  } catch (err) {
    console.error('❌ Weather error:', err.response?.data || err.message);

    return res.status(500).json({
      error: 'Failed to fetch weather',
      details: err.response?.data || err.message
    });
  }
};

module.exports = { getWeather };
