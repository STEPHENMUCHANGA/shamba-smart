const axios = require('axios');
const SoilSample = require('../models/SoilSample');

const analyzeSoil = async (req, res) => {
  try {
    console.log('🔔 Received soil analysis request:', req.body);
    const sample = req.body;

    // Save to DB (non-blocking)
    try {
      const doc = new SoilSample(sample);
      await doc.save();
      console.log('💾 Soil sample saved with ID:', doc._id);
    } catch (dbErr) {
      console.warn('⚠️ DB save failed (continuing):', dbErr.message);
    }

  
    // Read AI backend URL
    const aiBase = process.env.AI_API_URL?.trim();
    if (!aiBase) {
      console.error('❌ AI_API_URL missing in environment!');
      return res.status(500).json({ error: 'AI server URL not configured' });
    }

    const aiUrl = `${aiBase.replace(/\/$/, '')}/api/analyze`;
    console.log('🌐 Calling AI service at:', aiUrl);

    // Call AI backend with longer timeout
    const aiResponse = await axios.post(aiUrl, sample, { timeout: 60000 });

    console.log('✅ AI response received');

    return res.status(200).json({
      analysis: aiResponse.data.analysis,
      recommendation: aiResponse.data.recommendation,
      predicted_yield: aiResponse.data.predicted_yield,
      soil_status: aiResponse.data.soil_status,
      message: 'Soil analyzed successfully'
    });

  } catch (err) {
    console.error('❌ analyzeSoil error:', err.response?.data || err.message);

    return res.status(500).json({
      error: 'Server error during soil analysis',
      details: err.response?.data || err.message
    });
  }
};

module.exports = { analyzeSoil };
