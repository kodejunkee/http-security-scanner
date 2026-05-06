import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'HeaderGuard — HTTP Security Header Scanner',
  description:
    'Analyze HTTP security headers of any public website. Check for Content-Security-Policy, HSTS, X-Frame-Options, and more. Get a security score and actionable recommendations.',
  keywords: 'HTTP security headers, website security scanner, CSP, HSTS, security compliance, web security',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300..800;1,14..32,300..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
