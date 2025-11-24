const express = require("express");
const router = express.Router();
const axios = require("axios");

// ------------------------------
// Python/Gemini backend URL
// ------------------------------
const VITE_AI_URL = process.env.VITE_AI_URL || "http://localhost:10001";

// ------------------------------
// Weather route
// ------------------------------
router.post("/get", async (req, res) => {
  try {
    const requestData = req.body;
    console.log("🌐 Forwarding weather request to Python/Gemini backend...", requestData);

    const response = await axios.post(`${VITE_AI_URL}/api/gemini/weather`, requestData, {
      headers: { "Content-Type": "application/json" },
    });

    // Return the response from Python/Gemini backend
    res.json(response.data);
  } catch (err) {
    console.error("❌ Weather route error:", err.response?.data || err.message);
    res.status(500).json({
      error: "Failed to get weather",
      details: err.response?.data || err.message,
    });
  }
});

module.exports = router;
