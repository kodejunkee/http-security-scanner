'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getResults, getPdfUrl } from '@/lib/api';
import { formatDate, truncateUrl } from '@/lib/utils';
import ScoreCard from '@/components/ScoreCard';
import GradeIndicator from '@/components/GradeIndicator';
import HeaderTable from '@/components/HeaderTable';
import RecommendationsPanel from '@/components/RecommendationsPanel';

function LoadingPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 60px)', gap: '14px' }}>
      <div className="spinner" />
      <p style={{ color: 'var(--ink-4)', fontSize: '14px' }}>Loading scan results…</p>
    </div>
  );
}

function ErrorPage({ message }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 60px)', gap: '16px', textAlign: 'center' }}>
      <div style={{
        width: '56px', height: '56px', borderRadius: '14px',
        background: 'var(--red-bg)', border: '1px solid var(--red-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <p style={{ color: 'var(--red)', fontSize: '15px', fontWeight: 500 }}>{message}</p>
      <Link href="/" className="btn-secondary">← Back to Scanner</Link>
    </div>
  );
}

export default function ResultsPage() {
  const params = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchResults() {
      try {
        const result = await getResults(params.id);
        setData(result);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load results.');
      } finally {
        setLoading(false);
      }
    }
    if (params.id) fetchResults();
  }, [params.id]);

  if (loading) return <LoadingPage />;
  if (error) return <ErrorPage message={error} />;
  if (!data) return null;

  const presentCount = data.headers.filter(h => h.status === 'present').length;
  const missingCount = data.headers.filter(h => h.status === 'missing').length;
  const misconfiguredCount = data.headers.filter(h => h.status === 'misconfigured').length;

  return (
    <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '36px 24px 80px' }}>

      {/* ── Top bar ── */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '14px',
      }}>
        <div>
          <Link href="/" style={{ fontSize: '12.5px', color: 'var(--ink-4)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            ← Back to Scanner
          </Link>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--ink)', marginTop: '8px', letterSpacing: '-0.02em' }}>
            Scan Results
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--ink-4)', marginTop: '4px' }}>
            {truncateUrl(data.website?.url, 60)} &nbsp;·&nbsp; {formatDate(data.scanDate)}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
          <a
            href={getPdfUrl(params.id)}
            target="_blank"
            rel="noopener noreferrer"
            id="pdf-export-button"
            className="btn-secondary"
            style={{ fontSize: '13px', padding: '9px 18px' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" />
            </svg>
            Export PDF
          </a>
          <Link
            href="/"
            className="btn-primary"
            style={{ textDecoration: 'none', fontSize: '13px', padding: '9px 18px' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            New Scan
          </Link>
        </div>
      </div>

      {/* ── Score + Summary ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '260px 1fr',
        gap: '20px',
        marginBottom: '20px',
        alignItems: 'start',
      }}>
        <ScoreCard score={data.score} grade={data.grade} />

        <div className="card" style={{ padding: '24px 28px' }}>
          <p className="section-label" style={{ marginBottom: '20px' }}>Scan Summary</p>

          {/* Stat tiles */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '24px' }}>
            {[
              { label: 'Present', value: presentCount, color: 'var(--green)', bg: 'var(--green-bg)', border: 'var(--green-border)' },
              { label: 'Missing', value: missingCount, color: 'var(--red)', bg: 'var(--red-bg)', border: 'var(--red-border)' },
              { label: 'Misconfigured', value: misconfiguredCount, color: 'var(--amber)', bg: 'var(--amber-bg)', border: 'var(--amber-border)' },
            ].map(({ label, value, color, bg, border }) => (
              <div key={label} style={{ background: bg, border: `1px solid ${border}`, borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '30px', fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: '11.5px', color, fontWeight: 600, marginTop: '5px', opacity: 0.8 }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <GradeIndicator grade={data.grade} />
            {data.website?.category && (
              <span style={{
                fontSize: '12px',
                fontWeight: 500,
                color: 'var(--ink-3)',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                padding: '4px 12px',
                borderRadius: '8px',
              }}>
                {data.website.category}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Header Table ── */}
      <div style={{ marginBottom: '20px' }}>
        <HeaderTable headers={data.headers} breakdown={data.breakdown} />
      </div>

      {/* ── Recommendations ── */}
      <RecommendationsPanel recommendations={data.recommendations} />
    </div>
  );
}
