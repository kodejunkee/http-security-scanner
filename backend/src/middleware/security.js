const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

/**
 * Applies security middleware to the Express app:
 * - Helmet for HTTP security headers
 * - CORS for cross-origin requests
 * - Rate limiting to prevent abuse
 */
function applySecurityMiddleware(app) {
  // Helmet — sets various HTTP headers for security
  app.use(helmet());

  // CORS — allow requests from the frontend
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  // Rate limiting — 30 requests per minute per IP
  const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: 'Too many requests. Please try again later.',
    },
  });
  app.use('/api/', limiter);
}

module.exports = { applySecurityMiddleware };
