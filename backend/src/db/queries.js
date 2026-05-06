const { supabase } = require('../config/supabase');

/**
 * Insert or retrieve a website record.
 * If the URL already exists, returns the existing record.
 */
async function upsertWebsite(url) {
  // Check if already exists
  const { data: existing } = await supabase
    .from('websites')
    .select('*')
    .eq('url', url)
    .single();

  if (existing) return existing;

  // Extract category from URL hostname
  const hostname = new URL(url).hostname;
  const category = categorizeWebsite(hostname);

  const { data, error } = await supabase
    .from('websites')
    .insert({ url, category })
    .select()
    .single();

  if (error) throw new Error(`Database error (websites): ${error.message}`);
  return data;
}

/**
 * Simple website categorization based on domain.
 */
function categorizeWebsite(hostname) {
  const domain = hostname.toLowerCase();
  if (domain.includes('.gov')) return 'Government';
  if (domain.includes('.edu')) return 'Education';
  if (domain.includes('.org')) return 'Non-Profit';
  if (domain.match(/bank|finance|pay/)) return 'Finance';
  if (domain.match(/shop|store|amazon|ebay/)) return 'E-Commerce';
  if (domain.match(/news|cnn|bbc|times/)) return 'News';
  if (domain.match(/github|gitlab|stack/)) return 'Technology';
  if (domain.match(/facebook|twitter|instagram|linkedin|x\.com/)) return 'Social Media';
  return 'General';
}

/**
 * Insert a new scan record.
 */
async function insertScan(websiteId, securityScore) {
  const { data, error } = await supabase
    .from('scans')
    .insert({
      website_id: websiteId,
      security_score: securityScore,
      scan_date: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw new Error(`Database error (scans): ${error.message}`);
  return data;
}

/**
 * Insert header results for a scan.
 */
async function insertHeaders(scanId, headers) {
  const rows = headers.map((h) => ({
    scan_id: scanId,
    header_name: h.name,
    status: h.status,
    header_value: h.value || null,
  }));

  const { error } = await supabase.from('headers').insert(rows);

  if (error) throw new Error(`Database error (headers): ${error.message}`);
}

/**
 * Get full scan result by scan ID including website info and headers.
 */
async function getScanById(scanId) {
  // Get scan with website info
  const { data: scan, error: scanError } = await supabase
    .from('scans')
    .select(`
      *,
      websites (*)
    `)
    .eq('id', scanId)
    .single();

  if (scanError || !scan) return null;

  // Get headers for this scan
  const { data: headers, error: headersError } = await supabase
    .from('headers')
    .select('*')
    .eq('scan_id', scanId);

  if (headersError) throw new Error(`Database error (headers): ${headersError.message}`);

  return { ...scan, headers: headers || [] };
}

/**
 * Get analytics data across all scans.
 */
async function getAnalytics() {
  // Get all scans with website info
  const { data: scans, error: scansError } = await supabase
    .from('scans')
    .select(`
      *,
      websites (url, category)
    `)
    .order('scan_date', { ascending: false });

  if (scansError) throw new Error(`Database error: ${scansError.message}`);

  // Get all headers
  const { data: allHeaders, error: headersError } = await supabase
    .from('headers')
    .select('*');

  if (headersError) throw new Error(`Database error: ${headersError.message}`);

  if (!scans || scans.length === 0) {
    return {
      totalScans: 0,
      averageScore: 0,
      headerAdoption: {},
      mostMissingHeader: null,
      topWebsites: [],
      recentScans: [],
      scoreDistribution: { A: 0, B: 0, C: 0, D: 0, F: 0 },
    };
  }

  // Calculate average score
  const totalScore = scans.reduce((sum, s) => sum + s.security_score, 0);
  const averageScore = Math.round(totalScore / scans.length);

  // Calculate header adoption rates
  const headerCounts = {};
  const headerTotals = {};
  for (const h of allHeaders) {
    if (!headerTotals[h.header_name]) {
      headerTotals[h.header_name] = 0;
      headerCounts[h.header_name] = 0;
    }
    headerTotals[h.header_name]++;
    if (h.status === 'present') {
      headerCounts[h.header_name]++;
    }
  }

  const headerAdoption = {};
  for (const [name, total] of Object.entries(headerTotals)) {
    headerAdoption[name] = Math.round((headerCounts[name] / total) * 100);
  }

  // Find most missing header
  const missingCounts = {};
  for (const h of allHeaders) {
    if (h.status === 'missing') {
      missingCounts[h.header_name] = (missingCounts[h.header_name] || 0) + 1;
    }
  }
  const mostMissingHeader = Object.entries(missingCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  // Top websites by score (deduplicated — latest scan per website)
  const latestScans = {};
  for (const scan of scans) {
    const url = scan.websites?.url;
    if (url && !latestScans[url]) {
      latestScans[url] = scan;
    }
  }
  const topWebsites = Object.values(latestScans)
    .sort((a, b) => b.security_score - a.security_score)
    .slice(0, 10)
    .map((s) => ({
      url: s.websites.url,
      score: s.security_score,
      category: s.websites.category,
      scanDate: s.scan_date,
    }));

  // Score distribution
  const scoreDistribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  for (const scan of Object.values(latestScans)) {
    const score = scan.security_score;
    if (score >= 90) scoreDistribution.A++;
    else if (score >= 80) scoreDistribution.B++;
    else if (score >= 70) scoreDistribution.C++;
    else if (score >= 60) scoreDistribution.D++;
    else scoreDistribution.F++;
  }

  // Recent scans
  const recentScans = scans.slice(0, 15).map((s) => ({
    id: s.id,
    url: s.websites?.url,
    score: s.security_score,
    category: s.websites?.category,
    scanDate: s.scan_date,
  }));

  return {
    totalScans: scans.length,
    uniqueWebsites: Object.keys(latestScans).length,
    averageScore,
    headerAdoption,
    mostMissingHeader,
    topWebsites,
    recentScans,
    scoreDistribution,
  };
}

module.exports = {
  upsertWebsite,
  insertScan,
  insertHeaders,
  getScanById,
  getAnalytics,
};
