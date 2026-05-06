'use client';

import { useState } from 'react';

function ChevronIcon({ open }) {
  return (
    <svg
      width="14" height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--ink-4)"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export default function RecommendationsPanel({ recommendations }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="card" style={{ padding: '36px', textAlign: 'center' }}>
        <div style={{ fontSize: '36px', marginBottom: '12px' }}>✅</div>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--green)', marginBottom: '6px' }}>
          All Headers Properly Configured
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--ink-4)' }}>
          This website implements all analysed security headers correctly.
        </p>
      </div>
    );
  }

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        padding: '18px 24px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <h3 style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--ink)' }}>Recommendations</h3>
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
          {recommendations.length} issue{recommendations.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div style={{ padding: '8px 12px' }}>
        {recommendations.map((rec, index) => {
          const isExpanded = expandedIndex === index;
          const isMissing = rec.status === 'missing';

          return (
            <div
              key={index}
              style={{
                borderRadius: '10px',
                marginBottom: '4px',
                border: `1px solid ${isExpanded ? 'var(--border-strong)' : 'transparent'}`,
                background: isExpanded ? 'var(--surface-2)' : 'transparent',
                transition: 'all 0.18s',
                overflow: 'hidden',
              }}
            >
              {/* Row button */}
              <button
                onClick={() => setExpandedIndex(isExpanded ? null : index)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '13px 14px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13.5px',
                  textAlign: 'left',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                  <span style={{
                    width: '7px', height: '7px',
                    borderRadius: '50%',
                    background: isMissing ? 'var(--red)' : 'var(--amber)',
                    flexShrink: 0,
                  }} />
                  <span style={{
                    fontWeight: 600,
                    color: 'var(--ink)',
                    fontFamily: 'monospace',
                    fontSize: '12.5px',
                    letterSpacing: '-0.2px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {rec.header}
                  </span>
                  <span className={`badge ${isMissing ? 'badge-missing' : 'badge-misconfigured'}`}>
                    {rec.status}
                  </span>
                </div>
                <ChevronIcon open={isExpanded} />
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div
                  style={{ padding: '0 14px 16px', animation: 'fadeIn 0.2s ease' }}
                >
                  {/* Risk */}
                  <div style={{
                    background: 'var(--red-bg)',
                    border: '1px solid var(--red-border)',
                    borderRadius: '8px',
                    padding: '11px 14px',
                    marginBottom: '10px',
                  }}>
                    <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--red)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                      Security Risk
                    </p>
                    <p style={{ fontSize: '13px', color: 'var(--ink-2)', lineHeight: 1.55 }}>{rec.risk}</p>
                  </div>

                  {/* Why it matters */}
                  <div style={{ marginBottom: '10px' }}>
                    <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '5px' }}>
                      Why It Matters
                    </p>
                    <p style={{ fontSize: '13px', color: 'var(--ink-2)', lineHeight: 1.55 }}>{rec.importance}</p>
                  </div>

                  {/* Recommended config */}
                  <div style={{
                    background: 'var(--green-bg)',
                    border: '1px solid var(--green-border)',
                    borderRadius: '8px',
                    padding: '11px 14px',
                  }}>
                    <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '7px' }}>
                      Recommended Configuration
                    </p>
                    <code style={{
                      display: 'block',
                      fontSize: '12px',
                      color: 'var(--teal)',
                      background: 'rgba(10, 10, 12, 0.4)',
                      border: '1px solid var(--border)',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      overflowX: 'auto',
                      wordBreak: 'break-all',
                      whiteSpace: 'pre-wrap',
                      lineHeight: 1.6,
                    }}>
                      {rec.example}
                    </code>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
