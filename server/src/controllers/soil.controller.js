const County = require("../models/county.model");

const analyzeSoil = async (req, res) => {
  try {
    console.log("📥 Incoming soil analysis:", req.body);

    const { county } = req.body;

    if (!county || county.trim() === "") {
      return res.status(400).json({ error: "County is required" });
    }

    // Fetch from MongoDB
    const data = await County.findOne({ county: county.trim() });

    if (!data) {
      return res.status(404).json({ error: "County not found in database" });
    }

    res.status(200).json({
      county: data.county,
      average_ph: data.average_ph,
      nitrogen: data.nitrogen,
      phosphorus: data.phosphorus,
      potassium: data.potassium,
      soil_type: data.soil_type,
      recommended_crops: data.recommended_crops,
      source: "MongoDB seeded data"
    });

  } catch (err) {
    console.error("❌ Soil analysis error:", err.message);
    res.status(500).json({ error: "Server error during soil analysis" });
  }
};

module.exports = { analyzeSoil };
