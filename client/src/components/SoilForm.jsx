import React, { useState } from "react";
import { motion } from "framer-motion";
import { Droplets, FlaskConical, User, MapPin, Sprout, FileText } from "lucide-react";
import { analyzeSoil } from "../services/api";

export default function SoilForm() {
  const [state, setState] = useState({
    farmerName: "",
    county: "",
    farmerSize: "",
    ph: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    notes: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setState((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setResult(null);
      console.log("Submitting soil data:", state);

      const payload = {
        ...state,
        farmSize: parseFloat(state.farmerSize) || null,
        ph: parseFloat(state.ph) || null,
        nitrogen: parseFloat(state.nitrogen) || null,
        phosphorus: parseFloat(state.phosphorus) || null,
        potassium: parseFloat(state.potassium) || null,
      };

      const res = await analyzeSoil(payload);
      console.log("Response received:", res);
      setResult(res);
    } catch (err) {
      console.error("Soil form submit error:", err.message || err);
      alert("⚠️ Error analyzing soil sample. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full"
    >
      <h2 className="text-2xl font-semibold text-green-800 text-center mb-6">
        AI Soil Analysis
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
      >
        {/* Farmer Name */}
        <div className="flex flex-col">
          <label className="text-green-800 font-medium mb-1 flex items-center gap-2">
            <User size={18} className="text-green-600" />
            Farmer Name
          </label>
          <input
            name="farmerName"
            value={state.farmerName}
            onChange={handleChange}
            placeholder="Enter farmer name"
            className="border border-green-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
            required
          />
        </div>

        {/* County */}
        <div className="flex flex-col">
          <label className="text-green-800 font-medium mb-1 flex items-center gap-2">
            <MapPin size={18} className="text-green-600" />
            County
          </label>
          <input
            name="county"
            value={state.county}
            onChange={handleChange}
            placeholder="Enter county"
            className="border border-green-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
            required
          />
        </div>

        {/* Farm Size */}
        <div className="flex flex-col">
          <label className="text-green-800 font-medium mb-1 flex items-center gap-2">
            <MapPin size={18} className="text-green-600" />
            Farm Size (hectares)
          </label>
          <input
            name="farmerSize"
            value={state.farmerSize}
            onChange={handleChange}
            placeholder="Enter farm size"
            className="border border-green-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
            required
          />
        </div>

        {/* pH */}
        <div className="flex flex-col">
          <label className="text-green-800 font-medium mb-1 flex items-center gap-2">
            <FlaskConical size={18} className="text-green-600" />
            Soil pH
          </label>
          <input
            type="number"
            name="ph"
            value={state.ph}
            onChange={handleChange}
            placeholder="e.g. 6.5"
            className="border border-green-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
            required
          />
        </div>

        {/* Nitrogen */}
        <div className="flex flex-col">
          <label className="text-green-800 font-medium mb-1 flex items-center gap-2">
            <FlaskConical size={18} className="text-green-600" />
            Nitrogen (mg/kg)
          </label>
          <input
            type="number"
            name="nitrogen"
            value={state.nitrogen}
            onChange={handleChange}
            placeholder="e.g. 20"
            className="border border-green-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
            required
          />
        </div>

        {/* Phosphorus */}
        <div className="flex flex-col">
          <label className="text-green-800 font-medium mb-1 flex items-center gap-2">
            <FlaskConical size={18} className="text-green-600" />
            Phosphorus (mg/kg)
          </label>
          <input
            type="number"
            name="phosphorus"
            value={state.phosphorus}
            onChange={handleChange}
            placeholder="e.g. 15"
            className="border border-green-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
            required
          />
        </div>

        {/* Potassium */}
        <div className="flex flex-col">
          <label className="text-green-800 font-medium mb-1 flex items-center gap-2">
            <FlaskConical size={18} className="text-green-600" />
            Potassium (mg/kg)
          </label>
          <input
            type="number"
            name="potassium"
            value={state.potassium}
            onChange={handleChange}
            placeholder="e.g. 30"
            className="border border-green-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
            required
          />
        </div>

        {/* Notes */}
        <div className="sm:col-span-2 flex flex-col">
          <label className="text-green-800 font-medium mb-1 flex items-center gap-2">
            <FileText size={18} className="text-green-600" />
            Notes
          </label>
          <textarea
            name="notes"
            value={state.notes}
            onChange={handleChange}
            placeholder="Additional observations or remarks"
            className="border border-green-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={loading}
          className="sm:col-span-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl mt-4 shadow-md transition-all duration-300"
        >
          {loading ? "Analyzing..." : "Analyze Soil"}
        </motion.button>
      </form>

      {/* 🌿 Formatted Results */}
      {result && result.analysis && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-10 mx-auto bg-white rounded-2xl shadow-lg p-6 w-full max-w-md text-center"
        >
          <Sprout className="mx-auto text-green-600 mb-3" size={36} />
          <h3 className="text-xl font-semibold text-green-800 mb-4">
            🌱 AI Soil Analysis Results
          </h3>

          <div className="space-y-2 text-gray-700">
            <p><strong>Recommended Crop:</strong> {result.analysis.recommendation}</p>
            <p><strong>Predicted Yield:</strong> {result.analysis.predicted_yield}</p>
            <p><strong>Soil Status:</strong> {result.analysis.soil_status}</p>
          </div>

          <p className="mt-4 text-green-700 font-medium">
            {result.message}
          </p>

          <button
            onClick={() => setResult(null)}
            className="mt-6 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-5 rounded-lg transition duration-300"
          >
            Clear Results
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
