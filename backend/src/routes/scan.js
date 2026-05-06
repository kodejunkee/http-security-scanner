const express = require('express');
const router = express.Router();
const { validateUrl } = require('../middleware/validation');
const { scanWebsite } = require('../scanner/headerScanner');
const { calculateScore } = require('../scanner/scoreEngine');
const { getRecommendations } = require('../scanner/recommendations');
const { upsertWebsite, insertScan, insertHeaders } = require('../db/queries');

/**
 * POST /api/scan
 * Accepts a website URL, scans it for security headers,
 * calculates a score, stores results, and returns analysis.
 */
router.post('/', validateUrl, async (req, res) => {
  try {
    const url = req.validatedUrl;

    // Step 1–3: Scan the website and extract headers
    const scanResult = await scanWebsite(url);

    // Step 4–5: Calculate security score
    const scoreResult = calculateScore(scanResult.headers);

    // Step 6: Generate recommendations
    const recommendations = getRecommendations(scanResult.headers);

    // Step 7: Store results in database
    const website = await upsertWebsite(url);
    const scan = await insertScan(website.id, scoreResult.score);
    await insertHeaders(scan.id, scanResult.headers);

    // Step 8: Return structured response
    res.json({
      scanId: scan.id,
      website: {
        url,
        category: website.category,
      },
      score: scoreResult.score,
      grade: scoreResult.grade,
      breakdown: scoreResult.breakdown,
      headers: scanResult.headers,
      recommendations,
      httpStatus: scanResult.httpStatus,
      scanDuration: scanResult.scanDuration,
      scannedAt: scanResult.scannedAt,
    });
  } catch (error) {
    console.error('Scan error:', error.message);

    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return res.status(400).json({ error: 'Could not connect to the website. Please check the URL.' });
    }
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return res.status(408).json({ error: 'Request timed out. The website took too long to respond.' });
    }

    res.status(500).json({ error: 'Failed to scan the website. Please try again.' });
  }
});

module.exports = router;
