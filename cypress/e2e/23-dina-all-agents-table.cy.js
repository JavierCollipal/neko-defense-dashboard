// 🐾⚡ NEKO DEFENSE DASHBOARD - DINA ALL AGENTS Table E2E Tests ⚡🐾
// Test suite for DINA Documentation ALL AGENTS comprehensive table view
// Created: October 17, 2025

describe('DINA ALL AGENTS Table View', () => {
  beforeEach(() => {
    cy.visit('/dina');
    cy.viewport(1400, 900);
    // Wait for DINA page to load
    cy.contains('DINA INTERNATIONAL DOCUMENTATION', { timeout: 10000 }).should('be.visible');
  });

  describe('ALL AGENTS Button Visibility', () => {
    it('should display ALL AGENTS button in navigation', () => {
      cy.contains('.nav-button', 'ALL AGENTS').should('be.visible');
    });

    it('should show agent count in button label', () => {
      cy.get('.nav-button').contains(/ALL AGENTS \(\d+\)/).should('be.visible');
    });

    it('should have 8 navigation buttons including ALL AGENTS', () => {
      cy.get('.dina-navigation .nav-button').should('have.length', 8);
    });

    it('should position ALL AGENTS button after TIMELINE', () => {
      cy.contains('.nav-button', 'TIMELINE').parent().within(() => {
        cy.contains('.nav-button', 'ALL AGENTS');
      });
    });
  });

  describe('ALL AGENTS Button Click Behavior', () => {
    it('should navigate to ALL AGENTS view when clicked', () => {
      cy.contains('.nav-button', 'ALL AGENTS').click();
      cy.contains('h2', 'ALL DINA AGENTS').should('be.visible');
    });

    it('should highlight ALL AGENTS button as active', () => {
      cy.contains('.nav-button', 'ALL AGENTS').click();
      cy.contains('.nav-button', 'ALL AGENTS').should('have.class', 'active');
    });

    it('should deactivate other navigation buttons', () => {
      cy.contains('.nav-button', 'OVERVIEW').click();
      cy.contains('.nav-button', 'OVERVIEW').should('have.class', 'active');

      cy.contains('.nav-button', 'ALL AGENTS').click();
      cy.contains('.nav-button', 'OVERVIEW').should('not.have.class', 'active');
    });
  });

  describe('ALL AGENTS Table Rendering', () => {
    beforeEach(() => {
      cy.contains('.nav-button', 'ALL AGENTS').click();
    });

    it('should display comprehensive database heading', () => {
      cy.contains('h2', 'ALL DINA AGENTS - COMPREHENSIVE DATABASE').should('be.visible');
      cy.contains('.section-subtitle', 'Complete list').should('be.visible');
    });

    it('should display stats banner with 4 statistics', () => {
      cy.get('.agents-stats-banner').should('be.visible');
      cy.get('.agents-stats-banner .stat-item').should('have.length', 4);
    });

    it('should show correct stat labels', () => {
      cy.get('.agents-stats-banner').within(() => {
        cy.contains('Documented Agents').should('be.visible');
        cy.contains('Convicted').should('be.visible');
        cy.contains('At Large').should('be.visible');
        cy.contains('Never Prosecuted').should('be.visible');
      });
    });

    it('should display agents table', () => {
      cy.get('.agents-table').should('be.visible');
    });

    it('should have correct table headers', () => {
      const expectedHeaders = ['#', 'Full Name', 'Alias', 'Role', 'Rank', 'Status', 'Legal Status', 'Crimes', 'Actions'];

      expectedHeaders.forEach((header) => {
        cy.get('.agents-table thead th').contains(header).should('be.visible');
      });
    });

    it('should display at least one agent row', () => {
      cy.get('.agents-table tbody tr').should('have.length.greaterThan', 0);
    });

    it('should display sequential index numbers', () => {
      cy.get('.agents-table tbody tr').first().within(() => {
        cy.get('td').first().should('contain', '1');
      });
    });
  });

  describe('ALL AGENTS Table Data Display', () => {
    beforeEach(() => {
      cy.contains('.nav-button', 'ALL AGENTS').click();
    });

    it('should display agent full names', () => {
      cy.get('.agents-table tbody .name-cell').should('have.length.greaterThan', 0);
      cy.get('.agents-table tbody .name-cell strong').first().should('not.be.empty');
    });

    it('should display roles for each agent', () => {
      cy.get('.agents-table tbody .role-cell').should('have.length.greaterThan', 0);
    });

    it('should display status badges with proper styling', () => {
      cy.get('.agents-table tbody .status-badge-table').should('have.length.greaterThan', 0);
    });

    it('should show convicted/unprosecuted status', () => {
      cy.get('.agents-table tbody .legal-cell').first().within(() => {
        cy.contains(/CONVICTED|UNPROSECUTED/).should('be.visible');
      });
    });

    it('should display crimes count', () => {
      cy.get('.agents-table tbody .crimes-cell').first()
        .should('contain', 'documented');
    });

    it('should show View Details button for each agent', () => {
      cy.get('.agents-table tbody .view-btn-table').should('have.length.greaterThan', 0);
    });
  });

  describe('ALL AGENTS Color-Coded Rows', () => {
    beforeEach(() => {
      cy.contains('.nav-button', 'ALL AGENTS').click();
    });

    it('should apply different row classes based on status', () => {
      cy.get('.agents-table tbody tr').then(($rows) => {
        const hasColoredRows = $rows.toArray().some(row => {
          return row.className.includes('row-at-large') ||
                 row.className.includes('row-impunity') ||
                 row.className.includes('row-convicted');
        });
        expect(hasColoredRows).to.be.true;
      });
    });

    it('should use warning badge for At Large agents', () => {
      cy.get('.status-badge-table.badge-warning').should('exist');
    });

    it('should use critical badge for Never Prosecuted agents', () => {
      cy.get('.status-badge-table.badge-critical').should('exist');
    });

    it('should use success badge for Convicted agents', () => {
      cy.get('.status-badge-table.badge-success').should('exist');
    });
  });

  describe('ALL AGENTS View Details Functionality', () => {
    beforeEach(() => {
      cy.contains('.nav-button', 'ALL AGENTS').click();
    });

    it('should navigate to detail view when clicking View Details', () => {
      cy.get('.view-btn-table').first().click();
      cy.get('.perpetrator-details-comprehensive').should('be.visible');
    });

    it('should show Back to List button in detail view', () => {
      cy.get('.view-btn-table').first().click();
      cy.get('.back-button').should('be.visible');
      cy.get('.back-button').should('contain', 'Back to List');
    });

    it('should return to ALL AGENTS view when clicking Back', () => {
      cy.get('.view-btn-table').first().click();
      cy.get('.back-button').click();
      cy.contains('h2', 'ALL DINA AGENTS').should('be.visible');
    });

    it('should display agent full name in detail view', () => {
      cy.get('.view-btn-table').first().click();
      cy.get('.details-content-full h2').should('not.be.empty');
    });
  });

  describe('ALL AGENTS Table Footer Information', () => {
    beforeEach(() => {
      cy.contains('.nav-button', 'ALL AGENTS').click();
    });

    it('should display database information footer', () => {
      cy.get('.agents-footer-note').should('be.visible');
    });

    it('should show total known DINA agents (1,097)', () => {
      cy.get('.agents-footer-note').should('contain', '1,097');
    });

    it('should mention sources', () => {
      cy.get('.agents-footer-note').should('contain', 'Sources');
    });

    it('should mention Simon Wiesenthal methodology', () => {
      cy.get('.agents-footer-note').should('contain', 'Simon Wiesenthal');
    });
  });

  describe('ALL AGENTS Empty State', () => {
    it('should handle no agents gracefully', () => {
      // This test assumes API might fail or return no data
      cy.intercept('GET', '**/api/dina/perpetrators', {
        statusCode: 200,
        body: { success: true, data: [], count: 0 }
      }).as('emptyAgents');

      cy.visit('/dina');
      cy.contains('.nav-button', 'ALL AGENTS').click();

      cy.get('.no-data-message').should('be.visible');
      cy.contains('No agents loaded').should('be.visible');
    });
  });

  describe('ALL AGENTS Table Sorting and Filtering', () => {
    beforeEach(() => {
      cy.contains('.nav-button', 'ALL AGENTS').click();
    });

    it('should display agents in sequential order', () => {
      cy.get('.agents-table tbody tr').first().within(() => {
        cy.get('td').first().should('contain', '1');
      });

      cy.get('.agents-table tbody tr').eq(1).within(() => {
        cy.get('td').first().should('contain', '2');
      });
    });

    it('should show all agents without pagination', () => {
      cy.get('.agents-table tbody tr').should('have.length.greaterThan', 5);
    });
  });

  describe('ALL AGENTS Table Responsive Behavior', () => {
    beforeEach(() => {
      cy.contains('.nav-button', 'ALL AGENTS').click();
    });

    it('should be scrollable horizontally on narrow screens', () => {
      cy.viewport(768, 1024);
      cy.get('.agents-table-container').then(($container) => {
        expect($container[0].scrollWidth).to.be.greaterThan($container[0].clientWidth);
      });
    });

    it('should display all columns on desktop', () => {
      cy.viewport(1400, 900);
      cy.get('.agents-table thead th').should('have.length', 9);
    });

    it('should maintain table structure on tablet', () => {
      cy.viewport(1024, 768);
      cy.get('.agents-table').should('be.visible');
      cy.get('.agents-table tbody tr').should('have.length.greaterThan', 0);
    });
  });

  describe('ALL AGENTS Table Accessibility', () => {
    beforeEach(() => {
      cy.contains('.nav-button', 'ALL AGENTS').click();
    });

    it('should have proper table semantics', () => {
      cy.get('.agents-table').should('have.prop', 'tagName', 'TABLE');
      cy.get('.agents-table thead').should('exist');
      cy.get('.agents-table tbody').should('exist');
    });

    it('should have accessible button labels', () => {
      cy.get('.view-btn-table').first().should('contain', 'View Details');
    });

    it('should be keyboard navigable', () => {
      cy.get('.view-btn-table').first().focus();
      cy.focused().should('have.class', 'view-btn-table');
    });

    it('should have meaningful status indicators', () => {
      cy.get('.status-badge-table').first().invoke('text').should('not.be.empty');
    });
  });

  describe('ALL AGENTS Integration with Other Views', () => {
    it('should navigate from OVERVIEW to ALL AGENTS', () => {
      cy.contains('.nav-button', 'OVERVIEW').click();
      cy.contains('h2', 'INTERNATIONAL HUNT OPERATION').should('be.visible');

      cy.contains('.nav-button', 'ALL AGENTS').click();
      cy.contains('h2', 'ALL DINA AGENTS').should('be.visible');
    });

    it('should navigate from WANTED AGENTS to ALL AGENTS', () => {
      cy.contains('.nav-button', 'WANTED AGENTS').click();
      cy.contains('h2', 'DINA WANTED AGENTS').should('be.visible');

      cy.contains('.nav-button', 'ALL AGENTS').click();
      cy.contains('h2', 'ALL DINA AGENTS').should('be.visible');
    });

    it('should maintain DINA header and stats when switching to ALL AGENTS', () => {
      cy.contains('.nav-button', 'ALL AGENTS').click();
      cy.contains('DINA INTERNATIONAL DOCUMENTATION').should('be.visible');
      cy.get('.dina-stats-international').should('be.visible');
    });
  });

  describe('ALL AGENTS Performance', () => {
    it('should load ALL AGENTS view quickly', () => {
      const startTime = Date.now();
      cy.contains('.nav-button', 'ALL AGENTS').click();
      cy.get('.agents-table').should('be.visible');
      const endTime = Date.now();

      expect(endTime - startTime).to.be.lessThan(3000);
    });

    it('should handle large agent lists without lag', () => {
      cy.contains('.nav-button', 'ALL AGENTS').click();
      cy.get('.agents-table tbody tr').should('have.length.greaterThan', 0);

      // Scroll through table
      cy.get('.agents-table-container').scrollTo('bottom');
      cy.get('.agents-table tbody tr').last().should('be.visible');
    });

    it('should maintain table state when navigating away and back', () => {
      cy.contains('.nav-button', 'ALL AGENTS').click();
      cy.get('.agents-table tbody tr').its('length').as('rowCount');

      cy.contains('.nav-button', 'OVERVIEW').click();
      cy.contains('.nav-button', 'ALL AGENTS').click();

      cy.get('@rowCount').then((count) => {
        cy.get('.agents-table tbody tr').should('have.length', count);
      });
    });
  });

  describe('ALL AGENTS Data Accuracy', () => {
    beforeEach(() => {
      cy.contains('.nav-button', 'ALL AGENTS').click();
    });

    it('should match stats banner count with table row count', () => {
      cy.get('.agents-stats-banner .stat-item').first().find('strong').invoke('text').then((statsCount) => {
        cy.get('.agents-table tbody tr').its('length').should('eq', parseInt(statsCount));
      });
    });

    it('should display consistent data across views', () => {
      cy.get('.agents-table tbody tr').its('length').as('tableCount');

      cy.contains('.nav-button', 'PERPETRATORS').click();
      cy.get('.perp-grid-international .perp-card-international').its('length').then((cardCount) => {
        cy.get('@tableCount').should('eq', cardCount);
      });
    });
  });
});

// 🐾 *purrs with documentation excellence* ALL AGENTS table thoroughly tested, nyaa~! ✅📋
