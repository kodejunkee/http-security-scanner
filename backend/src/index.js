require('dotenv').config();
const express = require('express');
const { applySecurityMiddleware } = require('./middleware/security');
const scanRoutes = require('./routes/scan');
const resultsRoutes = require('./routes/results');
const analyticsRoutes = require('./routes/analytics');

const app = express();
const PORT = process.env.PORT || 5000;

// Parse JSON bodies
app.use(express.json());

// Apply security middleware (Helmet, CORS, Rate Limiting)
applySecurityMiddleware(app);

// API routes
app.use('/api/scan', scanRoutes);
app.use('/api/results', resultsRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
  });
});

const server = app.listen(PORT, () => {
  console.log(`✅ Security Scanner API running on http://localhost:${PORT}`);
});

// Prevent ECONNRESET: keep sockets alive longer than Next.js proxy timeout (60s)
server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;

module.exports = app;
