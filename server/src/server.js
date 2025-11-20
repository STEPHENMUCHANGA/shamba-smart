require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./utils/db');
const soilRoutes = require('./routes/soil.routes');

const PORT = process.env.PORT || 5000;

// Allowed origins for CORS
const allowedOrigins = [
  'http://localhost:5173',                       // local dev
  process.env.FRONTEND_URL, 
  'https://shambasmart.vercel.app',                     // Vercel URL
  process.env.RENDER_EXTERNAL_URL                // Render URL (automatically assigned)
].filter(Boolean); // remove undefined values

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., mobile apps or curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.warn(`❌ Blocked by CORS: ${origin}`);
      return callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
};

const startServer = async () => {
  try {
    console.log('🔧 Starting server...');

    // Connect to database
    await connectDB(process.env.MONGO_URI);

    const app = express();

    // Apply dynamic CORS
    app.use(cors(corsOptions));

    // Parse JSON
    app.use(express.json());

    // Root endpoint
    app.get('/', (req, res) => {
      res.json({ message: 'ShambaSmart API is running' });
    });

    // Routes
    app.use('/api/soil', soilRoutes);
    app.use('/api/weather', require('./routes/weather.routes'));

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT}`);
      console.log(`Allowed Origins:`, allowedOrigins);
    });

  } catch (err) {
    console.error('❌ Fatal server error:', err);
    process.exit(1);
  }
};

startServer();
