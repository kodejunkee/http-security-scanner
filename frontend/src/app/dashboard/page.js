'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAnalytics } from '@/lib/api';
import { getGrade, getGradeColor } from '@/lib/utils';
import AdoptionChart from '@/components/charts/AdoptionChart';
import ScoreDistribution from '@/components/charts/ScoreDistribution';
import RecentScans from '@/components/RecentScans';

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className="card animate-fade-in-up" style={{ padding: '22px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '14px' }}>
        {icon}
        <span className="section-label">{label}</span>
      </div>
      <div style={{
        fontSize: typeof value === 'string' && value.length > 12 ? '14px' : '30px',
        fontWeight: typeof value === 'string' && value.length > 12 ? 600 : 800,
        color: color || 'var(--ink)',
        letterSpacing: '-0.03em',
        lineHeight: 1,
        wordBreak: 'break-word',
      }}>
        {value}
        {sub && <span style={{ fontSize: '13px', fontWeight: 400, color: 'var(--ink-4)', marginLeft: '3px' }}>{sub}</span>}
      </div>
    </div>
  );
}

function LoadingPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 60px)', gap: '14px' }}>
      <div className="spinner" />
      <p style={{ color: 'var(--ink-4)', fontSize: '14px' }}>Loading analytics…</p>
    </div>
  );
}

function TrendIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;
}
function GlobeIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>;
}
function LinkIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>;
}
function WarnIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
}

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const analytics = await getAnalytics();
        setData(analytics);
      } catch {
        setError('Failed to load analytics data.');
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) return <LoadingPage />;

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 60px)', gap: '14px' }}>
        <p style={{ color: 'var(--red)', fontSize: '15px' }}>{error}</p>
      </div>
    );
  }

  const avgGrade = data ? getGrade(data.averageScore) : 'N/A';

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '36px 24px 80px' }}>

      {/* ── Page Header ── */}
      <div style={{ marginBottom: '36px', borderBottom: '1px solid var(--border)', paddingBottom: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em' }}>
          Analytics Dashboard
        </h1>
        <p style={{ fontSize: '13.5px', color: 'var(--ink-4)', marginTop: '6px' }}>
          Aggregated HTTP security header compliance statistics across all scanned websites.
        </p>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px', marginBottom: '28px' }}>
        <StatCard icon={<GlobeIcon />} label="Total Scans" value={data?.totalScans ?? 0} />
        <StatCard icon={<LinkIcon />} label="Unique Websites" value={data?.uniqueWebsites ?? 0} />
        <StatCard
          icon={<TrendIcon />}
          label="Average Score"
          value={data?.averageScore ?? 0}
          sub="/100"
          color={getGradeColor(avgGrade)}
        />
        <StatCard
          icon={<WarnIcon />}
          label="Most Missing Header"
          value={data?.mostMissingHeader || 'N/A'}
          color="var(--amber)"
        />
      </div>

      {/* ── Charts ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        <AdoptionChart headerAdoption={data?.headerAdoption} />
        <ScoreDistribution distribution={data?.scoreDistribution} />
      </div>

      {/* ── Top Websites ── */}
      {data?.topWebsites?.length > 0 && (
        <div className="card" style={{ overflow: 'hidden', marginBottom: '20px' }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
            </svg>
            <h3 style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--ink)' }}>Top Ranked Websites</h3>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Website</th>
                  <th>Score</th>
                  <th>Grade</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                {data.topWebsites.map((site, i) => {
                  const grade = getGrade(site.score);
                  const color = getGradeColor(grade);
                  return (
                    <tr key={i}>
                      <td>
                        <span style={{
                          fontWeight: 700,
                          fontSize: '13px',
                          color: i < 3 ? '#d97706' : 'var(--ink-4)',
                        }}>
                          {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 500, color: 'var(--ink)', fontFamily: 'monospace', fontSize: '13px' }}>
                          {site.url}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 700, color, fontSize: '14px' }}>{site.score}</span>
                      </td>
                      <td>
                        <span style={{
                          fontSize: '12px', fontWeight: 700, color,
                          background: `${color}12`, border: `1px solid ${color}30`,
                          padding: '2px 10px', borderRadius: '6px',
                        }}>
                          {grade}
                        </span>
                      </td>
                      <td>
                        <span style={{
                          fontSize: '11.5px', fontWeight: 500,
                          color: 'var(--ink-3)',
                          background: 'var(--surface-2)', border: '1px solid var(--border)',
                          padding: '2px 8px', borderRadius: '6px',
                        }}>
                          {site.category || 'General'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Recent Scans ── */}
      <RecentScans scans={data?.recentScans} />
    </div>
  );
}
