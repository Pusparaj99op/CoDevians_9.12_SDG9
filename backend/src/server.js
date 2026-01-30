require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const healthRoutes = require('./routes/health');
const bondsRoutes = require('./routes/bonds');

const app = express();
const PORT = process.env.PORT || 3210;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/bonds', bondsRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Mudra Backend API',
    version: '1.0.0',
    endpoints: ['/api/health', '/api/bonds']
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Mudra Backend running on http://localhost:${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📍 Bonds API: http://localhost:${PORT}/api/bonds`);
});
