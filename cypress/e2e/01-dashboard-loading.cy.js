// 🐾⚡ E2E TEST: Dashboard Loading & Initial State ⚡🐾
describe('🏠 Dashboard Loading & Initial State', () => {
  beforeEach(() => {
    console.log('🐾 [Test] Starting dashboard loading test, nyaa~!');
  });

  it('should load the dashboard successfully', () => {
    cy.visitDashboard();
  });

  it('should display the NEKO-ARC header with all status indicators', () => {
    cy.visitDashboard();

    // Verify header title
    cy.get('.App-header')
      .should('be.visible')
      .within(() => {
        cy.contains('🐾⚡ NEKO-ARC DEFENSE SYSTEM ⚡🐾').should('be.visible');
      });

    // Verify status indicators
    cy.contains('🔴 LIVE').should('be.visible');
    cy.contains('FORTRESS MODE: ACTIVE').should('be.visible');
    cy.contains('KAWAII LEVEL: MAXIMUM 💖').should('be.visible');
  });

  it('should display all navigation buttons in the header', () => {
    cy.visitDashboard();

    // Verify all TV/navigation buttons
    cy.contains('📺 NEKO TV').should('be.visible');
    cy.contains('📡 MULTI-CHANNEL TV').should('be.visible');
    cy.contains('⚖️ DINA DOCS').should('be.visible');
    cy.contains('📺 DINA JUSTICE TV').should('be.visible');
    cy.contains('🎯 THREAT ACTORS').should('be.visible');
  });

  it('should show loading state initially', () => {
    cy.visit('/');

    // Should show loading message initially
    cy.contains('Loading, nyaa~! 🐾', { timeout: 1000 })
      .should('exist');
  });

  it('should display all main dashboard components after loading', () => {
    cy.visitDashboard();
    cy.verifyDashboardComponents();
  });

  it('should display the category switcher sidebar', () => {
    cy.visitDashboard();

    cy.get('.sidebar-left')
      .should('be.visible')
      .within(() => {
        cy.get('.category-switcher').should('be.visible');
        cy.contains('🛡️ THREAT CATEGORIES').should('be.visible');
        cy.contains('FORTRESS MODE').should('be.visible');
      });
  });

  it('should display the main dashboard grid with all sections', () => {
    cy.visitDashboard();

    cy.get('.dashboard-grid')
      .should('be.visible')
      .within(() => {
        // ASCII TV section
        cy.get('.ascii-tv-section').should('be.visible');

        // Stats section
        cy.get('.stats-section').should('be.visible');

        // Threats section
        cy.get('.threats-section').should('be.visible');
      });
  });

  it('should display ASCII art after loading', () => {
    cy.visitDashboard();
    cy.verifyAsciiArt();
  });

  it('should display defense statistics', () => {
    cy.visitDashboard();
    cy.verifyStats();
  });

  it('should display threat intelligence list', () => {
    cy.visitDashboard();
    cy.verifyThreatList();
  });

  it('should display the footer with NEKO message', () => {
    cy.visitDashboard();

    cy.get('.App-footer')
      .should('be.visible')
      .within(() => {
        cy.contains('*purrs in defensive excellence* 😻').should('be.visible');
        cy.contains('NYA NYA NYA~!').should('be.visible');
      });
  });

  it('should have proper viewport and responsive layout', () => {
    cy.visitDashboard();

    // Verify layout structure
    cy.get('.main-container').should('be.visible');
    cy.get('.sidebar-left').should('have.css', 'display').and('not.equal', 'none');
    cy.get('.dashboard-grid').should('have.css', 'display').and('not.equal', 'none');
  });

  it('should successfully fetch data from all API endpoints', () => {
    cy.visit('/');

    // Verify all API calls were made
    cy.wait('@getAsciiArt').its('response.statusCode').should('eq', 200);
    cy.wait('@getThreatCounts').its('response.statusCode').should('eq', 200);
  });
});
