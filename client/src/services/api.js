import axios from 'axios';

// Node/Express server (if still used)
const base = import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:5000';
const API = axios.create({
  baseURL: `${base}/api`,
  timeout: 30000
});

// Python AI server (Render)
const AI_BASE = import.meta.env.VITE_AI_URL?.trim() || 'http://localhost:8000';
const AI_API = axios.create({
  baseURL: `${AI_BASE}/api`,
  timeout: 30000
});

// ----------------------
// Node server (optional)
// ----------------------
export const analyzeSoilNode = async (data) => {
  try {
    console.log('➡️ Sending soil data to Node backend:', data);
    const res = await API.post('/soil/analyze', data);
    console.log('⬅️ Response from Node backend:', res.data);
    return res.data;
  } catch (err) {
    console.error('❌ analyzeSoilNode error:', err?.response?.data || err.message);
    throw err;
  }
};

// ----------------------
// Python AI server (Render)
// ----------------------
export const analyzeSoilAI = async (data) => {
  try {
    console.log('➡️ Sending soil data to AI backend:', data);
    const res = await AI_API.post('/analyze', data);
    console.log('⬅️ Response from AI backend:', res.data);
    return res.data;
  } catch (err) {
    console.error('❌ analyzeSoilAI error:', err?.response?.data || err.message);
    throw err;
  }
};

export const getWeatherAI = async (data) => {
  try {
    console.log('➡️ Sending weather request to AI backend:', data);
    const res = await AI_API.post('/weather', data);
    console.log('⬅️ Response from AI backend:', res.data);
    return res.data;
  } catch (err) {
    console.error('❌ getWeatherAI error:', err?.response?.data || err.message);
    throw err;
  }
};

export const askOpenAI = async (prompt) => {
  try {
    console.log('➡️ Sending prompt to AI backend:', prompt);
    const res = await AI_API.post('/ask', { prompt });
    console.log('⬅️ Response from AI backend:', res.data);
    return res.data;
  } catch (err) {
    console.error('❌ askOpenAI error:', err?.response?.data || err.message);
    throw err;
  }
};
