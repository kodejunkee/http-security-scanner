'use client';

import { getStatusBadgeClass, getStatusIcon } from '@/lib/utils';

export default function HeaderTable({ headers, breakdown }) {
  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div style={{
        padding: '18px 24px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
        <h3 style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--ink)' }}>
          Header Analysis
        </h3>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Security Header</th>
              <th>Status</th>
              <th>Points</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {headers.map((header, index) => {
              const points = breakdown?.find(b => b.header === header.name);
              return (
                <tr key={index}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                      <span style={{ fontSize: '15px', flexShrink: 0 }}>{getStatusIcon(header.status)}</span>
                      <span style={{
                        fontWeight: 600,
                        fontSize: '13px',
                        fontFamily: 'monospace',
                        color: 'var(--ink)',
                        letterSpacing: '-0.2px',
                      }}>{header.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(header.status)}`}>
                      {header.status}
                    </span>
                  </td>
                  <td>
                    <span style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      color: header.status === 'present' ? 'var(--green)' :
                             header.status === 'misconfigured' ? 'var(--amber)' : 'var(--red)',
                    }}>
                      {points ? `${points.earnedPoints} / ${points.maxPoints}` : '—'}
                    </span>
                  </td>
                  <td>
                    <span style={{
                      fontSize: '11.5px',
                      color: 'var(--ink-4)',
                      fontFamily: 'monospace',
                      maxWidth: '300px',
                      display: 'inline-block',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      verticalAlign: 'middle',
                    }}>
                      {header.value || <span style={{ color: 'var(--ink-4)', fontFamily: 'inherit', fontStyle: 'italic' }}>not set</span>}
                    </span>
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
