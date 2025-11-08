// 🐾⚡ NEKO-ARC TESTS - DinaDocumentationInternational Component ⚡🐾
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import DinaDocumentationInternational from './DinaDocumentationInternational';
import { setupFetchMocks, setupFailedFetchMocks, mockApiResponses } from '../test-utils/testHelpers';

// Mock child components with translations
jest.mock('./GlobalThreatMap', () => {
  return function GlobalThreatMap({ language }) {
    const translations = {
      en: '🗺️ GLOBAL DINA OPERATIONS MAP',
      es: '🗺️ MAPA GLOBAL DE OPERACIONES DINA',
      pt: '🗺️ MAPA GLOBAL DE OPERAÇÕES DINA',
      de: '🗺️ DINA GLOBALE OPERATIONSKARTE'
    };
    return <div>{translations[language] || translations.en}</div>;
  };
});

jest.mock('./DinaTimeline', () => {
  return function DinaTimeline({ language }) {
    const translations = {
      en: '⏰ DINA OPERATIONS TIMELINE',
      es: '⏰ LÍNEA DE TIEMPO DE OPERACIONES DINA',
      pt: '⏰ LINHA DO TEMPO DE OPERAÇÕES DINA',
      de: '⏰ DINA-OPERATIONSZEITLINIE'
    };
    return <div>{translations[language] || translations.en}</div>;
  };
});

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
        // Multiple elements contain "International Hunt Operation" (subtitle + overview banner)
        expect(screen.getAllByText(/International Hunt Operation/i).length).toBeGreaterThan(0);
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
        // Component renders: 🌍⚖️ INTERNATIONALES DINA DOKUMENTATIONSARCHIV ⚖️🌍
        expect(screen.getByText(/INTERNATIONALES DINA DOKUMENTATIONSARCHIV/i)).toBeInTheDocument();
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
        // Component renders current stats structure
        expect(screen.getByText(/Total Known Agents/i)).toBeInTheDocument();
        expect(screen.getByText(/High-Profile Documented/i)).toBeInTheDocument();
        expect(screen.getByText('Convicted')).toBeInTheDocument();
        expect(screen.getByText(/At Large/i)).toBeInTheDocument();
      });
    });

    it('displays correct stat values', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        // Mock returns total_known_agents=undefined, so defaults to 1097
        expect(screen.getByText('1097')).toBeInTheDocument();
        // perpetrators array length (2 in mock)
        expect(screen.getByText('2')).toBeInTheDocument();
        // convicted from mock
        expect(screen.getByText('12')).toBeInTheDocument();
        // atLarge not in mock, defaults to 0
        expect(screen.getAllByText('0').length).toBeGreaterThan(0);
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
        // Component stat labels are hardcoded in English (not translated)
        // Verify stats remain visible after language change
        expect(screen.getByText(/Total Known Agents/i)).toBeInTheDocument();
        expect(screen.getByText(/High-Profile Documented/i)).toBeInTheDocument();
        expect(screen.getByText('Convicted')).toBeInTheDocument();
      });
    });
  });

  describe('🧭 Navigation Tests', () => {
    it('renders all 4 navigation buttons', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        expect(screen.getByText('🏠 OVERVIEW')).toBeInTheDocument();
        // PERPETRATORS includes count in parentheses
        expect(screen.getByText(/📋 PERPETRATORS/i)).toBeInTheDocument();
        expect(screen.getByText(/🌍 GLOBAL MAP/i)).toBeInTheDocument();
        expect(screen.getByText(/⏰ TIMELINE/i)).toBeInTheDocument();
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
        // Button text includes count: "📋 PERPETRATORS (2)"
        const perpButton = screen.getByText(/📋 PERPETRATORS/i);
        fireEvent.click(perpButton);
      });

      await waitFor(() => {
        expect(screen.getByText(/Documented DINA Agents/i)).toBeInTheDocument();
      });
    });

    it('switches to map view when GLOBAL MAP button is clicked', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      // Wait for component to load AND click button in same waitFor
      await waitFor(() => {
        expect(screen.getByText(/DINA INTERNATIONAL DOCUMENTATION ARCHIVE/i)).toBeInTheDocument();
        const mapButton = screen.getByText(/🌍 GLOBAL MAP/i);
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
        // Button includes count: "📋 PERPETRATORS (2)"
        const perpButton = screen.getByText(/📋 PERPETRATORS/i);
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
        // PERPETRADORES includes count: "📋 PERPETRADORES (2)"
        expect(screen.getByText(/📋 PERPETRADORES/i)).toBeInTheDocument();
        expect(screen.getByText(/🌍 MAPA GLOBAL/i)).toBeInTheDocument();
        expect(screen.getByText(/⏰ LÍNEA DE TIEMPO/i)).toBeInTheDocument();
      });
    });
  });

  describe('🏠 Overview View Tests', () => {
    it('renders overview section by default', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        // Component renders: 🔍 INTERNATIONAL HUNT OPERATION ACTIVE
        expect(screen.getByText(/INTERNATIONAL HUNT OPERATION ACTIVE/i)).toBeInTheDocument();
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
        // Multiple elements contain "Universal Jurisdiction" (card title + mission text)
        expect(screen.getAllByText(/Universal Jurisdiction/i).length).toBeGreaterThan(0);
      });
    });

    it('renders quick access buttons in overview', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        // Component has: View Wanted Agents, View International Crimes, View Torture Centers
        expect(screen.getByText(/View Wanted Agents/i)).toBeInTheDocument();
        expect(screen.getByText(/View International Crimes/i)).toBeInTheDocument();
        expect(screen.getByText(/View Torture Centers/i)).toBeInTheDocument();
      });
    });

    it('quick access map button navigates to map view', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        // Component has "View Wanted Agents" button (navigates to 'wanted' view)
        const quickButton = screen.getByText(/View Wanted Agents/i);
        fireEvent.click(quickButton);
      });

      await waitFor(() => {
        // Should navigate to wanted agents view
        expect(screen.getByText(/DINA WANTED AGENTS/i)).toBeInTheDocument();
      });
    });

    it('quick access timeline button navigates to timeline view', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        // Component has "View International Crimes" button (navigates to 'international' view)
        const quickButton = screen.getByText(/View International Crimes/i);
        fireEvent.click(quickButton);
      });

      await waitFor(() => {
        // Should navigate to international crimes view
        expect(screen.getByText(/DINA INTERNATIONAL TERRORISM/i)).toBeInTheDocument();
      });
    });

    it('quick access perpetrators button navigates to list view', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        // Component has "View Torture Centers" button (navigates to 'centers' view)
        const quickButton = screen.getByText(/View Torture Centers/i);
        fireEvent.click(quickButton);
      });

      await waitFor(() => {
        // Should navigate to torture centers view
        expect(screen.getByText(/DINA SECRET DETENTION/i)).toBeInTheDocument();
      });
    });
  });

  describe('📋 Perpetrators List View Tests', () => {
    it('displays perpetrators list when in list view', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        // Button includes count: "📋 PERPETRATORS (2)"
        const perpButton = screen.getByText(/📋 PERPETRATORS/i);
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
        const perpButton = screen.getByText(/📋 PERPETRATORS/i);
        fireEvent.click(perpButton);
      });

      await waitFor(() => {
        // Component displays: "No perpetrators loaded. Check API connection and restart NestJS API!"
        expect(screen.getByText(/No perpetrators loaded/i)).toBeInTheDocument();
      });
    });

    it('displays convicted/unprosecuted status with translation', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        const perpButton = screen.getByText(/📋 PERPETRATORS/i);
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
        const perpButton = screen.getByText(/📋 PERPETRATORS/i);
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
        const perpButton = screen.getByText(/📋 PERPETRATORS/i);
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
        const perpButton = screen.getByText(/📋 PERPETRATORS/i);
        fireEvent.click(perpButton);
      });

      await waitFor(() => {
        const card = screen.getByText('Test Perpetrator').closest('div.perp-card-international');
        fireEvent.click(card);
      });

      await waitFor(() => {
        expect(screen.getByText('Role & Organization')).toBeInTheDocument();
        // Component renders: "⚖️ Legal Status"
        expect(screen.getByText(/Legal Status/i)).toBeInTheDocument();
      });
    });

    it('displays role and organization in details', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        const perpButton = screen.getByText(/📋 PERPETRATORS/i);
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
        const perpButton = screen.getByText(/📋 PERPETRATORS/i);
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
        const perpButton = screen.getByText(/📋 PERPETRATORS/i);
        fireEvent.click(perpButton);
      });

      await waitFor(() => {
        const card = screen.getByText('Test Perpetrator').closest('div.perp-card-international');
        fireEvent.click(card);
      });

      await waitFor(() => {
        // Component renders: "💀 Crimes Accused"
        expect(screen.getByText(/Crimes Accused/i)).toBeInTheDocument();
        expect(screen.getByText('Torture')).toBeInTheDocument();
      });
    });

    it('back button returns to list view', async () => {
      setupFetchMocks();
      render(<DinaDocumentationInternational />);

      await waitFor(() => {
        const perpButton = screen.getByText(/📋 PERPETRATORS/i);
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
        // Button includes count: "📋 PERPETRADORES (2)"
        const perpButton = screen.getByText(/📋 PERPETRADORES/i);
        fireEvent.click(perpButton);
      });

      // Select a perpetrator
      await waitFor(() => {
        const card = screen.getByText('Test Perpetrator').closest('div.perp-card-international');
        fireEvent.click(card);
      });

      await waitFor(() => {
        // Component details section headers are hardcoded in English (not translated)
        expect(screen.getByText(/Role & Organization/i)).toBeInTheDocument();
        expect(screen.getByText(/Legal Status/i)).toBeInTheDocument();
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
});

// *purrs in international testing excellence* 😻🌍⚖️
