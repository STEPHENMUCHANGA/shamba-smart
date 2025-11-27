// src/components/SoilForm.jsx
import React, { useState } from "react";
import { analyzeSoil } from "../services/api";

export default function SoilForm() {
  const [county, setCounty] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setCounty(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!county.trim()) {
      alert("Please enter a county");
      return;
    }
    setLoading(true);

    try {
      // Only send county to backend
      const response = await analyzeSoil(county.trim());
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
          name="county"
          placeholder="County"
          value={county}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Analyzing..." : "Submit"}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc" }}>
          <h3>Analysis Result</h3>
          <p><strong>County:</strong> {result.county}</p>
          <p><strong>Average pH:</strong> {result.average_ph}</p>
          <p><strong>Nitrogen:</strong> {result.nitrogen}</p>
          <p><strong>Phosphorus:</strong> {result.phosphorus}</p>
          <p><strong>Potassium:</strong> {result.potassium}</p>
          <p><strong>Soil Type:</strong> {result.soil_type}</p>
          <p><strong>Recommended Crops:</strong> {result.recommended_crops.join(", ")}</p>
          <p><strong>Source:</strong> {result.source}</p>
        </div>
      )}
    </div>
  );
}
