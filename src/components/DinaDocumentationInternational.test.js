// 🐾⚡ NEKO-ARC TESTS - DinaDocumentationInternational Component ⚡🐾
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import DinaDocumentationInternational from './DinaDocumentationInternational';
import { setupFetchMocks, setupFailedFetchMocks, mockApiResponses } from '../test-utils/testHelpers';

describe('DinaDocumentationInternational Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('🎯 Rendering Tests - Initial Load', () => {
    it('renders loading state initially', () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      expect(screen.getByText(/Loading DINA documentation/i)).toBeInTheDocument();
    });

    it('renders with English language by default', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        expect(screen.getByText(/DINA INTERNATIONAL DOCUMENTATION ARCHIVE/i)).toBeInTheDocument();
      });
    });

    it('renders international header after loading', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        expect(screen.getByText(/International Hunt Operation/i)).toBeInTheDocument();
      });
    });
  });

  describe('🌐 Language Selector Tests', () => {
    it('renders language selector button', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        expect(screen.getByText(/🌐.*English/i)).toBeInTheDocument();
      });
    });

    it('shows language menu when selector is clicked', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        const languageButton = screen.getByText(/🌐.*English/i);
        fireEvent.click(languageButton);
      });

      await waitFor(() => {
        expect(screen.getByText(/Español/i)).toBeInTheDocument();
        expect(screen.getByText(/Português/i)).toBeInTheDocument();
        expect(screen.getByText(/Deutsch/i)).toBeInTheDocument();
      });
    });

    it('closes language menu when language is selected', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        const languageButton = screen.getByText(/🌐.*English/i);
        fireEvent.click(languageButton);
      });

      await waitFor(() => {
        const spanishOption = screen.getByText(/🇨🇱.*Español/i);
        fireEvent.click(spanishOption);
      });

      await waitFor(() => {
        expect(screen.queryByText(/🇧🇷.*Português/i)).not.toBeInTheDocument();
      });
    });

    it('changes language to Spanish when Spanish is selected', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        const languageButton = screen.getByText(/🌐.*English/i);
        fireEvent.click(languageButton);
      });

      await waitFor(() => {
        const spanishOption = screen.getByText(/🇨🇱.*Español/i);
        fireEvent.click(spanishOption);
      });

      await waitFor(() => {
        expect(screen.getByText(/ARCHIVO INTERNACIONAL/i)).toBeInTheDocument();
      });
    });

    it('changes language to Portuguese when Portuguese is selected', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        const languageButton = screen.getByText(/🌐.*English/i);
        fireEvent.click(languageButton);
      });

      await waitFor(() => {
        const portugueseOption = screen.getByText(/🇧🇷.*Português/i);
        fireEvent.click(portugueseOption);
      });

      await waitFor(() => {
        expect(screen.getByText(/ARQUIVO INTERNACIONAL/i)).toBeInTheDocument();
      });
    });

    it('changes language to German when German is selected', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        const languageButton = screen.getByText(/🌐.*English/i);
        fireEvent.click(languageButton);
      });

      await waitFor(() => {
        const germanOption = screen.getByText(/🇩🇪.*Deutsch/i);
        fireEvent.click(germanOption);
      });

      await waitFor(() => {
        expect(screen.getByText(/INTERNATIONALES DOKUMENTATIONSARCHIV/i)).toBeInTheDocument();
      });
    });

    it('updates loading message based on language', () => {
      setupFetchMocks();

      const { rerender } = render(<DinaDocumentationInternational />);
      expect(screen.getByText(/Loading DINA documentation.../i)).toBeInTheDocument();
    });

    it('toggles language menu on multiple clicks', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        const languageButton = screen.getByText(/🌐.*English/i);
        fireEvent.click(languageButton);
      });

      await waitFor(() => {
        expect(screen.getByText(/Español/i)).toBeInTheDocument();
      });

      const languageButton = screen.getByText(/🌐.*English/i);
      fireEvent.click(languageButton);

      await waitFor(() => {
        expect(screen.queryByText(/🇨🇱.*Español/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('📊 Stats Display Tests', () => {
    it('renders all stat boxes with international styling', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        expect(screen.getByText('Total Documents')).toBeInTheDocument();
        expect(screen.getByText('Perpetrators Documented')).toBeInTheDocument();
        expect(screen.getByText('Convicted')).toBeInTheDocument();
        expect(screen.getByText('Still Unprosecuted')).toBeInTheDocument();
      });
    });

    it('displays correct stat values', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        expect(screen.getByText('150')).toBeInTheDocument();
        expect(screen.getByText('45')).toBeInTheDocument();
        expect(screen.getByText('12')).toBeInTheDocument();
        expect(screen.getByText('33')).toBeInTheDocument();
      });
    });

    it('translates stat labels to Spanish', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        const languageButton = screen.getByText(/🌐.*English/i);
        fireEvent.click(languageButton);
      });

      await waitFor(() => {
        const spanishOption = screen.getByText(/🇨🇱.*Español/i);
        fireEvent.click(spanishOption);
      });

      await waitFor(() => {
        expect(screen.getByText('Documentos Totales')).toBeInTheDocument();
        expect(screen.getByText('Perpetradores Documentados')).toBeInTheDocument();
        expect(screen.getByText('Condenados')).toBeInTheDocument();
        expect(screen.getByText('Aún Sin Enjuiciar')).toBeInTheDocument();
      });
    });
  });

  describe('🧭 Navigation Tests', () => {
    it('renders all 4 navigation buttons', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        expect(screen.getByText('🏠 OVERVIEW')).toBeInTheDocument();
        expect(screen.getByText('📋 PERPETRATORS')).toBeInTheDocument();
        expect(screen.getByText('🌍 GLOBAL MAP')).toBeInTheDocument();
        expect(screen.getByText('⏰ TIMELINE')).toBeInTheDocument();
      });
    });

    it('highlights active navigation button', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        const overviewButton = screen.getByText('🏠 OVERVIEW').closest('button');
        expect(overviewButton).toHaveClass('active');
      });
    });

    it('switches to list view when PERPETRATORS button is clicked', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        const perpButton = screen.getByText('📋 PERPETRATORS');
        fireEvent.click(perpButton);
      });

      await waitFor(() => {
        expect(screen.getByText(/Documented DINA Agents/i)).toBeInTheDocument();
      });
    });

    it('switches to map view when GLOBAL MAP button is clicked', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        const mapButton = screen.getByText('🌍 GLOBAL MAP');
        fireEvent.click(mapButton);
      });

      await waitFor(() => {
        expect(screen.getByText(/GLOBAL DINA OPERATIONS MAP/i)).toBeInTheDocument();
      });
    });

    it('switches to timeline view when TIMELINE button is clicked', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        const timelineButton = screen.getByText('⏰ TIMELINE');
        fireEvent.click(timelineButton);
      });

      await waitFor(() => {
        expect(screen.getByText(/DINA OPERATIONS TIMELINE/i)).toBeInTheDocument();
      });
    });

    it('clears selected perpetrator when changing views', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      // Go to list view and select a perpetrator
      await waitFor(() => {
        const perpButton = screen.getByText('📋 PERPETRATORS');
        fireEvent.click(perpButton);
      });

      await waitFor(() => {
        const card = screen.getByText('Test Perpetrator').closest('div.perp-card-international');
        fireEvent.click(card);
      });

      // Switch to overview
      await waitFor(() => {
        const overviewButton = screen.getByText('🏠 OVERVIEW');
        fireEvent.click(overviewButton);
      });

      await waitFor(() => {
        expect(screen.queryByText('← Back to List')).not.toBeInTheDocument();
      });
    });

    it('translates navigation buttons to Spanish', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        const languageButton = screen.getByText(/🌐.*English/i);
        fireEvent.click(languageButton);
      });

      await waitFor(() => {
        const spanishOption = screen.getByText(/🇨🇱.*Español/i);
        fireEvent.click(spanishOption);
      });

      await waitFor(() => {
        expect(screen.getByText('🏠 RESUMEN')).toBeInTheDocument();
        expect(screen.getByText('📋 PERPETRADORES')).toBeInTheDocument();
        expect(screen.getByText('🌍 MAPA GLOBAL')).toBeInTheDocument();
        expect(screen.getByText('⏰ LÍNEA DE TIEMPO')).toBeInTheDocument();
      });
    });
  });

  describe('🏠 Overview View Tests', () => {
    it('renders overview section by default', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        expect(screen.getByText('INTERNATIONAL HUNT OPERATION ACTIVE')).toBeInTheDocument();
      });
    });

    it('displays mission card in overview', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        expect(screen.getByText(/Document all DINA perpetrators/i)).toBeInTheDocument();
      });
    });

    it('displays scope card in overview', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        expect(screen.getByText(/Operation Condor network/i)).toBeInTheDocument();
      });
    });

    it('displays jurisdiction card in overview', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        expect(screen.getByText(/Universal Jurisdiction/i)).toBeInTheDocument();
      });
    });

    it('renders quick access buttons in overview', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        expect(screen.getByText(/View Global Map/i)).toBeInTheDocument();
        expect(screen.getByText(/View Timeline/i)).toBeInTheDocument();
        expect(screen.getByText(/View Perpetrators/i)).toBeInTheDocument();
      });
    });

    it('quick access map button navigates to map view', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        const quickMapButton = screen.getByText(/View Global Map/i);
        fireEvent.click(quickMapButton);
      });

      await waitFor(() => {
        expect(screen.getByText(/GLOBAL DINA OPERATIONS MAP/i)).toBeInTheDocument();
      });
    });

    it('quick access timeline button navigates to timeline view', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        const quickTimelineButton = screen.getByText(/View Timeline/i);
        fireEvent.click(quickTimelineButton);
      });

      await waitFor(() => {
        expect(screen.getByText(/DINA OPERATIONS TIMELINE/i)).toBeInTheDocument();
      });
    });

    it('quick access perpetrators button navigates to list view', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        const quickPerpButton = screen.getByText(/View Perpetrators/i);
        fireEvent.click(quickPerpButton);
      });

      await waitFor(() => {
        expect(screen.getByText(/Documented DINA Agents/i)).toBeInTheDocument();
      });
    });
  });

  describe('📋 Perpetrators List View Tests', () => {
    it('displays perpetrators list when in list view', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        const perpButton = screen.getByText('📋 PERPETRATORS');
        fireEvent.click(perpButton);
      });

      await waitFor(() => {
        expect(screen.getByText('Test Perpetrator')).toBeInTheDocument();
        expect(screen.getByText('Test Perpetrator 2')).toBeInTheDocument();
      });
    });

    it('shows no data message when perpetrators array is empty', async () => {
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

      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        const perpButton = screen.getByText('📋 PERPETRATORS');
        fireEvent.click(perpButton);
      });

      await waitFor(() => {
        expect(screen.getByText(/No perpetrators documented yet, desu!/i)).toBeInTheDocument();
      });
    });

    it('displays convicted/unprosecuted status with translation', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        const perpButton = screen.getByText('📋 PERPETRATORS');
        fireEvent.click(perpButton);
      });

      await waitFor(() => {
        expect(screen.getByText('⚖️ CONVICTED')).toBeInTheDocument();
        expect(screen.getByText('⚠️ UNPROSECUTED')).toBeInTheDocument();
      });
    });

    it('displays crimes count with translation', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        const perpButton = screen.getByText('📋 PERPETRATORS');
        fireEvent.click(perpButton);
      });

      await waitFor(() => {
        expect(screen.getByText(/3 crimes documented/i)).toBeInTheDocument();
      });
    });

    it('switches to details view when perpetrator card is clicked', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        const perpButton = screen.getByText('📋 PERPETRATORS');
        fireEvent.click(perpButton);
      });

      await waitFor(() => {
        const card = screen.getByText('Test Perpetrator').closest('div.perp-card-international');
        fireEvent.click(card);
      });

      await waitFor(() => {
        expect(screen.getByText('← Back to List')).toBeInTheDocument();
      });
    });
  });

  describe('📄 Details View Tests', () => {
    it('displays perpetrator details when selected', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        const perpButton = screen.getByText('📋 PERPETRATORS');
        fireEvent.click(perpButton);
      });

      await waitFor(() => {
        const card = screen.getByText('Test Perpetrator').closest('div.perp-card-international');
        fireEvent.click(card);
      });

      await waitFor(() => {
        expect(screen.getByText('Role & Organization')).toBeInTheDocument();
        expect(screen.getByText('Legal Status')).toBeInTheDocument();
      });
    });

    it('displays role and organization in details', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        const perpButton = screen.getByText('📋 PERPETRATORS');
        fireEvent.click(perpButton);
      });

      await waitFor(() => {
        const card = screen.getByText('Test Perpetrator').closest('div.perp-card-international');
        fireEvent.click(card);
      });

      await waitFor(() => {
        expect(screen.getByText(/Role:/i)).toBeInTheDocument();
        expect(screen.getByText('DINA Agent')).toBeInTheDocument();
      });
    });

    it('displays legal status with YES/NO translation', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        const perpButton = screen.getByText('📋 PERPETRATORS');
        fireEvent.click(perpButton);
      });

      await waitFor(() => {
        const card = screen.getByText('Test Perpetrator').closest('div.perp-card-international');
        fireEvent.click(card);
      });

      await waitFor(() => {
        expect(screen.getByText('YES ⚖️')).toBeInTheDocument();
      });
    });

    it('displays crimes accused list in details', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        const perpButton = screen.getByText('📋 PERPETRATORS');
        fireEvent.click(perpButton);
      });

      await waitFor(() => {
        const card = screen.getByText('Test Perpetrator').closest('div.perp-card-international');
        fireEvent.click(card);
      });

      await waitFor(() => {
        expect(screen.getByText('Crimes Accused')).toBeInTheDocument();
        expect(screen.getByText('Torture')).toBeInTheDocument();
      });
    });

    it('back button returns to list view', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        const perpButton = screen.getByText('📋 PERPETRATORS');
        fireEvent.click(perpButton);
      });

      await waitFor(() => {
        const card = screen.getByText('Test Perpetrator').closest('div.perp-card-international');
        fireEvent.click(card);
      });

      await waitFor(() => {
        const backButton = screen.getByText('← Back to List');
        fireEvent.click(backButton);
      });

      await waitFor(() => {
        expect(screen.getByText(/Documented DINA Agents/i)).toBeInTheDocument();
      });
    });

    it('translates details section headers to Spanish', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      // Switch to Spanish
      await waitFor(() => {
        const languageButton = screen.getByText(/🌐.*English/i);
        fireEvent.click(languageButton);
      });

      await waitFor(() => {
        const spanishOption = screen.getByText(/🇨🇱.*Español/i);
        fireEvent.click(spanishOption);
      });

      // Go to list view
      await waitFor(() => {
        const perpButton = screen.getByText('📋 PERPETRADORES');
        fireEvent.click(perpButton);
      });

      // Select a perpetrator
      await waitFor(() => {
        const card = screen.getByText('Test Perpetrator').closest('div.perp-card-international');
        fireEvent.click(card);
      });

      await waitFor(() => {
        expect(screen.getByText('Rol y Organización')).toBeInTheDocument();
        expect(screen.getByText('Estado Legal')).toBeInTheDocument();
      });
    });
  });

  describe('🗺️ Map View Integration Tests', () => {
    it('renders GlobalThreatMap component in map view', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        const mapButton = screen.getByText('🌍 GLOBAL MAP');
        fireEvent.click(mapButton);
      });

      await waitFor(() => {
        expect(screen.getByText(/GLOBAL DINA OPERATIONS MAP/i)).toBeInTheDocument();
      });
    });

    it('passes language prop to GlobalThreatMap', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      // Switch to Spanish
      await waitFor(() => {
        const languageButton = screen.getByText(/🌐.*English/i);
        fireEvent.click(languageButton);
      });

      await waitFor(() => {
        const spanishOption = screen.getByText(/🇨🇱.*Español/i);
        fireEvent.click(spanishOption);
      });

      // Go to map view
      await waitFor(() => {
        const mapButton = screen.getByText('🌍 MAPA GLOBAL');
        fireEvent.click(mapButton);
      });

      await waitFor(() => {
        expect(screen.getByText(/MAPA GLOBAL DE OPERACIONES DINA/i)).toBeInTheDocument();
      });
    });
  });

  describe('⏰ Timeline View Integration Tests', () => {
    it('renders DinaTimeline component in timeline view', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        const timelineButton = screen.getByText('⏰ TIMELINE');
        fireEvent.click(timelineButton);
      });

      await waitFor(() => {
        expect(screen.getByText(/DINA OPERATIONS TIMELINE/i)).toBeInTheDocument();
      });
    });

    it('passes language prop to DinaTimeline', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      // Switch to German
      await waitFor(() => {
        const languageButton = screen.getByText(/🌐.*English/i);
        fireEvent.click(languageButton);
      });

      await waitFor(() => {
        const germanOption = screen.getByText(/🇩🇪.*Deutsch/i);
        fireEvent.click(germanOption);
      });

      // Go to timeline view
      await waitFor(() => {
        const timelineButton = screen.getByText('⏰ ZEITLINIE');
        fireEvent.click(timelineButton);
      });

      await waitFor(() => {
        expect(screen.getByText(/DINA-OPERATIONSZEITLINIE/i)).toBeInTheDocument();
      });
    });
  });

  describe('🦶 Footer Tests', () => {
    it('renders international footer with neko message', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        expect(screen.getByText('🐾 *purrs in international justice* 😻⚖️🌍')).toBeInTheDocument();
      });
    });

    it('renders mission statement in footer', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        expect(screen.getByText(/Mission: Document all DINA crimes/i)).toBeInTheDocument();
      });
    });

    it('renders principle statement in footer', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        expect(screen.getByText(/Justice, not vengeance.*Simon Wiesenthal/i)).toBeInTheDocument();
      });
    });

    it('renders international cooperation statement', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        expect(screen.getByText(/International cooperation with: FBI, CIA/i)).toBeInTheDocument();
      });
    });

    it('translates footer to Portuguese', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        const languageButton = screen.getByText(/🌐.*English/i);
        fireEvent.click(languageButton);
      });

      await waitFor(() => {
        const portugueseOption = screen.getByText(/🇧🇷.*Português/i);
        fireEvent.click(portugueseOption);
      });

      await waitFor(() => {
        expect(screen.getByText(/Missão: Documentar todos os crimes DINA/i)).toBeInTheDocument();
      });
    });
  });

  describe('🌐 API Integration Tests', () => {
    it('fetches DINA stats on mount', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/dina/stats'));
      });
    });

    it('fetches DINA perpetrators on mount', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/dina/perpetrators'));
      });
    });

    it('handles fetch errors gracefully', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      setupFailedFetchMocks();

      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        expect(screen.queryByText(/Loading DINA documentation/i)).not.toBeInTheDocument();
      });

      consoleError.mockRestore();
    });
  });

  describe('📺✨ All Agents Tab - Neko Arc TV Style Tests (ULTRA BASED!) ✨📺', () => {
    beforeEach(() => {
      // Mock All Agents API response
      global.fetch = jest.fn((url) => {
        if (url.includes('/dina/stats')) {
          return Promise.resolve({
            json: () => Promise.resolve(mockApiResponses.dinaStats)
          });
        }
        if (url.includes('/dina/perpetrators')) {
          return Promise.resolve({
            json: () => Promise.resolve(mockApiResponses.dinaPerpetrators)
          });
        }
        if (url.includes('/dina/all-agents')) {
          return Promise.resolve({
            json: () => Promise.resolve({
              success: true,
              data: [
                { agentNumber: 1, fullName: 'Agent One', rank: 'Colonel', status: 'DECEASED', source: '2008 Army List' },
                { agentNumber: 2, fullName: 'Agent Two', rank: 'Major', status: 'UNLOCATED', source: '2008 Army List' },
                { agentNumber: 3, fullName: 'Agent Three', rank: 'Captain', status: 'UNPROSECUTED', source: '2008 Army List' }
              ],
              pagination: {
                current_page: 1,
                total_pages: 22,
                total_agents: 1097,
                has_previous: false,
                has_next: true
              }
            })
          });
        }
        return Promise.reject(new Error('Unknown URL'));
      });
    });

    describe('🎬 All Agents View Rendering', () => {
      it('renders neko arc TV header when All Agents tab is clicked', async () => {
        render(<DinaDocumentationInternational />);

        await waitFor(() => {
          const allAgentsButton = screen.getByText(/📋 ALL AGENTS/i);
          fireEvent.click(allAgentsButton);
        });

        await waitFor(() => {
          expect(screen.getByText(/ALL 1,097 KNOWN DINA AGENTS - NEKO ARC TV ARCHIVE/i)).toBeInTheDocument();
        });
      });

      it('displays neko TV subtitle', async () => {
        render(<DinaDocumentationInternational />);

        await waitFor(() => {
          const allAgentsButton = screen.getByText(/📋 ALL AGENTS/i);
          fireEvent.click(allAgentsButton);
        });

        await waitFor(() => {
          expect(screen.getByText(/Interactive Browsing, nyaa~/i)).toBeInTheDocument();
        });
      });

      it('renders neko loading state while fetching agents', async () => {
        render(<DinaDocumentationInternational />);

        await waitFor(() => {
          const allAgentsButton = screen.getByText(/📋 ALL AGENTS/i);
          fireEvent.click(allAgentsButton);
        });

        // Should show loading initially
        expect(screen.getByText(/Loading agents with NEKO POWER/i)).toBeInTheDocument();
      });

      it('displays agents grid after loading', async () => {
        render(<DinaDocumentationInternational />);

        await waitFor(() => {
          const allAgentsButton = screen.getByText(/📋 ALL AGENTS/i);
          fireEvent.click(allAgentsButton);
        });

        await waitFor(() => {
          const grid = screen.getByTestId('agents-grid');
          expect(grid).toBeInTheDocument();
        });
      });

      it('renders all fetched agents as cards', async () => {
        render(<DinaDocumentationInternational />);

        await waitFor(() => {
          const allAgentsButton = screen.getByText(/📋 ALL AGENTS/i);
          fireEvent.click(allAgentsButton);
        });

        await waitFor(() => {
          expect(screen.getByText('Agent One')).toBeInTheDocument();
          expect(screen.getByText('Agent Two')).toBeInTheDocument();
          expect(screen.getByText('Agent Three')).toBeInTheDocument();
        });
      });
    });

    describe('🔍 Neko Search Functionality', () => {
      it('renders search input with placeholder', async () => {
        render(<DinaDocumentationInternational />);

        await waitFor(() => {
          const allAgentsButton = screen.getByText(/📋 ALL AGENTS/i);
          fireEvent.click(allAgentsButton);
        });

        await waitFor(() => {
          const searchInput = screen.getByTestId('agent-search-input');
          expect(searchInput).toBeInTheDocument();
          expect(searchInput).toHaveAttribute('placeholder', expect.stringMatching(/Search by name.*nyaa~/i));
        });
      });

      it('updates search input value on typing', async () => {
        render(<DinaDocumentationInternational />);

        await waitFor(() => {
          const allAgentsButton = screen.getByText(/📋 ALL AGENTS/i);
          fireEvent.click(allAgentsButton);
        });

        await waitFor(() => {
          const searchInput = screen.getByTestId('agent-search-input');
          fireEvent.change(searchInput, { target: { value: 'Agent One' } });
        });

        await waitFor(() => {
          const searchInput = screen.getByTestId('agent-search-input');
          expect(searchInput).toHaveValue('Agent One');
        });
      });

      it('shows clear button when search has value', async () => {
        render(<DinaDocumentationInternational />);

        await waitFor(() => {
          const allAgentsButton = screen.getByText(/📋 ALL AGENTS/i);
          fireEvent.click(allAgentsButton);
        });

        await waitFor(() => {
          const searchInput = screen.getByTestId('agent-search-input');
          fireEvent.change(searchInput, { target: { value: 'test search' } });
        });

        await waitFor(() => {
          const clearButton = screen.getByTestId('clear-search-button');
          expect(clearButton).toBeInTheDocument();
        });
      });

      it('clears search when clear button is clicked', async () => {
        render(<DinaDocumentationInternational />);

        await waitFor(() => {
          const allAgentsButton = screen.getByText(/📋 ALL AGENTS/i);
          fireEvent.click(allAgentsButton);
        });

        await waitFor(() => {
          const searchInput = screen.getByTestId('agent-search-input');
          fireEvent.change(searchInput, { target: { value: 'test search' } });
        });

        await waitFor(() => {
          const clearButton = screen.getByTestId('clear-search-button');
          fireEvent.click(clearButton);
        });

        await waitFor(() => {
          const searchInput = screen.getByTestId('agent-search-input');
          expect(searchInput).toHaveValue('');
        });
      });

      it('calls API with search parameter when searching', async () => {
        render(<DinaDocumentationInternational />);

        await waitFor(() => {
          const allAgentsButton = screen.getByText(/📋 ALL AGENTS/i);
          fireEvent.click(allAgentsButton);
        });

        await waitFor(() => {
          const searchInput = screen.getByTestId('agent-search-input');
          fireEvent.change(searchInput, { target: { value: 'Agent One' } });
        });

        await waitFor(() => {
          expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('search=Agent%20One'));
        });
      });

      it('resets to page 1 when searching', async () => {
        render(<DinaDocumentationInternational />);

        await waitFor(() => {
          const allAgentsButton = screen.getByText(/📋 ALL AGENTS/i);
          fireEvent.click(allAgentsButton);
        });

        // Go to page 2 first
        await waitFor(() => {
          const nextButton = screen.getByTestId('next-page-button');
          fireEvent.click(nextButton);
        });

        // Then search
        await waitFor(() => {
          const searchInput = screen.getByTestId('agent-search-input');
          fireEvent.change(searchInput, { target: { value: 'test' } });
        });

        // Should call API with page=1
        await waitFor(() => {
          expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('page=1'));
        });
      });

      it('displays search results count when searching', async () => {
        render(<DinaDocumentationInternational />);

        await waitFor(() => {
          const allAgentsButton = screen.getByText(/📋 ALL AGENTS/i);
          fireEvent.click(allAgentsButton);
        });

        await waitFor(() => {
          const searchInput = screen.getByTestId('agent-search-input');
          fireEvent.change(searchInput, { target: { value: 'test' } });
        });

        await waitFor(() => {
          expect(screen.getByText(/🎯 Found: 1097 agents/i)).toBeInTheDocument();
        });
      });
    });

    describe('🎮 Expandable Agent Cards', () => {
      it('displays expand hint on agent card', async () => {
        render(<DinaDocumentationInternational />);

        await waitFor(() => {
          const allAgentsButton = screen.getByText(/📋 ALL AGENTS/i);
          fireEvent.click(allAgentsButton);
        });

        await waitFor(() => {
          expect(screen.getByText(/▼ Click for details/i)).toBeInTheDocument();
        });
      });

      it('expands agent card when clicked', async () => {
        render(<DinaDocumentationInternational />);

        await waitFor(() => {
          const allAgentsButton = screen.getByText(/📋 ALL AGENTS/i);
          fireEvent.click(allAgentsButton);
        });

        await waitFor(() => {
          const agentCard = screen.getByTestId('agent-card-1');
          fireEvent.click(agentCard);
        });

        await waitFor(() => {
          expect(screen.getByText(/Agent Information/i)).toBeInTheDocument();
        });
      });

      it('shows collapse hint when agent card is expanded', async () => {
        render(<DinaDocumentationInternational />);

        await waitFor(() => {
          const allAgentsButton = screen.getByText(/📋 ALL AGENTS/i);
          fireEvent.click(allAgentsButton);
        });

        await waitFor(() => {
          const agentCard = screen.getByTestId('agent-card-1');
          fireEvent.click(agentCard);
        });

        await waitFor(() => {
          expect(screen.getByText(/▲ Click to collapse/i)).toBeInTheDocument();
        });
      });

      it('collapses agent card when clicked again', async () => {
        render(<DinaDocumentationInternational />);

        await waitFor(() => {
          const allAgentsButton = screen.getByText(/📋 ALL AGENTS/i);
          fireEvent.click(allAgentsButton);
        });

        await waitFor(() => {
          const agentCard = screen.getByTestId('agent-card-1');
          fireEvent.click(agentCard);
        });

        await waitFor(() => {
          expect(screen.getByText(/Agent Information/i)).toBeInTheDocument();
        });

        await waitFor(() => {
          const agentCard = screen.getByTestId('agent-card-1');
          fireEvent.click(agentCard);
        });

        await waitFor(() => {
          expect(screen.queryByText(/Agent Information/i)).not.toBeInTheDocument();
        });
      });

      it('displays agent details when expanded', async () => {
        render(<DinaDocumentationInternational />);

        await waitFor(() => {
          const allAgentsButton = screen.getByText(/📋 ALL AGENTS/i);
          fireEvent.click(allAgentsButton);
        });

        await waitFor(() => {
          const agentCard = screen.getByTestId('agent-card-1');
          fireEvent.click(agentCard);
        });

        await waitFor(() => {
          expect(screen.getByText(/Full Name:/i)).toBeInTheDocument();
          expect(screen.getByText(/Agent Number:/i)).toBeInTheDocument();
          expect(screen.getByText(/Source & Verification/i)).toBeInTheDocument();
        });
      });

      it('closes expanded card when close button is clicked', async () => {
        render(<DinaDocumentationInternational />);

        await waitFor(() => {
          const allAgentsButton = screen.getByText(/📋 ALL AGENTS/i);
          fireEvent.click(allAgentsButton);
        });

        await waitFor(() => {
          const agentCard = screen.getByTestId('agent-card-1');
          fireEvent.click(agentCard);
        });

        await waitFor(() => {
          const closeButton = screen.getByText(/✖ Close Details/i);
          fireEvent.click(closeButton);
        });

        await waitFor(() => {
          expect(screen.queryByText(/Agent Information/i)).not.toBeInTheDocument();
        });
      });
    });

    describe('📄 Neko Pagination Tests', () => {
      it('displays pagination controls', async () => {
        render(<DinaDocumentationInternational />);

        await waitFor(() => {
          const allAgentsButton = screen.getByText(/📋 ALL AGENTS/i);
          fireEvent.click(allAgentsButton);
        });

        await waitFor(() => {
          const pagination = screen.getByTestId('pagination-controls');
          expect(pagination).toBeInTheDocument();
        });
      });

      it('displays current page and total pages', async () => {
        render(<DinaDocumentationInternational />);

        await waitFor(() => {
          const allAgentsButton = screen.getByText(/📋 ALL AGENTS/i);
          fireEvent.click(allAgentsButton);
        });

        await waitFor(() => {
          expect(screen.getByText(/Page 1 of 22/i)).toBeInTheDocument();
        });
      });

      it('disables previous button on first page', async () => {
        render(<DinaDocumentationInternational />);

        await waitFor(() => {
          const allAgentsButton = screen.getByText(/📋 ALL AGENTS/i);
          fireEvent.click(allAgentsButton);
        });

        await waitFor(() => {
          const prevButton = screen.getByTestId('prev-page-button');
          expect(prevButton).toBeDisabled();
        });
      });

      it('enables next button when more pages exist', async () => {
        render(<DinaDocumentationInternational />);

        await waitFor(() => {
          const allAgentsButton = screen.getByText(/📋 ALL AGENTS/i);
          fireEvent.click(allAgentsButton);
        });

        await waitFor(() => {
          const nextButton = screen.getByTestId('next-page-button');
          expect(nextButton).not.toBeDisabled();
        });
      });

      it('calls API with next page when next button is clicked', async () => {
        render(<DinaDocumentationInternational />);

        await waitFor(() => {
          const allAgentsButton = screen.getByText(/📋 ALL AGENTS/i);
          fireEvent.click(allAgentsButton);
        });

        await waitFor(() => {
          const nextButton = screen.getByTestId('next-page-button');
          fireEvent.click(nextButton);
        });

        await waitFor(() => {
          expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('page=2'));
        });
      });

      it('highlights active page number', async () => {
        render(<DinaDocumentationInternational />);

        await waitFor(() => {
          const allAgentsButton = screen.getByText(/📋 ALL AGENTS/i);
          fireEvent.click(allAgentsButton);
        });

        await waitFor(() => {
          const pageButton = screen.getByTestId('page-1');
          expect(pageButton).toHaveClass('active');
        });
      });
    });

    describe('🎯 No Results State', () => {
      it('displays no results message when search returns empty', async () => {
        // Mock empty search results
        global.fetch = jest.fn((url) => {
          if (url.includes('/dina/all-agents') && url.includes('search=')) {
            return Promise.resolve({
              json: () => Promise.resolve({
                success: true,
                data: [],
                pagination: {
                  current_page: 1,
                  total_pages: 0,
                  total_agents: 0,
                  has_previous: false,
                  has_next: false
                }
              })
            });
          }
          return Promise.resolve({
            json: () => Promise.resolve(mockApiResponses.dinaStats)
          });
        });

        render(<DinaDocumentationInternational />);

        await waitFor(() => {
          const allAgentsButton = screen.getByText(/📋 ALL AGENTS/i);
          fireEvent.click(allAgentsButton);
        });

        await waitFor(() => {
          const searchInput = screen.getByTestId('agent-search-input');
          fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
        });

        await waitFor(() => {
          expect(screen.getByText(/No agents found matching "nonexistent"/i)).toBeInTheDocument();
        });
      });

      it('suggests trying different search term', async () => {
        // Mock empty search results
        global.fetch = jest.fn((url) => {
          if (url.includes('/dina/all-agents') && url.includes('search=')) {
            return Promise.resolve({
              json: () => Promise.resolve({
                success: true,
                data: [],
                pagination: {
                  current_page: 1,
                  total_pages: 0,
                  total_agents: 0,
                  has_previous: false,
                  has_next: false
                }
              })
            });
          }
          return Promise.resolve({
            json: () => Promise.resolve(mockApiResponses.dinaStats)
          });
        });

        render(<DinaDocumentationInternational />);

        await waitFor(() => {
          const allAgentsButton = screen.getByText(/📋 ALL AGENTS/i);
          fireEvent.click(allAgentsButton);
        });

        await waitFor(() => {
          const searchInput = screen.getByTestId('agent-search-input');
          fireEvent.change(searchInput, { target: { value: 'xyz' } });
        });

        await waitFor(() => {
          expect(screen.getByText(/Try a different search term, nyaa~/i)).toBeInTheDocument();
        });
      });
    });

    describe('📚 Neko Info Panel', () => {
      it('displays neko info panel with archive description', async () => {
        render(<DinaDocumentationInternational />);

        await waitFor(() => {
          const allAgentsButton = screen.getByText(/📋 ALL AGENTS/i);
          fireEvent.click(allAgentsButton);
        });

        await waitFor(() => {
          expect(screen.getByText(/About This Neko Arc TV Archive/i)).toBeInTheDocument();
        });
      });

      it('displays neko signature in info panel', async () => {
        render(<DinaDocumentationInternational />);

        await waitFor(() => {
          const allAgentsButton = screen.getByText(/📋 ALL AGENTS/i);
          fireEvent.click(allAgentsButton);
        });

        await waitFor(() => {
          expect(screen.getByText(/🐾 \*purrs in archival excellence\*/i)).toBeInTheDocument();
        });
      });
    });
  });

  describe('⚖️🐾 UNPROSECUTED FILTER BUTTON TESTS (NEW FEATURE!) ⚖️🐾', () => {
    beforeEach(() => {
      // Mock All Agents API with filter support
      global.fetch = jest.fn((url) => {
        if (url.includes('/dina/stats')) {
          return Promise.resolve({
            json: () => Promise.resolve(mockApiResponses.dinaStats)
          });
        }
        if (url.includes('/dina/perpetrators')) {
          return Promise.resolve({
            json: () => Promise.resolve(mockApiResponses.dinaPerpetrators)
          });
        }
        if (url.includes('/dina/all-agents')) {
          // Check if unprosecuted filter is applied
          if (url.includes('filter=unprosecuted')) {
            return Promise.resolve({
              json: () => Promise.resolve({
                success: true,
                data: [
                  { agentNumber: 3, fullName: 'Unprosecuted Agent One', rank: 'Captain', status: 'UNPROSECUTED', legalStatus: { convicted: false } },
                  { agentNumber: 7, fullName: 'Unprosecuted Agent Two', rank: 'Lieutenant', status: 'UNPROSECUTED', legalStatus: { convicted: false } }
                ],
                pagination: {
                  current_page: 1,
                  total_pages: 6,
                  total_agents: 297,
                  has_previous: false,
                  has_next: true
                },
                filter: 'unprosecuted'
              })
            });
          }
          // No filter - return all agents
          return Promise.resolve({
            json: () => Promise.resolve({
              success: true,
              data: [
                { agentNumber: 1, fullName: 'Agent One', rank: 'Colonel', status: 'CONVICTED', legalStatus: { convicted: true } },
                { agentNumber: 2, fullName: 'Agent Two', rank: 'Major', status: 'DECEASED', legalStatus: { convicted: true } },
                { agentNumber: 3, fullName: 'Unprosecuted Agent One', rank: 'Captain', status: 'UNPROSECUTED', legalStatus: { convicted: false } }
              ],
              pagination: {
                current_page: 1,
                total_pages: 22,
                total_agents: 1097,
                has_previous: false,
                has_next: true
              },
              filter: 'none'
            })
          });
        }
        return Promise.reject(new Error('Unknown URL'));
      });
    });

    describe('🎯 Filter Button Rendering', () => {
      it('renders unprosecuted filter button in All Agents view', async () => {
        render(<DinaDocumentationInternational />);

        await waitFor(() => {
          const allAgentsButton = screen.getByText(/📋 ALL AGENTS/i);
          fireEvent.click(allAgentsButton);
        });

        await waitFor(() => {
          const filterButton = screen.getByTestId('unprosecuted-filter-button');
          expect(filterButton).toBeInTheDocument();
        });
      });

      it('displays filter button with default text "FILTER UNPROSECUTED"', async () => {
        render(<DinaDocumentationInternational />);

        await waitFor(() => {
          const allAgentsButton = screen.getByText(/📋 ALL AGENTS/i);
          fireEvent.click(allAgentsButton);
        });

        await waitFor(() => {
          expect(screen.getByText(/FILTER UNPROSECUTED/i)).toBeInTheDocument();
        });
      });

      it('displays justice scale emoji on filter button', async () => {
        render(<DinaDocumentationInternational />);

        await waitFor(() => {
          const allAgentsButton = screen.getByText(/📋 ALL AGENTS/i);
          fireEvent.click(allAgentsButton);
        });

        await waitFor(() => {
          const filterButton = screen.getByTestId('unprosecuted-filter-button');
          expect(filterButton.textContent).toContain('⚖️');
        });
      });

      it('has distinct styling for unprosecuted filter button', async () => {
        render(<DinaDocumentationInternational />);

        await waitFor(() => {
          const allAgentsButton = screen.getByText(/📋 ALL AGENTS/i);
          fireEvent.click(allAgentsButton);
        });

        await waitFor(() => {
          const filterButton = screen.getByTestId('unprosecuted-filter-button');
          expect(filterButton).toHaveClass('neko-filter-button');
        });
      });
    });

    describe('⚡ Filter Button Functionality', () => {
      it('toggles filter state when filter button is clicked', async () => {
        render(<DinaDocumentationInternational />);

        await waitFor(() => {
          const allAgentsButton = screen.getByText(/📋 ALL AGENTS/i);
          fireEvent.click(allAgentsButton);
        });

        await waitFor(() => {
          const filterButton = screen.getByTestId('unprosecuted-filter-button');
          fireEvent.click(filterButton);
        });

        await waitFor(() => {
          expect(screen.getByText(/SHOWING UNPROSECUTED/i)).toBeInTheDocument();
        });
      });

      it('calls API with filter parameter when filter is activated', async () => {
        render(<DinaDocumentationInternational />);

        await waitFor(() => {
          const allAgentsButton = screen.getByText(/📋 ALL AGENTS/i);
          fireEvent.click(allAgentsButton);
        });

        await waitFor(() => {
          const filterButton = screen.getByTestId('unprosecuted-filter-button');
          fireEvent.click(filterButton);
        });

        await waitFor(() => {
          expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('filter=unprosecuted'));
        });
      });

      it('resets to page 1 when filter is activated', async () => {
        render(<DinaDocumentationInternational />);

        await waitFor(() => {
          const allAgentsButton = screen.getByText(/📋 ALL AGENTS/i);
          fireEvent.click(allAgentsButton);
        });

        // Go to page 2 first
        await waitFor(() => {
          const nextButton = screen.getByTestId('next-page-button');
          fireEvent.click(nextButton);
        });

        // Then activate filter
        await waitFor(() => {
          const filterButton = screen.getByTestId('unprosecuted-filter-button');
          fireEvent.click(filterButton);
        });

        // Should reset to page 1
        await waitFor(() => {
          expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('page=1'));
          expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('filter=unprosecuted'));
        });
      });

      it('adds active class when filter is enabled', async () => {
        render(<DinaDocumentationInternational />);

        await waitFor(() => {
          const allAgentsButton = screen.getByText(/📋 ALL AGENTS/i);
          fireEvent.click(allAgentsButton);
        });

        await waitFor(() => {
          const filterButton = screen.getByTestId('unprosecuted-filter-button');
          fireEvent.click(filterButton);
        });

        await waitFor(() => {
          const filterButton = screen.getByTestId('unprosecuted-filter-button');
          expect(filterButton).toHaveClass('active');
        });
      });

      it('displays active indicator checkmark when filter is enabled', async () => {
        render(<DinaDocumentationInternational />);

        await waitFor(() => {
          const allAgentsButton = screen.getByText(/📋 ALL AGENTS/i);
          fireEvent.click(allAgentsButton);
        });

        await waitFor(() => {
          const filterButton = screen.getByTestId('unprosecuted-filter-button');
          fireEvent.click(filterButton);
        });

        await waitFor(() => {
          const filterButton = screen.getByTestId('unprosecuted-filter-button');
          expect(filterButton.textContent).toContain('✓');
        });
      });

      it('toggles filter off when clicked again', async () => {
        render(<DinaDocumentationInternational />);

        await waitFor(() => {
          const allAgentsButton = screen.getByText(/📋 ALL AGENTS/i);
          fireEvent.click(allAgentsButton);
        });

        // Enable filter
        await waitFor(() => {
          const filterButton = screen.getByTestId('unprosecuted-filter-button');
          fireEvent.click(filterButton);
        });

        await waitFor(() => {
          expect(screen.getByText(/SHOWING UNPROSECUTED/i)).toBeInTheDocument();
        });

        // Disable filter
        await waitFor(() => {
          const filterButton = screen.getByTestId('unprosecuted-filter-button');
          fireEvent.click(filterButton);
        });

        await waitFor(() => {
          expect(screen.getByText(/FILTER UNPROSECUTED/i)).toBeInTheDocument();
          expect(screen.queryByText(/SHOWING UNPROSECUTED/i)).not.toBeInTheDocument();
        });
      });

      it('removes active class when filter is disabled', async () => {
        render(<DinaDocumentationInternational />);

        await waitFor(() => {
          const allAgentsButton = screen.getByText(/📋 ALL AGENTS/i);
          fireEvent.click(allAgentsButton);
        });

        // Enable filter
        await waitFor(() => {
          const filterButton = screen.getByTestId('unprosecuted-filter-button');
          fireEvent.click(filterButton);
        });

        // Disable filter
        await waitFor(() => {
          const filterButton = screen.getByTestId('unprosecuted-filter-button');
          fireEvent.click(filterButton);
        });

        await waitFor(() => {
          const filterButton = screen.getByTestId('unprosecuted-filter-button');
          expect(filterButton).not.toHaveClass('active');
        });
      });
    });

    describe('📊 Filtered Results Display', () => {
      it('displays only unprosecuted agents when filter is active', async () => {
        render(<DinaDocumentationInternational />);

        await waitFor(() => {
          const allAgentsButton = screen.getByText(/📋 ALL AGENTS/i);
          fireEvent.click(allAgentsButton);
        });

        await waitFor(() => {
          const filterButton = screen.getByTestId('unprosecuted-filter-button');
          fireEvent.click(filterButton);
        });

        await waitFor(() => {
          expect(screen.getByText('Unprosecuted Agent One')).toBeInTheDocument();
          expect(screen.getByText('Unprosecuted Agent Two')).toBeInTheDocument();
          expect(screen.queryByText('Agent One')).not.toBeInTheDocument(); // Convicted agent should not appear
        });
      });

      it('displays filtered count in pagination info', async () => {
        render(<DinaDocumentationInternational />);

        await waitFor(() => {
          const allAgentsButton = screen.getByText(/📋 ALL AGENTS/i);
          fireEvent.click(allAgentsButton);
        });

        await waitFor(() => {
          const filterButton = screen.getByTestId('unprosecuted-filter-button');
          fireEvent.click(filterButton);
        });

        await waitFor(() => {
          expect(screen.getByText(/297.*agents/i)).toBeInTheDocument();
        });
      });

      it('updates total pages when filter is applied', async () => {
        render(<DinaDocumentationInternational />);

        await waitFor(() => {
          const allAgentsButton = screen.getByText(/📋 ALL AGENTS/i);
          fireEvent.click(allAgentsButton);
        });

        await waitFor(() => {
          const filterButton = screen.getByTestId('unprosecuted-filter-button');
          fireEvent.click(filterButton);
        });

        await waitFor(() => {
          expect(screen.getByText(/Page 1 of 6/i)).toBeInTheDocument();
        });
      });

      it('returns to full list when filter is disabled', async () => {
        render(<DinaDocumentationInternational />);

        await waitFor(() => {
          const allAgentsButton = screen.getByText(/📋 ALL AGENTS/i);
          fireEvent.click(allAgentsButton);
        });

        // Enable filter
        await waitFor(() => {
          const filterButton = screen.getByTestId('unprosecuted-filter-button');
          fireEvent.click(filterButton);
        });

        await waitFor(() => {
          expect(screen.getByText(/297.*agents/i)).toBeInTheDocument();
        });

        // Disable filter
        await waitFor(() => {
          const filterButton = screen.getByTestId('unprosecuted-filter-button');
          fireEvent.click(filterButton);
        });

        await waitFor(() => {
          expect(screen.getByText(/1097.*agents/i)).toBeInTheDocument();
        });
      });
    });

    describe('🔄 Filter Interaction with Other Features', () => {
      it('maintains filter state during pagination', async () => {
        render(<DinaDocumentationInternational />);

        await waitFor(() => {
          const allAgentsButton = screen.getByText(/📋 ALL AGENTS/i);
          fireEvent.click(allAgentsButton);
        });

        // Enable filter
        await waitFor(() => {
          const filterButton = screen.getByTestId('unprosecuted-filter-button');
          fireEvent.click(filterButton);
        });

        // Go to next page
        await waitFor(() => {
          const nextButton = screen.getByTestId('next-page-button');
          fireEvent.click(nextButton);
        });

        // Should still have filter applied
        await waitFor(() => {
          expect(global.fetch).toHaveBeenCalledWith(expect.stringMatching(/filter=unprosecuted.*page=2/));
        });
      });

      it('preserves filter when switching between expandable cards', async () => {
        render(<DinaDocumentationInternational />);

        await waitFor(() => {
          const allAgentsButton = screen.getByText(/📋 ALL AGENTS/i);
          fireEvent.click(allAgentsButton);
        });

        // Enable filter
        await waitFor(() => {
          const filterButton = screen.getByTestId('unprosecuted-filter-button');
          fireEvent.click(filterButton);
        });

        // Expand a card
        await waitFor(() => {
          const agentCard = screen.getByTestId('agent-card-3');
          fireEvent.click(agentCard);
        });

        // Filter button should still show active state
        await waitFor(() => {
          const filterButton = screen.getByTestId('unprosecuted-filter-button');
          expect(filterButton).toHaveClass('active');
        });
      });

      it('clears search when filter is toggled', async () => {
        render(<DinaDocumentationInternational />);

        await waitFor(() => {
          const allAgentsButton = screen.getByText(/📋 ALL AGENTS/i);
          fireEvent.click(allAgentsButton);
        });

        // Search for something
        await waitFor(() => {
          const searchInput = screen.getByTestId('agent-search-input');
          fireEvent.change(searchInput, { target: { value: 'test search' } });
        });

        // Toggle filter - should work alongside search
        await waitFor(() => {
          const filterButton = screen.getByTestId('unprosecuted-filter-button');
          fireEvent.click(filterButton);
        });

        await waitFor(() => {
          // Both search and filter should be applied
          expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('filter=unprosecuted'));
        });
      });
    });

    describe('🌍 Internationalization Tests for Filter Button', () => {
      it('translates filter button text to Spanish', async () => {
        render(<DinaDocumentationInternational />);

        // Switch to Spanish
        await waitFor(() => {
          const languageButton = screen.getByText(/🌐.*English/i);
          fireEvent.click(languageButton);
        });

        await waitFor(() => {
          const spanishOption = screen.getByText(/🇨🇱.*Español/i);
          fireEvent.click(spanishOption);
        });

        // Go to All Agents view
        await waitFor(() => {
          const allAgentsButton = screen.getByText(/📋 TODOS LOS AGENTES/i);
          fireEvent.click(allAgentsButton);
        });

        await waitFor(() => {
          expect(screen.getByText(/FILTRAR SIN ENJUICIAR/i)).toBeInTheDocument();
        });
      });

      it('translates active filter text to Portuguese', async () => {
        render(<DinaDocumentationInternational />);

        // Switch to Portuguese
        await waitFor(() => {
          const languageButton = screen.getByText(/🌐.*English/i);
          fireEvent.click(languageButton);
        });

        await waitFor(() => {
          const portugueseOption = screen.getByText(/🇧🇷.*Português/i);
          fireEvent.click(portugueseOption);
        });

        // Go to All Agents view
        await waitFor(() => {
          const allAgentsButton = screen.getByText(/📋 TODOS OS AGENTES/i);
          fireEvent.click(allAgentsButton);
        });

        // Enable filter
        await waitFor(() => {
          const filterButton = screen.getByTestId('unprosecuted-filter-button');
          fireEvent.click(filterButton);
        });

        await waitFor(() => {
          expect(screen.getByText(/MOSTRANDO NÃO PROCESSADOS/i)).toBeInTheDocument();
        });
      });

      it('translates filter button to German', async () => {
        render(<DinaDocumentationInternational />);

        // Switch to German
        await waitFor(() => {
          const languageButton = screen.getByText(/🌐.*English/i);
          fireEvent.click(languageButton);
        });

        await waitFor(() => {
          const germanOption = screen.getByText(/🇩🇪.*Deutsch/i);
          fireEvent.click(germanOption);
        });

        // Go to All Agents view
        await waitFor(() => {
          const allAgentsButton = screen.getByText(/📋 ALLE AGENTEN/i);
          fireEvent.click(allAgentsButton);
        });

        await waitFor(() => {
          expect(screen.getByText(/NICHT VERFOLGTE FILTERN/i)).toBeInTheDocument();
        });
      });
    });
  });
});

// *purrs in international testing excellence* 😻🌍⚖️
// *swishes tail in neko arc TV testing mastery* 📺✨🐾
// *bounces with unprosecuted filter testing completion* ⚖️🐾✨
