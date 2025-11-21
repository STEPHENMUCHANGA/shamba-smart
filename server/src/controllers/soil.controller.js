const axios = require("axios");
const SoilSample = require("../models/SoilSample");

const analyzeSoil = async (req, res) => {
  try {
    console.log("🔔 Received soil analysis request:", req.body);
    const sample = req.body;

    // Save to DB (non-blocking)
    try {
      const doc = new SoilSample(sample);
      await doc.save();
      console.log("💾 Soil sample saved, id:", doc._id);
    } catch (dbErr) {
      console.error("DB save failed (continuing):", dbErr.message);
    }

    // Use the Flask backend URL
    const flaskBase = process.env.FLASK_API_URL?.trim();
    if (!flaskBase) {
      console.error("❌ FLASK_API_URL missing in server environment!");
      return res.status(500).json({ error: "Flask backend URL not configured" });
    }

    const flaskUrl = `${flaskBase.replace(/\/$/, "")}/api/analyze`;

    console.log("🌐 Calling Flask AI service at:", flaskUrl);

    const aiResponse = await axios.post(flaskUrl, sample, { timeout: 30000 });

    console.log("✅ AI response received");

    return res.status(200).json({
      analysis: aiResponse.data.analysis,
      recommendation: aiResponse.data.recommendation,
      predicted_yield: aiResponse.data.predicted_yield,
      soil_status: aiResponse.data.soil_status,
      message: "Soil analyzed successfully"
    });

  } catch (err) {
    console.error("❌ analyzeSoil error:", err.message);
    return res.status(500).json({
      error: "Server error during soil analysis",
      details: err.message
    });
  }
};

module.exports = { analyzeSoil };
