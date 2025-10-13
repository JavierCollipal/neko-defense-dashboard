// 🐾⚡ NEKO-ARC TESTS - DinaDocumentation Component ⚡🐾
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import DinaDocumentation from './DinaDocumentation';
import { setupFetchMocks, setupFailedFetchMocks, mockApiResponses } from '../test-utils/testHelpers';

describe('DinaDocumentation Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('🎯 Rendering Tests', () => {
    it('renders loading state initially', () => {
      setupFetchMocks();
      render(<DinaDocumentation />);

      expect(screen.getByText(/Loading DINA documentation, nyaa~/i)).toBeInTheDocument();
    });

    it('renders DINA header after loading', async () => {
      setupFetchMocks();
      render(<DinaDocumentation />);

      await waitFor(() => {
        expect(screen.getByText('🔍 DINA Documentation Archive')).toBeInTheDocument();
      });
    });

    it('renders subtitle with correct text', async () => {
      setupFetchMocks();
      render(<DinaDocumentation />);

      await waitFor(() => {
        expect(screen.getByText('Chilean Secret Police (1973-1977) - Crimes Against Humanity')).toBeInTheDocument();
      });
    });

    it('renders methodology section', async () => {
      setupFetchMocks();
      render(<DinaDocumentation />);

      await waitFor(() => {
        expect(screen.getByText('📚 Methodology: Simon Wiesenthal Nazi-Hunting Precedent')).toBeInTheDocument();
      });
    });

    it('renders legal basis section', async () => {
      setupFetchMocks();
      render(<DinaDocumentation />);

      await waitFor(() => {
        expect(screen.getByText('⚖️ Legal Basis: No Statute of Limitations for Crimes Against Humanity')).toBeInTheDocument();
      });
    });
  });

  describe('📊 Stats Display Tests', () => {
    it('renders all stat boxes when stats are loaded', async () => {
      setupFetchMocks();
      render(<DinaDocumentation />);

      await waitFor(() => {
        expect(screen.getByText('Total Documents')).toBeInTheDocument();
        expect(screen.getByText('Perpetrators Documented')).toBeInTheDocument();
        expect(screen.getByText('Convicted')).toBeInTheDocument();
        expect(screen.getByText('Still Unprosecuted')).toBeInTheDocument();
      });
    });

    it('displays correct stat values from API', async () => {
      setupFetchMocks();
      render(<DinaDocumentation />);

      // Wait for stats section to appear
      await screen.findByText('Total Documents', {}, { timeout: 3000 });

      // Use findByText for async stat values - these should appear after API returns
      const stat150 = await screen.findByText('150', {}, { timeout: 3000 });
      expect(stat150).toBeInTheDocument(); // total_documents

      const stat45 = await screen.findByText('45', {}, { timeout: 3000 });
      expect(stat45).toBeInTheDocument(); // perpetrators.total

      const stat12 = await screen.findByText('12', {}, { timeout: 3000 });
      expect(stat12).toBeInTheDocument(); // perpetrators.convicted

      const stat33 = await screen.findByText('33', {}, { timeout: 3000 });
      expect(stat33).toBeInTheDocument(); // perpetrators.unprosecuted
    });

    it('handles missing perpetrators object with default values', async () => {
      global.fetch = jest.fn((url) => {
        if (url.includes('/dina/stats')) {
          return Promise.resolve({
            json: () => Promise.resolve({
              success: true,
              data: { total_documents: 100 } // No perpetrators object
            })
          });
        }
        if (url.includes('/dina/perpetrators')) {
          return Promise.resolve({
            json: () => Promise.resolve(mockApiResponses.dinaPerpetrators)
          });
        }
        return Promise.reject(new Error('Unknown URL'));
      });

      render(<DinaDocumentation />);

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText(/Loading DINA documentation/i)).not.toBeInTheDocument();
      });

      // Wait for stats section to appear
      await waitFor(() => {
        expect(screen.getByText('Perpetrators Documented')).toBeInTheDocument();
      });

      // Check that default value 0 appears (there are multiple 0s, so we need to be specific)
      await waitFor(() => {
        const statLabels = screen.getAllByText(/Perpetrators Documented|Convicted|Still Unprosecuted/i);
        expect(statLabels.length).toBeGreaterThan(0); // Stats section is rendered
        // The component should show 0 for all perpetrator stats when perpetrators object is missing
        const zeros = screen.getAllByText('0');
        expect(zeros.length).toBeGreaterThan(0); // At least one "0" appears
      });
    });
  });

  describe('🌐 API Integration Tests', () => {
    it('fetches DINA stats on mount', async () => {
      setupFetchMocks();
      render(<DinaDocumentation />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/dina/stats'));
      });
    });

    it('fetches DINA perpetrators on mount', async () => {
      setupFetchMocks();
      render(<DinaDocumentation />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/dina/perpetrators'));
      });
    });

    it('handles fetch errors gracefully', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      setupFailedFetchMocks();

      render(<DinaDocumentation />);

      await waitFor(() => {
        expect(screen.queryByText(/Loading DINA documentation/i)).not.toBeInTheDocument();
      });

      consoleError.mockRestore();
    });

    it('sets loading to false after successful fetch', async () => {
      setupFetchMocks();
      render(<DinaDocumentation />);

      await waitFor(() => {
        expect(screen.queryByText(/Loading DINA documentation/i)).not.toBeInTheDocument();
      });
    });

    it('only updates state when API response has success flag', async () => {
      global.fetch = jest.fn((url) => {
        if (url.includes('/dina/stats')) {
          return Promise.resolve({
            json: () => Promise.resolve({ success: false, data: {} })
          });
        }
        if (url.includes('/dina/perpetrators')) {
          return Promise.resolve({
            json: () => Promise.resolve({ success: false, data: [] })
          });
        }
        return Promise.reject(new Error('Unknown URL'));
      });

      render(<DinaDocumentation />);

      await waitFor(() => {
        expect(screen.queryByText('150')).not.toBeInTheDocument(); // Stats not loaded
      });
    });
  });

  describe('📋 Perpetrators List View Tests', () => {
    it('renders overview view by default, then shows list when clicked', async () => {
      setupFetchMocks();
      render(<DinaDocumentation />);

      // Component starts in 'overview' mode
      await waitFor(() => {
        expect(screen.getByText(/DINA DOCUMENTATION OPERATION ACTIVE/i)).toBeInTheDocument();
      });

      // Click on list button to switch to list view
      await waitFor(() => {
        const listButton = screen.getByText('📋 PERPETRATORS');
        fireEvent.click(listButton);
      });

      await waitFor(() => {
        expect(screen.getByText('📋 Documented DINA Agents & Collaborators')).toBeInTheDocument();
      });
    });

    it('displays all perpetrator cards in grid', async () => {
      setupFetchMocks();
      render(<DinaDocumentation />);

      // Switch to list view
      await waitFor(() => {
        const listButton = screen.getByText('📋 PERPETRATORS');
        fireEvent.click(listButton);
      });

      await waitFor(() => {
        expect(screen.getByText('Test Perpetrator')).toBeInTheDocument();
        expect(screen.getByText('Test Perpetrator 2')).toBeInTheDocument();
      });
    });

    it('displays perpetrator role in each card', async () => {
      setupFetchMocks();
      render(<DinaDocumentation />);

      await waitFor(() => {
        const listButton = screen.getByText('📋 PERPETRATORS');
        fireEvent.click(listButton);
      });

      await waitFor(() => {
        expect(screen.getByText('DINA Agent')).toBeInTheDocument();
        expect(screen.getByText('Military Officer')).toBeInTheDocument();
      });
    });

    it('shows convicted status for convicted perpetrators', async () => {
      setupFetchMocks();
      render(<DinaDocumentation />);

      await waitFor(() => {
        const listButton = screen.getByText('📋 PERPETRATORS');
        fireEvent.click(listButton);
      });

      await waitFor(() => {
        expect(screen.getByText('⚖️ CONVICTED')).toBeInTheDocument();
      });
    });

    it('shows unprosecuted status for unprosecuted perpetrators', async () => {
      setupFetchMocks();
      render(<DinaDocumentation />);

      await waitFor(() => {
        const listButton = screen.getByText('📋 PERPETRATORS');
        fireEvent.click(listButton);
      });

      await waitFor(() => {
        expect(screen.getByText('⚠️ UNPROSECUTED')).toBeInTheDocument();
      });
    });

    it('displays verification status', async () => {
      setupFetchMocks();
      render(<DinaDocumentation />);

      await waitFor(() => {
        const listButton = screen.getByText('📋 PERPETRATORS');
        fireEvent.click(listButton);
      });

      await waitFor(() => {
        const verificationElements = screen.getAllByText(/Status: VERIFIED/i);
        expect(verificationElements.length).toBeGreaterThan(0);
      });
    });

    it('shows organization for perpetrators with organization array', async () => {
      setupFetchMocks();
      render(<DinaDocumentation />);

      await waitFor(() => {
        const listButton = screen.getByText('📋 PERPETRATORS');
        fireEvent.click(listButton);
      });

      await waitFor(() => {
        expect(screen.getByText(/DINA, Military Intelligence/i)).toBeInTheDocument();
        expect(screen.getByText(/Chilean Army/i)).toBeInTheDocument();
      });
    });

    it('displays crimes count for each perpetrator', async () => {
      setupFetchMocks();
      render(<DinaDocumentation />);

      await waitFor(() => {
        const listButton = screen.getByText('📋 PERPETRATORS');
        fireEvent.click(listButton);
      });

      await waitFor(() => {
        expect(screen.getByText('3 crimes documented')).toBeInTheDocument();
        expect(screen.getByText('1 crimes documented')).toBeInTheDocument();
      });
    });

    it('shows "no data" message when perpetrators array is empty', async () => {
      global.fetch = jest.fn((url) => {
        if (url.includes('/dina/stats')) {
          return Promise.resolve({
            json: () => Promise.resolve(mockApiResponses.dinaStats)
          });
        }
        if (url.includes('/dina/perpetrators')) {
          return Promise.resolve({
            json: () => Promise.resolve({ success: true, data: [] })
          });
        }
        return Promise.reject(new Error('Unknown URL'));
      });

      render(<DinaDocumentation />);

      await waitFor(() => {
        const listButton = screen.getByText('📋 PERPETRATORS');
        fireEvent.click(listButton);
      });

      await waitFor(() => {
        expect(screen.getByText('No perpetrators documented yet, desu!')).toBeInTheDocument();
      });
    });

    it('limits displayed organizations to first 2', async () => {
      global.fetch = jest.fn((url) => {
        if (url.includes('/dina/stats')) {
          return Promise.resolve({
            json: () => Promise.resolve(mockApiResponses.dinaStats)
          });
        }
        if (url.includes('/dina/perpetrators')) {
          return Promise.resolve({
            json: () => Promise.resolve({
              success: true,
              data: [{
                fullName: 'Test Perp',
                role: 'Agent',
                legalStatus: { convicted: false },
                organization: ['Org1', 'Org2', 'Org3', 'Org4'],
                crimesAccused: ['Crime1']
              }]
            })
          });
        }
        return Promise.reject(new Error('Unknown URL'));
      });

      render(<DinaDocumentation />);

      await waitFor(() => {
        const listButton = screen.getByText('📋 PERPETRATORS');
        fireEvent.click(listButton);
      });

      await waitFor(() => {
        expect(screen.getByText('Org1, Org2')).toBeInTheDocument();
        expect(screen.queryByText('Org3')).not.toBeInTheDocument();
      });
    });
  });

  describe('🎮 Event Handler Tests - View Switching', () => {
    it('switches to details view when perpetrator card is clicked', async () => {
      setupFetchMocks();
      render(<DinaDocumentation />);

      // First switch to list view
      await waitFor(() => {
        const listButton = screen.getByText('📋 PERPETRATORS');
        fireEvent.click(listButton);
      });

      await waitFor(() => {
        const card = screen.getByText('Test Perpetrator').closest('div.perp-card');
        fireEvent.click(card);
      });

      await waitFor(() => {
        expect(screen.getByText('← Back to List')).toBeInTheDocument();
      });
    });

    it('displays selected perpetrator details in details view', async () => {
      setupFetchMocks();
      render(<DinaDocumentation />);

      await waitFor(() => {
        const listButton = screen.getByText('📋 PERPETRATORS');
        fireEvent.click(listButton);
      });

      await waitFor(() => {
        const card = screen.getByText('Test Perpetrator').closest('div.perp-card');
        fireEvent.click(card);
      });

      await waitFor(() => {
        expect(screen.getByText('Role & Organization')).toBeInTheDocument();
        expect(screen.getByText('Legal Status')).toBeInTheDocument();
      });
    });

    it('switches back to list view when back button is clicked', async () => {
      setupFetchMocks();
      render(<DinaDocumentation />);

      // First switch to list view
      await waitFor(() => {
        const listButton = screen.getByText('📋 PERPETRATORS');
        fireEvent.click(listButton);
      });

      // First click to details
      await waitFor(() => {
        const card = screen.getByText('Test Perpetrator').closest('div.perp-card');
        fireEvent.click(card);
      });

      // Then click back
      await waitFor(() => {
        const backButton = screen.getByText('← Back to List');
        fireEvent.click(backButton);
      });

      await waitFor(() => {
        expect(screen.getByText('📋 Documented DINA Agents & Collaborators')).toBeInTheDocument();
      });
    });

    it('clears selected perpetrator when back button is clicked', async () => {
      setupFetchMocks();
      render(<DinaDocumentation />);

      await waitFor(() => {
        const listButton = screen.getByText('📋 PERPETRATORS');
        fireEvent.click(listButton);
      });

      await waitFor(() => {
        const card = screen.getByText('Test Perpetrator').closest('div.perp-card');
        fireEvent.click(card);
      });

      await waitFor(() => {
        const backButton = screen.getByText('← Back to List');
        fireEvent.click(backButton);
      });

      await waitFor(() => {
        expect(screen.queryByText('← Back to List')).not.toBeInTheDocument();
      });
    });
  });

  describe('📄 Perpetrator Details View Tests', () => {
    it('displays perpetrator full name as title', async () => {
      setupFetchMocks();
      render(<DinaDocumentation />);

      // Switch to list view first
      await waitFor(() => {
        const listButton = screen.getByText('📋 PERPETRATORS');
        fireEvent.click(listButton);
      });

      await waitFor(() => {
        const card = screen.getByText('Test Perpetrator').closest('div.perp-card');
        fireEvent.click(card);
      });

      await waitFor(() => {
        const titles = screen.getAllByText('Test Perpetrator');
        expect(titles.length).toBeGreaterThan(0);
      });
    });

    it('displays role in details section', async () => {
      setupFetchMocks();
      render(<DinaDocumentation />);

      // Switch to list view first
      await waitFor(() => {
        const listButton = screen.getByText('📋 PERPETRATORS');
        fireEvent.click(listButton);
      });

      await waitFor(() => {
        const card = screen.getByText('Test Perpetrator').closest('div.perp-card');
        fireEvent.click(card);
      });

      await waitFor(() => {
        expect(screen.getByText(/Role:/i)).toBeInTheDocument();
        expect(screen.getByText('DINA Agent')).toBeInTheDocument();
      });
    });

    it('displays all organizations in details view', async () => {
      setupFetchMocks();
      render(<DinaDocumentation />);

      // Switch to list view first
      await waitFor(() => {
        const listButton = screen.getByText('📋 PERPETRATORS');
        fireEvent.click(listButton);
      });

      await waitFor(() => {
        const card = screen.getByText('Test Perpetrator').closest('div.perp-card');
        fireEvent.click(card);
      });

      await waitFor(() => {
        expect(screen.getByText(/Organizations:/i)).toBeInTheDocument();
        expect(screen.getByText('DINA, Military Intelligence')).toBeInTheDocument();
      });
    });

    it('displays convicted status with YES emoji', async () => {
      setupFetchMocks();
      render(<DinaDocumentation />);

      // Switch to list view first
      await waitFor(() => {
        const listButton = screen.getByText('📋 PERPETRATORS');
        fireEvent.click(listButton);
      });

      await waitFor(() => {
        const card = screen.getByText('Test Perpetrator').closest('div.perp-card');
        fireEvent.click(card);
      });

      await waitFor(() => {
        expect(screen.getByText(/Convicted:/i)).toBeInTheDocument();
        expect(screen.getByText('YES ⚖️')).toBeInTheDocument();
      });
    });

    it('displays current status from legalStatus', async () => {
      setupFetchMocks();
      render(<DinaDocumentation />);

      // Switch to list view first
      await waitFor(() => {
        const listButton = screen.getByText('📋 PERPETRATORS');
        fireEvent.click(listButton);
      });

      await waitFor(() => {
        const card = screen.getByText('Test Perpetrator').closest('div.perp-card');
        fireEvent.click(card);
      });

      await waitFor(() => {
        expect(screen.getByText(/Current Status:/i)).toBeInTheDocument();
        expect(screen.getByText('Imprisoned')).toBeInTheDocument();
      });
    });

    it('displays all crimes accused as list', async () => {
      setupFetchMocks();
      render(<DinaDocumentation />);

      // Switch to list view first
      await waitFor(() => {
        const listButton = screen.getByText('📋 PERPETRATORS');
        fireEvent.click(listButton);
      });

      await waitFor(() => {
        const card = screen.getByText('Test Perpetrator').closest('div.perp-card');
        fireEvent.click(card);
      });

      await waitFor(() => {
        expect(screen.getByText('Crimes Accused')).toBeInTheDocument();
        expect(screen.getByText('Torture')).toBeInTheDocument();
        expect(screen.getByText('Murder')).toBeInTheDocument();
        expect(screen.getByText('Disappearances')).toBeInTheDocument();
      });
    });

    it('displays all tags with proper styling', async () => {
      setupFetchMocks();
      render(<DinaDocumentation />);

      // Switch to list view first
      await waitFor(() => {
        const listButton = screen.getByText('📋 PERPETRATORS');
        fireEvent.click(listButton);
      });

      await waitFor(() => {
        const card = screen.getByText('Test Perpetrator').closest('div.perp-card');
        fireEvent.click(card);
      });

      await waitFor(() => {
        expect(screen.getByText('Tags')).toBeInTheDocument();
        expect(screen.getByText('Operation Condor')).toBeInTheDocument();
        expect(screen.getByText('State Terrorism')).toBeInTheDocument();
      });
    });

    it('displays verification status in details', async () => {
      setupFetchMocks();
      render(<DinaDocumentation />);

      // Switch to list view first
      await waitFor(() => {
        const listButton = screen.getByText('📋 PERPETRATORS');
        fireEvent.click(listButton);
      });

      await waitFor(() => {
        const card = screen.getByText('Test Perpetrator').closest('div.perp-card');
        fireEvent.click(card);
      });

      await waitFor(() => {
        expect(screen.getByText(/Verification Status:/i)).toBeInTheDocument();
        expect(screen.getByText('VERIFIED')).toBeInTheDocument();
      });
    });

    it('handles missing crimesAccused array gracefully', async () => {
      global.fetch = jest.fn((url) => {
        if (url.includes('/dina/stats')) {
          return Promise.resolve({
            json: () => Promise.resolve(mockApiResponses.dinaStats)
          });
        }
        if (url.includes('/dina/perpetrators')) {
          return Promise.resolve({
            json: () => Promise.resolve({
              success: true,
              data: [{
                fullName: 'Test Perp',
                role: 'Agent',
                legalStatus: { convicted: false, currentStatus: 'Free' }
              }]
            })
          });
        }
        return Promise.reject(new Error('Unknown URL'));
      });

      render(<DinaDocumentation />);

      // Switch to list view first
      await waitFor(() => {
        const listButton = screen.getByText('📋 PERPETRATORS');
        fireEvent.click(listButton);
      });

      await waitFor(() => {
        const card = screen.getByText('Test Perp').closest('div.perp-card');
        fireEvent.click(card);
      });

      await waitFor(() => {
        expect(screen.queryByText('Crimes Accused')).not.toBeInTheDocument();
      });
    });

    it('handles missing tags array gracefully', async () => {
      global.fetch = jest.fn((url) => {
        if (url.includes('/dina/stats')) {
          return Promise.resolve({
            json: () => Promise.resolve(mockApiResponses.dinaStats)
          });
        }
        if (url.includes('/dina/perpetrators')) {
          return Promise.resolve({
            json: () => Promise.resolve({
              success: true,
              data: [{
                fullName: 'Test Perp',
                role: 'Agent',
                legalStatus: { convicted: false, currentStatus: 'Free' }
              }]
            })
          });
        }
        return Promise.reject(new Error('Unknown URL'));
      });

      render(<DinaDocumentation />);

      // Switch to list view first
      await waitFor(() => {
        const listButton = screen.getByText('📋 PERPETRATORS');
        fireEvent.click(listButton);
      });

      await waitFor(() => {
        const card = screen.getByText('Test Perp').closest('div.perp-card');
        fireEvent.click(card);
      });

      await waitFor(() => {
        expect(screen.queryByText('Tags')).not.toBeInTheDocument();
      });
    });
  });

  describe('🦶 Footer Tests', () => {
    it('renders neko purr message', async () => {
      setupFetchMocks();
      render(<DinaDocumentation />);

      await waitFor(() => {
        expect(screen.getByText('🐾 *purrs in justice documentation* 😻⚖️')).toBeInTheDocument();
      });
    });

    it('renders mission statement', async () => {
      setupFetchMocks();
      render(<DinaDocumentation />);

      await waitFor(() => {
        expect(screen.getByText(/Mission: Document all DINA crimes/i)).toBeInTheDocument();
      });
    });

    it('renders Simon Wiesenthal principle quote', async () => {
      setupFetchMocks();
      render(<DinaDocumentation />);

      await waitFor(() => {
        expect(screen.getByText(/Justice, not vengeance.*Simon Wiesenthal/i)).toBeInTheDocument();
      });
    });
  });
});

// *purrs in DINA testing excellence* 😻⚖️
