'use client';

import { getGradeColor } from '@/lib/utils';

export default function GradeIndicator({ grade }) {
  const color = getGradeColor(grade);
  const label = { A: 'Excellent', B: 'Good', C: 'Fair', D: 'Poor', F: 'Critical — Action Required' }[grade] || '';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{
        width: '44px',
        height: '44px',
        borderRadius: '10px',
        background: `${color}14`,
        border: `1.5px solid ${color}40`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '22px',
        fontWeight: 800,
        color,
        flexShrink: 0,
      }}>
        {grade}
      </div>
      <div>
        <div style={{ fontSize: '14px', fontWeight: 600, color }}>{label}</div>
        <div style={{ fontSize: '12px', color: 'var(--ink-4)', marginTop: '1px' }}>Overall Grade</div>
      </div>
    </div>
  );
}
