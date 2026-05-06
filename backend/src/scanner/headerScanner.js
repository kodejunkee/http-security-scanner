const axios = require('axios');

/**
 * The 6 security headers to analyze,
 * with validation logic for detecting misconfigurations.
 */
const SECURITY_HEADERS = {
  'content-security-policy': {
    displayName: 'Content-Security-Policy',
    validate: (value) => {
      if (!value) return 'missing';
      // A CSP with only "unsafe-inline" or "unsafe-eval" on script-src is misconfigured
      const lower = value.toLowerCase();
      if (lower === "default-src '*'") return 'misconfigured';
      if (lower.includes("'unsafe-inline'") && lower.includes("'unsafe-eval'") && lower.includes('script-src')) {
        return 'misconfigured';
      }
      return 'present';
    },
  },
  'strict-transport-security': {
    displayName: 'Strict-Transport-Security',
    validate: (value) => {
      if (!value) return 'missing';
      const lower = value.toLowerCase();
      // Should have a reasonable max-age (at least 6 months = 15768000)
      const maxAgeMatch = lower.match(/max-age=(\d+)/);
      if (!maxAgeMatch) return 'misconfigured';
      const maxAge = parseInt(maxAgeMatch[1], 10);
      if (maxAge < 15768000) return 'misconfigured';
      return 'present';
    },
  },
  'x-frame-options': {
    displayName: 'X-Frame-Options',
    validate: (value) => {
      if (!value) return 'missing';
      const upper = value.toUpperCase().trim();
      if (['DENY', 'SAMEORIGIN'].includes(upper)) return 'present';
      if (upper.startsWith('ALLOW-FROM')) return 'present';
      return 'misconfigured';
    },
  },
  'x-content-type-options': {
    displayName: 'X-Content-Type-Options',
    validate: (value) => {
      if (!value) return 'missing';
      if (value.toLowerCase().trim() === 'nosniff') return 'present';
      return 'misconfigured';
    },
  },
  'referrer-policy': {
    displayName: 'Referrer-Policy',
    validate: (value) => {
      if (!value) return 'missing';
      const validPolicies = [
        'no-referrer', 'no-referrer-when-downgrade', 'origin',
        'origin-when-cross-origin', 'same-origin', 'strict-origin',
        'strict-origin-when-cross-origin', 'unsafe-url',
      ];
      const policies = value.toLowerCase().split(',').map(p => p.trim());
      const allValid = policies.every(p => validPolicies.includes(p));
      return allValid ? 'present' : 'misconfigured';
    },
  },
  'permissions-policy': {
    displayName: 'Permissions-Policy',
    validate: (value) => {
      if (!value) return 'missing';
      // Basic check: should contain at least one directive
      if (value.trim().length === 0) return 'misconfigured';
      return 'present';
    },
  },
};

/**
 * Scans a website URL and analyzes its HTTP security headers.
 * @param {string} url - The validated URL to scan
 * @returns {Object} Scan results with header analysis
 */
async function scanWebsite(url) {
  const startTime = Date.now();

  // Send HTTP GET request with timeout and redirect following
  const response = await axios.get(url, {
    timeout: 10000,
    maxRedirects: 5,
    validateStatus: () => true, // Accept any HTTP status
    headers: {
      'User-Agent': 'SecurityHeaderScanner/1.0 (Academic Research)',
    },
  });

  const responseHeaders = response.headers;
  const results = [];

  // Check each security header
  for (const [headerKey, config] of Object.entries(SECURITY_HEADERS)) {
    const rawValue = responseHeaders[headerKey] || null;
    const status = config.validate(rawValue);

    results.push({
      name: config.displayName,
      headerKey,
      status,
      value: rawValue || null,
    });
  }

  const scanDuration = Date.now() - startTime;

  return {
    url,
    headers: results,
    httpStatus: response.status,
    scanDuration,
    scannedAt: new Date().toISOString(),
  };
}

module.exports = { scanWebsite, SECURITY_HEADERS };
