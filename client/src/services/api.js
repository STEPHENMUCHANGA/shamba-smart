// src/services/api.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:10000/api";

// ===============================
// SOIL ANALYSIS (Node backend)
// ===============================
export const analyzeSoil = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/soil/analyze`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("❌ analyzeSoil error:", error.response?.data || error);
    throw error;
  }
};

// ===============================
// WEATHER (Node backend)
// ===============================
export const getWeather = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/weather/get`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("❌ getWeather error:", error.response?.data || error);
    throw error;
  }
};
