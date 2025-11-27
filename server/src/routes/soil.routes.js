const express = require('express');
const router = express.Router();
const { analyzeSoil } = require('../controllers/soil.controller');

// ------------------------------
// Soil analysis route (Node-only)
// ------------------------------
router.post('/analyze', async (req, res) => {
  try {
    const soilData = req.body;
    console.log('📥 Incoming soil analysis request:', soilData);

    // Use local analyzeSoil controller logic
    const result = await analyzeSoil(soilData);

    // Return the analysis to frontend
    res.json(result);
  } catch (err) {
    console.error('❌ Soil analysis route error:', err.message || err);
    res.status(500).json({
      error: 'Failed to analyze soil',
      details: err.message || err,
    });
  }
});

module.exports = router;
