const express = require('express');
const router = express.Router();
const axios = require('axios');

// ------------------------------
// Python/Gemini backend URL
// ------------------------------
const VITE_AI_URL = process.env.VITE_AI_URL || 'http://localhost:10001';

// ------------------------------
// Soil analysis route
// ------------------------------
router.post('/analyze', async (req, res) => {
  try {
    const soilData = req.body;
    console.log('🌐 Forwarding soil analysis to Python/Gemini backend...', soilData);

    // Forward request to Python backend
    const response = await axios.post(`${VITE_AI_URL}/api/analyze`, soilData, {
      headers: { 'Content-Type': 'application/json' },
    });

    // Return response from Python/Gemini to frontend
    res.json(response.data);
  } catch (err) {
    console.error('❌ Soil analysis route error:', err.response?.data || err.message);
    res.status(500).json({
      error: 'Failed to analyze soil',
      details: err.response?.data || err.message,
    });
  }
});

module.exports = router;
