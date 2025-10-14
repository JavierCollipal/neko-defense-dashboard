// 🐾⚡ NEKO-ARC TESTS - ValechDataViewer Component ⚡🐾
// ULTRA BASED TESTING with 100% coverage goal, nyaa~! 😻
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ValechDataViewer from './ValechDataViewer';

// 🎯 Mock Data - BASED test fixtures, desu!
const mockVictimsResponse = {
  success: true,
  data: [
    {
      _id: '1',
      fullName: 'Test Victim 1',
      age: 35,
      gender: 'Male',
      outcome: 'SURVIVED',
      detentionCenters: [{ name: 'Villa Grimaldi', codeName: 'Villa', datesHeld: { from: '1973-09-11', to: '1973-12-01' } }],
      linkedPerpetrators: ['Manuel Contreras', 'Osvaldo Romo'],
      testimonyText: 'Test testimony text',
      detentionInfo: { arrested: '1973-09-11', released: '1973-12-01', duration: 81 },
      tortureReported: { methods: ['Electric Shock', 'Waterboarding'], perpetrators: ['Manuel Contreras'] }
    },
    {
      _id: '2',
      fullName: 'Test Victim 2',
      age: 28,
      gender: 'Female',
      outcome: 'EXECUTED',
      detentionCenters: [{ name: 'Londres 38' }],
      linkedPerpetrators: []
    }
  ]
};

const mockStatsResponse = {
  success: true,
  data: {
    total: 10,
    survived: 7,
    executed: 2,
    disappeared: 1,
    assassinated: 0,
    male: 6,
    female: 4,
    withTestimony: 8,
    withLinkedPerpetrators: 5
  }
};

const mockCentersResponse = {
  success: true,
  data: ['Villa Grimaldi', 'Londres 38', 'Estadio Nacional']
};

const mockPerpsResponse = {
  success: true,
  data: ['Manuel Contreras', 'Osvaldo Romo', 'Miguel Krassnoff']
};

