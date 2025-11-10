const mongoose = require('mongoose');

const SoilSampleSchema = new mongoose.Schema({
  farmerName: String,
  county: String,
  subCounty: String,
  ph: Number,
  nitrogen: Number,
  phosphorus: Number,
  potassium: Number,
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SoilSample', SoilSampleSchema);
