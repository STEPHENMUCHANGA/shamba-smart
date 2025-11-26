// src/components/SoilForm.jsx
import React, { useState } from "react";
import { analyzeSoil } from "../services/api";

export default function SoilForm() {
  const [state, setState] = useState({
    farmerName: "",
    county: "",
    farmSize: "",
    ph: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await analyzeSoil(state);
      setResult(response);
    } catch (err) {
      console.error("Soil form submit error:", err);
      alert("Error analyzing soil. Check backend logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Soil Analysis</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="farmerName"
          placeholder="Farmer Name"
          onChange={handleChange}
        />

        <input
          name="county"
          placeholder="County"
          onChange={handleChange}
        />

        <input
          name="farmSize"
          placeholder="Farm Size (Acres)"
          onChange={handleChange}
        />

        <input
          name="ph"
          placeholder="pH"
          type="float"
          onChange={handleChange}
        />

        <input
          name="nitrogen"
          placeholder="Nitrogen"
          type="number"
          onChange={handleChange}
        />

        <input
          name="phosphorus"
          placeholder="Phosphorus"
          type="number"
          onChange={handleChange}
        />

        <input
          name="potassium"
          placeholder="Potassium"
          type="number"
          onChange={handleChange}
        />

        <textarea
          name="notes"
          placeholder="Analysis Notes"
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Analyzing..." : "Submit"}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc" }}>
          <h3>Analysis Result</h3>
          <p><strong>Soil Status:</strong> {result.soilStatus}</p>
          <p><strong>Recommended Crop:</strong> {result.recommendedCrop}</p>
          <p><strong>Expected Yield:</strong> {result.expectedYield}</p>
          <p><strong>Fertilizer Advice:</strong> {result.fertilizerAdvice}</p>
          <p><strong>Additional Notes:</strong> {result.additionalNotes}</p>
        </div>
      )}
    </div>
  );
}
