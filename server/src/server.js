require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./utils/db');
const soilRoutes = require('./routes/soil.routes');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log('🔧 Starting server...');
    await connectDB(process.env.MONGO_URI);

    const app = express();
    app.use(cors());
    app.use(express.json());

    app.get('/', (req, res) => {
      res.json({ message: 'ShambaSmart API is running' });
    });

    app.use('/api/soil', soilRoutes);

    app.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Fatal server error:', err);
    process.exit(1);
  }
};

startServer();
