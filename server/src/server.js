require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./utils/db');
const soilRoutes = require('./routes/soil.routes');
const weatherRoutes = require('./routes/weather.routes');
const axios = require('axios');

const PORT = process.env.PORT || 10000;

// ------------------------------
// Allowed origins for CORS
// ------------------------------
const allowedOrigins = [
  'http://localhost:5173',                  // Local dev
  process.env.FRONTEND_URL,                 // Production frontend domain
  'https://shambasmart.vercel.app',         // Vercel frontend
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow requests like Postman/curl
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.warn(`❌ Blocked by CORS: ${origin}`);
    return callback(new Error('Not allowed by CORS'), false);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
};

const startServer = async () => {
  try {
    console.log('🔧 Starting server...');

    // Connect to MongoDB
    await connectDB(process.env.MONGO_URI);

    const app = express();

    // Apply CORS and JSON parsing
    app.use(cors(corsOptions));
    app.use(express.json());

    // Root endpoint
    app.get('/', (req, res) => {
      res.json({ message: 'ShambaSmart API is running' });
    });

    // Mount existing routes
    app.use('/api/soil', soilRoutes);
    app.use('/api/weather', weatherRoutes);

    // ------------------------------
    // Forward /api/soil/analyze requests to Python/Gemini backend
    // ------------------------------
    const VITE_AI_URL = process.env.VITE_AI_URL || 'http://localhost:10001';

    app.post('/api/soil/analyze', async (req, res) => {
      try {
        console.log('🔔 Received soil analysis request:', req.body);

        const response = await axios.post(
          `${VITE_AI_URL}/api/analyze`,
          req.body,
          { headers: { 'Content-Type': 'application/json' } }
        );

        console.log('✅ Gemini response received');
        res.json(response.data);
      } catch (err) {
        console.error('❌ Soil analyze error:', err.response?.data || err.message);
        res.status(500).json({
          error: 'Failed to analyze soil',
          details: err.response?.data || err.message
        });
      }
    });

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Node server listening on port ${PORT}`);
      console.log('✅ Allowed Origins:', allowedOrigins);
      console.log('🌐 Python/Gemini backend URL:', VITE_AI_URL);
    });

  } catch (err) {
    console.error('❌ Fatal server error:', err);
    process.exit(1);
  }
};

startServer();
