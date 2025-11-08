// 🐾⚡ E2E TEST: DINA Centers Interactive Map ⚡🐾
describe('🗺️ DINA Torture Centers Interactive Map', () => {
  beforeEach(() => {
    console.log('🐾 [Test] Starting DINA Centers Map test, nyaa~!');
    cy.visitDashboard();

    // Navigate to DINA Documentation view
    cy.get('.tv-window-button.dina-doc').click();
    cy.get('.App-header h1').should('contain', 'DINA INTERNATIONAL HUNT OPERATION');

    // Wait for map to be visible
    cy.get('.dina-centers-map-container', { timeout: 5000 }).should('be.visible');
  });

  describe('🎨 Map Component Structure', () => {
    it('should display map header with title', () => {
      cy.get('.map-header h2').should('contain', 'DINA Torture Centers');
      cy.get('.map-subtitle').should('contain', 'Interactive map');
    });

    it('should display map controls', () => {
      cy.get('.map-controls').should('be.visible');
      cy.get('.map-view-btn').should('have.length', 2);
    });

    it('should display Santiago Focus button as active by default', () => {
      cy.get('.map-view-btn').contains('Santiago Focus')
        .should('have.class', 'active');
    });

    it('should display Chile Overview button', () => {
      cy.get('.map-view-btn').contains('Chile Overview').should('be.visible');
    });

    it('should display map legend with all severity levels', () => {
      cy.get('.map-legend').should('be.visible');
      cy.get('.map-legend h4').should('contain', 'Legend');

      // Check all legend items
      cy.get('.legend-item').should('have.length', 3);
      cy.get('.legend-marker.critical').should('be.visible');
      cy.get('.legend-marker.high').should('be.visible');
      cy.get('.legend-marker.medium').should('be.visible');
    });

    it('should display interactive map area', () => {
      cy.get('.interactive-map-area').should('be.visible');
      cy.get('.map-canvas').should('be.visible');
    });

    it('should display map title and note', () => {
      cy.get('.map-title').should('contain', 'Santiago Metropolitan Region');
      cy.get('.map-note').should('contain', 'DINA operated');
    });
  });

  describe('📍 Map Markers & Centers', () => {
    it('should display all 6 torture center markers', () => {
      cy.get('.map-marker').should('have.length', 6);
    });

    it('should display Villa Grimaldi marker (critical)', () => {
      cy.get('.map-marker.critical').should('exist');
      cy.get('.marker-label').contains('Villa Grimaldi').should('be.visible');
    });

    it('should display Londres 38 marker (critical)', () => {
      cy.get('.marker-label').contains('Londres 38').should('be.visible');
    });

    it('should display Jose Domingo Cañas marker (high)', () => {
      cy.get('.map-marker.high').should('exist');
      cy.get('.marker-label').contains('Jose Domingo Cañas').should('be.visible');
    });

    it('should display Cuatro Alamos marker (medium)', () => {
      cy.get('.map-marker.medium').should('exist');
      cy.get('.marker-label').contains('Cuatro Alamos').should('be.visible');
    });

    it('should display Venecia marker (medium)', () => {
      cy.get('.marker-label').contains('Venecia').should('be.visible');
    });

    it('should display Malloco marker (medium)', () => {
      cy.get('.marker-label').contains('Malloco').should('be.visible');
    });

    it('should position markers with correct coordinates', () => {
      cy.get('.map-marker').each(($marker) => {
        // Each marker should have left and top positioning
        cy.wrap($marker).should('have.css', 'left');
        cy.wrap($marker).should('have.css', 'top');
      });
    });

    it('should color-code markers by severity level', () => {
      // Critical markers (red)
      cy.get('.map-marker.critical').should('have.length', 2);

      // High markers (orange)
      cy.get('.map-marker.high').should('have.length', 1);

      // Medium markers (yellow)
      cy.get('.map-marker.medium').should('have.length', 3);
    });
  });

  describe('🎯 Interactive Marker Clicking', () => {
    it('should open details panel when clicking Villa Grimaldi marker', () => {
      cy.get('.marker-label').contains('Villa Grimaldi').click();

      cy.get('.center-details-panel').should('be.visible');
      cy.get('.panel-header h3').should('contain', 'Villa Grimaldi');
    });

    it('should display selected marker with active styling', () => {
      cy.get('.marker-label').contains('Londres 38').click();

      cy.get('.map-marker').contains('Londres 38')
        .parent('.map-marker')
        .should('have.class', 'selected');
    });

    it('should update details when clicking different marker', () => {
      // Click first marker
      cy.get('.marker-label').contains('Villa Grimaldi').click();
      cy.get('.panel-header h3').should('contain', 'Villa Grimaldi');

      // Click second marker
      cy.get('.marker-label').contains('Londres 38').click();
      cy.get('.panel-header h3').should('contain', 'Londres 38');
    });

    it('should show all center markers are clickable', () => {
      const centers = ['Villa Grimaldi', 'Londres 38', 'Jose Domingo Cañas', 'Cuatro Alamos', 'Venecia', 'Malloco'];

      centers.forEach((centerName) => {
        cy.get('.marker-label').contains(centerName).click();
        cy.get('.panel-header h3').should('contain', centerName);
        cy.get('.close-btn').click();
      });
    });
  });

  describe('📋 Details Panel Content', () => {
    beforeEach(() => {
      // Open Villa Grimaldi details for testing
      cy.get('.marker-label').contains('Villa Grimaldi').click();
      cy.get('.center-details-panel').should('be.visible');
    });

    it('should display center name in panel header', () => {
      cy.get('.panel-header h3').should('contain', 'Villa Grimaldi');
    });

    it('should display close button in panel header', () => {
      cy.get('.panel-header .close-btn').should('be.visible').and('contain', '✕');
    });

    it('should display code name', () => {
      cy.get('.detail-row').contains('Code Name:').should('be.visible');
      cy.get('.panel-content').should('contain', 'Cuartel Terranova');
    });

    it('should display location address', () => {
      cy.get('.detail-row').contains('Location:').should('be.visible');
      cy.get('.panel-content').should('contain', 'Av. José Arrieta 8401');
    });

    it('should display operational period', () => {
      cy.get('.detail-row').contains('Period:').should('be.visible');
      cy.get('.panel-content').should('contain', '1974');
    });

    it('should display detainee count with critical styling', () => {
      cy.get('.detail-row.critical-stat').contains('Detainees:').should('be.visible');
      cy.get('.panel-content').should('contain', '~4,500');
    });

    it('should display killed/disappeared count with critical styling', () => {
      cy.get('.detail-row.critical-stat').contains('Killed/Disappeared:').should('be.visible');
      cy.get('.panel-content').should('contain', '240+');
    });

    it('should display significance badge', () => {
      cy.get('.detail-row').contains('Significance:').should('be.visible');
      cy.get('.significance-badge').should('contain', 'MOST IMPORTANT DINA COMPLEX');
    });

    it('should display documented torture methods section', () => {
      cy.get('.torture-methods-section h4').should('contain', 'Documented Torture Methods');
      cy.get('.torture-methods-section ul li').should('have.length.at.least', 1);
    });

    it('should list specific torture methods', () => {
      cy.get('.torture-methods-section').within(() => {
        cy.contains('La Parrilla').should('be.visible');
        cy.contains('Electric shock').should('be.visible');
        cy.contains('Waterboarding').should('be.visible');
      });
    });

    it('should display current status section', () => {
      cy.get('.current-status-section h4').should('contain', 'Current Status');
      cy.get('.status-text').should('be.visible').and('contain', '✅');
    });

    it('should display visit information', () => {
      cy.get('.visit-info').should('be.visible').and('contain', '🚶');
      cy.get('.visit-info').should('contain', 'Open to public');
    });

    it('should display center description', () => {
      cy.get('.description-section p').should('be.visible');
      cy.get('.description-section').should('contain', '4,500 detainees');
    });
  });

  describe('🎮 Panel Interactions', () => {
    it('should close details panel when clicking close button', () => {
      cy.get('.marker-label').contains('Londres 38').click();
      cy.get('.center-details-panel').should('be.visible');

      cy.get('.close-btn').click();
      cy.get('.center-details-panel').should('not.exist');
    });

    it('should remove selected marker styling after closing panel', () => {
      cy.get('.marker-label').contains('Villa Grimaldi').click();
      cy.get('.map-marker.selected').should('exist');

      cy.get('.close-btn').click();
      cy.get('.map-marker.selected').should('not.exist');
    });

    it('should keep panel open when clicking inside it', () => {
      cy.get('.marker-label').contains('Villa Grimaldi').click();
      cy.get('.center-details-panel').should('be.visible');

      cy.get('.panel-content').click();
      cy.get('.center-details-panel').should('be.visible');
    });
  });

  describe('🗂️ Centers List View', () => {
    it('should display centers list section', () => {
      cy.get('.centers-list-compact').should('be.visible');
    });

    it('should show total count of centers', () => {
      cy.get('.centers-list-compact h3').should('contain', 'All DINA Torture Centers (6)');
    });

    it('should display all 6 centers in compact card grid', () => {
      cy.get('.center-compact-card').should('have.length', 6);
    });

    it('should show center names in compact cards', () => {
      cy.get('.center-compact-card h4').should('contain', 'Villa Grimaldi');
      cy.get('.center-compact-card h4').should('contain', 'Londres 38');
    });

    it('should display level badges for each center', () => {
      cy.get('.level-badge').should('have.length', 6);
    });

    it('should color-code level badges correctly', () => {
      // Find critical level badge and verify color
      cy.get('.center-compact-card.critical .level-badge')
        .first()
        .should('have.css', 'background-color');
    });

    it('should show location in compact cards', () => {
      cy.get('.compact-card-info').first()
        .should('contain', '📍');
    });

    it('should show period in compact cards', () => {
      cy.get('.compact-card-info').first()
        .should('contain', '📅');
    });

    it('should show victim count in compact cards', () => {
      cy.get('.victim-count').should('have.length', 6);
      cy.get('.victim-count').first().should('contain', '💀');
    });

    it('should open details panel when clicking compact card', () => {
      cy.get('.center-compact-card').first().click();
      cy.get('.center-details-panel').should('be.visible');
    });

    it('should show correct details for clicked compact card', () => {
      cy.get('.center-compact-card h4').contains('Londres 38')
        .parents('.center-compact-card')
        .click();

      cy.get('.panel-header h3').should('contain', 'Londres 38');
    });
  });

  describe('🌍 Map View Toggle', () => {
    it('should switch to Chile Overview when clicking Chile button', () => {
      cy.get('.map-view-btn').contains('Chile Overview').click();

      cy.get('.map-view-btn.active').should('contain', 'Chile Overview');
    });

    it('should remove active class from Santiago when switching to Chile', () => {
      cy.get('.map-view-btn').contains('Chile Overview').click();

      cy.get('.map-view-btn').contains('Santiago Focus')
        .should('not.have.class', 'active');
    });

    it('should switch back to Santiago Focus when clicking Santiago button', () => {
      cy.get('.map-view-btn').contains('Chile Overview').click();
      cy.get('.map-view-btn').contains('Santiago Focus').click();

      cy.get('.map-view-btn.active').should('contain', 'Santiago Focus');
    });

    it('should maintain selected center when toggling views', () => {
      // Select a center
      cy.get('.marker-label').contains('Villa Grimaldi').click();
      cy.get('.panel-header h3').should('contain', 'Villa Grimaldi');

      // Toggle view
      cy.get('.map-view-btn').contains('Chile Overview').click();

      // Details should still be visible
      cy.get('.panel-header h3').should('contain', 'Villa Grimaldi');
    });
  });

  describe('📊 Data Completeness', () => {
    it('should display complete data for Villa Grimaldi (most important center)', () => {
      cy.get('.marker-label').contains('Villa Grimaldi').click();

      cy.get('.panel-content').within(() => {
        cy.contains('Cuartel Terranova').should('exist'); // Code name
        cy.contains('~4,500').should('exist'); // Detainees
        cy.contains('240+').should('exist'); // Killed
        cy.contains('MOST IMPORTANT DINA COMPLEX').should('exist'); // Significance
        cy.get('.torture-methods-section li').should('have.length.at.least', 3);
        cy.contains('Peace Park Memorial').should('exist'); // Current status
      });
    });

    it('should display complete data for Londres 38 (first DINA center)', () => {
      cy.get('.marker-label').contains('Londres 38').click();

      cy.get('.panel-content').within(() => {
        cy.contains('Yucatán').should('exist'); // Code name
        cy.contains('~1,100').should('exist'); // Detainees
        cy.contains('94 executed').should('exist'); // Killed
        cy.contains('FIRST DINA DETENTION CENTER').should('exist'); // Significance
        cy.contains('Memorial & Human Rights Center').should('exist');
      });
    });

    it('should display data for all 6 centers', () => {
      const centers = ['Villa Grimaldi', 'Londres 38', 'Jose Domingo Cañas', 'Cuatro Alamos', 'Venecia', 'Malloco'];

      centers.forEach((centerName) => {
        cy.get('.marker-label').contains(centerName).click();

        // Verify all panels have required data
        cy.get('.panel-content').within(() => {
          cy.contains('Code Name:').should('exist');
          cy.contains('Location:').should('exist');
          cy.contains('Period:').should('exist');
          cy.contains('Detainees:').should('exist');
          cy.contains('Killed/Disappeared:').should('exist');
        });

        cy.get('.close-btn').click();
      });
    });
  });

  describe('🎨 Visual Styling & Colors', () => {
    it('should apply correct background color for critical markers', () => {
      cy.get('.map-marker.critical').first()
        .should('have.css', 'background-color', 'rgb(220, 38, 38)'); // Red
    });

    it('should apply correct background color for high markers', () => {
      cy.get('.map-marker.high').first()
        .should('have.css', 'background-color', 'rgb(234, 88, 12)'); // Orange
    });

    it('should apply correct background color for medium markers', () => {
      cy.get('.map-marker.medium').first()
        .should('have.css', 'background-color', 'rgb(202, 138, 4)'); // Yellow
    });

    it('should display map grid lines', () => {
      cy.get('.map-grid').should('be.visible');
      cy.get('.grid-line.horizontal').should('have.length.at.least', 1);
      cy.get('.grid-line.vertical').should('have.length.at.least', 1);
    });
  });

  describe('🕊️ Map Footer & Memorial Information', () => {
    it('should display map footer', () => {
      cy.get('.map-footer').should('be.visible');
    });

    it('should show memorial note about visiting sites', () => {
      cy.get('.memorial-note').should('be.visible')
        .and('contain', '🕊️')
        .and('contain', 'memorials')
        .and('contain', 'visited');
    });

    it('should show network note about DINA operations', () => {
      cy.get('.network-note').should('be.visible')
        .and('contain', '🗺️')
        .and('contain', 'DINA operated')
        .and('contain', 'systematic network');
    });

    it('should include Neko signature in footer', () => {
      cy.get('.map-footer').should('contain', 'nyaa~');
    });
  });

  describe('🎯 Edge Cases & Error Handling', () => {
    it('should handle rapid marker clicking', () => {
      for (let i = 0; i < 10; i++) {
        cy.get('.map-marker').eq(i % 6).click();
        cy.wait(100);
      }

      // Should still be functional
      cy.get('.center-details-panel').should('be.visible');
    });

    it('should handle clicking same marker twice', () => {
      cy.get('.marker-label').contains('Villa Grimaldi').click();
      cy.get('.panel-header h3').should('contain', 'Villa Grimaldi');

      cy.get('.marker-label').contains('Villa Grimaldi').click();
      cy.get('.panel-header h3').should('contain', 'Villa Grimaldi');
    });

    it('should handle clicking marker while panel is open', () => {
      cy.get('.marker-label').contains('Villa Grimaldi').click();
      cy.get('.panel-header h3').should('contain', 'Villa Grimaldi');

      cy.get('.marker-label').contains('Londres 38').click();
      cy.get('.panel-header h3').should('contain', 'Londres 38');
    });

    it('should handle opening and closing panel multiple times', () => {
      for (let i = 0; i < 5; i++) {
        cy.get('.marker-label').contains('Villa Grimaldi').click();
        cy.get('.center-details-panel').should('be.visible');
        cy.get('.close-btn').click();
        cy.get('.center-details-panel').should('not.exist');
      }
    });
  });

  describe('📱 Responsive Map Behavior', () => {
    it('should be visible on mobile viewport', () => {
      cy.viewport(375, 667);
      cy.get('.dina-centers-map-container').should('be.visible');
      cy.get('.map-marker').should('be.visible');
    });

    it('should be visible on tablet viewport', () => {
      cy.viewport(768, 1024);
      cy.get('.dina-centers-map-container').should('be.visible');
      cy.get('.centers-list-compact').should('be.visible');
    });

    it('should be visible on desktop viewport', () => {
      cy.viewport(1920, 1080);
      cy.get('.dina-centers-map-container').should('be.visible');
      cy.get('.map-canvas').should('be.visible');
    });

    it('should handle viewport changes while details panel is open', () => {
      cy.get('.marker-label').contains('Villa Grimaldi').click();
      cy.get('.center-details-panel').should('be.visible');

      cy.viewport(768, 1024);
      cy.get('.center-details-panel').should('be.visible');

      cy.viewport(375, 667);
      cy.get('.center-details-panel').should('be.visible');
    });
  });

  describe('♿ Accessibility Features', () => {
    it('should have title attributes on markers for tooltips', () => {
      cy.get('.map-marker').first().should('have.attr', 'title');
    });

    it('should make markers clickable for keyboard navigation', () => {
      cy.get('.map-marker').first().should('be.visible');
      cy.get('.map-marker').first().click();
      cy.get('.center-details-panel').should('be.visible');
    });

    it('should make compact cards clickable', () => {
      cy.get('.center-compact-card').first().should('be.visible').click();
      cy.get('.center-details-panel').should('be.visible');
    });
  });
});