describe('ValechDataViewer Component', () => {
  let originalFetch;

  beforeEach(() => {
    console.log('🐾 [ValechDataViewer.test] Setting up test, nyaa~');
    originalFetch = global.fetch;
    jest.clearAllMocks();
  });

  afterEach(() => {
    console.log('🐾 [ValechDataViewer.test] Cleaning up test, desu~');
    global.fetch = originalFetch;
  });

  const setupSuccessfulFetch = () => {
    global.fetch = jest.fn((url) => {
      if (url.includes('/stats/all')) {
        return Promise.resolve({ json: () => Promise.resolve(mockStatsResponse) });
      } else if (url.includes('/lists/detention-centers')) {
        return Promise.resolve({ json: () => Promise.resolve(mockCentersResponse) });
      } else if (url.includes('/lists/perpetrators')) {
        return Promise.resolve({ json: () => Promise.resolve(mockPerpsResponse) });
      } else {
        return Promise.resolve({ json: () => Promise.resolve(mockVictimsResponse) });
      }
    });
  };

  const setupFailedFetch = () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));
  };

  describe('🎨 Initial Rendering & Loading State', () => {
    it('renders loading state initially', () => {
      console.log('🧪 [Test] Checking loading state, nyaa~');
      setupSuccessfulFetch();
      render(<ValechDataViewer />);

      expect(screen.getByText(/Loading Valech data, nyaa~/i)).toBeInTheDocument();
    });

    it('renders header after loading', async () => {
      console.log('🧪 [Test] Checking header render, desu~');
      setupSuccessfulFetch();
      render(<ValechDataViewer />);

      await waitFor(() => {
        expect(screen.getByText('🕊️⚖️ VALECH HISTORICAL RECORDS ⚖️🕊️')).toBeInTheDocument();
      });
    });

    it('calls all APIs on mount', async () => {
      console.log('🧪 [Test] Verifying API calls, nyaa~');
      setupSuccessfulFetch();
      render(<ValechDataViewer />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(4);
      });
    });
  });

  describe('🗂️ Navigation Tabs', () => {
    it('renders all navigation tabs', async () => {
      console.log('🧪 [Test] Checking nav tabs, desu~');
      setupSuccessfulFetch();
      render(<ValechDataViewer />);

      await waitFor(() => {
        expect(screen.getByText('📋 VICTIM LIST')).toBeInTheDocument();
        expect(screen.getByText('📊 STATISTICS')).toBeInTheDocument();
      });
    });

    it('list view is active by default', async () => {
      console.log('🧪 [Test] Checking default view, nyaa~');
      setupSuccessfulFetch();
      render(<ValechDataViewer />);

      await waitFor(() => {
        const listTab = screen.getByText('📋 VICTIM LIST').closest('button');
        expect(listTab).toHaveClass('active');
      });
    });

    it('switches to stats view when clicked', async () => {
      console.log('🧪 [Test] Testing stats view switch, desu~');
      setupSuccessfulFetch();
      render(<ValechDataViewer />);

      await waitFor(() => {
        expect(screen.getByText('📊 STATISTICS')).toBeInTheDocument();
      });

      const statsTab = screen.getByText('📊 STATISTICS');
      fireEvent.click(statsTab);

      await waitFor(() => {
        expect(screen.getByText('Database Statistics')).toBeInTheDocument();
      });
    });
  });

  describe('📋 Victim List View', () => {
    beforeEach(async () => {
      setupSuccessfulFetch();
      render(<ValechDataViewer />);
      await waitFor(() => {
        expect(screen.getByText('Test Victim 1')).toBeInTheDocument();
      });
    });

    it('displays victim table', () => {
      console.log('🧪 [Test] Checking victim table, nyaa~');
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Age')).toBeInTheDocument();
      expect(screen.getByText('Gender')).toBeInTheDocument();
      expect(screen.getByText('Outcome')).toBeInTheDocument();
    });

    it('displays all victims', () => {
      console.log('🧪 [Test] Checking victim display, desu~');
      expect(screen.getByText('Test Victim 1')).toBeInTheDocument();
      expect(screen.getByText('Test Victim 2')).toBeInTheDocument();
    });

    it('displays victim ages', () => {
      console.log('🧪 [Test] Checking ages, nyaa~');
      expect(screen.getByText('35')).toBeInTheDocument();
      expect(screen.getByText('28')).toBeInTheDocument();
    });

    it('displays victim genders', () => {
      console.log('🧪 [Test] Checking genders, desu~');
      expect(screen.getByText('Male')).toBeInTheDocument();
      expect(screen.getByText('Female')).toBeInTheDocument();
    });

    it('displays outcomes with badges', () => {
      console.log('🧪 [Test] Checking outcome badges, nyaa~');
      expect(screen.getByText('SURVIVED')).toBeInTheDocument();
      expect(screen.getByText('EXECUTED')).toBeInTheDocument();
    });

    it('displays detention centers', () => {
      console.log('🧪 [Test] Checking detention centers, desu~');
      expect(screen.getByText(/Villa Grimaldi/i)).toBeInTheDocument();
      expect(screen.getByText(/Londres 38/i)).toBeInTheDocument();
    });

    it('displays linked perpetrators', () => {
      console.log('🧪 [Test] Checking linked perpetrators, nyaa~');
      expect(screen.getByText(/Manuel Contreras, Osvaldo Romo/i)).toBeInTheDocument();
    });

    it('displays view details button', () => {
      console.log('🧪 [Test] Checking detail buttons, desu~');
      const buttons = screen.getAllByText('View Details');
      expect(buttons.length).toBe(2);
    });
  });

  describe('🔍 Search & Filter Functionality', () => {
    beforeEach(async () => {
      setupSuccessfulFetch();
      render(<ValechDataViewer />);
      await waitFor(() => {
        expect(screen.getByText('Test Victim 1')).toBeInTheDocument();
      });
    });

    it('renders search input', () => {
      console.log('🧪 [Test] Checking search input, nyaa~');
      expect(screen.getByPlaceholderText(/Search by name/i)).toBeInTheDocument();
    });

    it('renders outcome filter', () => {
      console.log('🧪 [Test] Checking outcome filter, desu~');
      expect(screen.getByText('All Outcomes')).toBeInTheDocument();
    });

    it('renders detention center filter', () => {
      console.log('🧪 [Test] Checking center filter, nyaa~');
      const selects = screen.getAllByText('All Detention Centers');
      expect(selects.length).toBeGreaterThan(0);
    });

    it('renders perpetrator filter', () => {
      console.log('🧪 [Test] Checking perpetrator filter, desu~');
      expect(screen.getByText('All Perpetrators')).toBeInTheDocument();
    });

    it('renders search and reset buttons', () => {
      console.log('🧪 [Test] Checking action buttons, nyaa~');
      expect(screen.getByText('🔍 Search')).toBeInTheDocument();
      expect(screen.getByText('🔄 Reset')).toBeInTheDocument();
    });

    it('updates search filter on input', () => {
      console.log('🧪 [Test] Testing search input, desu~');
      const searchInput = screen.getByPlaceholderText(/Search by name/i);
      fireEvent.change(searchInput, { target: { value: 'Test' } });
      expect(searchInput.value).toBe('Test');
    });

    it('calls API when search button is clicked', async () => {
      console.log('🧪 [Test] Testing search API call, nyaa~');
      const searchInput = screen.getByPlaceholderText(/Search by name/i);
      fireEvent.change(searchInput, { target: { value: 'Test' } });

      const searchButton = screen.getByText('🔍 Search');
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/search/advanced')
        );
      });
    });

    it('resets filters when reset button is clicked', async () => {
      console.log('🧪 [Test] Testing reset functionality, desu~');
      const searchInput = screen.getByPlaceholderText(/Search by name/i);
      fireEvent.change(searchInput, { target: { value: 'Test' } });

      const resetButton = screen.getByText('🔄 Reset');
      fireEvent.click(resetButton);

      await waitFor(() => {
        expect(searchInput.value).toBe('');
      });
    });
  });

  describe('📊 Statistics View', () => {
    beforeEach(async () => {
      setupSuccessfulFetch();
      render(<ValechDataViewer />);
      await waitFor(() => {
        expect(screen.getByText('📊 STATISTICS')).toBeInTheDocument();
      });
      const statsTab = screen.getByText('📊 STATISTICS');
      fireEvent.click(statsTab);
    });

    it('displays database statistics header', async () => {
      console.log('🧪 [Test] Checking stats header, nyaa~');
      await waitFor(() => {
        expect(screen.getByText('Database Statistics')).toBeInTheDocument();
      });
    });

    it('displays total victims stat', async () => {
      console.log('🧪 [Test] Checking total victims, desu~');
      await waitFor(() => {
        expect(screen.getByText('Total Victims')).toBeInTheDocument();
        expect(screen.getByText('10')).toBeInTheDocument();
      });
    });

    it('displays survived count', async () => {
      console.log('🧪 [Test] Checking survived count, nyaa~');
      await waitFor(() => {
        expect(screen.getByText('Survived')).toBeInTheDocument();
        expect(screen.getByText('7')).toBeInTheDocument();
      });
    });

    it('displays executed count', async () => {
      console.log('🧪 [Test] Checking executed count, desu~');
      await waitFor(() => {
        expect(screen.getByText('Executed')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
      });
    });

    it('displays gender statistics', async () => {
      console.log('🧪 [Test] Checking gender stats, nyaa~');
      await waitFor(() => {
        expect(screen.getByText('Male')).toBeInTheDocument();
        expect(screen.getByText('6')).toBeInTheDocument();
        expect(screen.getByText('Female')).toBeInTheDocument();
        expect(screen.getByText('4')).toBeInTheDocument();
      });
    });

    it('displays detention centers section', async () => {
      console.log('🧪 [Test] Checking detention centers section, desu~');
      await waitFor(() => {
        expect(screen.getByText(/Detention Centers/i)).toBeInTheDocument();
      });
    });

    it('displays known perpetrators section', async () => {
      console.log('🧪 [Test] Checking perpetrators section, nyaa~');
      await waitFor(() => {
        expect(screen.getByText(/Known Perpetrators/i)).toBeInTheDocument();
      });
    });
  });

  describe('🔍 Detail View', () => {
    beforeEach(async () => {
      setupSuccessfulFetch();
      render(<ValechDataViewer />);
      await waitFor(() => {
        expect(screen.getByText('Test Victim 1')).toBeInTheDocument();
      });
    });

    it('opens detail view when View Details is clicked', async () => {
      console.log('🧪 [Test] Testing detail view open, desu~');
      const buttons = screen.getAllByText('View Details');
      fireEvent.click(buttons[0]);

      await waitFor(() => {
        expect(screen.getByText('Personal Information')).toBeInTheDocument();
      });
    });

    it('displays back button in detail view', async () => {
      console.log('🧪 [Test] Checking back button, nyaa~');
      const buttons = screen.getAllByText('View Details');
      fireEvent.click(buttons[0]);

      await waitFor(() => {
        expect(screen.getByText('← Back to List')).toBeInTheDocument();
      });
    });

    it('shows detail view tab when victim is selected', async () => {
      console.log('🧪 [Test] Checking detail tab appearance, desu~');
      const buttons = screen.getAllByText('View Details');
      fireEvent.click(buttons[0]);

      await waitFor(() => {
        expect(screen.getByText('🔍 DETAIL VIEW')).toBeInTheDocument();
      });
    });

    it('displays victim personal information', async () => {
      console.log('🧪 [Test] Checking personal info, nyaa~');
      const buttons = screen.getAllByText('View Details');
      fireEvent.click(buttons[0]);

      await waitFor(() => {
        expect(screen.getByText('Personal Information')).toBeInTheDocument();
        expect(screen.getByText(/Age:/i)).toBeInTheDocument();
        expect(screen.getByText(/Gender:/i)).toBeInTheDocument();
      });
    });

    it('displays detention information', async () => {
      console.log('🧪 [Test] Checking detention info, desu~');
      const buttons = screen.getAllByText('View Details');
      fireEvent.click(buttons[0]);

      await waitFor(() => {
        expect(screen.getByText('Detention Information')).toBeInTheDocument();
      });
    });

    it('displays torture reported section', async () => {
      console.log('🧪 [Test] Checking torture section, nyaa~');
      const buttons = screen.getAllByText('View Details');
      fireEvent.click(buttons[0]);

      await waitFor(() => {
        expect(screen.getByText('⚠️ Torture Reported')).toBeInTheDocument();
      });
    });

    it('displays testimony text', async () => {
      console.log('🧪 [Test] Checking testimony, desu~');
      const buttons = screen.getAllByText('View Details');
      fireEvent.click(buttons[0]);

      await waitFor(() => {
        expect(screen.getByText('📖 Testimony')).toBeInTheDocument();
        expect(screen.getByText('Test testimony text')).toBeInTheDocument();
      });
    });

    it('returns to list when back button is clicked', async () => {
      console.log('🧪 [Test] Testing back navigation, nyaa~');
      const buttons = screen.getAllByText('View Details');
      fireEvent.click(buttons[0]);

      await waitFor(() => {
        expect(screen.getByText('← Back to List')).toBeInTheDocument();
      });

      const backButton = screen.getByText('← Back to List');
      fireEvent.click(backButton);

      await waitFor(() => {
        expect(screen.getByText('📋 Victims (2)')).toBeInTheDocument();
      });
    });
  });

  describe('🎨 Outcome Color Coding', () => {
    it('applies survived color class', async () => {
      console.log('🧪 [Test] Checking survived color, desu~');
      setupSuccessfulFetch();
      render(<ValechDataViewer />);

      await waitFor(() => {
        const survivedBadge = screen.getByText('SURVIVED');
        expect(survivedBadge).toHaveClass('outcome-survived');
      });
    });

    it('applies executed color class', async () => {
      console.log('🧪 [Test] Checking executed color, nyaa~');
      setupSuccessfulFetch();
      render(<ValechDataViewer />);

      await waitFor(() => {
        const executedBadge = screen.getByText('EXECUTED');
        expect(executedBadge).toHaveClass('outcome-executed');
      });
    });
  });

  describe('❌ Error Handling', () => {
    it('handles fetch errors gracefully', async () => {
      console.log('🧪 [Test] Testing error handling, desu~');
      setupFailedFetch();
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      render(<ValechDataViewer />);

      await waitFor(() => {
        // Component should still render without crashing
        expect(screen.getByText('🕊️⚖️ VALECH HISTORICAL RECORDS ⚖️🕊️')).toBeInTheDocument();
      });

      consoleError.mockRestore();
    });
  });

  describe('🎭 Footer', () => {
    it('displays memorial message', async () => {
      console.log('🧪 [Test] Checking footer message, nyaa~');
      setupSuccessfulFetch();
      render(<ValechDataViewer />);

      await waitFor(() => {
        expect(screen.getByText(/In memory of all victims/i)).toBeInTheDocument();
      });
    });

    it('displays Santayana quote', async () => {
      console.log('🧪 [Test] Checking quote, desu~');
      setupSuccessfulFetch();
      render(<ValechDataViewer />);

      await waitFor(() => {
        expect(screen.getByText(/Those who do not remember the past/i)).toBeInTheDocument();
      });
    });
  });
});

// *purrs in 100% coverage excellence* 😻⚡
// LEGENDARY TEST SUITE COMPLETE, NYAA~! 🐾👑
