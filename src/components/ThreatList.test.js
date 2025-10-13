// 🐾⚡ NEKO-ARC TESTS - ThreatList Component (Hunt Tracker Edition) ⚡🐾
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ThreatList from './ThreatList';

describe('ThreatList Component', () => {
  const mockThreatActors = {
    success: true,
    count: 2,
    data: [
      {
        _id: '1',
        name: 'Test Predator Alpha',
        aliases: ['Alpha One', 'Hunter'],
        threat_level: 'CRITICAL',
        type: 'Predator',
        actor_classification: 'Individual',
        location: 'Unknown',
        hunt_priority: 1,
        bounty_usd: 50000,
        known_for: 'Serial online predator targeting children',
        law_enforcement_status: 'WANTED - FBI Most Wanted List'
      },
      {
        _id: '2',
        name: 'Test Crypto Thief',
        threat_level: 'HIGH',
        type: 'Crypto Crime',
        hunt_priority: 2,
        known_for: 'Large-scale crypto theft operations'
      }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default successful fetch mock
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockThreatActors)
      })
    );
  });

  afterEach(() => {
    global.fetch.mockRestore && global.fetch.mockRestore();
  });

  describe('🎯 Initial Rendering', () => {
    it('renders loading state initially', () => {
      render(<ThreatList activeCategory="all" />);

      // 🐾 Component shows "Loading hunt targets, desu~!"
      expect(screen.getByText(/loading hunt targets, desu~/i)).toBeInTheDocument();
    });

    it('renders category title for all category', async () => {
      render(<ThreatList activeCategory="all" />);

      await waitFor(() => {
        expect(screen.getByText('🎯 ALL THREAT ACTORS')).toBeInTheDocument();
      });
    });

    it('renders category title for predators category', async () => {
      render(<ThreatList activeCategory="predators" />);

      await waitFor(() => {
        expect(screen.getByText('⚠️ PREDATOR THREAT ACTORS')).toBeInTheDocument();
      });
    });

    it('renders category title for pedophiles category', async () => {
      render(<ThreatList activeCategory="pedophiles" />);

      await waitFor(() => {
        expect(screen.getByText('🚨 PEDOPHILE THREAT ACTORS - MASS HUNT TARGET')).toBeInTheDocument();
      });
    });
  });

  describe('🌐 API Integration', () => {
    it('fetches data from correct endpoint on mount', async () => {
      render(<ThreatList activeCategory="all" />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'http://localhost:5001/api/threat-actors?category=all'
        );
      });
    });

    it('updates state with successful API response', async () => {
      render(<ThreatList activeCategory="all" />);

      await waitFor(() => {
        expect(screen.getByText('Test Predator Alpha')).toBeInTheDocument();
        expect(screen.getByText('Test Crypto Thief')).toBeInTheDocument();
      });
    });

    it('renders threat count correctly', async () => {
      render(<ThreatList activeCategory="all" />);

      await waitFor(() => {
        expect(screen.getByText('2 TARGETS')).toBeInTheDocument();
        expect(screen.getByText('🎯 HUNT ACTIVE')).toBeInTheDocument();
      });
    });

    it('handles singular target count', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            success: true,
            count: 1,
            data: [mockThreatActors.data[0]]
          })
        })
      );

      render(<ThreatList activeCategory="all" />);

      await waitFor(() => {
        expect(screen.getByText('1 TARGET')).toBeInTheDocument();
      });
    });
  });

  describe('📚 Data Rendering', () => {
    it('renders threat actor names', async () => {
      render(<ThreatList activeCategory="all" />);

      await waitFor(() => {
        expect(screen.getByText('Test Predator Alpha')).toBeInTheDocument();
        expect(screen.getByText('Test Crypto Thief')).toBeInTheDocument();
      });
    });

    it('renders threat actor aliases', async () => {
      render(<ThreatList activeCategory="all" />);

      await waitFor(() => {
        expect(screen.getByText(/aka: Alpha One, Hunter/i)).toBeInTheDocument();
      });
    });

    it('renders threat levels', async () => {
      render(<ThreatList activeCategory="all" />);

      await waitFor(() => {
        expect(screen.getByText('CRITICAL')).toBeInTheDocument();
        expect(screen.getByText('HIGH')).toBeInTheDocument();
      });
    });

    it('renders actor rankings', async () => {
      render(<ThreatList activeCategory="all" />);

      await waitFor(() => {
        expect(screen.getByText('#1')).toBeInTheDocument();
        expect(screen.getByText('#2')).toBeInTheDocument();
      });
    });

    it('renders known_for field', async () => {
      render(<ThreatList activeCategory="all" />);

      await waitFor(() => {
        expect(screen.getByText(/Serial online predator targeting children/i)).toBeInTheDocument();
      });
    });

    it('renders law enforcement status', async () => {
      render(<ThreatList activeCategory="all" />);

      await waitFor(() => {
        expect(screen.getByText(/WANTED - FBI Most Wanted List/i)).toBeInTheDocument();
      });
    });

    it('renders bounty when present', async () => {
      render(<ThreatList activeCategory="all" />);

      await waitFor(() => {
        expect(screen.getByText('$50,000')).toBeInTheDocument();
      });
    });

    it('renders hunt priority', async () => {
      render(<ThreatList activeCategory="all" />);

      await waitFor(() => {
        expect(screen.getByText('P1')).toBeInTheDocument();
        expect(screen.getByText('P2')).toBeInTheDocument();
      });
    });
  });

  describe('🚨 Error Handling', () => {
    it('handles fetch errors gracefully', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation();

      global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));

      render(<ThreatList activeCategory="all" />);

      await waitFor(() => {
        expect(screen.getByText(/Network error - unable to connect to defense system/i)).toBeInTheDocument();
      });

      consoleError.mockRestore();
    });

    it('handles missing success field in response', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ data: [] }) // Missing 'success' field
        })
      );

      render(<ThreatList activeCategory="all" />);

      await waitFor(() => {
        // Should show error state
        expect(screen.getByText(/Failed to load threat actors/i)).toBeInTheDocument();
      });
    });

    it('handles response with success=false', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ success: false, data: null })
        })
      );

      render(<ThreatList activeCategory="all" />);

      await waitFor(() => {
        expect(screen.getByText(/Failed to load threat actors/i)).toBeInTheDocument();
      });
    });

    it('renders empty state when no threat actors found', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ success: true, count: 0, data: [] })
        })
      );

      render(<ThreatList activeCategory="all" />);

      await waitFor(() => {
        expect(screen.getByText(/No threat actors found in this category, nyaa~/i)).toBeInTheDocument();
      });
    });
  });

  describe('🔄 Lifecycle', () => {
    it('fetches data once on mount', async () => {
      const { rerender } = render(<ThreatList activeCategory="all" />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1);
      });

      // Rerender with same props
      rerender(<ThreatList activeCategory="all" />);

      // Should still be called only once (same activeCategory)
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('refetches when activeCategory prop changes', async () => {
      const { rerender } = render(<ThreatList activeCategory="all" />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(global.fetch).toHaveBeenCalledWith(
          'http://localhost:5001/api/threat-actors?category=all'
        );
      });

      // Change activeCategory
      rerender(<ThreatList activeCategory="predators" />);

      await waitFor(() => {
        // 🐾 Component NOW refetches when category changes (useEffect has activeCategory dependency)
        expect(global.fetch).toHaveBeenCalledTimes(2);
        expect(global.fetch).toHaveBeenCalledWith(
          'http://localhost:5001/api/threat-actors?category=predators'
        );
      });
    });
  });

  describe('🦶 Footer Tests', () => {
    it('renders neko status message', async () => {
      render(<ThreatList activeCategory="all" />);

      await waitFor(() => {
        expect(screen.getByText(/\*purrs in hunt readiness\*/i)).toBeInTheDocument();
      });
    });

    it('renders last updated timestamp', async () => {
      render(<ThreatList activeCategory="all" />);

      await waitFor(() => {
        expect(screen.getByText(/Last Updated:/i)).toBeInTheDocument();
      });
    });
  });
});

// *purrs in API testing excellence* 😻
