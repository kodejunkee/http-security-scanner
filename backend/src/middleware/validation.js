const { URL } = require('url');
const dns = require('dns');
const { promisify } = require('util');
const net = require('net');

const dnsLookup = promisify(dns.lookup);

// Private/internal IP ranges (SSRF protection)
const PRIVATE_RANGES = [
  /^127\./,                        // Loopback
  /^10\./,                         // Class A private
  /^172\.(1[6-9]|2\d|3[01])\./,   // Class B private
  /^192\.168\./,                   // Class C private
  /^169\.254\./,                   // Link-local
  /^0\./,                          // Current network
  /^::1$/,                         // IPv6 loopback
  /^fc00:/i,                       // IPv6 unique local
  /^fe80:/i,                       // IPv6 link-local
];

/**
 * Checks if an IP address is private/internal
 */
function isPrivateIP(ip) {
  return PRIVATE_RANGES.some((range) => range.test(ip));
}

/**
 * Validates and sanitizes a URL for scanning.
 * Prevents SSRF by blocking internal/private IPs.
 */
async function validateUrl(req, res, next) {
  const { url } = req.body;

  // 1. Check URL is provided
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'A valid URL is required.' });
  }

  // 2. Trim and normalize
  let targetUrl = url.trim();

  // 3. Add https:// if no protocol specified
  if (!/^https?:\/\//i.test(targetUrl)) {
    targetUrl = `https://${targetUrl}`;
  }

  // 4. Parse and validate URL format
  let parsed;
  try {
    parsed = new URL(targetUrl);
  } catch {
    return res.status(400).json({ error: 'Invalid URL format.' });
  }

  // 5. Enforce http or https scheme only
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return res.status(400).json({ error: 'Only HTTP and HTTPS URLs are allowed.' });
  }

  // 6. Block localhost and common internal hostnames
  const blockedHosts = ['localhost', '0.0.0.0', '127.0.0.1', '[::1]'];
  if (blockedHosts.includes(parsed.hostname.toLowerCase())) {
    return res.status(400).json({ error: 'Scanning internal hosts is not allowed.' });
  }

  // 7. Resolve hostname and check for private IPs (SSRF protection)
  try {
    const { address } = await dnsLookup(parsed.hostname);
    if (isPrivateIP(address)) {
      return res.status(400).json({ error: 'Scanning internal/private IPs is not allowed.' });
    }
  } catch {
    return res.status(400).json({ error: 'Could not resolve hostname. Please check the URL.' });
  }

  // Attach validated URL to request
  req.validatedUrl = targetUrl;
  next();
}

module.exports = { validateUrl };
