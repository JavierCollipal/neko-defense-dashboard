'use client';
import { AppProvider } from '../src/contexts/AppContext';
import { Layout as NekoLayout } from '../src/components/layout/Layout';

export default function ClientRootLayout({ children }) {
  return (
    <AppProvider>
      <NekoLayout>
        {children}
      </NekoLayout>
    </AppProvider>
  );
}
