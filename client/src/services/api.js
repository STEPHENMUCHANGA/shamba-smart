import axios from 'axios';

// Base URLs from environment variables
const BASE_API = import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:5000';
const AI_BASE = import.meta.env.VITE_AI_URL?.trim() || 'http://localhost:8000'; // Replace with your Render AI URL in .env

// Backend API instance (for user auth, other server endpoints)
const API = axios.create({
  baseURL: `${BASE_API}/api`,
  timeout: 30000
});

// AI API instance (for soil & weather analysis)
const AI_API = axios.create({
  baseURL: `${AI_BASE}/api`,
  timeout: 30000
});

// ----------------------------
// User Authentication
// ----------------------------
export const signup = async (data) => {
  const res = await API.post('/signup', data);
  return res.data;
};

export const login = async (data) => {
  const res = await API.post('/login', data);
  return res.data;
};

// ----------------------------
// Soil Analysis
// ----------------------------
export const analyzeSoil = async (data) => {
  try {
    console.log('➡️ Sending soil data to AI server:', data);
    const res = await AI_API.post('/analyze', data);
    console.log('⬅️ Received soil analysis response:', res.data);
    return res.data;
  } catch (err) {
    console.error('❌ analyzeSoil error:', err?.response?.data || err.message);
    throw err;
  }
};

// ----------------------------
// Weather Analysis
// ----------------------------
export const getWeather = async (location) => {
  try {
    console.log('➡️ Fetching weather for:', location);
    const res = await AI_API.post('/weather', { location });
    console.log('⬅️ Received weather response:', res.data);
    return res.data;
  } catch (err) {
    console.error('❌ getWeather error:', err?.response?.data || err.message);
    throw err;
  }
};
