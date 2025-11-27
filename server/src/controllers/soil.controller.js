const SoilSample = require('../models/SoilSample');

const analyzeSoil = async (req, res) => {
  try {
    console.log('🔔 Received soil analysis request:', req.body);
    const sample = req.body;

    // Save to DB only
    try {
      const doc = new SoilSample(sample);
      await doc.save();
      console.log('💾 Soil sample saved with ID:', doc._id);
    } catch (dbErr) {
      console.warn('⚠️ DB save failed:', dbErr.message);
    }

    // 🔍 Simple local (non-AI) soil analysis logic
    const ph = parseFloat(sample.ph);
    let soil_status = '';
    let recommendation = '';
    let predicted_yield = 0;

    if (ph < 5.5) {
      soil_status = 'Too acidic';
      recommendation = 'Apply agricultural lime to raise soil pH.';
      predicted_yield = 40;
    } else if (ph >= 5.5 && ph <= 7.5) {
      soil_status = 'Optimal pH range';
      recommendation = 'Maintain current soil management practices.';
      predicted_yield = 80;
    } else {
      soil_status = 'Too alkaline';
      recommendation = 'Add sulfur or organic compost to lower pH.';
      predicted_yield = 50;
    }

    return res.status(200).json({
      analysis: `Soil pH is ${ph}, indicating: ${soil_status}`,
      recommendation,
      predicted_yield,
      soil_status,
      message: 'Soil analyzed locally without AI'
    });

  } catch (err) {
    console.error('❌ analyzeSoil error:', err.message);

    return res.status(500).json({
      error: 'Server error during soil analysis',
      details: err.message
    });
  }
};

module.exports = { analyzeSoil };
