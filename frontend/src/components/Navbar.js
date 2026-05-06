'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

function ShieldIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2L3 6.5V12C3 16.418 7.03 20.574 12 22C16.97 20.574 21 16.418 21 12V6.5L12 2Z"
        fill="#0d9488"
        fillOpacity="0.15"
        stroke="#0d9488"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M9 12L11 14L15 10" stroke="#0d9488" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ScannerIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Scanner', Icon: ScannerIcon },
    { href: '/dashboard', label: 'Dashboard', Icon: DashboardIcon },
  ];

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'var(--surface)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderBottom: '1px solid var(--border)',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '60px',
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '9px' }}>
          <ShieldIcon />
          <span style={{
            fontSize: '16px',
            fontWeight: 700,
            color: 'var(--ink)',
            letterSpacing: '-0.3px',
          }}>
            HeaderGuard
          </span>
        </Link>

        {/* Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {links.map(({ href, label, Icon }) => {
            const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                style={{
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  fontSize: '13.5px',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--teal)' : 'var(--ink-3)',
                  background: isActive ? 'var(--teal-light)' : 'transparent',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--surface-2)'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <Icon />
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
