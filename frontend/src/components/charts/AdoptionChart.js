'use client';

import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BAR_COLORS = [
  '#0d9488', '#14b8a6', '#2dd4bf', '#5eead4', '#99f6e4', '#ccfbf1',
];

export default function AdoptionChart({ headerAdoption }) {
  if (!headerAdoption || Object.keys(headerAdoption).length === 0) {
    return (
      <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
        <p style={{ color: 'var(--ink-4)', fontSize: '14px' }}>No adoption data available yet.</p>
      </div>
    );
  }

  const labels = Object.keys(headerAdoption);
  const values = Object.values(headerAdoption);

  const chartData = {
    labels: labels.map(l => l.replace(/-/g, '\u200B-')),
    datasets: [{
      label: 'Adoption Rate (%)',
      data: values,
      backgroundColor: labels.map((_, i) => BAR_COLORS[i % BAR_COLORS.length]),
      borderRadius: 6,
      borderSkipped: false,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 15, 17, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#a1a1aa',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        callbacks: { label: ctx => `${ctx.parsed.y}% of scanned sites` },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8', font: { size: 10 }, maxRotation: 45 },
      },
      y: {
        beginAtZero: true, max: 100,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8', callback: v => `${v}%` },
      },
    },
  };

  return (
    <div className="card" style={{ padding: '22px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
        </svg>
        <h3 style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--ink)' }}>Header Adoption Rates</h3>
      </div>
      <div style={{ height: '280px' }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
