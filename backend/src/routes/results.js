const express = require('express');
const router = express.Router();
const { getScanById } = require('../db/queries');
const { getRecommendations } = require('../scanner/recommendations');
const { calculateScore } = require('../scanner/scoreEngine');

/**
 * GET /api/results/:id
 * Returns full scan results for a given scan ID.
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({ error: 'Invalid scan ID format.' });
    }

    const scan = await getScanById(id);

    if (!scan) {
      return res.status(404).json({ error: 'Scan result not found.' });
    }

    // Rebuild score breakdown and recommendations from stored headers
    const headerResults = scan.headers.map((h) => ({
      name: h.header_name,
      status: h.status,
      value: h.header_value,
    }));

    const scoreResult = calculateScore(headerResults);
    const recommendations = getRecommendations(headerResults);

    res.json({
      scanId: scan.id,
      website: {
        url: scan.websites?.url,
        category: scan.websites?.category,
      },
      score: scan.security_score,
      grade: scoreResult.grade,
      breakdown: scoreResult.breakdown,
      headers: headerResults,
      recommendations,
      scanDate: scan.scan_date,
    });
  } catch (error) {
    console.error('Results error:', error.message);
    res.status(500).json({ error: 'Failed to retrieve scan results.' });
  }
});

/**
 * GET /api/results/:id/pdf
 * Serves a printable HTML report page.
 * Users can print or "Save as PDF" from their browser.
 */
router.get('/:id/pdf', async (req, res) => {
  try {
    const { id } = req.params;
    const scan = await getScanById(id);

    if (!scan) {
      return res.status(404).json({ error: 'Scan result not found.' });
    }

    const headerResults = scan.headers.map((h) => ({
      name: h.header_name,
      status: h.status,
      value: h.header_value,
    }));

    const scoreResult = calculateScore(headerResults);
    const recommendations = getRecommendations(headerResults);

    // Build HTML report page
    const htmlContent = buildPdfHtml({
      url: scan.websites?.url,
      score: scan.security_score,
      grade: scoreResult.grade,
      headers: headerResults,
      breakdown: scoreResult.breakdown,
      recommendations,
      scanDate: scan.scan_date,
    });

    res.setHeader('Content-Type', 'text/html');
    res.send(htmlContent);
  } catch (error) {
    console.error('PDF generation error:', error.message);
    res.status(500).json({ error: 'Failed to generate report.' });
  }
});

/**
 * Builds an HTML document for the PDF report.
 */
function buildPdfHtml({ url, score, grade, headers, breakdown, recommendations, scanDate }) {
  const statusColor = (s) => s === 'present' ? '#22c55e' : s === 'misconfigured' ? '#f59e0b' : '#ef4444';
  const gradeColor = (g) => ({ A: '#22c55e', B: '#3b82f6', C: '#f59e0b', D: '#f97316', F: '#ef4444' })[g] || '#6b7280';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; padding: 40px; line-height: 1.6; }
    h1 { color: #0f172a; border-bottom: 3px solid #3b82f6; padding-bottom: 10px; }
    h2 { color: #334155; margin-top: 30px; }
    .score-section { display: flex; align-items: center; gap: 20px; margin: 20px 0; }
    .score { font-size: 48px; font-weight: bold; color: ${gradeColor(grade)}; }
    .grade { font-size: 36px; font-weight: bold; color: ${gradeColor(grade)}; background: ${gradeColor(grade)}22; padding: 8px 20px; border-radius: 12px; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    th, td { padding: 10px 14px; text-align: left; border-bottom: 1px solid #e2e8f0; }
    th { background: #f1f5f9; font-weight: 600; }
    .status { padding: 3px 10px; border-radius: 6px; font-weight: 600; font-size: 13px; color: white; }
    .rec { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px 16px; margin: 10px 0; border-radius: 4px; }
    .rec code { background: #f1f5f9; padding: 2px 6px; border-radius: 3px; font-size: 12px; }
    .footer { margin-top: 40px; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 10px; }
  </style>
</head>
<body>
  <h1>🛡️ HTTP Security Header Report</h1>
  <p><strong>Website:</strong> ${url}</p>
  <p><strong>Scan Date:</strong> ${new Date(scanDate).toLocaleString()}</p>

  <div class="score-section">
    <div class="score">${score}/100</div>
    <div class="grade">Grade: ${grade}</div>
  </div>

  <h2>Header Analysis</h2>
  <table>
    <tr><th>Header</th><th>Status</th><th>Points</th></tr>
    ${breakdown.map(h => `
      <tr>
        <td>${h.header}</td>
        <td><span class="status" style="background:${statusColor(h.status)}">${h.status.toUpperCase()}</span></td>
        <td>${h.earnedPoints} / ${h.maxPoints}</td>
      </tr>
    `).join('')}
  </table>

  ${recommendations.length > 0 ? `
    <h2>Recommendations</h2>
    ${recommendations.map(r => `
      <div class="rec">
        <strong>${r.header}</strong> — ${r.status}<br/>
        <p>${r.importance}</p>
        <p><strong>Recommended:</strong> <code>${r.example}</code></p>
      </div>
    `).join('')}
  ` : '<h2>✅ All headers properly configured</h2>'}

  <div class="footer">
    Generated by HTTP Security Header Scanner — Academic Research Tool
  </div>
  <div style="text-align:center;margin:30px 0;">
    <button onclick="window.print()" style="background:#3b82f6;color:white;border:none;padding:12px 32px;border-radius:8px;font-size:15px;cursor:pointer;font-weight:600;">
      🖨️ Print / Save as PDF
    </button>
  </div>
  <style>@media print { button, .footer div:last-child { display:none!important; } }</style>
</body>
</html>`;
}

module.exports = router;
