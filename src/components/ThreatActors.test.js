// 🐾⚡ NEKO-ARC TESTS - ThreatActors Component ⚡🐾
// ULTRA BASED TESTING with 100% coverage goal, nyaa~! 😻
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ThreatActors from './ThreatActors';

// 🎯 Mock Data - BASED test fixtures, desu!
const mockThreatActorsResponse = {
  success: true,
  count: 3,
  data: [
    {
      actor_id: 'TA-001',
      name: 'Test Hacker',
      type: 'individual',
      threat_level: 'CRITICAL',
      status: 'WANTED',
      aliases: ['Evil Hacker', 'Mr. Bad'],
      origin: {
        country: 'Unknown',
        affiliated_state: true
      },
      attribution: {
        fbi_wanted: true,
        reward_usd: 5000000
      },
      categories: ['Ransomware', 'Data Theft'],
      evidence: {
        victim_count: 100,
        financial_damage_usd: 50000000,
        known_incidents: ['Attack 1', 'Attack 2', 'Attack 3']
      },
      technical_profile: {
        malware_families: ['BadMalware', 'EvilTrojan'],
        attack_vectors: ['Phishing', 'Zero-day', 'Social Engineering']
      },
      intelligence: {
        sources: ['FBI', 'CIA'],
        confidence_level: 'HIGH',
        last_updated: '2025-10-01T00:00:00Z'
      },
      hunting_status: {
        notes: 'Actively hunting this threat, nyaa~!'
      }
    },
    {
      actor_id: 'TA-002',
      name: 'Ransomware Gang',
      type: 'ransomware',
      threat_level: 'HIGH',
      status: 'ACTIVE',
      aliases: ['RansomKitty'],
      origin: {
        country: 'Russia',
        affiliated_state: false
      },
      attribution: {
        fbi_wanted: false,
        reward_usd: 0
      },
      categories: ['Ransomware'],
      evidence: {
        victim_count: 50,
        financial_damage_usd: 25000000,
        known_incidents: ['Attack A']
      },
      technical_profile: {
        malware_families: ['RansomCat'],
        attack_vectors: ['Exploit']
      },
      intelligence: {
        sources: ['Private Sector'],
        confidence_level: 'MEDIUM',
        last_updated: '2025-09-15T00:00:00Z'
      }
    },
    {
      actor_id: 'TA-003',
      name: 'APT Group',
      type: 'apt',
      threat_level: 'MEDIUM',
      status: 'MONITORED',
      aliases: [],
      origin: {
        country: 'China',
        affiliated_state: true
      },
      attribution: {
        reward_usd: 1000000
      },
      categories: ['Espionage'],
      evidence: {
        victim_count: 10,
        financial_damage_usd: 5000000,
        known_incidents: []
      },
      technical_profile: {},
      intelligence: {
        sources: ['NSA'],
        confidence_level: 'LOW',
        last_updated: '2025-08-01T00:00:00Z'
      }
    }
  ]
};

