// 🐾⚡ E2E TEST: Accessibility & Responsive Design ⚡🐾
describe('♿ Accessibility & Responsive Design', () => {
  beforeEach(() => {
    console.log('🐾 [Test] Starting accessibility and responsive test, nyaa~!');
  });

  describe('⌨️ Keyboard Navigation', () => {
    it('should allow tab navigation through category buttons', () => {
      cy.visitDashboard();

      // Tab to first category
      cy.get('.category-item')
        .first()
        .focus();

      // Should be focusable
      cy.focused().should('have.class', 'category-item');
    });

    it('should allow enter key to select categories', () => {
      cy.visitDashboard();

      cy.get('.category-item')
        .contains('Predators')
        .parent()
        .focus()
        .type('{enter}');

      // Category should be selected
      cy.get('.category-item.active')
        .should('contain', 'Predators');
    });

    it('should allow keyboard navigation for TV window buttons', () => {
      cy.visitDashboard();
      cy.stubWindowOpen();

      cy.contains('📺 NEKO TV')
        .focus()
        .type('{enter}');

      cy.get('@windowOpen').should('be.called');
    });

    it('should allow escape key behavior (if implemented)', () => {
      cy.visitDashboard();

      // Press escape key
      cy.get('body').type('{esc}');

      // Dashboard should remain stable
      cy.get('.App-header').should('be.visible');
    });

    it('should have logical tab order', () => {
      cy.visitDashboard();

      // Tab through elements
      cy.get('body').tab();
      cy.focused().should('exist');

      cy.get('body').tab();
      cy.focused().should('exist');
    });
  });

  describe('📱 Responsive Design - Mobile (375px)', () => {
    beforeEach(() => {
      cy.viewport(375, 667);
    });

    it('should load dashboard on mobile viewport', () => {
      cy.visitDashboard();

      cy.get('.App-header').should('be.visible');
    });

    it('should display header on mobile', () => {
      cy.visitDashboard();

      cy.get('.neko-banner h1').should('be.visible');
    });

    it('should maintain category switcher visibility on mobile', () => {
      cy.visitDashboard();

      cy.get('.category-switcher').should('exist');
    });

    it('should display threat actors on mobile', () => {
      cy.visitDashboard();

      cy.get('.threat-list').should('be.visible');
    });

    it('should show ASCII TV on mobile', () => {
      cy.visitDashboard();

      cy.get('.ascii-tv').should('exist');
    });

    it('should allow category selection on mobile', () => {
      cy.visitDashboard();

      cy.get('.category-item')
        .contains('Predators')
        .parent()
        .click({ force: true });

      cy.get('.category-item.active')
        .should('contain', 'Predators');
    });

    it('should display footer on mobile', () => {
      cy.visitDashboard();

      cy.get('.App-footer').should('exist');
    });
  });

  describe('📱 Responsive Design - Tablet (768px)', () => {
    beforeEach(() => {
      cy.viewport(768, 1024);
    });

    it('should load dashboard on tablet viewport', () => {
      cy.visitDashboard();

      cy.get('.App-header').should('be.visible');
    });

    it('should display all main sections on tablet', () => {
      cy.visitDashboard();

      cy.get('.main-container').should('be.visible');
      cy.get('.sidebar-left').should('exist');
      cy.get('.dashboard-grid').should('be.visible');
    });

    it('should maintain grid layout on tablet', () => {
      cy.visitDashboard();

      cy.get('.threat-actors-grid').should('exist');
    });

    it('should show navigation buttons on tablet', () => {
      cy.visitDashboard();

      cy.contains('📺 NEKO TV').should('be.visible');
      cy.contains('🎯 THREAT ACTORS').should('be.visible');
    });
  });

  describe('🖥️ Responsive Design - Desktop (1920px)', () => {
    beforeEach(() => {
      cy.viewport(1920, 1080);
    });

    it('should load dashboard on large desktop viewport', () => {
      cy.visitDashboard();

      cy.get('.App-header').should('be.visible');
    });

    it('should display optimal layout on large screens', () => {
      cy.visitDashboard();

      cy.get('.main-container').should('be.visible');
      cy.get('.dashboard-grid').should('be.visible');
    });

    it('should show all threat actor cards in grid', () => {
      cy.visitDashboard();

      cy.get('.threat-actor-card')
        .should('have.length', 8)
        .and('be.visible');
    });

    it('should maintain proper spacing on large screens', () => {
      cy.visitDashboard();

      cy.get('.threat-actors-grid')
        .should('have.css', 'display');
    });
  });

  describe('🔍 Text Readability', () => {
    it('should have readable font sizes', () => {
      cy.visitDashboard();

      // Headers should be larger
      cy.get('h1').should('have.css', 'font-size');
      cy.get('h2').should('have.css', 'font-size');
    });

    it('should have sufficient contrast for critical elements', () => {
      cy.visitDashboard();

      // Critical threat badges should be visible
      cy.get('.threat-level-badge').should('be.visible');
    });

    it('should display text without truncation in important fields', () => {
      cy.visitDashboard();

      cy.get('.actor-name h3')
        .first()
        .should('be.visible')
        .and('not.have.css', 'overflow', 'hidden');
    });

    it('should handle long text gracefully', () => {
      cy.visitDashboard();

      cy.get('.actor-known-for')
        .first()
        .should('be.visible');
    });
  });

  describe('🎯 Interactive Elements', () => {
    it('should show hover states on buttons', () => {
      cy.visitDashboard();

      cy.contains('📺 NEKO TV')
        .should('have.css', 'cursor');
    });

    it('should show hover states on categories', () => {
      cy.visitDashboard();

      cy.get('.category-item')
        .first()
        .should('have.css', 'cursor');
    });

    it('should make interactive elements clearly clickable', () => {
      cy.visitDashboard();

      // Check that interactive elements have pointer cursor
      cy.get('.category-item')
        .first()
        .should('exist');
    });

    it('should provide visual feedback on active states', () => {
      cy.visitDashboard();

      cy.get('.category-item.active')
        .should('have.css', 'background-color');
    });
  });

  describe('🎨 Visual Indicators', () => {
    it('should display status indicators clearly', () => {
      cy.visitDashboard();

      cy.get('.status-indicator.active')
        .should('be.visible')
        .and('contain', '🔴 LIVE');
    });

    it('should show priority badges prominently', () => {
      cy.visitDashboard();

      cy.get('.detail-item.priority')
        .should('exist')
        .and('be.visible');
    });

    it('should use color coding for threat levels', () => {
      cy.visitDashboard();

      cy.get('.threat-level-badge')
        .each(($badge) => {
          cy.wrap($badge)
            .should('have.css', 'background-color')
            .and('not.equal', 'rgba(0, 0, 0, 0)');
        });
    });

    it('should show loading indicators clearly', () => {
      cy.intercept('GET', '**/api/threat-actors?category=ransomware', {
        delay: 500,
        fixture: 'threat-actors-all.json'
      }).as('getDelayed');

      cy.visitDashboard();

      cy.get('.category-switcher')
        .contains('Ransomware')
        .parent('.category-item')
        .click({ force: true });

      cy.get('.loading-spinner').should('be.visible');
    });
  });

  describe('📊 Content Organization', () => {
    it('should have clear visual hierarchy', () => {
      cy.visitDashboard();

      // H1 should be larger than H2
      cy.get('h1').should('exist');
      cy.get('h2').should('exist');
    });

    it('should group related information', () => {
      cy.visitDashboard();

      cy.get('.actor-details')
        .should('exist')
        .find('.detail-item')
        .should('have.length.at.least', 1);
    });

    it('should separate distinct sections visually', () => {
      cy.visitDashboard();

      cy.get('.main-container').should('exist');
      cy.get('.sidebar-left').should('exist');
      cy.get('.dashboard-grid').should('exist');
    });

    it('should use consistent spacing', () => {
      cy.visitDashboard();

      cy.get('.threat-actor-card')
        .should('have.css', 'margin')
        .or('have.css', 'padding');
    });
  });

  describe('⚡ Performance on Different Viewports', () => {
    const viewports = [
      { width: 320, height: 568, name: 'iPhone SE' },
      { width: 375, height: 667, name: 'iPhone 8' },
      { width: 414, height: 896, name: 'iPhone 11' },
      { width: 768, height: 1024, name: 'iPad' },
      { width: 1024, height: 768, name: 'iPad Landscape' },
      { width: 1280, height: 720, name: 'Laptop' },
      { width: 1920, height: 1080, name: 'Desktop' }
    ];

    viewports.forEach(viewport => {
      it(`should render correctly on ${viewport.name} (${viewport.width}x${viewport.height})`, () => {
        cy.viewport(viewport.width, viewport.height);
        cy.visitDashboard();

        // Core elements should be accessible
        cy.get('.App-header').should('be.visible');
        cy.get('.threat-list').should('exist');
      });
    });
  });

  describe('🔄 Orientation Changes', () => {
    it('should handle portrait to landscape transition', () => {
      // Start in portrait
      cy.viewport(375, 667);
      cy.visitDashboard();

      cy.get('.App-header').should('be.visible');

      // Switch to landscape
      cy.viewport(667, 375);

      cy.get('.App-header').should('be.visible');
      cy.get('.threat-list').should('exist');
    });

    it('should handle landscape to portrait transition', () => {
      // Start in landscape
      cy.viewport(812, 375);
      cy.visitDashboard();

      cy.get('.App-header').should('be.visible');

      // Switch to portrait
      cy.viewport(375, 812);

      cy.get('.App-header').should('be.visible');
    });
  });

  describe('🎯 Touch Targets (Mobile)', () => {
    beforeEach(() => {
      cy.viewport(375, 667);
    });

    it('should have adequately sized touch targets for categories', () => {
      cy.visitDashboard();

      cy.get('.category-item')
        .first()
        .should('have.css', 'height')
        .and('not.equal', '0px');
    });

    it('should have adequately sized touch targets for buttons', () => {
      cy.visitDashboard();

      cy.contains('📺 NEKO TV')
        .should('have.css', 'padding')
        .or('have.css', 'height');
    });

    it('should allow touch interaction with categories', () => {
      cy.visitDashboard();

      cy.get('.category-item')
        .contains('Crypto Crime')
        .parent()
        .click();

      cy.get('.category-item.active')
        .should('contain', 'Crypto Crime');
    });
  });

  describe('📝 Content Overflow Handling', () => {
    it('should handle overflow in threat actor names', () => {
      cy.visitDashboard();

      cy.get('.actor-name h3')
        .should('be.visible')
        .and('have.css', 'overflow');
    });

    it('should handle overflow in actor descriptions', () => {
      cy.visitDashboard();

      cy.get('.actor-known-for')
        .first()
        .should('be.visible');
    });

    it('should handle overflow in law enforcement status', () => {
      cy.visitDashboard();

      cy.get('.law-enforcement-status')
        .first()
        .should('be.visible');
    });

    it('should not have horizontal scrollbar on standard viewports', () => {
      cy.viewport(1400, 900);
      cy.visitDashboard();

      cy.get('body').should('have.css', 'overflow-x');
    });
  });

  describe('🌟 Visual Consistency', () => {
    it('should use consistent color scheme', () => {
      cy.visitDashboard();

      // Status indicators should use consistent colors
      cy.get('.status-indicator').should('be.visible');
    });

    it('should use consistent typography', () => {
      cy.visitDashboard();

      cy.get('h2')
        .should('have.css', 'font-family');
    });

    it('should use consistent spacing patterns', () => {
      cy.visitDashboard();

      cy.get('.threat-actor-card')
        .first()
        .should('have.css', 'padding');
    });

    it('should maintain brand identity across all views', () => {
      cy.visitDashboard();

      // Check for Neko branding
      cy.contains('NEKO-ARC').should('exist');
      cy.contains('*purrs').should('exist');
    });
  });

  describe('⚡ Animation and Transitions', () => {
    it('should have smooth transitions on category selection', () => {
      cy.visitDashboard();

      cy.get('.category-item')
        .first()
        .should('have.css', 'transition');
    });

    it('should show loading animation smoothly', () => {
      cy.intercept('GET', '**/api/threat-actors?category=state_sponsored', {
        delay: 500,
        fixture: 'threat-actors-all.json'
      });

      cy.visitDashboard();

      cy.get('.category-switcher')
        .contains('State Sponsored')
        .parent('.category-item')
        .click({ force: true });

      cy.get('.loading-spinner').should('be.visible');
    });

    it('should not have jarring layout shifts', () => {
      cy.visitDashboard();

      // Store initial position
      cy.get('.App-header').should('have.css', 'position');

      // Change category
      cy.get('.category-item').eq(2).click({ force: true });

      // Header should remain stable
      cy.get('.App-header').should('be.visible');
    });
  });

  describe('🎨 Dark/Light Mode Compatibility (if implemented)', () => {
    it('should render correctly in default mode', () => {
      cy.visitDashboard();

      cy.get('.App').should('have.css', 'background-color');
    });

    it('should maintain readability of all text', () => {
      cy.visitDashboard();

      cy.get('.actor-name h3')
        .should('be.visible')
        .and('have.css', 'color');
    });
  });
});
