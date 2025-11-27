// src/services/api.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:10000/api";

// ===============================
// SOIL ANALYSIS (MongoDB-backed)
// ===============================
export const analyzeSoil = async (county) => {
  try {
    if (typeof county !== "string") {
      county = String(county); // Ensure it’s a string
    }

    const payload = { county: county.trim() };

    const response = await axios.post(
      `${API_URL}/soil/analyze`,
      payload,
      {
        headers: { "Content-Type": "application/json" }
      }
    );

    return response.data;
  } catch (error) {
    console.error("❌ analyzeSoil error:", error.response?.data || error);
    throw error;
  }
};

// ===============================
// WEATHER (Node backend)
// ===============================
export const getWeather = async (county) => {
  try {
    if (typeof county !== "string") {
      county = String(county);
    }

    const response = await axios.get(`${API_URL}/weather/get`, {
      params: { county: county.trim() },
      headers: { "Content-Type": "application/json" },
    });

    return response.data;
  } catch (error) {
    console.error("❌ getWeather error:", error.response?.data || error);
    throw error;
  }
};
