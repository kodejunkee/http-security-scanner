import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 90000, // 90s — allows for Render free-tier cold starts
  headers: {
    'Content-Type': 'application/json',
  },
});

// Retry interceptor — automatically retries on network/timeout errors (cold start resilience)
api.interceptors.response.use(undefined, async (error) => {
  const config = error.config;
  if (!config || config.__retryCount >= 2) return Promise.reject(error);

  const isRetryable =
    error.code === 'ECONNABORTED' ||          // timeout
    error.code === 'ERR_NETWORK' ||            // network error
    (error.response && error.response.status >= 500); // server error

  if (!isRetryable) return Promise.reject(error);

  config.__retryCount = (config.__retryCount || 0) + 1;
  await new Promise((r) => setTimeout(r, 2000)); // wait 2s before retry
  return api(config);
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
