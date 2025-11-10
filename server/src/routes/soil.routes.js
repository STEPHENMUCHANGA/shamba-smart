const express = require('express');
const router = express.Router();
const { analyzeSoil } = require('../controllers/soil.controller');

router.post('/analyze', analyzeSoil);

module.exports = router;
