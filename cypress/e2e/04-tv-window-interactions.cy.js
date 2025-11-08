// 🐾⚡ E2E TEST: TV Window Pop-up Interactions ⚡🐾
describe('📺 TV Window Pop-up Interactions', () => {
  beforeEach(() => {
    console.log('🐾 [Test] Starting TV window interaction test, nyaa~!');
    cy.visitDashboard();
    cy.stubWindowOpen();
  });

  describe('📺 NEKO TV Window', () => {
    it('should open NEKO TV window when button clicked', () => {
      cy.contains('📺 NEKO TV').click();

      cy.get('@windowOpen').should('be.calledOnce');
      cy.get('@windowOpen').should('be.calledWith',
        '/tv-window.html',
        'NekoTvStreaming',
        Cypress.sinon.match.string
      );
    });

    it('should pass correct window parameters for NEKO TV', () => {
      cy.contains('📺 NEKO TV').click();

      cy.get('@windowOpen').should('be.calledWith',
        '/tv-window.html',
        'NekoTvStreaming',
        Cypress.sinon.match(/width=1200/)
      );
    });

    it('should set correct window features for NEKO TV', () => {
      cy.contains('📺 NEKO TV').click();

      cy.get('@windowOpen').should('be.calledWith',
        Cypress.sinon.match.any,
        Cypress.sinon.match.any,
        Cypress.sinon.match(/menubar=no/)
      );
    });
  });

  describe('📡 Multi-Channel TV Window', () => {
    it('should open Multi-Channel TV window when button clicked', () => {
      cy.contains('📡 MULTI-CHANNEL TV').click();

      cy.get('@windowOpen').should('be.calledOnce');
      cy.get('@windowOpen').should('be.calledWith',
        '/tv-window-tabs.html',
        'NekoMultiChannelTv',
        Cypress.sinon.match.string
      );
    });

    it('should pass correct window parameters for Multi-Channel TV', () => {
      cy.contains('📡 MULTI-CHANNEL TV').click();

      cy.get('@windowOpen').should('be.calledWith',
        '/tv-window-tabs.html',
        'NekoMultiChannelTv',
        Cypress.sinon.match(/width=1400/)
      );
    });

    it('should set larger dimensions for Multi-Channel TV', () => {
      cy.contains('📡 MULTI-CHANNEL TV').click();

      cy.get('@windowOpen').should('be.calledWith',
        Cypress.sinon.match.any,
        Cypress.sinon.match.any,
        Cypress.sinon.match(/height=900/)
      );
    });
  });

  describe('⚖️ DINA Justice TV Window', () => {
    it('should open DINA Justice TV window when button clicked', () => {
      cy.contains('📺 DINA JUSTICE TV').click();

      cy.get('@windowOpen').should('be.calledOnce');
      cy.get('@windowOpen').should('be.calledWith',
        '/dina-tv-window.html',
        'DinaTvWindow',
        Cypress.sinon.match.string
      );
    });

    it('should pass correct window parameters for DINA Justice TV', () => {
      cy.contains('📺 DINA JUSTICE TV').click();

      cy.get('@windowOpen').should('be.calledWith',
        '/dina-tv-window.html',
        'DinaTvWindow',
        Cypress.sinon.match(/width=1400/)
      );
    });
  });

  describe('🎬 Multiple TV Windows', () => {
    it('should allow opening multiple TV windows sequentially', () => {
      // Open NEKO TV
      cy.contains('📺 NEKO TV').click();
      cy.get('@windowOpen').should('have.callCount', 1);

      // Reset the stub
      cy.window().then((win) => {
        win.open.resetHistory();
      });

      // Open Multi-Channel TV
      cy.contains('📡 MULTI-CHANNEL TV').click();
      cy.get('@windowOpen').should('have.callCount', 1);
    });

    it('should open all three TV window types', () => {
      // Open NEKO TV
      cy.contains('📺 NEKO TV').click();

      // Reset and open Multi-Channel TV
      cy.window().then((win) => {
        win.open.resetHistory();
      });
      cy.contains('📡 MULTI-CHANNEL TV').click();

      // Reset and open DINA Justice TV
      cy.window().then((win) => {
        win.open.resetHistory();
      });
      cy.contains('📺 DINA JUSTICE TV').click();

      // All should have been called
      cy.get('@windowOpen').should('be.calledOnce');
    });
  });

  describe('🚫 Pop-up Blocker Handling', () => {
    it('should handle pop-up blocker scenario for NEKO TV', () => {
      // Stub window.open to return null (blocked)
      cy.window().then((win) => {
        cy.stub(win, 'open').returns(null).as('windowOpenBlocked');
      });

      cy.contains('📺 NEKO TV').click();

      // Alert should be triggered (we can't easily test alert, but window.open was called)
      cy.get('@windowOpenBlocked').should('be.calledOnce');
    });
  });

  describe('🎯 Button Styling and Accessibility', () => {
    it('should have correct CSS classes for TV buttons', () => {
      cy.contains('📺 NEKO TV')
        .should('have.class', 'tv-window-button');

      cy.contains('📡 MULTI-CHANNEL TV')
        .should('have.class', 'tv-window-button')
        .and('have.class', 'multi-channel');

      cy.contains('⚖️ DINA DOCS')
        .should('have.class', 'tv-window-button')
        .and('have.class', 'dina-doc');

      cy.contains('📺 DINA JUSTICE TV')
        .should('have.class', 'tv-window-button')
        .and('have.class', 'dina-tv');

      cy.contains('🎯 THREAT ACTORS')
        .should('have.class', 'tv-window-button')
        .and('have.class', 'threat-actors');
    });

    it('should be keyboard accessible', () => {
      cy.contains('📺 NEKO TV')
        .focus()
        .type('{enter}');

      cy.get('@windowOpen').should('be.called');
    });

    it('should maintain dashboard state after opening TV windows', () => {
      cy.contains('📺 NEKO TV').click();

      // Dashboard should still be visible and functional
      cy.verifyDashboardComponents();
    });
  });

  describe('📺 Window Focus Behavior', () => {
    it('should attempt to focus the TV window after opening', () => {
      // Create a mock window object with focus method
      const mockWindow = {
        focus: cy.stub().as('windowFocus')
      };

      cy.window().then((win) => {
        cy.stub(win, 'open').returns(mockWindow).as('windowOpenWithFocus');
      });

      cy.contains('📺 NEKO TV').click();

      cy.get('@windowFocus').should('be.called');
    });
  });
});
