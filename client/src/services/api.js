import axios from "axios";

const AI_BASE_URL = "https://shamba-smart-1.onrender.com"; // your deployed backend

export const analyzeSoil = async (data) => {
  try {
    const response = await axios.post(`${AI_BASE_URL}/api/analyze`, data, {
      withCredentials: true
    });
    return response.data;
  } catch (err) {
    console.error("❌ analyzeSoil error:", err);
    throw err;
  }
};

export const getWeather = async (location) => {
  try {
    const response = await axios.post(`${AI_BASE_URL}/api/gemini/weather`, { location });
    return response.data;
  } catch (err) {
    console.error("❌ getWeather error:", err);
    throw err;
  }
};
