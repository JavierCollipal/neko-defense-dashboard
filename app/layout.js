// 🐾⚡ NEKO DEFENSE DASHBOARD - Root Layout (Next.js) ⚡🐾
import '../src/styles/App.css';
import ClientRootLayout from './ClientRootLayout';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata = {
  title: 'Neko Defense Dashboard',
  description:
    'Real-time threat monitoring with MAXIMUM KAWAII POWER, nyaa~! 🐾⚡',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientRootLayout>{children}</ClientRootLayout>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
