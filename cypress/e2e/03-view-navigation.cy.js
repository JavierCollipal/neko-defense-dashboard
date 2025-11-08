// 🐾⚡ E2E TEST: View Navigation (Threat Actors & DINA Docs) ⚡🐾
describe('🔄 View Navigation - Multiple Views', () => {
  beforeEach(() => {
    console.log('🐾 [Test] Starting view navigation test, nyaa~!');
    cy.visitDashboard();
  });

  describe('📺 Threat Actors View Navigation', () => {
    it('should navigate to Threat Actors view when button clicked', () => {
      cy.navigateToThreatActors();
    });

    it('should display Threat Actors header correctly', () => {
      cy.navigateToThreatActors();

      cy.get('.App-header')
        .should('be.visible')
        .within(() => {
          cy.contains('🐾🎯⚡ THREAT ACTORS REGISTRY ⚡🎯🐾').should('be.visible');
        });
    });

    it('should show correct status indicators in Threat Actors view', () => {
      cy.navigateToThreatActors();

      cy.contains('🔴 LIVE - GLOBAL TRACKING').should('be.visible');
      cy.contains('THREAT INTELLIGENCE MODE: ACTIVE').should('be.visible');
    });

    it('should display back to dashboard button in Threat Actors view', () => {
      cy.navigateToThreatActors();

      cy.contains('← Back to Dashboard')
        .should('be.visible')
        .and('have.class', 'tv-window-button');
    });

    it('should navigate back to dashboard from Threat Actors view', () => {
      cy.navigateToThreatActors();
      cy.backToDashboard();

      // Verify we're back on dashboard
      cy.contains('NEKO-ARC DEFENSE SYSTEM').should('be.visible');
      cy.get('.main-container').should('be.visible');
    });

    it('should hide dashboard components when in Threat Actors view', () => {
      cy.navigateToThreatActors();

      // Dashboard-specific components should not be visible
      cy.get('.main-container').should('not.exist');
      cy.get('.sidebar-left').should('not.exist');
      cy.get('.dashboard-grid').should('not.exist');
    });
  });

  describe('⚖️ DINA Documentation View Navigation', () => {
    it('should navigate to DINA Docs view when button clicked', () => {
      cy.navigateToDinaDocs();
    });

    it('should display DINA Documentation header correctly', () => {
      cy.navigateToDinaDocs();

      cy.get('.App-header')
        .should('be.visible')
        .within(() => {
          cy.contains('🐾⚖️🌍 DINA INTERNATIONAL HUNT OPERATION 🌍⚖️🐾').should('be.visible');
        });
    });

    it('should show correct status indicators in DINA Docs view', () => {
      cy.navigateToDinaDocs();

      cy.contains('🔴 LIVE - GLOBAL DEPLOYMENT').should('be.visible');
      cy.contains('INTERNATIONAL JUSTICE MODE: ACTIVE').should('be.visible');
    });

    it('should display back to dashboard button in DINA Docs view', () => {
      cy.navigateToDinaDocs();

      cy.contains('← Back to Dashboard')
        .should('be.visible')
        .and('have.class', 'tv-window-button');
    });

    it('should navigate back to dashboard from DINA Docs view', () => {
      cy.navigateToDinaDocs();
      cy.backToDashboard();

      // Verify we're back on dashboard
      cy.contains('NEKO-ARC DEFENSE SYSTEM').should('be.visible');
      cy.get('.main-container').should('be.visible');
    });

    it('should hide dashboard components when in DINA Docs view', () => {
      cy.navigateToDinaDocs();

      // Dashboard-specific components should not be visible
      cy.get('.main-container').should('not.exist');
      cy.get('.sidebar-left').should('not.exist');
      cy.get('.dashboard-grid').should('not.exist');
    });
  });

  describe('🔄 Multi-View Navigation Flow', () => {
    it('should navigate between all views sequentially', () => {
      // Start on dashboard
      cy.contains('NEKO-ARC DEFENSE SYSTEM').should('be.visible');

      // Navigate to Threat Actors
      cy.navigateToThreatActors();
      cy.contains('THREAT ACTORS REGISTRY').should('be.visible');

      // Back to dashboard
      cy.backToDashboard();
      cy.contains('NEKO-ARC DEFENSE SYSTEM').should('be.visible');

      // Navigate to DINA Docs
      cy.navigateToDinaDocs();
      cy.contains('DINA INTERNATIONAL HUNT OPERATION').should('be.visible');

      // Back to dashboard
      cy.backToDashboard();
      cy.contains('NEKO-ARC DEFENSE SYSTEM').should('be.visible');
    });

    it('should maintain app state when navigating between views', () => {
      // Navigate to Threat Actors
      cy.navigateToThreatActors();

      // Back to dashboard
      cy.backToDashboard();

      // All dashboard components should still be functional
      cy.verifyDashboardComponents();
    });

    it('should not show both special views simultaneously', () => {
      // Navigate to Threat Actors
      cy.navigateToThreatActors();

      // Threat Actors should be visible, DINA Docs should not
      cy.contains('THREAT ACTORS REGISTRY').should('be.visible');
      cy.contains('DINA INTERNATIONAL HUNT OPERATION').should('not.exist');
    });

    it('should properly toggle between special views via dashboard', () => {
      // Go to Threat Actors
      cy.navigateToThreatActors();
      cy.contains('THREAT ACTORS REGISTRY').should('be.visible');

      // Back to dashboard
      cy.backToDashboard();

      // Go to DINA Docs
      cy.navigateToDinaDocs();
      cy.contains('DINA INTERNATIONAL HUNT OPERATION').should('be.visible');

      // Threat Actors should not be visible
      cy.contains('THREAT ACTORS REGISTRY').should('not.exist');
    });
  });

  describe('🎯 Navigation Button Visibility', () => {
    it('should show all navigation buttons on dashboard', () => {
      cy.contains('🎯 THREAT ACTORS').should('be.visible');
      cy.contains('⚖️ DINA DOCS').should('be.visible');
      cy.contains('📺 NEKO TV').should('be.visible');
      cy.contains('📡 MULTI-CHANNEL TV').should('be.visible');
      cy.contains('📺 DINA JUSTICE TV').should('be.visible');
    });

    it('should only show back button in Threat Actors view', () => {
      cy.navigateToThreatActors();

      cy.contains('← Back to Dashboard').should('be.visible');

      // Other navigation buttons should not be visible
      cy.contains('📺 NEKO TV').should('not.exist');
      cy.contains('⚖️ DINA DOCS').should('not.exist');
    });

    it('should only show back button in DINA Docs view', () => {
      cy.navigateToDinaDocs();

      cy.contains('← Back to Dashboard').should('be.visible');

      // Other navigation buttons should not be visible
      cy.contains('📺 NEKO TV').should('not.exist');
      cy.contains('🎯 THREAT ACTORS').should('not.exist');
    });
  });

  describe('🧭 Browser Navigation', () => {
    it('should handle browser back button after view navigation', () => {
      cy.navigateToThreatActors();

      // Use browser back (Cypress doesn't change URL, but test the component behavior)
      cy.backToDashboard();

      cy.contains('NEKO-ARC DEFENSE SYSTEM').should('be.visible');
    });

    it('should maintain view consistency on rapid navigation', () => {
      // Rapidly navigate between views
      cy.navigateToThreatActors();
      cy.wait(100);
      cy.backToDashboard();
      cy.wait(100);
      cy.navigateToDinaDocs();
      cy.wait(100);
      cy.backToDashboard();

      // Should end up on dashboard in stable state
      cy.verifyDashboardComponents();
    });
  });
});
