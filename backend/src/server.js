const express = require('express');
const cors = require('cors');
const healthRoutes = require('./routes/health');

const app = express();
const PORT = process.env.PORT || 3210;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/health', healthRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Mudra Backend API',
    version: '1.0.0',
    endpoints: ['/api/health']
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Mudra Backend running on http://localhost:${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});
