/**
 * Security Score Engine
 *
 * Calculates a security score from 0–100 based on the presence
 * and correct configuration of HTTP security headers.
 *
 * Weighting:
 *   Content-Security-Policy    = 25 points
 *   Strict-Transport-Security  = 20 points
 *   X-Frame-Options            = 15 points
 *   X-Content-Type-Options     = 15 points
 *   Referrer-Policy             = 15 points
 *   Permissions-Policy          = 10 points
 *
 * Scoring:
 *   present       → full points
 *   misconfigured → 40% of points
 *   missing       → 0 points
 */

const HEADER_WEIGHTS = {
  'Content-Security-Policy': 25,
  'Strict-Transport-Security': 20,
  'X-Frame-Options': 15,
  'X-Content-Type-Options': 15,
  'Referrer-Policy': 15,
  'Permissions-Policy': 10,
};

const STATUS_MULTIPLIERS = {
  present: 1.0,
  misconfigured: 0.4,
  missing: 0.0,
};

/**
 * Calculates the security score for a set of header results.
 * @param {Array} headers - Array of { name, status } objects from the scanner
 * @returns {Object} Score details
 */
function calculateScore(headers) {
  let totalScore = 0;
  const breakdown = [];

  for (const header of headers) {
    const weight = HEADER_WEIGHTS[header.name] || 0;
    const multiplier = STATUS_MULTIPLIERS[header.status] || 0;
    const points = Math.round(weight * multiplier);

    totalScore += points;
    breakdown.push({
      header: header.name,
      maxPoints: weight,
      earnedPoints: points,
      status: header.status,
    });
  }

  return {
    score: totalScore,
    maxScore: 100,
    grade: getGrade(totalScore),
    breakdown,
  };
}

/**
 * Converts a numeric score to a letter grade.
 * @param {number} score - Score from 0–100
 * @returns {string} Letter grade (A–F)
 */
function getGrade(score) {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

module.exports = { calculateScore, getGrade, HEADER_WEIGHTS };
