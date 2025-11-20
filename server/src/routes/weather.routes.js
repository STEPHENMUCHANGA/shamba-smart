const express = require("express");
const router = express.Router();
const { getWeather } = require("../controllers/weather.controller");

router.post("/get", getWeather);

module.exports = router;
