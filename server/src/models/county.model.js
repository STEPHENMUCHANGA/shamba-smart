const mongoose = require("mongoose");

const countySchema = new mongoose.Schema({
  county: { type: String, required: true, unique: true },
  average_ph: { type: Number, required: true },
  nitrogen: { type: Number, required: true },
  phosphorus: { type: Number, required: true },
  potassium: { type: Number, required: true },
  soil_type: { type: String, required: true },
  recommended_crops: { type: [String], required: true }
});

module.exports = mongoose.model("County", countySchema);