describe('ThreatActors Component', () => {
  let originalFetch;

  beforeEach(() => {
    console.log('🐾 [ThreatActors.test] Setting up test, nyaa~');
    originalFetch = global.fetch;
    jest.clearAllMocks();
  });

  afterEach(() => {
    console.log('🐾 [ThreatActors.test] Cleaning up test, desu~');
    global.fetch = originalFetch;
  });

  // 🎯 Helper function for successful API mocks
  const setupSuccessfulFetch = () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockThreatActorsResponse)
      })
    );
  };

  // 🎯 Helper function for failed API mocks
  const setupFailedFetch = (errorMessage = 'Network error') => {
    global.fetch = jest.fn(() => Promise.reject(new Error(errorMessage)));
  };

  describe('🎨 Initial Rendering & Loading State', () => {
    it('renders loading state initially', () => {
      console.log('🧪 [Test] Checking loading state, nyaa~');
      setupSuccessfulFetch();
      render(<ThreatActors />);

      expect(screen.getByText(/Loading threat actors, nyaa~/i)).toBeInTheDocument();
      expect(screen.getByText('🐾')).toBeInTheDocument();
    });

    it('calls API on mount', async () => {
      console.log('🧪 [Test] Verifying API call on mount, desu~');
      setupSuccessfulFetch();
      render(<ThreatActors />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/threat-actors')
        );
      });
    });

    it('renders component after successful data load', async () => {
      console.log('🧪 [Test] Checking successful render, nyaa~');
      setupSuccessfulFetch();
      render(<ThreatActors />);

      await waitFor(() => {
        expect(screen.getByText('🎯⚡ THREAT ACTORS REGISTRY ⚡🎯')).toBeInTheDocument();
      });
    });
  });

  describe('📊 Stats Display', () => {
    it('displays total tracked count correctly', async () => {
      console.log('🧪 [Test] Checking total tracked stat, desu~');
      setupSuccessfulFetch();
      render(<ThreatActors />);

      await waitFor(() => {
        expect(screen.getByText('3')).toBeInTheDocument();
        expect(screen.getByText('Total Tracked')).toBeInTheDocument();
      });
    });

    it('displays FBI wanted count correctly', async () => {
      console.log('🧪 [Test] Checking FBI wanted stat, nyaa~');
      setupSuccessfulFetch();
      render(<ThreatActors />);

      await waitFor(() => {
        expect(screen.getByText('1')).toBeInTheDocument(); // Only TA-001 is WANTED
        expect(screen.getByText('FBI Wanted')).toBeInTheDocument();
      });
    });

    it('displays total rewards correctly', async () => {
      console.log('🧪 [Test] Checking total rewards stat, desu~');
      setupSuccessfulFetch();
      render(<ThreatActors />);

      await waitFor(() => {
        // 5M + 0 + 1M = 6M
        expect(screen.getByText('$6,000,000')).toBeInTheDocument();
        expect(screen.getByText('Total Rewards')).toBeInTheDocument();
      });
    });
  });

  describe('🎴 Threat Actor Cards Rendering', () => {
    it('renders all threat actor cards', async () => {
      console.log('🧪 [Test] Checking card rendering, nyaa~');
      setupSuccessfulFetch();
      render(<ThreatActors />);

      await waitFor(() => {
        expect(screen.getByText('Test Hacker')).toBeInTheDocument();
        expect(screen.getByText('Ransomware Gang')).toBeInTheDocument();
        expect(screen.getByText('APT Group')).toBeInTheDocument();
      });
    });

    it('displays actor IDs on cards', async () => {
      console.log('🧪 [Test] Checking actor IDs, desu~');
      setupSuccessfulFetch();
      render(<ThreatActors />);

      await waitFor(() => {
        expect(screen.getByText('TA-001')).toBeInTheDocument();
        expect(screen.getByText('TA-002')).toBeInTheDocument();
        expect(screen.getByText('TA-003')).toBeInTheDocument();
      });
    });

    it('displays threat levels on cards', async () => {
      console.log('🧪 [Test] Checking threat levels, nyaa~');
      setupSuccessfulFetch();
      render(<ThreatActors />);

      await waitFor(() => {
        const criticalBadges = screen.getAllByText('CRITICAL');
        const highBadges = screen.getAllByText('HIGH');
        const mediumBadges = screen.getAllByText('MEDIUM');

        expect(criticalBadges.length).toBeGreaterThanOrEqual(1);
        expect(highBadges.length).toBeGreaterThanOrEqual(1);
        expect(mediumBadges.length).toBeGreaterThanOrEqual(1);
      });
    });

    it('displays aliases on cards (max 3)', async () => {
      console.log('🧪 [Test] Checking aliases display, desu~');
      setupSuccessfulFetch();
      render(<ThreatActors />);

      await waitFor(() => {
        expect(screen.getByText('Evil Hacker')).toBeInTheDocument();
        expect(screen.getByText('Mr. Bad')).toBeInTheDocument();
        expect(screen.getByText('RansomKitty')).toBeInTheDocument();
      });
    });

    it('displays origin country on cards', async () => {
      console.log('🧪 [Test] Checking origin display, nyaa~');
      setupSuccessfulFetch();
      render(<ThreatActors />);

      await waitFor(() => {
        expect(screen.getByText('Russia')).toBeInTheDocument();
        expect(screen.getByText('China')).toBeInTheDocument();
      });
    });

    it('displays status badges on cards', async () => {
      console.log('🧪 [Test] Checking status badges, desu~');
      setupSuccessfulFetch();
      render(<ThreatActors />);

      await waitFor(() => {
        expect(screen.getByText('WANTED')).toBeInTheDocument();
        expect(screen.getByText('ACTIVE')).toBeInTheDocument();
        expect(screen.getByText('MONITORED')).toBeInTheDocument();
      });
    });

    it('displays reward amounts on cards when present', async () => {
      console.log('🧪 [Test] Checking reward display, nyaa~');
      setupSuccessfulFetch();
      render(<ThreatActors />);

      await waitFor(() => {
        expect(screen.getByText('$5,000,000')).toBeInTheDocument();
        expect(screen.getByText('$1,000,000')).toBeInTheDocument();
      });
    });

    it('displays victim counts on cards', async () => {
      console.log('🧪 [Test] Checking victim counts, desu~');
      setupSuccessfulFetch();
      render(<ThreatActors />);

      await waitFor(() => {
        expect(screen.getByText('100 victims')).toBeInTheDocument();
        expect(screen.getByText('50 victims')).toBeInTheDocument();
        expect(screen.getByText('10 victims')).toBeInTheDocument();
      });
    });

    it('displays financial damage on cards', async () => {
      console.log('🧪 [Test] Checking financial damage, nyaa~');
      setupSuccessfulFetch();
      render(<ThreatActors />);

      await waitFor(() => {
        expect(screen.getByText('$50M damage')).toBeInTheDocument();
        expect(screen.getByText('$25M damage')).toBeInTheDocument();
        expect(screen.getByText('$5M damage')).toBeInTheDocument();
      });
    });

    it('displays categories on cards (max 2)', async () => {
      console.log('🧪 [Test] Checking categories display, desu~');
      setupSuccessfulFetch();
      render(<ThreatActors />);

      await waitFor(() => {
        // Multiple cards have these categories, so use getAllByText
        expect(screen.getAllByText('Ransomware').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Data Theft').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Espionage').length).toBeGreaterThan(0);
      });
    });
  });

  describe('🔍 Search Functionality', () => {
    it('renders search input', async () => {
      console.log('🧪 [Test] Checking search input render, nyaa~');
      setupSuccessfulFetch();
      render(<ThreatActors />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Search by name, ID, or alias/i)).toBeInTheDocument();
      });
    });

    it('filters by name', async () => {
      console.log('🧪 [Test] Testing name search, desu~');
      setupSuccessfulFetch();
      render(<ThreatActors />);

      await waitFor(() => {
        expect(screen.getByText('Test Hacker')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/Search by name, ID, or alias/i);
      fireEvent.change(searchInput, { target: { value: 'Ransomware Gang' } });

      await waitFor(() => {
        expect(screen.getByText('Ransomware Gang')).toBeInTheDocument();
        expect(screen.queryByText('Test Hacker')).not.toBeInTheDocument();
      });
    });

    it('filters by actor ID', async () => {
      console.log('🧪 [Test] Testing ID search, nyaa~');
      setupSuccessfulFetch();
      render(<ThreatActors />);

      await waitFor(() => {
        expect(screen.getByText('TA-001')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/Search by name, ID, or alias/i);
      fireEvent.change(searchInput, { target: { value: 'TA-003' } });

      await waitFor(() => {
        expect(screen.getByText('APT Group')).toBeInTheDocument();
        expect(screen.queryByText('Test Hacker')).not.toBeInTheDocument();
      });
    });

    it('filters by alias', async () => {
      console.log('🧪 [Test] Testing alias search, desu~');
      setupSuccessfulFetch();
      render(<ThreatActors />);

      await waitFor(() => {
        expect(screen.getByText('Evil Hacker')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/Search by name, ID, or alias/i);
      fireEvent.change(searchInput, { target: { value: 'RansomKitty' } });

      await waitFor(() => {
        expect(screen.getByText('Ransomware Gang')).toBeInTheDocument();
        expect(screen.queryByText('Test Hacker')).not.toBeInTheDocument();
      });
    });

    it('is case-insensitive', async () => {
      console.log('🧪 [Test] Testing case-insensitive search, nyaa~');
      setupSuccessfulFetch();
      render(<ThreatActors />);

      await waitFor(() => {
        expect(screen.getByText('Test Hacker')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/Search by name, ID, or alias/i);
      fireEvent.change(searchInput, { target: { value: 'TEST HACKER' } });

      await waitFor(() => {
        expect(screen.getByText('Test Hacker')).toBeInTheDocument();
      });
    });

    it('shows no results message when search matches nothing', async () => {
      console.log('🧪 [Test] Testing no results message, desu~');
      setupSuccessfulFetch();
      render(<ThreatActors />);

      await waitFor(() => {
        expect(screen.getByText('Test Hacker')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/Search by name, ID, or alias/i);
      fireEvent.change(searchInput, { target: { value: 'NonexistentActor' } });

      await waitFor(() => {
        expect(screen.getByText(/No threat actors found matching your filters, nyaa~/i)).toBeInTheDocument();
      });
    });
  });

  describe('🎛️ Type Filter Functionality', () => {
    it('renders all filter buttons', async () => {
      console.log('🧪 [Test] Checking filter buttons, nyaa~');
      setupSuccessfulFetch();
      render(<ThreatActors />);

      await waitFor(() => {
        expect(screen.getByText('All Types')).toBeInTheDocument();
        expect(screen.getByText('👤 Individual')).toBeInTheDocument();
        expect(screen.getByText('💰 Ransomware')).toBeInTheDocument();
        expect(screen.getByText('🎯 APT')).toBeInTheDocument();
      });
    });

    it('"All Types" filter is active by default', async () => {
      console.log('🧪 [Test] Checking default filter, desu~');
      setupSuccessfulFetch();
      render(<ThreatActors />);

      await waitFor(() => {
        const allTypesBtn = screen.getByText('All Types').closest('button');
        expect(allTypesBtn).toHaveClass('active');
      });
    });

    it('filters by individual type', async () => {
      console.log('🧪 [Test] Testing individual filter, nyaa~');
      setupSuccessfulFetch();
      render(<ThreatActors />);

      await waitFor(() => {
        expect(screen.getByText('Test Hacker')).toBeInTheDocument();
      });

      const individualBtn = screen.getByText('👤 Individual');
      fireEvent.click(individualBtn);

      await waitFor(() => {
        expect(screen.getByText('Test Hacker')).toBeInTheDocument();
        expect(screen.queryByText('Ransomware Gang')).not.toBeInTheDocument();
        expect(screen.queryByText('APT Group')).not.toBeInTheDocument();
      });
    });

    it('filters by ransomware type', async () => {
      console.log('🧪 [Test] Testing ransomware filter, desu~');
      setupSuccessfulFetch();
      render(<ThreatActors />);

      await waitFor(() => {
        expect(screen.getByText('Ransomware Gang')).toBeInTheDocument();
      });

      const ransomwareBtn = screen.getByText('💰 Ransomware');
      fireEvent.click(ransomwareBtn);

      await waitFor(() => {
        expect(screen.getByText('Ransomware Gang')).toBeInTheDocument();
        expect(screen.queryByText('Test Hacker')).not.toBeInTheDocument();
        expect(screen.queryByText('APT Group')).not.toBeInTheDocument();
      });
    });

    it('filters by APT type', async () => {
      console.log('🧪 [Test] Testing APT filter, nyaa~');
      setupSuccessfulFetch();
      render(<ThreatActors />);

      await waitFor(() => {
        expect(screen.getByText('APT Group')).toBeInTheDocument();
      });

      const aptBtn = screen.getByText('🎯 APT');
      fireEvent.click(aptBtn);

      await waitFor(() => {
        expect(screen.getByText('APT Group')).toBeInTheDocument();
        expect(screen.queryByText('Test Hacker')).not.toBeInTheDocument();
        expect(screen.queryByText('Ransomware Gang')).not.toBeInTheDocument();
      });
    });

    it('can return to "All Types" after filtering', async () => {
      console.log('🧪 [Test] Testing return to all types, desu~');
      setupSuccessfulFetch();
      render(<ThreatActors />);

      await waitFor(() => {
        expect(screen.getByText('Test Hacker')).toBeInTheDocument();
      });

      // Filter to individual
      const individualBtn = screen.getByText('👤 Individual');
      fireEvent.click(individualBtn);

      await waitFor(() => {
        expect(screen.queryByText('Ransomware Gang')).not.toBeInTheDocument();
      });

      // Return to all
      const allTypesBtn = screen.getByText('All Types');
      fireEvent.click(allTypesBtn);

      await waitFor(() => {
        expect(screen.getByText('Test Hacker')).toBeInTheDocument();
        expect(screen.getByText('Ransomware Gang')).toBeInTheDocument();
        expect(screen.getByText('APT Group')).toBeInTheDocument();
      });
    });
  });

  describe('🎭 Modal Functionality', () => {
    it('opens modal when actor card is clicked', async () => {
      console.log('🧪 [Test] Testing modal open, nyaa~');
      setupSuccessfulFetch();
      render(<ThreatActors />);

      await waitFor(() => {
        expect(screen.getByText('Test Hacker')).toBeInTheDocument();
      });

      const card = screen.getByText('Test Hacker').closest('.threat-actor-card');
      fireEvent.click(card);

      await waitFor(() => {
        // Modal should show full aliases
        expect(screen.getByText('🎭 Aliases')).toBeInTheDocument();
      });
    });

    it('closes modal when close button is clicked', async () => {
      console.log('🧪 [Test] Testing modal close button, desu~');
      setupSuccessfulFetch();
      render(<ThreatActors />);

      await waitFor(() => {
        expect(screen.getByText('Test Hacker')).toBeInTheDocument();
      });

      const card = screen.getByText('Test Hacker').closest('.threat-actor-card');
      fireEvent.click(card);

      await waitFor(() => {
        expect(screen.getByText('🎭 Aliases')).toBeInTheDocument();
      });

      const closeButton = screen.getByText('✕');
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByText('🎭 Aliases')).not.toBeInTheDocument();
      });
    });

    it('closes modal when overlay is clicked', async () => {
      console.log('🧪 [Test] Testing modal overlay close, nyaa~');
      setupSuccessfulFetch();
      render(<ThreatActors />);

      await waitFor(() => {
        expect(screen.getByText('Test Hacker')).toBeInTheDocument();
      });

      const card = screen.getByText('Test Hacker').closest('.threat-actor-card');
      fireEvent.click(card);

      await waitFor(() => {
        expect(screen.getByText('🎭 Aliases')).toBeInTheDocument();
      });

      const overlay = document.querySelector('.modal-overlay');
      fireEvent.click(overlay);

      await waitFor(() => {
        expect(screen.queryByText('🎭 Aliases')).not.toBeInTheDocument();
      });
    });

    it('does not close modal when modal content is clicked', async () => {
      console.log('🧪 [Test] Testing modal content click, desu~');
      setupSuccessfulFetch();
      render(<ThreatActors />);

      await waitFor(() => {
        expect(screen.getByText('Test Hacker')).toBeInTheDocument();
      });

      const card = screen.getByText('Test Hacker').closest('.threat-actor-card');
      fireEvent.click(card);

      await waitFor(() => {
        expect(screen.getByText('🎭 Aliases')).toBeInTheDocument();
      });

      const modalContent = document.querySelector('.modal-content');
      fireEvent.click(modalContent);

      // Modal should still be open
      expect(screen.getByText('🎭 Aliases')).toBeInTheDocument();
    });

    it('displays all aliases in modal', async () => {
      console.log('🧪 [Test] Testing modal aliases, nyaa~');
      setupSuccessfulFetch();
      render(<ThreatActors />);

      await waitFor(() => {
        expect(screen.getByText('Test Hacker')).toBeInTheDocument();
      });

      const card = screen.getByText('Test Hacker').closest('.threat-actor-card');
      fireEvent.click(card);

      await waitFor(() => {
        const aliases = screen.getAllByText('Evil Hacker');
        const mrBad = screen.getAllByText('Mr. Bad');
        expect(aliases.length).toBeGreaterThan(0);
        expect(mrBad.length).toBeGreaterThan(0);
      });
    });

    it('displays origin info in modal', async () => {
      console.log('🧪 [Test] Testing modal origin info, desu~');
      setupSuccessfulFetch();
      render(<ThreatActors />);

      await waitFor(() => {
        expect(screen.getByText('Test Hacker')).toBeInTheDocument();
      });

      const card = screen.getByText('Test Hacker').closest('.threat-actor-card');
      fireEvent.click(card);

      await waitFor(() => {
        expect(screen.getByText('📍 Origin & Attribution')).toBeInTheDocument();
        expect(screen.getByText(/State Affiliated:/)).toBeInTheDocument();
        expect(screen.getByText('✅ Yes')).toBeInTheDocument();
      });
    });

    it('displays FBI wanted badge in modal when applicable', async () => {
      console.log('🧪 [Test] Testing modal FBI badge, nyaa~');
      setupSuccessfulFetch();
      render(<ThreatActors />);

      await waitFor(() => {
        expect(screen.getByText('Test Hacker')).toBeInTheDocument();
      });

      const card = screen.getByText('Test Hacker').closest('.threat-actor-card');
      fireEvent.click(card);

      await waitFor(() => {
        expect(screen.getByText('🚨 FBI WANTED')).toBeInTheDocument();
      });
    });

    it('displays technical profile in modal', async () => {
      console.log('🧪 [Test] Testing modal technical profile, desu~');
      setupSuccessfulFetch();
      render(<ThreatActors />);

      await waitFor(() => {
        expect(screen.getByText('Test Hacker')).toBeInTheDocument();
      });

      const card = screen.getByText('Test Hacker').closest('.threat-actor-card');
      fireEvent.click(card);

      await waitFor(() => {
        expect(screen.getByText('🔧 Technical Profile')).toBeInTheDocument();
        expect(screen.getByText('BadMalware')).toBeInTheDocument();
        expect(screen.getByText('Phishing')).toBeInTheDocument();
      });
    });

    it('displays evidence stats in modal', async () => {
      console.log('🧪 [Test] Testing modal evidence stats, nyaa~');
      setupSuccessfulFetch();
      render(<ThreatActors />);

      await waitFor(() => {
        expect(screen.getByText('Test Hacker')).toBeInTheDocument();
      });

      const card = screen.getByText('Test Hacker').closest('.threat-actor-card');
      fireEvent.click(card);

      await waitFor(() => {
        expect(screen.getByText('📊 Evidence & Impact')).toBeInTheDocument();
        expect(screen.getByText('Victims')).toBeInTheDocument();
        expect(screen.getByText('Financial Damage')).toBeInTheDocument();
      });
    });

    it('displays known incidents in modal', async () => {
      console.log('🧪 [Test] Testing modal incidents, desu~');
      setupSuccessfulFetch();
      render(<ThreatActors />);

      await waitFor(() => {
        expect(screen.getByText('Test Hacker')).toBeInTheDocument();
      });

      const card = screen.getByText('Test Hacker').closest('.threat-actor-card');
      fireEvent.click(card);

      await waitFor(() => {
        expect(screen.getByText('Notable Incidents:')).toBeInTheDocument();
        expect(screen.getByText('Attack 1')).toBeInTheDocument();
        expect(screen.getByText('Attack 2')).toBeInTheDocument();
      });
    });

    it('displays intelligence info in modal', async () => {
      console.log('🧪 [Test] Testing modal intelligence, nyaa~');
      setupSuccessfulFetch();
      render(<ThreatActors />);

      await waitFor(() => {
        expect(screen.getByText('Test Hacker')).toBeInTheDocument();
      });

      const card = screen.getByText('Test Hacker').closest('.threat-actor-card');
      fireEvent.click(card);

      await waitFor(() => {
        expect(screen.getByText('🔍 Intelligence')).toBeInTheDocument();
        expect(screen.getByText('FBI, CIA')).toBeInTheDocument();
      });
    });

    it('displays hunting notes in modal when present', async () => {
      console.log('🧪 [Test] Testing modal hunting notes, desu~');
      setupSuccessfulFetch();
      render(<ThreatActors />);

      await waitFor(() => {
        expect(screen.getByText('Test Hacker')).toBeInTheDocument();
      });

      const card = screen.getByText('Test Hacker').closest('.threat-actor-card');
      fireEvent.click(card);

      await waitFor(() => {
        expect(screen.getByText('🐾 Hunting Notes')).toBeInTheDocument();
        expect(screen.getByText(/Actively hunting this threat, nyaa~/i)).toBeInTheDocument();
      });
    });
  });

  describe('❌ Error Handling', () => {
    it('displays error message when API fails', async () => {
      console.log('🧪 [Test] Testing error display, nyaa~');
      setupFailedFetch('Network error');
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      render(<ThreatActors />);

      await waitFor(() => {
        expect(screen.getByText(/Error loading threat actors:/i)).toBeInTheDocument();
        expect(screen.getByText(/Network error/i)).toBeInTheDocument();
      });

      consoleError.mockRestore();
    });

    it('displays retry button on error', async () => {
      console.log('🧪 [Test] Testing retry button display, desu~');
      setupFailedFetch();
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      render(<ThreatActors />);

      await waitFor(() => {
        expect(screen.getByText('🔄 Retry')).toBeInTheDocument();
      });

      consoleError.mockRestore();
    });

    it('retries API call when retry button is clicked', async () => {
      console.log('🧪 [Test] Testing retry functionality, nyaa~');
      let callCount = 0;
      global.fetch = jest.fn(() => {
        callCount++;
        if (callCount === 1) {
          return Promise.reject(new Error('Network error'));
        }
        return Promise.resolve({
          json: () => Promise.resolve(mockThreatActorsResponse)
        });
      });

      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      render(<ThreatActors />);

      await waitFor(() => {
        expect(screen.getByText('🔄 Retry')).toBeInTheDocument();
      });

      const retryButton = screen.getByText('🔄 Retry');
      fireEvent.click(retryButton);

      await waitFor(() => {
        expect(screen.getByText('Test Hacker')).toBeInTheDocument();
      });

      expect(callCount).toBe(2);
      consoleError.mockRestore();
    });

    it('handles API response with success: false', async () => {
      console.log('🧪 [Test] Testing failed API response, desu~');
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ success: false })
        })
      );

      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      render(<ThreatActors />);

      await waitFor(() => {
        expect(screen.getByText(/Failed to load threat actors/i)).toBeInTheDocument();
      });

      consoleError.mockRestore();
    });
  });

  describe('🎨 Edge Cases & Special States', () => {
    it('handles actor with no aliases', async () => {
      console.log('🧪 [Test] Testing no aliases case, nyaa~');
      setupSuccessfulFetch();
      render(<ThreatActors />);

      await waitFor(() => {
        expect(screen.getByText('APT Group')).toBeInTheDocument();
        // APT Group has no aliases, should not crash
      });
    });

    it('handles actor with unknown origin', async () => {
      console.log('🧪 [Test] Testing unknown origin, desu~');
      setupSuccessfulFetch();
      render(<ThreatActors />);

      await waitFor(() => {
        expect(screen.getByText('Test Hacker')).toBeInTheDocument();
        const unknownTexts = screen.getAllByText('Unknown');
        expect(unknownTexts.length).toBeGreaterThan(0);
      });
    });

    it('handles actor with no reward', async () => {
      console.log('🧪 [Test] Testing no reward case, nyaa~');
      setupSuccessfulFetch();
      render(<ThreatActors />);

      await waitFor(() => {
        expect(screen.getByText('Ransomware Gang')).toBeInTheDocument();
        // Should not display reward for TA-002
      });

      const card = screen.getByText('Ransomware Gang').closest('.threat-actor-card');
      expect(card).not.toHaveTextContent('$0');
    });

    it('handles actor with empty technical profile', async () => {
      console.log('🧪 [Test] Testing empty technical profile, desu~');
      setupSuccessfulFetch();
      render(<ThreatActors />);

      await waitFor(() => {
        expect(screen.getByText('APT Group')).toBeInTheDocument();
      });

      const card = screen.getByText('APT Group').closest('.threat-actor-card');
      fireEvent.click(card);

      await waitFor(() => {
        expect(screen.getByText('🔧 Technical Profile')).toBeInTheDocument();
        // Should not crash with empty technical_profile
      });
    });

    it('handles actor with empty known incidents', async () => {
      console.log('🧪 [Test] Testing empty incidents, nyaa~');
      setupSuccessfulFetch();
      render(<ThreatActors />);

      await waitFor(() => {
        expect(screen.getByText('APT Group')).toBeInTheDocument();
      });

      const card = screen.getByText('APT Group').closest('.threat-actor-card');
      fireEvent.click(card);

      await waitFor(() => {
        const incidents = screen.queryByText('Notable Incidents:');
        // APT Group has no incidents, should not show incidents section
        expect(incidents).not.toBeInTheDocument();
      });
    });

    it('handles zero victims and damage', async () => {
      console.log('🧪 [Test] Testing zero values, desu~');
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            success: true,
            count: 1,
            data: [{
              actor_id: 'TA-999',
              name: 'Zero Impact Actor',
              type: 'individual',
              threat_level: 'LOW',
              status: 'MONITORED',
              aliases: [],
              origin: {},
              attribution: {},
              categories: [],
              evidence: {
                victim_count: 0,
                financial_damage_usd: 0,
                known_incidents: []
              },
              technical_profile: {},
              intelligence: {}
            }]
          })
        })
      );

      render(<ThreatActors />);

      await waitFor(() => {
        expect(screen.getByText('Zero Impact Actor')).toBeInTheDocument();
        expect(screen.getByText('0 victims')).toBeInTheDocument();
        expect(screen.getByText('$0M damage')).toBeInTheDocument();
      });
    });

    it('handles no hunting notes', async () => {
      console.log('🧪 [Test] Testing no hunting notes, nyaa~');
      setupSuccessfulFetch();
      render(<ThreatActors />);

      await waitFor(() => {
        expect(screen.getByText('Ransomware Gang')).toBeInTheDocument();
      });

      const card = screen.getByText('Ransomware Gang').closest('.threat-actor-card');
      fireEvent.click(card);

      await waitFor(() => {
        const huntingNotes = screen.queryByText('🐾 Hunting Notes');
        expect(huntingNotes).not.toBeInTheDocument();
      });
    });
  });

  describe('🎯 Helper Functions', () => {
    it('getThreatLevelColor returns correct color for CRITICAL', async () => {
      console.log('🧪 [Test] Testing CRITICAL color, desu~');
      setupSuccessfulFetch();
      render(<ThreatActors />);

      await waitFor(() => {
        const criticalCard = screen.getByText('Test Hacker').closest('.threat-actor-card');
        expect(criticalCard).toHaveStyle({ borderLeft: '4px solid #ff0055' });
      });
    });

    it('getTypeIcon returns correct icon for individual', async () => {
      console.log('🧪 [Test] Testing individual icon, nyaa~');
      setupSuccessfulFetch();
      render(<ThreatActors />);

      await waitFor(() => {
        expect(screen.getByText('👤')).toBeInTheDocument();
      });
    });

    it('getTypeIcon returns correct icon for ransomware', async () => {
      console.log('🧪 [Test] Testing ransomware icon, desu~');
      setupSuccessfulFetch();
      render(<ThreatActors />);

      await waitFor(() => {
        expect(screen.getByText('💰')).toBeInTheDocument();
      });
    });

    it('getTypeIcon returns correct icon for APT', async () => {
      console.log('🧪 [Test] Testing APT icon, nyaa~');
      setupSuccessfulFetch();
      render(<ThreatActors />);

      await waitFor(() => {
        // Multiple actors may have APT icon, use getAllByText
        expect(screen.getAllByText('🎯').length).toBeGreaterThan(0);
      });
    });
  });
});

// *purrs in 100% coverage excellence* 😻⚡
// LEGENDARY TEST SUITE COMPLETE, NYAA~! 🐾👑
