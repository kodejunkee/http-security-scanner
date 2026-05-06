import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Scan a website for security headers.
 * @param {string} url - The website URL to scan
 * @returns {Promise<Object>} Scan results
 */
export async function scanWebsite(url) {
  const response = await api.post('/scan', { url });
  return response.data;
}

/**
 * Get scan results by ID.
 * @param {string} id - The scan UUID
 * @returns {Promise<Object>} Scan results
 */
export async function getResults(id) {
  const response = await api.get(`/results/${id}`);
  return response.data;
}

/**
 * Get analytics data.
 * @returns {Promise<Object>} Aggregated analytics
 */
export async function getAnalytics() {
  const response = await api.get('/analytics');
  return response.data;
}

/**
 * Get the PDF download URL for a scan.
 * @param {string} id - The scan UUID
 * @returns {string} PDF endpoint URL
 */
export function getPdfUrl(id) {
  return `/api/results/${id}/pdf`;
}

export default api;
