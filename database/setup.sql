-- ============================================
-- HTTP Security Header Scanner — Database Setup
-- Run this SQL in the Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Websites table
CREATE TABLE IF NOT EXISTS websites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT NOT NULL UNIQUE,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scans table
CREATE TABLE IF NOT EXISTS scans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  website_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  scan_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  security_score INTEGER NOT NULL CHECK (security_score >= 0 AND security_score <= 100)
);

-- Headers table
CREATE TABLE IF NOT EXISTS headers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scan_id UUID NOT NULL REFERENCES scans(id) ON DELETE CASCADE,
  header_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present', 'missing', 'misconfigured')),
  header_value TEXT
);

-- Indexes for query performance
CREATE INDEX IF NOT EXISTS idx_scans_website_id ON scans(website_id);
CREATE INDEX IF NOT EXISTS idx_scans_scan_date ON scans(scan_date DESC);
CREATE INDEX IF NOT EXISTS idx_headers_scan_id ON headers(scan_id);

-- Enable Row Level Security
ALTER TABLE websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE headers ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (backend uses service_role key)
CREATE POLICY "Service role full access" ON websites FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON scans FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON headers FOR ALL USING (true) WITH CHECK (true);
