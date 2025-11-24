import axios from "axios";

// Use environment variable for API base URL
const API_URL = import.meta.env.VITE_API_URL;

export const analyzeSoil = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/soil/analyze`, data, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true, // if you need cookies/auth
    });
    return response.data;
  } catch (error) {
    console.error("❌ analyzeSoil error:", error);
    throw error;
  }
};

// Example for weather API
export const getWeather = async (county) => {
  try {
    const response = await axios.get(`${API_URL}/weather/get?county=${county}`);
    return response.data;
  } catch (error) {
    console.error("❌ getWeather error:", error);
    throw error;
  }
};
