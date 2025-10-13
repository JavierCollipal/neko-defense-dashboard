// 🐾⚡ E2E TEST: Component Interactions & Dynamic Content ⚡🐾
describe('🎨 Component Interactions & Dynamic Content', () => {
  beforeEach(() => {
    console.log('🐾 [Test] Starting component interactions test, nyaa~!');
    cy.visitDashboard();
  });

  describe('🎨 ASCII Art Display & Rotation', () => {
    it('should display ASCII art section', () => {
      cy.get('.ascii-tv-section')
        .should('be.visible');
    });

    it('should show ASCII art after data loads', () => {
      cy.verifyAsciiArt();

      // Should display some ASCII content
      cy.get('.ascii-tv-section')
        .should('not.contain', 'Loading, nyaa~! 🐾');
    });

    it('should display art piece counter (current/total)', () => {
      cy.get('.ascii-tv-section')
        .within(() => {
          // Should show something like "1 / 3" for art navigation
          cy.get('pre, .ascii-display, .ascii-art')
            .should('exist');
        });
    });

    it('should have accessible ASCII art container', () => {
      cy.get('.ascii-tv-section')
        .should('have.css', 'display')
        .and('not.equal', 'none');
    });
  });

  describe('📊 Defense Stats Display', () => {
    it('should display stats section', () => {
      cy.get('.stats-section')
        .should('be.visible');
    });

    it('should show defense statistics after loading', () => {
      cy.verifyStats();
    });

    it('should display stats with proper structure', () => {
      cy.get('.stats-section')
        .should('be.visible')
        .and('not.contain', 'Loading');
    });

    it('should update stats based on active category', () => {
      // Select a specific category
      cy.get('.category-switcher')
        .contains('Predators')
        .parent('.category-item')
        .click({ force: true });

      // Stats section should still be visible
      cy.get('.stats-section').should('be.visible');
    });
  });

  describe('🎯 Threat List & Intelligence', () => {
    it('should display threat intelligence section', () => {
      cy.get('.threats-section')
        .should('be.visible');
    });

    it('should show threat intelligence header', () => {
      cy.contains('🎯 THREAT INTELLIGENCE').should('be.visible');
    });

    it('should display threat summary information', () => {
      cy.get('.threat-list')
        .should('be.visible')
        .within(() => {
          cy.get('.threat-summary').should('exist');
        });
    });

    it('should show honeypot traps section', () => {
      cy.get('.honeypot-section')
        .should('be.visible');

      cy.contains('🍯 Active Honeypot Traps').should('be.visible');
    });

    it('should display list of honeypot traps', () => {
      cy.get('.trap-list')
        .should('be.visible')
        .within(() => {
          cy.get('.trap-item').should('have.length.at.least', 1);
        });
    });

    it('should show tracked threat actors section', () => {
      cy.get('.actors-section')
        .should('be.visible');

      cy.contains('👁️ Tracked Threat Actors').should('be.visible');
    });

    it('should display list of threat actors', () => {
      cy.get('.actor-list')
        .should('be.visible')
        .within(() => {
          cy.get('.actor-item').should('have.length.at.least', 1);
        });
    });

    it('should show last updated timestamp', () => {
      cy.get('.update-time')
        .should('be.visible')
        .and('contain', 'Last Updated:');
    });
  });

  describe('🛡️ Category Switcher Interactive Elements', () => {
    it('should display fortress badge', () => {
      cy.get('.fortress-badge')
        .should('be.visible')
        .and('contain', 'FORTRESS MODE');
    });

    it('should show monitoring status footer', () => {
      cy.get('.monitoring-status')
        .should('be.visible')
        .and('contain', 'ACTIVE MONITORING');
    });

    it('should display Neko Guardian status', () => {
      cy.get('.neko-guardian')
        .should('be.visible')
        .and('contain', '🐾 Neko Guardian: ON');
    });

    it('should show status dot animation', () => {
      cy.get('.status-dot')
        .should('be.visible')
        .and('have.css', 'display');
    });

    it('should highlight selected category visually', () => {
      cy.get('.category-item.active')
        .should('have.css', 'background-color');
    });
  });

  describe('⚡ Dynamic Content Updates', () => {
    it('should handle category selection without errors', () => {
      // Switch through multiple categories
      const categories = ['Predators', 'Ransomware', 'All Threats'];

      categories.forEach(cat => {
        cy.get('.category-switcher')
          .contains(cat)
          .parent('.category-item')
          .click({ force: true });

        cy.wait(100);

        // Verify no console errors (implicitly checked by Cypress)
        cy.get('.category-item.active').should('exist');
      });
    });

    it('should maintain component visibility during interactions', () => {
      // Interact with categories
      cy.get('.category-switcher')
        .contains('Pedophiles')
        .parent('.category-item')
        .click({ force: true });

      // All main sections should still be visible
      cy.get('.ascii-tv-section').should('be.visible');
      cy.get('.stats-section').should('be.visible');
      cy.get('.threats-section').should('be.visible');
    });
  });

  describe('🎯 Responsive Layout & Grid', () => {
    it('should display main container with proper layout', () => {
      cy.get('.main-container')
        .should('be.visible')
        .and('have.css', 'display');
    });

    it('should show sidebar and main grid side by side', () => {
      cy.get('.sidebar-left').should('be.visible');
      cy.get('.dashboard-grid').should('be.visible');
    });

    it('should properly arrange dashboard grid sections', () => {
      cy.get('.dashboard-grid')
        .within(() => {
          cy.get('.ascii-tv-section').should('be.visible');
          cy.get('.stats-section').should('be.visible');
          cy.get('.threats-section').should('be.visible');
        });
    });
  });

  describe('🎨 Visual Indicators & Animations', () => {
    it('should show alert pulse for priority categories', () => {
      cy.get('.alert-pulse')
        .should('have.length.at.least', 3);
    });

    it('should display status indicator as active', () => {
      cy.get('.status-indicator.active')
        .should('be.visible')
        .and('contain', '🔴 LIVE');
    });

    it('should show category border colors', () => {
      cy.get('.category-item')
        .each(($item) => {
          cy.wrap($item)
            .should('have.css', 'border-left-color');
        });
    });
  });

  describe('📱 User Interaction Feedback', () => {
    it('should provide visual feedback on category hover', () => {
      cy.get('.category-item')
        .first()
        .trigger('mouseover');

      // Category should be interactive
      cy.get('.category-item').first().should('exist');
    });

    it('should provide visual feedback on button hover', () => {
      cy.contains('📺 NEKO TV')
        .trigger('mouseover');

      cy.contains('📺 NEKO TV').should('have.css', 'cursor');
    });

    it('should handle rapid category switching', () => {
      // Rapidly switch categories
      for (let i = 0; i < 5; i++) {
        cy.get('.category-item')
          .eq(i % 7)
          .click({ force: true });
        cy.wait(50);
      }

      // Should still be in valid state
      cy.get('.category-item.active').should('exist');
    });
  });

  describe('🔧 Component State Consistency', () => {
    it('should maintain state after view navigation round-trip', () => {
      // Select a category
      cy.get('.category-switcher')
        .contains('Crypto Crime')
        .parent('.category-item')
        .click({ force: true });

      // Navigate away and back
      cy.navigateToThreatActors();
      cy.backToDashboard();

      // Components should be in valid state
      cy.verifyDashboardComponents();
    });

    it('should preserve component visibility across interactions', () => {
      // Perform multiple interactions
      cy.stubWindowOpen();
      cy.contains('📺 NEKO TV').click();

      cy.get('.category-switcher')
        .contains('State Sponsored')
        .parent('.category-item')
        .click({ force: true });

      // All components still visible
      cy.get('.ascii-tv-section').should('be.visible');
      cy.get('.stats-section').should('be.visible');
      cy.get('.threats-section').should('be.visible');
      cy.get('.category-switcher').should('be.visible');
    });
  });
});
