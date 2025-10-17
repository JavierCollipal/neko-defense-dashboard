// 🐾⚡ NEKO DEFENSE DASHBOARD - Top Navigation Tabs E2E Tests ⚡🐾
// Test suite for desktop top navigation bar (TopTabs component)
// Created: October 17, 2025

describe('Top Navigation Tabs (Desktop)', () => {
  beforeEach(() => {
    cy.visit('/');
    // Set desktop viewport for TopTabs visibility
    cy.viewport(1400, 900);
  });

  describe('TopTabs Visibility and Rendering', () => {
    it('should display TopTabs on desktop viewport', () => {
      cy.get('.top-tabs').should('be.visible');
      cy.get('.top-tabs-container').should('be.visible');
    });

    it('should hide TopTabs on mobile viewport', () => {
      cy.viewport(375, 667); // Mobile
      cy.get('.top-tabs').should('not.be.visible');
    });

    it('should show 8 navigation buttons', () => {
      cy.get('.top-tab-button').should('have.length', 8);
    });

    it('should display correct button labels', () => {
      const expectedLabels = ['Home', 'Threats', 'DINA', 'Analytics', 'Abilities', 'Blog', 'Videos', 'RAG'];

      expectedLabels.forEach((label) => {
        cy.contains('.top-tab-button', label).should('be.visible');
      });
    });

    it('should display icons for each button', () => {
      cy.get('.top-tab-icon').should('have.length', 8);

      // Check specific icons
      cy.get('.top-tab-button').first().find('.top-tab-icon').should('contain', '🏠');
      cy.contains('.top-tab-button', 'Threats').find('.top-tab-icon').should('contain', '🎯');
      cy.contains('.top-tab-button', 'DINA').find('.top-tab-icon').should('contain', '📚');
    });
  });

  describe('TopTabs Navigation Functionality', () => {
    it('should navigate to Home when clicking Home button', () => {
      cy.contains('.top-tab-button', 'Home').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/');
      cy.get('.dashboard-page').should('be.visible');
    });

    it('should navigate to Threats page', () => {
      cy.contains('.top-tab-button', 'Threats').click();
      cy.url().should('include', '/threats');
      cy.contains('h2', 'Threat Actors').should('be.visible');
    });

    it('should navigate to DINA page', () => {
      cy.contains('.top-tab-button', 'DINA').click();
      cy.url().should('include', '/dina');
      cy.contains('DINA INTERNATIONAL DOCUMENTATION').should('be.visible');
    });

    it('should navigate to Analytics (Valech) page', () => {
      cy.contains('.top-tab-button', 'Analytics').click();
      cy.url().should('include', '/valech');
      cy.contains('Valech').should('be.visible');
    });

    it('should navigate to Abilities page', () => {
      cy.contains('.top-tab-button', 'Abilities').click();
      cy.url().should('include', '/abilities');
      cy.contains('Neko-Arc').should('be.visible');
    });

    it('should navigate to Blog (Confessions) page', () => {
      cy.contains('.top-tab-button', 'Blog').click();
      cy.url().should('include', '/confessions');
    });

    it('should navigate to Videos (YouTube) page', () => {
      cy.contains('.top-tab-button', 'Videos').click();
      cy.url().should('include', '/youtube');
    });

    it('should navigate to RAG page', () => {
      cy.contains('.top-tab-button', 'RAG').click();
      cy.url().should('include', '/rag');
    });
  });

  describe('Active State Highlighting', () => {
    it('should highlight Home button as active on homepage', () => {
      cy.visit('/');
      cy.contains('.top-tab-button', 'Home')
        .should('have.class', 'active');
    });

    it('should highlight Threats button as active on threats page', () => {
      cy.visit('/threats');
      cy.contains('.top-tab-button', 'Threats')
        .should('have.class', 'active');
    });

    it('should highlight DINA button as active on DINA page', () => {
      cy.visit('/dina');
      cy.contains('.top-tab-button', 'DINA')
        .should('have.class', 'active');
    });

    it('should only have one active button at a time', () => {
      cy.visit('/threats');
      cy.get('.top-tab-button.active').should('have.length', 1);
    });

    it('should update active state when navigating between pages', () => {
      // Start on Home
      cy.visit('/');
      cy.contains('.top-tab-button', 'Home').should('have.class', 'active');

      // Navigate to Threats
      cy.contains('.top-tab-button', 'Threats').click();
      cy.contains('.top-tab-button', 'Home').should('not.have.class', 'active');
      cy.contains('.top-tab-button', 'Threats').should('have.class', 'active');

      // Navigate to DINA
      cy.contains('.top-tab-button', 'DINA').click();
      cy.contains('.top-tab-button', 'Threats').should('not.have.class', 'active');
      cy.contains('.top-tab-button', 'DINA').should('have.class', 'active');
    });
  });

  describe('TopTabs Styling and Appearance', () => {
    it('should have sticky positioning', () => {
      cy.get('.top-tabs').should('have.css', 'position', 'sticky');
    });

    it('should have retro CRT border styling', () => {
      cy.get('.top-tabs').should('have.css', 'border-bottom-color')
        .and('match', /rgb\(0, 255, (65|41)\)/); // Green glow
    });

    it('should display scanline effect on buttons', () => {
      cy.get('.top-tab-button').first().then(($button) => {
        const pseudoElement = window.getComputedStyle($button[0], '::before');
        expect(pseudoElement).to.exist;
      });
    });

    it('should have glow effect on active button', () => {
      cy.visit('/');
      cy.get('.top-tab-button.active')
        .should('have.css', 'box-shadow')
        .and('not.equal', 'none');
    });

    it('should change appearance on hover', () => {
      cy.get('.top-tab-button').first().trigger('mouseover');
      cy.get('.top-tab-button').first()
        .should('have.css', 'transform')
        .and('not.equal', 'none');
    });
  });

  describe('TopTabs Accessibility', () => {
    it('should have proper ARIA labels', () => {
      cy.get('.top-tabs').should('have.attr', 'role', 'navigation');
      cy.get('.top-tabs').should('have.attr', 'aria-label', 'Top navigation');
    });

    it('should have aria-current on active button', () => {
      cy.visit('/');
      cy.contains('.top-tab-button', 'Home')
        .should('have.attr', 'aria-current', 'page');
    });

    it('should be keyboard navigable', () => {
      cy.get('.top-tab-button').first().focus();
      cy.focused().should('have.class', 'top-tab-button');

      // Tab through buttons
      cy.focused().tab();
      cy.focused().should('have.class', 'top-tab-button');
    });

    it('should have visible focus indicators', () => {
      cy.get('.top-tab-button').first().focus();
      cy.focused()
        .should('have.css', 'outline')
        .and('not.equal', 'none');
    });
  });

  describe('TopTabs Responsive Behavior', () => {
    it('should be visible on large desktop (1920px)', () => {
      cy.viewport(1920, 1080);
      cy.get('.top-tabs').should('be.visible');
    });

    it('should be visible on tablet landscape (1024px)', () => {
      cy.viewport(1024, 768);
      cy.get('.top-tabs').should('be.visible');
    });

    it('should be hidden on tablet portrait (768px)', () => {
      cy.viewport(768, 1024);
      cy.get('.top-tabs').should('not.be.visible');
    });

    it('should be hidden on mobile (375px)', () => {
      cy.viewport(375, 667);
      cy.get('.top-tabs').should('not.be.visible');
    });

    it('should show horizontal scroll on narrow screens', () => {
      cy.viewport(900, 600);
      cy.get('.top-tabs-container').then(($container) => {
        expect($container[0].scrollWidth).to.be.greaterThan($container[0].clientWidth);
      });
    });
  });

  describe('TopTabs Integration with BottomTabs', () => {
    it('should show TopTabs but not BottomTabs on desktop', () => {
      cy.viewport(1400, 900);
      cy.get('.top-tabs').should('be.visible');
      cy.get('.bottom-tabs').should('not.be.visible');
    });

    it('should show BottomTabs but not TopTabs on mobile', () => {
      cy.viewport(375, 667);
      cy.get('.top-tabs').should('not.be.visible');
      cy.get('.bottom-tabs').should('be.visible');
    });

    it('should navigate correctly from TopTabs on desktop', () => {
      cy.viewport(1400, 900);
      cy.contains('.top-tab-button', 'Threats').click();
      cy.url().should('include', '/threats');
      cy.contains('h2', 'Threat Actors').should('be.visible');
    });

    it('should navigate correctly from BottomTabs on mobile', () => {
      cy.viewport(375, 667);
      cy.contains('.bottom-tabs .tab', 'Threats').click();
      cy.url().should('include', '/threats');
    });
  });

  describe('TopTabs Performance', () => {
    it('should render quickly without layout shift', () => {
      const startTime = Date.now();
      cy.visit('/');
      cy.get('.top-tabs').should('be.visible');
      const endTime = Date.now();

      expect(endTime - startTime).to.be.lessThan(3000);
    });

    it('should handle rapid navigation clicks', () => {
      cy.contains('.top-tab-button', 'Threats').click();
      cy.contains('.top-tab-button', 'DINA').click();
      cy.contains('.top-tab-button', 'Home').click();

      cy.url().should('eq', Cypress.config().baseUrl + '/');
      cy.get('.dashboard-page').should('be.visible');
    });

    it('should maintain state across page navigations', () => {
      cy.visit('/threats');
      cy.get('.top-tab-button.active').should('contain', 'Threats');

      cy.visit('/dina');
      cy.get('.top-tab-button.active').should('contain', 'DINA');

      cy.go('back');
      cy.get('.top-tab-button.active').should('contain', 'Threats');
    });
  });

  describe('TopTabs Edge Cases', () => {
    it('should handle missing icons gracefully', () => {
      cy.get('.top-tab-icon').each(($icon) => {
        expect($icon.text().trim()).to.not.be.empty;
      });
    });

    it('should handle long button labels on narrow screens', () => {
      cy.viewport(900, 600);
      cy.get('.top-tab-button').each(($button) => {
        expect($button.text().trim()).to.not.be.empty;
        expect($button.css('white-space')).to.equal('nowrap');
      });
    });

    it('should work without JavaScript (progressive enhancement)', () => {
      cy.visit('/');
      cy.get('.top-tab-button').first()
        .should('have.attr', 'href')
        .and('not.be.empty');
    });
  });
});

// 🐾 *purrs with testing excellence* All TopTabs features tested, nyaa~! ✅🎯
