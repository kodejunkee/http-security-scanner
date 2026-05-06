/**
 * Recommendations Engine
 *
 * Provides security recommendations for missing or misconfigured headers.
 * Each entry includes:
 *   - importance: Why the header matters
 *   - example: A recommended configuration value
 *   - risk: What happens if the header is absent
 */

const RECOMMENDATIONS = {
  'Content-Security-Policy': {
    importance:
      'Content Security Policy (CSP) prevents cross-site scripting (XSS), clickjacking, and other code injection attacks by specifying which dynamic resources are allowed to load.',
    example: "Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';",
    risk: 'Without CSP, attackers can inject malicious scripts into your pages, steal user data, and hijack sessions.',
  },
  'Strict-Transport-Security': {
    importance:
      'HTTP Strict Transport Security (HSTS) forces browsers to only communicate over HTTPS, preventing protocol downgrade attacks and cookie hijacking.',
    example: 'Strict-Transport-Security: max-age=31536000; includeSubDomains; preload',
    risk: 'Without HSTS, users may be vulnerable to man-in-the-middle attacks when first connecting via HTTP.',
  },
  'X-Frame-Options': {
    importance:
      'X-Frame-Options prevents your page from being embedded in iframes on other sites, protecting against clickjacking attacks.',
    example: 'X-Frame-Options: DENY',
    risk: 'Without this header, attackers can embed your site in invisible frames and trick users into clicking hidden elements.',
  },
  'X-Content-Type-Options': {
    importance:
      'X-Content-Type-Options prevents the browser from MIME-sniffing the content type, which can lead to security vulnerabilities when browsers interpret files as different content types.',
    example: 'X-Content-Type-Options: nosniff',
    risk: 'Without this header, browsers may misinterpret files (e.g., treating a text file as JavaScript), enabling attackers to execute malicious code.',
  },
  'Referrer-Policy': {
    importance:
      'Referrer-Policy controls how much referrer information is sent with requests, protecting user privacy and preventing sensitive URL data from leaking to external sites.',
    example: 'Referrer-Policy: strict-origin-when-cross-origin',
    risk: 'Without a Referrer-Policy, full URL paths (which may contain session tokens or private data) may be sent to third-party sites.',
  },
  'Permissions-Policy': {
    importance:
      'Permissions-Policy (formerly Feature-Policy) controls which browser features and APIs can be used on your site, reducing the attack surface for malicious scripts.',
    example: 'Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()',
    risk: 'Without this header, any script on your page could access sensitive device features like the camera, microphone, or location.',
  },
};

/**
 * Generates recommendations for headers that are missing or misconfigured.
 * @param {Array} headers - Array of { name, status } from the scanner
 * @returns {Array} Recommendations for non-present headers
 */
function getRecommendations(headers) {
  const recommendations = [];

  for (const header of headers) {
    if (header.status === 'missing' || header.status === 'misconfigured') {
      const rec = RECOMMENDATIONS[header.name];
      if (rec) {
        recommendations.push({
          header: header.name,
          status: header.status,
          ...rec,
        });
      }
    }
  }

  return recommendations;
}

module.exports = { getRecommendations, RECOMMENDATIONS };
