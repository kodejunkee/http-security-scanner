/**
 * Converts a numeric score (0–100) to a letter grade.
 */
export function getGrade(score) {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

/**
 * Returns a color hex value for a given grade.
 */
export function getGradeColor(grade) {
  const colors = {
    A: '#22c55e',
    B: '#3b82f6',
    C: '#f59e0b',
    D: '#f97316',
    F: '#ef4444',
  };
  return colors[grade] || '#6b7280';
}

/**
 * Returns the CSS class for a header status badge.
 */
export function getStatusBadgeClass(status) {
  const classes = {
    present: 'badge badge-present',
    missing: 'badge badge-missing',
    misconfigured: 'badge badge-misconfigured',
  };
  return classes[status] || 'badge';
}

/**
 * Formats an ISO date string to a readable format.
 */
export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Shortens a URL for display.
 */
export function truncateUrl(url, maxLength = 40) {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    const display = parsed.hostname + parsed.pathname;
    return display.length > maxLength
      ? display.substring(0, maxLength) + '...'
      : display;
  } catch {
    return url.length > maxLength ? url.substring(0, maxLength) + '...' : url;
  }
}

/**
 * Gets the status icon emoji.
 */
export function getStatusIcon(status) {
  switch (status) {
    case 'present': return '✅';
    case 'missing': return '❌';
    case 'misconfigured': return '⚠️';
    default: return '❓';
  }
}
