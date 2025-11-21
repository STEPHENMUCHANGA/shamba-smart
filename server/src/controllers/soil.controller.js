const axios = require('axios');
const SoilSample = require('../models/SoilSample');

const analyzeSoil = async (req, res) => {
  try {
    console.log('🔔 Received soil analysis request with body:', req.body);

    const sample = req.body;

    // Validate required fields before sending to AI
    const requiredFields = ['ph', 'nitrogen', 'phosphorus', 'potassium', 'location'];
    for (const field of requiredFields) {
      if (!(field in sample)) {
        return res.status(400).json({ error: `Missing field: ${field}` });
      }
    }

    // Save to DB (non-blocking)
    try {
      const doc = new SoilSample(sample);
      await doc.save();
      console.log('💾 Soil sample saved, id:', doc._id);
    } catch (dbErr) {
      console.error('DB save failed (continuing):', dbErr.message);
    }

    // Ensure AI server URL is configured
    const aiBase = process.env.AI_API_URL?.trim();
    if (!aiBase) {
      console.error("❌ AI_API_URL missing in server environment!");
      return res.status(500).json({ error: "AI server URL not configured" });
    }

    const aiUrl = `${aiBase.replace(/\/$/, "")}/api/analyze`;
    console.log('🌐 Calling AI service at:', aiUrl);

    let aiResponse;
    try {
      aiResponse = await axios.post(aiUrl, sample, { timeout: 30000 });
    } catch (axiosErr) {
      console.error('❌ Error calling AI service:', axiosErr.message);
      if (axiosErr.response) {
        console.error('AI response data:', axiosErr.response.data);
      }
      return res.status(500).json({
        error: "Failed to get response from AI service",
        details: axiosErr.message,
        ai_response: axiosErr.response?.data
      });
    }

    console.log("✅ AI response received:", aiResponse.data);

    // Return structured response to frontend
    return res.status(200).json({
      analysis: aiResponse.data.analysis,
      recommendation: aiResponse.data.recommendation,
      predicted_yield: aiResponse.data.predicted_yield,
      soil_status: aiResponse.data.soil_status,
      message: "Soil analyzed successfully"
    });

  } catch (err) {
    console.error("❌ analyzeSoil unexpected error:", err);
    return res.status(500).json({
      error: "Server error during soil analysis",
      details: err.message
    });
  }
};

module.exports = { analyzeSoil };
