// 🐾⚡ NEKO-ARC TESTS - Dashboard Component ⚡🐾
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { Dashboard } from './Dashboard';
import { setupFetchMocks } from '../test-utils/testHelpers';

// 🌐 Setup i18n for tests, nyaa~!
i18n.init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: {
      translation: {
        categories: {
          header: 'Threat Categories',
          fortress_badge: 'FORTRESS MODE',
          all_threats: 'All Threats',
          predators: 'Predators',
          pedophiles: 'Pedophiles',
          dina_network: 'DINA Network',
          ransomware: 'Ransomware',
          state_sponsored: 'State Sponsored',
          crypto_crime: 'Crypto Crime',
          priority_critical: 'CRITICAL',
          priority_maximum: 'MAXIMUM ALERT',
          priority_high: 'HIGH',
          detected: 'detected',
          active_monitoring: 'Active Monitoring',
          neko_guardian: 'NEKO Guardian Active'
        }
      }
    }
  }
});

// 🎨 Wrapper component with i18n provider, desu!
const renderWithI18n = (component) => {
  return render(
    <I18nextProvider i18n={i18n}>
      {component}
    </I18nextProvider>
  );
};

// 🐾 Mock useMediaQuery hook
jest.mock('../hooks/useMediaQuery', () => ({
  useIsMobile: jest.fn(() => false) // Default to desktop view
}));

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupFetchMocks();
  });

  describe('🎯 Rendering Tests', () => {
    it('renders Dashboard without crashing', async () => {
      renderWithI18n(<Dashboard />);

      // Wait for async data fetching
      await waitFor(() => {
        expect(screen.getByText('All Threats')).toBeInTheDocument();
      });
    });

    it('renders CategorySwitcher in desktop view', async () => {
      const { useIsMobile } = require('../hooks/useMediaQuery');
      useIsMobile.mockReturnValue(false);

      renderWithI18n(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText('All Threats')).toBeInTheDocument();
      });
    });

    it('renders CategorySwitcher in mobile view', async () => {
      const { useIsMobile } = require('../hooks/useMediaQuery');
      useIsMobile.mockReturnValue(true);

      renderWithI18n(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText('All Threats')).toBeInTheDocument();
      });
    });
  });

  describe('🐾 CRITICAL: ThreatCounts Prop Tests', () => {
    it('passes threatCounts prop to CategorySwitcher (desktop)', async () => {
      const { useIsMobile } = require('../hooks/useMediaQuery');
      useIsMobile.mockReturnValue(false);

      renderWithI18n(<Dashboard />);

      // Wait for threat counts to load
      await waitFor(() => {
        expect(screen.getByText(/8.*detected/i)).toBeInTheDocument(); // all: 8
      });

      // Verify other category counts are displayed
      expect(screen.getByText(/3.*detected/i)).toBeInTheDocument(); // predators: 3
      expect(screen.getByText(/5.*detected/i)).toBeInTheDocument(); // pedophiles: 5
    });

    it('passes threatCounts prop to CategorySwitcher (mobile)', async () => {
      const { useIsMobile } = require('../hooks/useMediaQuery');
      useIsMobile.mockReturnValue(true);

      renderWithI18n(<Dashboard />);

      // Wait for threat counts to load
      await waitFor(() => {
        expect(screen.getByText(/8.*detected/i)).toBeInTheDocument(); // all: 8
      });

      // Verify other category counts are displayed
      expect(screen.getByText(/3.*detected/i)).toBeInTheDocument(); // predators: 3
      expect(screen.getByText(/5.*detected/i)).toBeInTheDocument(); // pedophiles: 5
    });

    it('initializes with default threatCounts before API loads', () => {
      // 🐾 CRITICAL TEST: Component should render with default counts immediately
      renderWithI18n(<Dashboard />);

      // Should show "0 detected" initially before API loads
      const zeroDetected = screen.queryAllByText(/0.*detected/i);
      expect(zeroDetected.length).toBeGreaterThan(0);
    });

    it('handles failed threat-counts API gracefully', async () => {
      // Mock failed API
      global.fetch = jest.fn((url) => {
        if (url.includes('/threat-counts')) {
          return Promise.reject(new Error('Network error'));
        }
        if (url.includes('/ascii-art')) {
          return Promise.resolve({
            json: () => Promise.resolve({ success: true, data: [] })
          });
        }
        return Promise.reject(new Error('Unknown URL'));
      });

      renderWithI18n(<Dashboard />);

      // Should still render with default counts
      await waitFor(() => {
        expect(screen.getByText('All Threats')).toBeInTheDocument();
      });

      // Should show "0 detected" when API fails
      const zeroDetected = screen.getAllByText(/0.*detected/i);
      expect(zeroDetected.length).toBe(7); // All 7 categories show 0
    });

    it('handles invalid threat-counts API response', async () => {
      // Mock invalid API response
      global.fetch = jest.fn((url) => {
        if (url.includes('/threat-counts')) {
          return Promise.resolve({
            json: () => Promise.resolve({ success: false }) // Missing data
          });
        }
        if (url.includes('/ascii-art')) {
          return Promise.resolve({
            json: () => Promise.resolve({ success: true, data: [] })
          });
        }
        return Promise.reject(new Error('Unknown URL'));
      });

      renderWithI18n(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText('All Threats')).toBeInTheDocument();
      });

      // Should keep default counts when API returns invalid data
      const zeroDetected = screen.getAllByText(/0.*detected/i);
      expect(zeroDetected.length).toBe(7);
    });
  });

  describe('📡 API Integration Tests', () => {
    it('fetches ascii-art data on mount', async () => {
      renderWithI18n(<Dashboard />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/ascii-art');
      });
    });

    it('fetches threat-counts data on mount', async () => {
      renderWithI18n(<Dashboard />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/threat-counts');
      });
    });

    it('updates threatCounts state when API succeeds', async () => {
      renderWithI18n(<Dashboard />);

      // Wait for API data to load and update the UI
      await waitFor(() => {
        expect(screen.getByText(/8.*detected/i)).toBeInTheDocument();
      });
    });
  });
});

// *purrs in dashboard testing excellence* 😻
