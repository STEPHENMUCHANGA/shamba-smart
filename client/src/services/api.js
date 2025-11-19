import axios from 'axios';

const base = import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:5000';
const API = axios.create({
  baseURL: `${base}/api`,
  timeout: 30000
});

export const analyzeSoil = async (data) => {
  try {
    console.log('➡️ Sending soil data to backend:', data);
    const res = await API.post('/soil/analyze', data);
    console.log('⬅️ Received response from backend:', res.data);
    return res.data;
  } catch (err) {
    console.error('❌ analyzeSoil error:', err?.response?.data || err.message);
    throw err;
  }
};
