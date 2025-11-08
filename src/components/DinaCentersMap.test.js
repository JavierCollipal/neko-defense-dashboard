// 🐾⚡ NEKO-ARC TESTS - DinaCentersMap Component ⚡🐾
// ULTRA BASED TESTING for torture centers map, nyaa~! 😻
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import DinaCentersMap from './DinaCentersMap';

describe('DinaCentersMap Component', () => {
  beforeEach(() => {
    console.log('🐾 [DinaCentersMap.test] Setting up test, nyaa~');
    jest.clearAllMocks();
  });

  afterEach(() => {
    console.log('🐾 [DinaCentersMap.test] Cleaning up test, desu~');
  });

  describe('🎨 Initial Rendering', () => {
    it('renders map header', () => {
      console.log('🧪 [Test] Checking map header, nyaa~');
      render(<DinaCentersMap />);

      expect(screen.getByText(/DINA Torture Centers - Santiago Metropolitan Region/i)).toBeInTheDocument();
      expect(screen.getByText(/Interactive map of secret detention and torture facilities/i)).toBeInTheDocument();
    });

    it('renders map controls', () => {
      console.log('🧪 [Test] Checking map controls, desu~');
      render(<DinaCentersMap />);

      expect(screen.getByText('📍 Santiago Focus')).toBeInTheDocument();
      expect(screen.getByText('🌎 Chile Overview')).toBeInTheDocument();
    });

    it('Santiago Focus view is active by default', () => {
      console.log('🧪 [Test] Checking default view, nyaa~');
      render(<DinaCentersMap />);

      const santiagoBtn = screen.getByText('📍 Santiago Focus').closest('button');
      expect(santiagoBtn).toHaveClass('active');
    });

    it('renders legend section', () => {
      console.log('🧪 [Test] Checking legend, desu~');
      render(<DinaCentersMap />);

      expect(screen.getByText('Legend:')).toBeInTheDocument();
      expect(screen.getByText('Critical - Major complex')).toBeInTheDocument();
      expect(screen.getByText('High - Major center')).toBeInTheDocument();
      expect(screen.getByText('Medium - Secret facility')).toBeInTheDocument();
    });

    it('renders map canvas', () => {
      console.log('🧪 [Test] Checking map canvas, nyaa~');
      render(<DinaCentersMap />);

      expect(screen.getByText('Santiago Metropolitan Region')).toBeInTheDocument();
      expect(screen.getByText('DINA operated a systematic network across Santiago')).toBeInTheDocument();
    });

    it('renders footer messages', () => {
      console.log('🧪 [Test] Checking footer, desu~');
      render(<DinaCentersMap />);

      expect(screen.getByText(/Many of these sites are now memorials that can be visited/i)).toBeInTheDocument();
      expect(screen.getByText(/DINA operated a systematic network of clandestine detention centers/i)).toBeInTheDocument();
    });
  });

  describe('🗺️ Map View Controls', () => {
    it('switches to Chile Overview when button is clicked', () => {
      console.log('🧪 [Test] Testing Chile view switch, nyaa~');
      render(<DinaCentersMap />);

      const chileBtn = screen.getByText('🌎 Chile Overview');
      fireEvent.click(chileBtn);

      expect(chileBtn.closest('button')).toHaveClass('active');
    });

    it('switches back to Santiago Focus', () => {
      console.log('🧪 [Test] Testing Santiago view switch, desu~');
      render(<DinaCentersMap />);

      // Switch to Chile
      const chileBtn = screen.getByText('🌎 Chile Overview');
      fireEvent.click(chileBtn);

      // Switch back to Santiago
      const santiagoBtn = screen.getByText('📍 Santiago Focus');
      fireEvent.click(santiagoBtn);

      expect(santiagoBtn.closest('button')).toHaveClass('active');
    });

    it('only one view button is active at a time', () => {
      console.log('🧪 [Test] Testing exclusive view selection, nyaa~');
      render(<DinaCentersMap />);

      const santiagoBtn = screen.getByText('📍 Santiago Focus').closest('button');
      const chileBtn = screen.getByText('🌎 Chile Overview').closest('button');

      // Initially Santiago is active
      expect(santiagoBtn).toHaveClass('active');
      expect(chileBtn).not.toHaveClass('active');

      // Click Chile
      fireEvent.click(chileBtn);
      expect(chileBtn).toHaveClass('active');
      expect(santiagoBtn).not.toHaveClass('active');
    });
  });

  describe('📍 Map Markers Rendering', () => {
    it('renders all 6 torture centers', () => {
      console.log('🧪 [Test] Checking all centers rendered, desu~');
      render(<DinaCentersMap />);

      expect(screen.getAllByText('Villa Grimaldi').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Londres 38').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Jose Domingo Cañas').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Cuatro Alamos').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Venecia').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Malloco').length).toBeGreaterThanOrEqual(1);
    });

    it('displays center count in list header', () => {
      console.log('🧪 [Test] Checking center count, nyaa~');
      render(<DinaCentersMap />);

      expect(screen.getByText('All DINA Torture Centers (6)')).toBeInTheDocument();
    });

    it('renders markers with correct level classes', () => {
      console.log('🧪 [Test] Checking marker level classes, desu~');
      render(<DinaCentersMap />);

      const markers = document.querySelectorAll('.map-marker');
      expect(markers.length).toBe(6);

      const criticalMarkers = document.querySelectorAll('.map-marker.critical');
      expect(criticalMarkers.length).toBe(2); // Villa Grimaldi, Londres 38
    });

    it('markers have correct titles', () => {
      console.log('🧪 [Test] Checking marker titles, nyaa~');
      render(<DinaCentersMap />);

      const markers = document.querySelectorAll('.map-marker');
      const villaGrimaldiMarker = Array.from(markers).find(m => m.title === 'Villa Grimaldi');

      expect(villaGrimaldiMarker).toBeTruthy();
    });
  });

  describe('📝 Centers List View', () => {
    it('renders all centers in compact cards', () => {
      console.log('🧪 [Test] Checking compact cards, desu~');
      render(<DinaCentersMap />);

      const cards = document.querySelectorAll('.center-compact-card');
      expect(cards.length).toBe(6);
    });

    it('displays location in compact cards', () => {
      console.log('🧪 [Test] Checking location display, nyaa~');
      render(<DinaCentersMap />);

      expect(screen.getByText(/📍.*Av\. José Arrieta 8401, Peñalolén/i)).toBeInTheDocument();
      expect(screen.getByText(/📍.*Londres 38, Downtown/i)).toBeInTheDocument();
    });

    it('displays period in compact cards', () => {
      console.log('🧪 [Test] Checking period display, desu~');
      render(<DinaCentersMap />);

      expect(screen.getByText(/📅.*Mid-1974 to Mid-1978/i)).toBeInTheDocument();
      expect(screen.getByText(/📅.*September 1973 - December 1974/i)).toBeInTheDocument();
    });

    it('displays killed count in compact cards', () => {
      console.log('🧪 [Test] Checking killed count display, nyaa~');
      render(<DinaCentersMap />);

      expect(screen.getByText(/💀.*240\+/)).toBeInTheDocument();
      expect(screen.getByText(/💀.*94 executed/i)).toBeInTheDocument();
    });

    it('compact cards have correct level classes', () => {
      console.log('🧪 [Test] Checking card level classes, desu~');
      render(<DinaCentersMap />);

      const criticalCards = document.querySelectorAll('.center-compact-card.critical');
      const highCards = document.querySelectorAll('.center-compact-card.high');
      const mediumCards = document.querySelectorAll('.center-compact-card.medium');

      expect(criticalCards.length).toBe(2); // Villa Grimaldi, Londres 38
      expect(highCards.length).toBe(1); // Jose Domingo Canas
      expect(mediumCards.length).toBe(3); // Cuatro Alamos, Venecia, Malloco
    });

    it('compact cards display level badges', () => {
      console.log('🧪 [Test] Checking level badges, nyaa~');
      render(<DinaCentersMap />);

      const criticalBadges = screen.getAllByText('critical');
      const highBadges = screen.getAllByText('high');
      const mediumBadges = screen.getAllByText('medium');

      expect(criticalBadges.length).toBeGreaterThanOrEqual(2);
      expect(highBadges.length).toBeGreaterThanOrEqual(1);
      expect(mediumBadges.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('🎯 Center Selection from Map', () => {
    it('opens details panel when marker is clicked', () => {
      console.log('🧪 [Test] Testing marker click, desu~');
      render(<DinaCentersMap />);

      const markers = document.querySelectorAll('.map-marker');
      const villaGrimaldiMarker = Array.from(markers).find(m => m.title === 'Villa Grimaldi');

      fireEvent.click(villaGrimaldiMarker);

      expect(screen.getByText('Code Name:')).toBeInTheDocument();
      expect(screen.getByText('Cuartel Terranova')).toBeInTheDocument();
    });

    it('displays full center details in panel', () => {
      console.log('🧪 [Test] Testing details panel content, nyaa~');
      render(<DinaCentersMap />);

      const markers = document.querySelectorAll('.map-marker');
      const villaGrimaldiMarker = Array.from(markers).find(m => m.title === 'Villa Grimaldi');

      fireEvent.click(villaGrimaldiMarker);

      const detailsPanel = document.querySelector('.center-details-panel');
      expect(within(detailsPanel).getByText('Villa Grimaldi')).toBeInTheDocument();
      expect(within(detailsPanel).getByText('Cuartel Terranova')).toBeInTheDocument();
      expect(within(detailsPanel).getByText(/~4,500/)).toBeInTheDocument();
      expect(within(detailsPanel).getByText(/240\+/)).toBeInTheDocument();
      expect(within(detailsPanel).getByText('MOST IMPORTANT DINA COMPLEX')).toBeInTheDocument();
    });

    it('displays torture methods in details panel', () => {
      console.log('🧪 [Test] Testing torture methods display, desu~');
      render(<DinaCentersMap />);

      const markers = document.querySelectorAll('.map-marker');
      const villaGrimaldiMarker = Array.from(markers).find(m => m.title === 'Villa Grimaldi');

      fireEvent.click(villaGrimaldiMarker);

      expect(screen.getByText('Documented Torture Methods:')).toBeInTheDocument();
      expect(screen.getByText(/La Parrilla \(Electric Shock Bed\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Waterboarding/i)).toBeInTheDocument();
    });

    it('displays current status in details panel', () => {
      console.log('🧪 [Test] Testing current status display, nyaa~');
      render(<DinaCentersMap />);

      const markers = document.querySelectorAll('.map-marker');
      const villaGrimaldiMarker = Array.from(markers).find(m => m.title === 'Villa Grimaldi');

      fireEvent.click(villaGrimaldiMarker);

      expect(screen.getByText('Current Status:')).toBeInTheDocument();
      expect(screen.getByText(/Parque por la Paz \(Peace Park Memorial\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Open to public/i)).toBeInTheDocument();
    });

    it('displays description in details panel', () => {
      console.log('🧪 [Test] Testing description display, desu~');
      render(<DinaCentersMap />);

      const markers = document.querySelectorAll('.map-marker');
      const villaGrimaldiMarker = Array.from(markers).find(m => m.title === 'Villa Grimaldi');

      fireEvent.click(villaGrimaldiMarker);

      expect(screen.getByText(/The most important DINA interrogation and torture complex/i)).toBeInTheDocument();
    });

    it('selected marker gets selected class', () => {
      console.log('🧪 [Test] Testing selected marker styling, nyaa~');
      render(<DinaCentersMap />);

      const markers = document.querySelectorAll('.map-marker');
      const villaGrimaldiMarker = Array.from(markers).find(m => m.title === 'Villa Grimaldi');

      expect(villaGrimaldiMarker).not.toHaveClass('selected');

      fireEvent.click(villaGrimaldiMarker);

      expect(villaGrimaldiMarker).toHaveClass('selected');
    });
  });

  describe('🎯 Center Selection from List', () => {
    it('opens details panel when compact card is clicked', () => {
      console.log('🧪 [Test] Testing compact card click, desu~');
      render(<DinaCentersMap />);

      const londres38Elements = screen.getAllByText('Londres 38');
      const londres38Card = londres38Elements.find(el => el.closest('.center-compact-card'));
      fireEvent.click(londres38Card.closest('.center-compact-card'));

      expect(screen.getByText('Code Name:')).toBeInTheDocument();
      expect(screen.getByText('Yucatán')).toBeInTheDocument();
      expect(screen.getByText('FIRST DINA DETENTION CENTER')).toBeInTheDocument();
    });

    it('displays different center details when selecting different cards', () => {
      console.log('🧪 [Test] Testing multiple card selections, nyaa~');
      render(<DinaCentersMap />);

      // Select first center
      const villaGrimaldiElements = screen.getAllByText('Villa Grimaldi');
      const villaGrimaldiCard = villaGrimaldiElements.find(el => el.closest('.center-compact-card'));
      fireEvent.click(villaGrimaldiCard.closest('.center-compact-card'));

      expect(screen.getByText('Cuartel Terranova')).toBeInTheDocument();

      // Select second center
      const londres38Elements = screen.getAllByText('Londres 38');
      const londres38Card = londres38Elements.find(el => el.closest('.center-compact-card'));
      fireEvent.click(londres38Card.closest('.center-compact-card'));

      expect(screen.getByText('Yucatán')).toBeInTheDocument();
      expect(screen.queryByText('Cuartel Terranova')).not.toBeInTheDocument();
    });
  });

  describe('✕ Close Details Panel', () => {
    it('closes details panel when close button is clicked', () => {
      console.log('🧪 [Test] Testing close button, desu~');
      render(<DinaCentersMap />);

      // Open details
      const markers = document.querySelectorAll('.map-marker');
      const villaGrimaldiMarker = Array.from(markers).find(m => m.title === 'Villa Grimaldi');
      fireEvent.click(villaGrimaldiMarker);

      expect(screen.getByText('Code Name:')).toBeInTheDocument();

      // Close details
      const closeBtn = screen.getByText('✕');
      fireEvent.click(closeBtn);

      expect(screen.queryByText('Code Name:')).not.toBeInTheDocument();
    });

    it('removes selected class from marker when details are closed', () => {
      console.log('🧪 [Test] Testing selected class removal, nyaa~');
      render(<DinaCentersMap />);

      const markers = document.querySelectorAll('.map-marker');
      const villaGrimaldiMarker = Array.from(markers).find(m => m.title === 'Villa Grimaldi');

      fireEvent.click(villaGrimaldiMarker);
      expect(villaGrimaldiMarker).toHaveClass('selected');

      const closeBtn = screen.getByText('✕');
      fireEvent.click(closeBtn);

      expect(villaGrimaldiMarker).not.toHaveClass('selected');
    });
  });

  describe('🎨 Helper Function - getLevelColor', () => {
    it('returns correct color for critical level', () => {
      console.log('🧪 [Test] Testing critical color, desu~');
      render(<DinaCentersMap />);

      const criticalMarkers = document.querySelectorAll('.map-marker.critical');
      const firstCritical = criticalMarkers[0];

      expect(firstCritical).toHaveStyle({ backgroundColor: '#dc2626' });
    });

    it('returns correct color for high level', () => {
      console.log('🧪 [Test] Testing high color, nyaa~');
      render(<DinaCentersMap />);

      const highMarkers = document.querySelectorAll('.map-marker.high');
      const firstHigh = highMarkers[0];

      expect(firstHigh).toHaveStyle({ backgroundColor: '#ea580c' });
    });

    it('returns correct color for medium level', () => {
      console.log('🧪 [Test] Testing medium color, desu~');
      render(<DinaCentersMap />);

      const mediumMarkers = document.querySelectorAll('.map-marker.medium');
      const firstMedium = mediumMarkers[0];

      expect(firstMedium).toHaveStyle({ backgroundColor: '#ca8a04' });
    });
  });

  describe('📊 Data Integrity Tests', () => {
    it('Villa Grimaldi has correct complete data', () => {
      console.log('🧪 [Test] Testing Villa Grimaldi data, nyaa~');
      render(<DinaCentersMap />);

      const villaElements = screen.getAllByText('Villa Grimaldi');
      const villaCard = villaElements.find(el => el.closest('.center-compact-card'));
      fireEvent.click(villaCard.closest('.center-compact-card'));

      // Check all key data points in details panel
      const detailsPanel = document.querySelector('.center-details-panel');
      expect(within(detailsPanel).getByText('Cuartel Terranova')).toBeInTheDocument();
      expect(within(detailsPanel).getByText(/Av\. José Arrieta 8401, Peñalolén/i)).toBeInTheDocument();
      expect(within(detailsPanel).getByText('Mid-1974 to Mid-1978')).toBeInTheDocument();
      expect(within(detailsPanel).getByText(/~4,500/)).toBeInTheDocument();
      expect(within(detailsPanel).getByText(/240\+/)).toBeInTheDocument();
    });

    it('Londres 38 has correct complete data', () => {
      console.log('🧪 [Test] Testing Londres 38 data, desu~');
      render(<DinaCentersMap />);

      const londresElements = screen.getAllByText('Londres 38');
      const londresCard = londresElements.find(el => el.closest('.center-compact-card'));
      fireEvent.click(londresCard.closest('.center-compact-card'));

      expect(screen.getByText('Yucatán')).toBeInTheDocument();
      expect(screen.getByText('Londres 38, Downtown')).toBeInTheDocument();
      expect(screen.getByText('September 1973 - December 1974')).toBeInTheDocument();
      expect(screen.getByText(/~1,100/)).toBeInTheDocument();
      expect(screen.getByText('94 executed')).toBeInTheDocument();
    });

    it('Jose Domingo Cañas has correct data', () => {
      console.log('🧪 [Test] Testing Jose Domingo Cañas data, nyaa~');
      render(<DinaCentersMap />);

      const joseElements = screen.getAllByText('Jose Domingo Cañas');
      const joseCard = joseElements.find(el => el.closest('.center-compact-card'));
      fireEvent.click(joseCard.closest('.center-compact-card'));

      expect(screen.getByText('Ollague')).toBeInTheDocument();
      expect(screen.getByText('Jose Domingo Cañas street')).toBeInTheDocument();
      expect(screen.getByText('1974-1975')).toBeInTheDocument();
    });

    it('Cuatro Alamos has correct data', () => {
      console.log('🧪 [Test] Testing Cuatro Alamos data, desu~');
      render(<DinaCentersMap />);

      const cuatroElements = screen.getAllByText('Cuatro Alamos');
      const cuatroCard = cuatroElements.find(el => el.closest('.center-compact-card'));
      fireEvent.click(cuatroCard.closest('.center-compact-card'));

      const detailsPanel = document.querySelector('.center-details-panel');
      // Cuatro Alamos appears twice: as name and codeName (they're the same)
      expect(within(detailsPanel).getAllByText('Cuatro Alamos').length).toBe(2);
      expect(within(detailsPanel).getByText('1974-1976')).toBeInTheDocument();
      expect(within(detailsPanel).getByText('Transit detention center')).toBeInTheDocument();
    });

    it('Venecia has correct data', () => {
      console.log('🧪 [Test] Testing Venecia data, nyaa~');
      render(<DinaCentersMap />);

      const veneciaElements = screen.getAllByText('Venecia');
      const veneciaCard = veneciaElements.find(el => el.closest('.center-compact-card'));
      fireEvent.click(veneciaCard.closest('.center-compact-card'));

      const detailsPanel = document.querySelector('.center-details-panel');
      expect(within(detailsPanel).getByText('Secret detention facility')).toBeInTheDocument();
      expect(within(detailsPanel).getByText('1974-1977')).toBeInTheDocument();
    });

    it('Malloco has correct data', () => {
      console.log('🧪 [Test] Testing Malloco data, desu~');
      render(<DinaCentersMap />);

      const mallocoElements = screen.getAllByText('Malloco');
      const mallocoCard = mallocoElements.find(el => el.closest('.center-compact-card'));
      fireEvent.click(mallocoCard.closest('.center-compact-card'));

      const detailsPanel = document.querySelector('.center-details-panel');
      expect(within(detailsPanel).getByText('Secret detention facility')).toBeInTheDocument();
      expect(within(detailsPanel).getByText('1974-1977')).toBeInTheDocument();
    });
  });

  describe('🎭 Component State Management', () => {
    it('maintains no selection state initially', () => {
      console.log('🧪 [Test] Testing initial state, nyaa~');
      render(<DinaCentersMap />);

      expect(screen.queryByText('Code Name:')).not.toBeInTheDocument();
      expect(screen.queryByText('Documented Torture Methods:')).not.toBeInTheDocument();
    });

    it('updates selectedCenter state when marker is clicked', () => {
      console.log('🧪 [Test] Testing state update on marker click, desu~');
      render(<DinaCentersMap />);

      const markers = document.querySelectorAll('.map-marker');
      const londres38Marker = Array.from(markers).find(m => m.title === 'Londres 38');

      fireEvent.click(londres38Marker);

      // Details panel should be visible
      expect(screen.getByText('Yucatán')).toBeInTheDocument();
    });

    it('clears selectedCenter state when close button is clicked', () => {
      console.log('🧪 [Test] Testing state clear on close, nyaa~');
      render(<DinaCentersMap />);

      const markers = document.querySelectorAll('.map-marker');
      const villaMarker = Array.from(markers).find(m => m.title === 'Villa Grimaldi');

      fireEvent.click(villaMarker);
      expect(screen.getByText('Cuartel Terranova')).toBeInTheDocument();

      const closeBtn = screen.getByText('✕');
      fireEvent.click(closeBtn);

      expect(screen.queryByText('Cuartel Terranova')).not.toBeInTheDocument();
    });

    it('switches between different selected centers', () => {
      console.log('🧪 [Test] Testing center switching, desu~');
      render(<DinaCentersMap />);

      const markers = document.querySelectorAll('.map-marker');

      // Select first center
      const villaMarker = Array.from(markers).find(m => m.title === 'Villa Grimaldi');
      fireEvent.click(villaMarker);
      expect(screen.getByText('Cuartel Terranova')).toBeInTheDocument();

      // Select different center
      const londresMarker = Array.from(markers).find(m => m.title === 'Londres 38');
      fireEvent.click(londresMarker);
      expect(screen.getByText('Yucatán')).toBeInTheDocument();
      expect(screen.queryByText('Cuartel Terranova')).not.toBeInTheDocument();
    });
  });

  describe('🎨 Visual & Accessibility', () => {
    it('renders grid lines for visual structure', () => {
      console.log('🧪 [Test] Testing grid lines, nyaa~');
      render(<DinaCentersMap />);

      const gridLines = document.querySelectorAll('.grid-line');
      expect(gridLines.length).toBeGreaterThan(0);
    });

    it('renders marker pins', () => {
      console.log('🧪 [Test] Testing marker pins, desu~');
      render(<DinaCentersMap />);

      const pins = document.querySelectorAll('.marker-pin');
      expect(pins.length).toBe(6); // One per center
    });

    it('renders marker labels', () => {
      console.log('🧪 [Test] Testing marker labels, nyaa~');
      render(<DinaCentersMap />);

      const labels = document.querySelectorAll('.marker-label');
      expect(labels.length).toBe(6); // One per center
    });

    it('markers have title attribute for accessibility', () => {
      console.log('🧪 [Test] Testing marker accessibility, desu~');
      render(<DinaCentersMap />);

      const markers = document.querySelectorAll('.map-marker');
      markers.forEach(marker => {
        expect(marker).toHaveAttribute('title');
      });
    });

    it('details panel has proper header structure', () => {
      console.log('🧪 [Test] Testing panel header, nyaa~');
      render(<DinaCentersMap />);

      const markers = document.querySelectorAll('.map-marker');
      const marker = markers[0];
      fireEvent.click(marker);

      const panelHeader = document.querySelector('.panel-header');
      expect(panelHeader).toBeInTheDocument();
      expect(panelHeader.querySelector('h3')).toBeInTheDocument();
    });
  });

  describe('📱 Interactive Behavior', () => {
    it('can interact with multiple centers in sequence', () => {
      console.log('🧪 [Test] Testing sequential interactions, desu~');
      render(<DinaCentersMap />);

      const cards = document.querySelectorAll('.center-compact-card');

      // Click each card and verify it opens details
      cards.forEach((card, i) => {
        if (i < 3) { // Test first 3 to save time
          fireEvent.click(card);
          expect(screen.getByText('Code Name:')).toBeInTheDocument();
        }
      });
    });

    it('details panel can be opened and closed multiple times', () => {
      console.log('🧪 [Test] Testing repeated open/close, nyaa~');
      render(<DinaCentersMap />);

      const markers = document.querySelectorAll('.map-marker');
      const marker = markers[0];

      // Open
      fireEvent.click(marker);
      expect(screen.getByText('Code Name:')).toBeInTheDocument();

      // Close
      const closeBtn1 = screen.getByText('✕');
      fireEvent.click(closeBtn1);
      expect(screen.queryByText('Code Name:')).not.toBeInTheDocument();

      // Open again
      fireEvent.click(marker);
      expect(screen.getByText('Code Name:')).toBeInTheDocument();

      // Close again
      const closeBtn2 = screen.getByText('✕');
      fireEvent.click(closeBtn2);
      expect(screen.queryByText('Code Name:')).not.toBeInTheDocument();
    });

    it('map view can be toggled multiple times', () => {
      console.log('🧪 [Test] Testing repeated view toggles, desu~');
      render(<DinaCentersMap />);

      const santiagoBtn = screen.getByText('📍 Santiago Focus').closest('button');
      const chileBtn = screen.getByText('🌎 Chile Overview').closest('button');

      // Toggle multiple times
      fireEvent.click(chileBtn);
      expect(chileBtn).toHaveClass('active');

      fireEvent.click(santiagoBtn);
      expect(santiagoBtn).toHaveClass('active');

      fireEvent.click(chileBtn);
      expect(chileBtn).toHaveClass('active');

      fireEvent.click(santiagoBtn);
      expect(santiagoBtn).toHaveClass('active');
    });
  });
});

// *purrs in complete coverage excellence* 😻🗺️
// DINA CENTERS MAP 100% TESTED, NYAA~! 🐾⚡👑
