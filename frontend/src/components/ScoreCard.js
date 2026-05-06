'use client';

import { getGradeColor } from '@/lib/utils';

export default function ScoreCard({ score, grade }) {
  const color = getGradeColor(grade);
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  const gradeLabel = { A: 'Excellent', B: 'Good', C: 'Fair', D: 'Poor', F: 'Critical' }[grade] || grade;

  return (
    <div className="card" style={{ padding: '32px 28px', textAlign: 'center' }}>
      <p className="section-label" style={{ marginBottom: '24px' }}>Security Score</p>

      {/* Circular Progress */}
      <div className="score-circle" style={{ margin: '0 auto 22px' }}>
        <svg width="160" height="160" viewBox="0 0 100 100">
          <circle className="circle-bg" cx="50" cy="50" r="45" />
          <circle
            className="circle-progress"
            cx="50" cy="50" r="45"
            stroke={color}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="score-text">
          <div style={{ fontSize: '38px', fontWeight: 800, color, lineHeight: 1, letterSpacing: '-1px' }}>
            {score}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--ink-4)', fontWeight: 500, marginTop: '3px' }}>
            out of 100
          </div>
        </div>
      </div>

      {/* Grade */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        background: `${color}18`,
        border: `1px solid ${color}45`,
        boxShadow: `0 0 20px ${color}15`,
        borderRadius: '10px',
        padding: '9px 22px',
      }}>
        <span style={{ fontSize: '26px', fontWeight: 800, color, lineHeight: 1 }}>{grade}</span>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color }}>{gradeLabel}</div>
          <div style={{ fontSize: '11px', color: 'var(--ink-4)', marginTop: '1px' }}>
            {grade === 'A' ? 'Action Required' : grade === 'F' ? 'Action Required' : 'Review Needed'}
          </div>
        </div>
      </div>
    </div>
  );
}
