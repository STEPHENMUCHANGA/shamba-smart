const axios = require('axios');
const SoilSample = require('../models/SoilSample');

const analyzeSoil = async (req, res) => {
  try {
    console.log('🔔 Received soil analysis request with body:', req.body);
    const sample = req.body;

    // Save to DB (non-blocking)
    try {
      const doc = new SoilSample(sample);
      await doc.save();
      console.log('💾 Soil sample saved, id:', doc._id);
    } catch (dbErr) {
      console.error('DB save failed (continuing):', dbErr.message);
    }

    const aiBase = process.env.AI_API_URL?.trim();
    const aiUrl = `${aiBase}/api/soil/analyze`;

    console.log('🌐 Calling AI service at:', aiUrl);

    const aiResponse = await axios.post(aiUrl, sample, { timeout: 30000 });

    const result = {
      analysis: aiResponse.data,
      message: 'Soil analyzed successfully'
    };

    console.log('✅ AI response received');
    return res.status(200).json(result);

  } catch (err) {
    console.error('❌ analyzeSoil error:', err.message);
    return res.status(500).json({
      error: 'Server error during soil analysis',
      details: err.message
    });
  }
};

module.exports = { analyzeSoil };
