const express = require('express');
const router = express.Router();
const { getAnalytics } = require('../db/queries');

/**
 * GET /api/analytics
 * Returns aggregated statistics across all scans:
 *   - totalScans, uniqueWebsites, averageScore
 *   - headerAdoption (% per header)
 *   - mostMissingHeader
 *   - topWebsites (top 10 by score)
 *   - recentScans (last 15)
 *   - scoreDistribution (A–F counts)
 */
router.get('/', async (req, res) => {
  try {
    const analytics = await getAnalytics();
    res.json(analytics);
  } catch (error) {
    console.error('Analytics error:', error.message);
    res.status(500).json({ error: 'Failed to retrieve analytics.' });
  }
});

module.exports = router;
