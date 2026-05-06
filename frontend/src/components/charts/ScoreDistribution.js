'use client';

import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ScoreDistribution({ distribution }) {
  if (!distribution) return null;

  const { A = 0, B = 0, C = 0, D = 0, F = 0 } = distribution;
  const total = A + B + C + D + F;

  if (total === 0) {
    return (
      <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
        <p style={{ color: 'var(--ink-4)', fontSize: '14px' }}>No score data available yet.</p>
      </div>
    );
  }

  const chartData = {
    labels: ['A  (90–100)', 'B  (80–89)', 'C  (70–79)', 'D  (60–69)', 'F  (<60)'],
    datasets: [{
      data: [A, B, C, D, F],
      backgroundColor: ['#16a34a', '#0d9488', '#d97706', '#f97316', '#dc2626'],
      borderColor: '#fff',
      borderWidth: 3,
      hoverOffset: 6,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '66%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#64748b',
          padding: 14,
          usePointStyle: true,
          pointStyleWidth: 9,
          font: { size: 12 },
        },
      },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#0f172a',
        bodyColor: '#64748b',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          label: ctx => {
            const pct = total > 0 ? Math.round((ctx.parsed / total) * 100) : 0;
            return ` ${ctx.label}: ${ctx.parsed} sites (${pct}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="card" style={{ padding: '22px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
        <h3 style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--ink)' }}>Score Distribution</h3>
      </div>
      <div style={{ height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
}
