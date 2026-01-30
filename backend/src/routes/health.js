const express = require('express');
const router = express.Router();

// GET /api/health - Health check endpoint
router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Mudra Backend is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

module.exports = router;
