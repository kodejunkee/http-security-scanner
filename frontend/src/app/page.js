'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { scanWebsite } from '@/lib/api';

const HEADERS_INFO = [
  {
    name: 'Content-Security-Policy',
    desc: 'Prevents XSS and code injection by controlling allowed content sources.',
    points: '25 pts',
    color: '#0d9488',
  },
  {
    name: 'Strict-Transport-Security',
    desc: 'Forces HTTPS connections, protecting against protocol downgrade attacks.',
    points: '20 pts',
    color: '#0d9488',
  },
  {
    name: 'X-Frame-Options',
    desc: 'Blocks clickjacking by preventing the site from loading inside iframes.',
    points: '15 pts',
    color: '#0d9488',
  },
  {
    name: 'X-Content-Type-Options',
    desc: 'Prevents MIME-type sniffing that could expose security vulnerabilities.',
    points: '15 pts',
    color: '#0d9488',
  },
  {
    name: 'Referrer-Policy',
    desc: 'Controls referrer info sent with requests to protect user privacy.',
    points: '15 pts',
    color: '#0d9488',
  },
  {
    name: 'Permissions-Policy',
    desc: 'Restricts browser feature access to reduce the attack surface.',
    points: '10 pts',
    color: '#0d9488',
  },
];

const exampleSites = ['github.com', 'cloudflare.com', 'mozilla.org', 'bbc.co.uk', 'stripe.com'];

function SearchIcon({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function HomePage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleScan = async (e) => {
    e.preventDefault();
    if (!url.trim()) { setError('Please enter a website URL.'); return; }
    setLoading(true); setError('');
    try {
      const result = await scanWebsite(url.trim());
      router.push(`/results/${result.scanId}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to scan the website. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 60px)' }}>

      {/* ── Hero ── */}
      <section style={{
        padding: '120px 24px 90px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>

          {/* Pill badge */}
          <div className="animate-fade-in-up" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--teal-light)',
            border: '1px solid var(--teal-border)',
            borderRadius: '100px',
            padding: '5px 14px',
            fontSize: '12.5px',
            fontWeight: 600,
            color: 'var(--teal)',
            marginBottom: '28px',
          }}>
            <CheckIcon />
            HTTP Security Header Analysis
          </div>

          {/* Headline */}
          <h1 className="animate-fade-in-up" style={{
            fontSize: 'clamp(34px, 5.5vw, 56px)',
            fontWeight: 800,
            lineHeight: 1.12,
            letterSpacing: '-0.03em',
            color: 'var(--ink)',
            marginBottom: '20px',
            animationDelay: '0.07s',
          }}>
            Evaluate your website's{' '}
            <span className="text-gradient">security compliance</span>
          </h1>

          {/* Sub */}
          <p className="animate-fade-in-up" style={{
            fontSize: '16.5px',
            color: 'var(--ink-3)',
            maxWidth: '500px',
            margin: '0 auto 44px',
            lineHeight: 1.7,
            animationDelay: '0.14s',
          }}>
            Scan any public website to analyse HTTP security headers, calculate a compliance score, and get actionable recommendations.
          </p>

          {/* Scan form */}
          <form
            onSubmit={handleScan}
            className="animate-fade-in-up"
            style={{ animationDelay: '0.21s' }}
          >
            <div style={{
              display: 'flex',
              gap: '10px',
              maxWidth: '580px',
              margin: '0 auto',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}>
              <input
                id="url-input"
                type="text"
                className="input-base"
                placeholder="e.g. github.com or https://stripe.com"
                value={url}
                onChange={e => { setUrl(e.target.value); setError(''); }}
                disabled={loading}
                style={{ flex: '1', minWidth: '280px' }}
              />
              <button
                id="scan-button"
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{ minWidth: '136px', justifyContent: 'center', fontSize: '14.5px', padding: '13px 24px' }}
              >
                {loading ? (
                  <><span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} /> Scanning…</>
                ) : (
                  <><SearchIcon size={15} color="#fff" /> Scan Now</>
                )}
              </button>
            </div>

            {error && (
              <div style={{
                marginTop: '14px',
                padding: '10px 16px',
                background: 'var(--red-bg)',
                border: '1px solid var(--red-border)',
                borderRadius: '8px',
                color: 'var(--red)',
                fontSize: '13.5px',
                maxWidth: '580px',
                margin: '14px auto 0',
                textAlign: 'left',
              }}>
                {error}
              </div>
            )}
          </form>

          {/* Quick examples */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.3s', marginTop: '24px' }}>
            <span style={{ fontSize: '12px', color: 'var(--ink-4)', marginRight: '10px' }}>Try:</span>
            {exampleSites.map(site => (
              <button
                key={site}
                onClick={() => setUrl(site)}
                disabled={loading}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '2px 4px',
                  fontSize: '12.5px',
                  color: 'var(--teal)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontWeight: 500,
                  marginRight: '8px',
                  textDecoration: 'underline',
                  textUnderlineOffset: '3px',
                  textDecorationColor: 'var(--teal-border)',
                  transition: 'color 0.15s',
                }}
              >
                {site}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── What we analyse ── */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '72px 24px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p className="section-label" style={{ marginBottom: '10px' }}>Coverage</p>
          <h2 style={{
            fontSize: '28px',
            fontWeight: 700,
            color: 'var(--ink)',
            letterSpacing: '-0.02em',
          }}>
            Six headers. Full picture.
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '16px',
        }}>
          {HEADERS_INFO.map((item, i) => (
            <div
              key={i}
              className="card animate-fade-in-up"
              style={{
                padding: '22px 24px',
                animationDelay: `${i * 0.07}s`,
                opacity: 0,
                borderLeft: '3px solid var(--teal)',
                transition: 'box-shadow 0.2s, transform 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = 'var(--shadow)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <h3 style={{
                  fontSize: '13.5px',
                  fontWeight: 700,
                  color: 'var(--ink)',
                  fontFamily: 'monospace',
                  letterSpacing: '-0.2px',
                }}>
                  {item.name}
                </h3>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'var(--teal)',
                  background: 'var(--teal-light)',
                  padding: '2px 9px',
                  borderRadius: '100px',
                  border: '1px solid var(--teal-border)',
                  whiteSpace: 'nowrap',
                  marginLeft: '12px',
                }}>
                  {item.points}
                </span>
              </div>
              <p style={{ fontSize: '13.5px', color: 'var(--ink-3)', lineHeight: 1.6 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
