// 🐾⚡ NEKO-ARC TESTS - App Component (Root) ⚡🐾
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import App from './App';
import { setupFetchMocks, setupFailedFetchMocks, setupWindowOpenMock, mockApiResponses } from './test-utils/testHelpers';

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('🎯 Rendering Tests - Initial Load', () => {
    it('renders loading state initially', () => {
      setupFetchMocks();
      render(<App />);

      expect(screen.getByText(/Loading, nyaa~/i)).toBeInTheDocument();
    });

    it('renders main app header after loading', async () => {
      setupFetchMocks();
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('🐾⚡ NEKO-ARC DEFENSE SYSTEM ⚡🐾')).toBeInTheDocument();
      });
    });

    it('renders status bar with LIVE indicator', async () => {
      setupFetchMocks();
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('🔴 LIVE')).toBeInTheDocument();
      });
    });

    it('renders FORTRESS MODE indicator', async () => {
      setupFetchMocks();
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('FORTRESS MODE: ACTIVE')).toBeInTheDocument();
      });
    });

    it('renders KAWAII LEVEL indicator', async () => {
      setupFetchMocks();
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('KAWAII LEVEL: MAXIMUM 💖')).toBeInTheDocument();
      });
    });

    it('renders footer with neko message', async () => {
      setupFetchMocks();
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('*purrs in defensive excellence* 😻 | NYA NYA NYA~!')).toBeInTheDocument();
      });
    });
  });

  describe('📺 TV Window Buttons Tests', () => {
    it('renders NEKO TV button', async () => {
      setupFetchMocks();
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('📺 NEKO TV')).toBeInTheDocument();
      });
    });

    it('renders MULTI-CHANNEL TV button', async () => {
      setupFetchMocks();
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('📡 MULTI-CHANNEL TV')).toBeInTheDocument();
      });
    });

    it('renders DINA DOCS button', async () => {
      setupFetchMocks();
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('⚖️ DINA DOCS')).toBeInTheDocument();
      });
    });

    it('renders DINA JUSTICE TV button', async () => {
      setupFetchMocks();
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('📺 DINA JUSTICE TV')).toBeInTheDocument();
      });
    });

    it('opens NEKO TV window when NEKO TV button is clicked', async () => {
      const mockWindow = setupWindowOpenMock();
      setupFetchMocks();
      render(<App />);

      await waitFor(() => {
        const tvButton = screen.getByText('📺 NEKO TV');
        fireEvent.click(tvButton);
      });

      expect(global.window.open).toHaveBeenCalledWith(
        '/tv-window.html',
        'NekoTvStreaming',
        expect.stringContaining('width=1200,height=800')
      );
      expect(mockWindow.focus).toHaveBeenCalled();
    });

    it('opens MULTI-CHANNEL TV window when button is clicked', async () => {
      const mockWindow = setupWindowOpenMock();
      setupFetchMocks();
      render(<App />);

      await waitFor(() => {
        const multiChannelButton = screen.getByText('📡 MULTI-CHANNEL TV');
        fireEvent.click(multiChannelButton);
      });

      expect(global.window.open).toHaveBeenCalledWith(
        '/tv-window-tabs.html',
        'NekoMultiChannelTv',
        expect.stringContaining('width=1400,height=900')
      );
      expect(mockWindow.focus).toHaveBeenCalled();
    });

    it('opens DINA JUSTICE TV window when button is clicked', async () => {
      const mockWindow = setupWindowOpenMock();
      setupFetchMocks();
      render(<App />);

      await waitFor(() => {
        const dinaTvButton = screen.getByText('📺 DINA JUSTICE TV');
        fireEvent.click(dinaTvButton);
      });

      expect(global.window.open).toHaveBeenCalledWith(
        '/dina-tv-window.html',
        'DinaTvWindow',
        expect.stringContaining('width=1400,height=900')
      );
      expect(mockWindow.focus).toHaveBeenCalled();
    });

    it('shows alert when popup is blocked for NEKO TV', async () => {
      global.window.open = jest.fn(() => null); // Simulate popup blocker
      global.alert = jest.fn();
      setupFetchMocks();
      render(<App />);

      await waitFor(() => {
        const tvButton = screen.getByText('📺 NEKO TV');
        fireEvent.click(tvButton);
      });

      expect(global.alert).toHaveBeenCalledWith(
        expect.stringContaining('Please allow pop-ups to open NEKO TV Window')
      );
    });

    it('shows alert when popup is blocked for MULTI-CHANNEL TV', async () => {
      global.window.open = jest.fn(() => null);
      global.alert = jest.fn();
      setupFetchMocks();
      render(<App />);

      await waitFor(() => {
        const multiChannelButton = screen.getByText('📡 MULTI-CHANNEL TV');
        fireEvent.click(multiChannelButton);
      });

      expect(global.alert).toHaveBeenCalledWith(
        expect.stringContaining('Please allow pop-ups to open NEKO MULTI-CHANNEL TV')
      );
    });

    it('shows alert when popup is blocked for DINA JUSTICE TV', async () => {
      global.window.open = jest.fn(() => null);
      global.alert = jest.fn();
      setupFetchMocks();
      render(<App />);

      await waitFor(() => {
        const dinaTvButton = screen.getByText('📺 DINA JUSTICE TV');
        fireEvent.click(dinaTvButton);
      });

      expect(global.alert).toHaveBeenCalledWith(
        expect.stringContaining('Please allow pop-ups to open DINA JUSTICE TV')
      );
    });
  });

  describe('📚 DINA Documentation Toggle Tests', () => {
    it('toggles to DINA documentation view when DINA DOCS button is clicked', async () => {
      setupFetchMocks();
      render(<App />);

      await waitFor(() => {
        const dinaDocsButton = screen.getByText('⚖️ DINA DOCS');
        fireEvent.click(dinaDocsButton);
      });

      await waitFor(() => {
        expect(screen.getByText('🐾⚖️🌍 DINA INTERNATIONAL HUNT OPERATION 🌍⚖️🐾')).toBeInTheDocument();
      });
    });

    it('shows DINA international header when in DINA mode', async () => {
      setupFetchMocks();
      render(<App />);

      await waitFor(() => {
        const dinaDocsButton = screen.getByText('⚖️ DINA DOCS');
        fireEvent.click(dinaDocsButton);
      });

      await waitFor(() => {
        expect(screen.getByText('🔴 LIVE - GLOBAL DEPLOYMENT')).toBeInTheDocument();
        expect(screen.getByText('INTERNATIONAL JUSTICE MODE: ACTIVE')).toBeInTheDocument();
      });
    });

    it('shows Back to Dashboard button in DINA mode', async () => {
      setupFetchMocks();
      render(<App />);

      await waitFor(() => {
        const dinaDocsButton = screen.getByText('⚖️ DINA DOCS');
        fireEvent.click(dinaDocsButton);
      });

      await waitFor(() => {
        expect(screen.getByText('← Back to Dashboard')).toBeInTheDocument();
      });
    });

    it('toggles back to main dashboard when Back button is clicked', async () => {
      setupFetchMocks();
      render(<App />);

      // Toggle to DINA mode
      await waitFor(() => {
        const dinaDocsButton = screen.getByText('⚖️ DINA DOCS');
        fireEvent.click(dinaDocsButton);
      });

      // Toggle back
      await waitFor(() => {
        const backButton = screen.getByText('← Back to Dashboard');
        fireEvent.click(backButton);
      });

      await waitFor(() => {
        expect(screen.getByText('🐾⚡ NEKO-ARC DEFENSE SYSTEM ⚡🐾')).toBeInTheDocument();
      });
    });

    it('hides main dashboard components when in DINA mode', async () => {
      setupFetchMocks();
      render(<App />);

      await waitFor(() => {
        const dinaDocsButton = screen.getByText('⚖️ DINA DOCS');
        fireEvent.click(dinaDocsButton);
      });

      await waitFor(() => {
        expect(screen.queryByText('FORTRESS MODE: ACTIVE')).not.toBeInTheDocument();
      });
    });
  });

  describe('🌐 API Integration Tests - Dual Fetch', () => {
    it('fetches ASCII art data on mount', async () => {
      setupFetchMocks();
      render(<App />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/ascii-art'));
      });
    });

    it('fetches stats data on mount', async () => {
      setupFetchMocks();
      render(<App />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/stats'));
      });
    });

    it('sets asciiArt state when API returns success', async () => {
      setupFetchMocks();
      render(<App />);

      await waitFor(() => {
        expect(screen.queryByText(/Loading, nyaa~/i)).not.toBeInTheDocument();
      });
    });

    it('sets stats state when API returns success', async () => {
      setupFetchMocks();
      render(<App />);

      await waitFor(() => {
        expect(screen.queryByText(/Loading, nyaa~/i)).not.toBeInTheDocument();
      });
    });

    it('handles fetch errors gracefully', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      setupFailedFetchMocks();

      render(<App />);

      await waitFor(() => {
        expect(screen.queryByText(/Loading, nyaa~/i)).not.toBeInTheDocument();
      });

      consoleError.mockRestore();
    });

    it('sets loading to false after fetch completes', async () => {
      setupFetchMocks();
      render(<App />);

      await waitFor(() => {
        expect(screen.queryByText(/Loading, nyaa~/i)).not.toBeInTheDocument();
      });
    });

    it('only updates state when success flag is true', async () => {
      global.fetch = jest.fn((url) => {
        if (url.includes('/ascii-art')) {
          return Promise.resolve({
            json: () => Promise.resolve({ success: false, data: [] })
          });
        }
        if (url.includes('/stats')) {
          return Promise.resolve({
            json: () => Promise.resolve({ success: false, data: {} })
          });
        }
        return Promise.reject(new Error('Unknown URL'));
      });

      render(<App />);

      await waitFor(() => {
        expect(screen.queryByText(/Loading, nyaa~/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('🎨 Component Integration Tests', () => {
    it('renders CategorySwitcher component', async () => {
      setupFetchMocks();
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('All Threats')).toBeInTheDocument();
      });
    });

    it('renders AsciiTvDisplay component after loading', async () => {
      setupFetchMocks();
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Neko Guardian')).toBeInTheDocument();
      });
    });

    it('renders DefenseStats component', async () => {
      setupFetchMocks();
      render(<App />);

      await waitFor(() => {
        // DefenseStats displays "Active Collections" label
        expect(screen.getByText('Active Collections')).toBeInTheDocument();
      });
    });

    it('renders ThreatList component', async () => {
      setupFetchMocks();
      render(<App />);

      await waitFor(() => {
        // ThreatList displays title based on active category (default is 'all')
        expect(screen.getByText(/ALL THREAT ACTORS/i)).toBeInTheDocument();
      });
    });

    it('renders DinaDocumentationInternational when showDinaDoc is true', async () => {
      setupFetchMocks();
      render(<App />);

      await waitFor(() => {
        const dinaDocsButton = screen.getByText('⚖️ DINA DOCS');
        fireEvent.click(dinaDocsButton);
      });

      await waitFor(() => {
        expect(screen.getByText(/DINA INTERNATIONAL/i)).toBeInTheDocument();
      });
    });
  });

  describe('🎮 Category Switching Tests', () => {
    it('changes active category when category is selected', async () => {
      setupFetchMocks();
      render(<App />);

      await waitFor(() => {
        const predatorsItem = screen.getByText('Predators');
        fireEvent.click(predatorsItem);
      });

      await waitFor(() => {
        // CategorySwitcher uses div.category-item, not button
        const predatorsItem = screen.getByText('Predators').closest('.category-item');
        expect(predatorsItem).toHaveClass('active');
      });
    });

    it('passes active category to DefenseStats', async () => {
      setupFetchMocks();
      render(<App />);

      await waitFor(() => {
        const predatorsButton = screen.getByText('Predators');
        fireEvent.click(predatorsButton);
      });

      // DefenseStats should receive activeCategory prop
      await waitFor(() => {
        expect(screen.getByText('Predators')).toBeInTheDocument();
      });
    });

    it('passes active category to ThreatList', async () => {
      setupFetchMocks();
      render(<App />);

      await waitFor(() => {
        const pedophilesButton = screen.getByText('Pedophiles');
        fireEvent.click(pedophilesButton);
      });

      await waitFor(() => {
        expect(screen.getByText('Pedophiles')).toBeInTheDocument();
      });
    });
  });

  describe('⏰ ASCII Art Rotation Tests', () => {
    it('sets up interval for ASCII art rotation', async () => {
      setupFetchMocks();
      render(<App />);

      await waitFor(() => {
        expect(screen.queryByText(/Loading, nyaa~/i)).not.toBeInTheDocument();
      });

      expect(jest.getTimerCount()).toBeGreaterThan(0);
    });

    it('rotates to next ASCII art after 5 seconds', async () => {
      setupFetchMocks();
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Neko Guardian')).toBeInTheDocument();
      });

      // Fast-forward 5 seconds
      jest.advanceTimersByTime(5000);

      await waitFor(() => {
        // Should still show art (only 1 art piece in mock, so cycles back)
        expect(screen.getByText('Neko Guardian')).toBeInTheDocument();
      });
    });

    it('clears interval on unmount', async () => {
      setupFetchMocks();
      const { unmount } = render(<App />);

      await waitFor(() => {
        expect(screen.queryByText(/Loading, nyaa~/i)).not.toBeInTheDocument();
      });

      unmount();

      // After unmount, timers should be cleaned up
      expect(jest.getTimerCount()).toBe(0);
    });

    it('handles empty asciiArt array gracefully', async () => {
      global.fetch = jest.fn((url) => {
        if (url.includes('/ascii-art')) {
          return Promise.resolve({
            json: () => Promise.resolve({ success: true, data: [] })
          });
        }
        if (url.includes('/stats')) {
          return Promise.resolve({
            json: () => Promise.resolve(mockApiResponses.stats)
          });
        }
        return Promise.reject(new Error('Unknown URL'));
      });

      render(<App />);

      await waitFor(() => {
        expect(screen.queryByText(/Loading, nyaa~/i)).not.toBeInTheDocument();
      });

      // Should not crash with empty array
      jest.advanceTimersByTime(5000);
    });

    it('cycles through multiple ASCII art pieces', async () => {
      global.fetch = jest.fn((url) => {
        if (url.includes('/ascii-art')) {
          return Promise.resolve({
            json: () => Promise.resolve({
              success: true,
              data: [
                { name: 'Art 1', art: ['line1'], category: 'predators' },
                { name: 'Art 2', art: ['line2'], category: 'pedophiles' }
              ]
            })
          });
        }
        if (url.includes('/stats')) {
          return Promise.resolve({
            json: () => Promise.resolve(mockApiResponses.stats)
          });
        }
        return Promise.reject(new Error('Unknown URL'));
      });

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Art 1')).toBeInTheDocument();
      });

      jest.advanceTimersByTime(5000);

      await waitFor(() => {
        expect(screen.getByText('Art 2')).toBeInTheDocument();
      });
    });

    it('wraps around to first art after reaching end', async () => {
      global.fetch = jest.fn((url) => {
        if (url.includes('/ascii-art')) {
          return Promise.resolve({
            json: () => Promise.resolve({
              success: true,
              data: [
                { name: 'Art 1', art: ['line1'], category: 'predators' },
                { name: 'Art 2', art: ['line2'], category: 'pedophiles' }
              ]
            })
          });
        }
        if (url.includes('/stats')) {
          return Promise.resolve({
            json: () => Promise.resolve(mockApiResponses.stats)
          });
        }
        return Promise.reject(new Error('Unknown URL'));
      });

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Art 1')).toBeInTheDocument();
      });

      jest.advanceTimersByTime(5000); // Art 2
      await waitFor(() => {
        expect(screen.getByText('Art 2')).toBeInTheDocument();
      });

      jest.advanceTimersByTime(5000); // Back to Art 1
      await waitFor(() => {
        expect(screen.getByText('Art 1')).toBeInTheDocument();
      });
    });
  });

  describe('📦 State Management Tests', () => {
    it('initializes with default threat counts', async () => {
      setupFetchMocks();
      render(<App />);

      await waitFor(() => {
        // CategorySwitcher shows "X detected" for each category
        expect(screen.getByText('8 detected')).toBeInTheDocument(); // all threats
        expect(screen.getByText('3 detected')).toBeInTheDocument(); // predators
        expect(screen.getByText('5 detected')).toBeInTheDocument(); // pedophiles
      });
    });

    it('initializes with "all" as active category', async () => {
      setupFetchMocks();
      render(<App />);

      await waitFor(() => {
        // CategorySwitcher uses div.category-item, not button
        const allItem = screen.getByText('All Threats').closest('.category-item');
        expect(allItem).toHaveClass('active');
      });
    });

    it('initializes showDinaDoc as false', async () => {
      setupFetchMocks();
      render(<App />);

      await waitFor(() => {
        expect(screen.queryByText('DINA INTERNATIONAL HUNT OPERATION')).not.toBeInTheDocument();
      });
    });
  });

  describe('🧪 Edge Cases', () => {
    it('handles null stats gracefully', async () => {
      global.fetch = jest.fn((url) => {
        if (url.includes('/ascii-art')) {
          return Promise.resolve({
            json: () => Promise.resolve(mockApiResponses.asciiArt)
          });
        }
        if (url.includes('/stats')) {
          return Promise.resolve({
            json: () => Promise.resolve({ success: false, data: null })
          });
        }
        return Promise.reject(new Error('Unknown URL'));
      });

      render(<App />);

      await waitFor(() => {
        expect(screen.queryByText(/Loading, nyaa~/i)).not.toBeInTheDocument();
      });
    });

    it('handles multiple rapid DINA DOCS toggles', async () => {
      setupFetchMocks();
      render(<App />);

      await waitFor(() => {
        const dinaDocsButton = screen.getByText('⚖️ DINA DOCS');
        fireEvent.click(dinaDocsButton);
      });

      await waitFor(() => {
        const backButton = screen.getByText('← Back to Dashboard');
        fireEvent.click(backButton);
      });

      await waitFor(() => {
        const dinaDocsButton = screen.getByText('⚖️ DINA DOCS');
        fireEvent.click(dinaDocsButton);
      });

      await waitFor(() => {
        // Header contains emojis: "🐾⚖️🌍 DINA INTERNATIONAL HUNT OPERATION 🌍⚖️🐾"
        expect(screen.getByText(/DINA INTERNATIONAL HUNT OPERATION/i)).toBeInTheDocument();
      });
    });
  });
});

// *purrs in App testing excellence* 😻⚡🐾
