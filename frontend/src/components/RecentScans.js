'use client';

import Link from 'next/link';
import { getGrade, getGradeColor, truncateUrl, formatDate } from '@/lib/utils';

export default function RecentScans({ scans }) {
  if (!scans || scans.length === 0) {
    return (
      <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
        <p style={{ color: 'var(--ink-4)', fontSize: '14px' }}>No scans yet — start by scanning a website.</p>
      </div>
    );
  }

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div style={{
        padding: '18px 24px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
          <h3 style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--ink)' }}>Recent Scans</h3>
        </div>
        <span style={{
          fontSize: '11.5px',
          fontWeight: 600,
          color: 'var(--ink-4)',
          background: 'var(--surface-2)',
          border: '1px solid var(--border)',
          padding: '2px 10px',
          borderRadius: '100px',
        }}>
          {scans.length} results
        </span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Website</th>
              <th>Score</th>
              <th>Grade</th>
              <th>Category</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {scans.map((scan, index) => {
              const grade = getGrade(scan.score);
              const color = getGradeColor(grade);
              return (
                <tr key={scan.id || index}>
                  <td>
                    <span style={{ fontWeight: 500, color: 'var(--ink)', fontSize: '13px', fontFamily: 'monospace' }}>
                      {truncateUrl(scan.url)}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color, fontSize: '14px' }}>{scan.score}</span>
                  </td>
                  <td>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color,
                      background: `${color}25`,
                      border: `1px solid ${color}45`,
                      boxShadow: `0 0 15px ${color}10`,
                      padding: '2px 9px',
                      borderRadius: '6px',
                    }}>
                      {grade}
                    </span>
                  </td>
                  <td>
                    <span style={{
                      fontSize: '11.5px',
                      fontWeight: 500,
                      color: 'var(--ink-3)',
                      background: 'var(--surface-2)',
                      border: '1px solid var(--border)',
                      padding: '2px 8px',
                      borderRadius: '6px',
                    }}>
                      {scan.category || 'General'}
                    </span>
                  </td>
                  <td style={{ fontSize: '12.5px', color: 'var(--ink-4)' }}>
                    {formatDate(scan.scanDate)}
                  </td>
                  <td>
                    {scan.id && (
                      <Link href={`/results/${scan.id}`} style={{
                        fontSize: '12.5px',
                        color: 'var(--teal)',
                        fontWeight: 600,
                        textDecoration: 'none',
                        whiteSpace: 'nowrap',
                      }}>
                        View →
                      </Link>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
