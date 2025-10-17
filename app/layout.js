// 🐾⚡ NEKO DEFENSE DASHBOARD - Root Layout (Next.js) ⚡🐾
import '../src/styles/App.css';
import ClientRootLayout from './ClientRootLayout';

export const metadata = {
  title: 'Neko Defense Dashboard',
  description: 'Real-time threat monitoring with MAXIMUM KAWAII POWER, nyaa~! 🐾⚡',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientRootLayout>{children}</ClientRootLayout>
      </body>
    </html>
  );
}
