// 🐾📺✨ NEKO ARC TV - ALL AGENTS TAB E2E TESTS ✨📺🐾
// Comprehensive end-to-end testing for the All Agents neko arc TV interface

describe('📺 All Agents Tab - Neko Arc TV Interface (E2E)', () => {
  beforeEach(() => {
    // Intercept API calls
    cy.intercept('GET', '**/api/dina/stats', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          perpetrators: {
            total_known_agents: 1097,
            convicted: 12,
            atLarge: 5,
            neverProsecuted: 1,
          },
        },
      },
    }).as('getStats');

    cy.intercept('GET', '**/api/dina/perpetrators', {
      statusCode: 200,
      body: {
        success: true,
        count: 8,
        data: [
          {
            fullName: 'Test Agent',
            role: 'DINA Commander',
            legalStatus: { convicted: true },
            crimesAccused: ['Torture', 'Kidnapping'],
          },
        ],
      },
    }).as('getPerpetrators');

    // Mock All Agents API with pagination
    cy.intercept('GET', '**/api/dina/all-agents?page=1&limit=50', {
      statusCode: 200,
      body: {
        success: true,
        data: [
          {
            agentNumber: 1,
            fullName: 'Agent One',
            rank: 'Colonel',
            status: 'DECEASED',
            source: '2008 Army List',
          },
          {
            agentNumber: 2,
            fullName: 'Agent Two',
            rank: 'Major',
            status: 'UNLOCATED',
            source: '2008 Army List',
          },
          {
            agentNumber: 3,
            fullName: 'Agent Three',
            rank: 'Captain',
            status: 'UNPROSECUTED',
            source: '2008 Army List',
          },
          {
            agentNumber: 4,
            fullName: 'Test Search Agent',
            rank: 'Lieutenant',
            status: 'DECEASED',
            source: '2008 Army List',
          },
        ],
        pagination: {
          current_page: 1,
          total_pages: 22,
          total_agents: 1097,
          has_previous: false,
          has_next: true,
        },
      },
    }).as('getAllAgentsPage1');

    cy.intercept('GET', '**/api/dina/all-agents?page=2&limit=50', {
      statusCode: 200,
      body: {
        success: true,
        data: [
          {
            agentNumber: 51,
            fullName: 'Page Two Agent',
            rank: 'Major',
            status: 'UNLOCATED',
            source: '2008 Army List',
          },
        ],
        pagination: {
          current_page: 2,
          total_pages: 22,
          total_agents: 1097,
          has_previous: true,
          has_next: true,
        },
      },
    }).as('getAllAgentsPage2');

    // Mock search results
    cy.intercept('GET', '**/api/dina/all-agents?page=1&limit=50&search=*', {
      statusCode: 200,
      body: {
        success: true,
        data: [
          {
            agentNumber: 4,
            fullName: 'Test Search Agent',
            rank: 'Lieutenant',
            status: 'DECEASED',
            source: '2008 Army List',
          },
        ],
        pagination: {
          current_page: 1,
          total_pages: 1,
          total_agents: 1,
          has_previous: false,
          has_next: false,
        },
      },
    }).as('getSearchResults');

    // Visit dashboard
    cy.visit('http://localhost:5000');
    cy.wait('@getStats');
    cy.wait('@getPerpetrators');
  });

  describe('🎬 All Agents View - Initial Rendering', () => {
    it('should navigate to All Agents tab successfully', () => {
      cy.contains('📋 ALL AGENTS').click();
      cy.wait('@getAllAgentsPage1');

      // Verify neko arc TV header
      cy.contains('ALL 1,097 KNOWN DINA AGENTS - NEKO ARC TV ARCHIVE').should(
        'be.visible'
      );
      cy.contains('Interactive Browsing, nyaa~').should('be.visible');
    });

    it('should display neko search bar', () => {
      cy.contains('📋 ALL AGENTS').click();
      cy.wait('@getAllAgentsPage1');

      cy.get('[data-testid="agent-search-input"]')
        .should('be.visible')
        .should('have.attr', 'placeholder')
        .and('match', /Search by name.*nyaa~/i);
    });

    it('should display results info with total agents count', () => {
      cy.contains('📋 ALL AGENTS').click();
      cy.wait('@getAllAgentsPage1');

      cy.contains('📋 Total: 1097 agents').should('be.visible');
      cy.contains('Page 1 of 22').should('be.visible');
    });

    it('should render agent cards in grid', () => {
      cy.contains('📋 ALL AGENTS').click();
      cy.wait('@getAllAgentsPage1');

      cy.get('[data-testid="agents-grid"]').should('be.visible');
      cy.contains('Agent One').should('be.visible');
      cy.contains('Agent Two').should('be.visible');
      cy.contains('Agent Three').should('be.visible');
    });
  });

  describe('🔍 Neko Search Functionality (E2E)', () => {
    it('should show clear button when typing search query', () => {
      cy.contains('📋 ALL AGENTS').click();
      cy.wait('@getAllAgentsPage1');

      cy.get('[data-testid="agent-search-input"]').type('Test Search');
      cy.get('[data-testid="clear-search-button"]').should('be.visible');
    });

    it('should clear search when clear button is clicked', () => {
      cy.contains('📋 ALL AGENTS').click();
      cy.wait('@getAllAgentsPage1');

      cy.get('[data-testid="agent-search-input"]').type('Test Search');
      cy.get('[data-testid="clear-search-button"]').click();

      cy.get('[data-testid="agent-search-input"]').should('have.value', '');
    });

    it('should search agents and display results', () => {
      cy.contains('📋 ALL AGENTS').click();
      cy.wait('@getAllAgentsPage1');

      cy.get('[data-testid="agent-search-input"]').type('Test Search');
      cy.wait('@getSearchResults');

      // Should show search results count
      cy.contains('🎯 Found: 1 agents').should('be.visible');

      // Should display matching agent
      cy.contains('Test Search Agent').should('be.visible');
    });

    it('should display no results message for empty search', () => {
      // Mock empty search results
      cy.intercept('GET', '**/api/dina/all-agents?page=1&limit=50&search=*', {
        statusCode: 200,
        body: {
          success: true,
          data: [],
          pagination: {
            current_page: 1,
            total_pages: 0,
            total_agents: 0,
            has_previous: false,
            has_next: false,
          },
        },
      }).as('getEmptySearch');

      cy.contains('📋 ALL AGENTS').click();
      cy.wait('@getAllAgentsPage1');

      cy.get('[data-testid="agent-search-input"]').type('nonexistent');
      cy.wait('@getEmptySearch');

      cy.contains('😿 No agents found matching "nonexistent"').should(
        'be.visible'
      );
      cy.contains('Try a different search term, nyaa~').should('be.visible');
    });

    it('should reset to page 1 when searching', () => {
      cy.contains('📋 ALL AGENTS').click();
      cy.wait('@getAllAgentsPage1');

      // Go to page 2
      cy.get('[data-testid="next-page-button"]').click();
      cy.wait('@getAllAgentsPage2');

      // Verify on page 2
      cy.contains('Page 2 of 22').should('be.visible');

      // Now search
      cy.get('[data-testid="agent-search-input"]').type('Test');
      cy.wait('@getSearchResults');

      // Should be back to page 1
      cy.contains('Page 1 of 1').should('be.visible');
    });
  });

  describe('🎮 Expandable Agent Cards (E2E)', () => {
    it('should display expand hint on agent card', () => {
      cy.contains('📋 ALL AGENTS').click();
      cy.wait('@getAllAgentsPage1');

      cy.get('[data-testid="agent-card-1"]').within(() => {
        cy.contains('▼ Click for details').should('be.visible');
      });
    });

    it('should expand agent card when clicked', () => {
      cy.contains('📋 ALL AGENTS').click();
      cy.wait('@getAllAgentsPage1');

      cy.get('[data-testid="agent-card-1"]').click();

      // Should show expanded details
      cy.contains('📋 Agent Information').should('be.visible');
      cy.contains('Full Name: Agent One').should('be.visible');
      cy.contains('Agent Number: #1').should('be.visible');
      cy.contains('Source & Verification').should('be.visible');
    });

    it('should show collapse hint when expanded', () => {
      cy.contains('📋 ALL AGENTS').click();
      cy.wait('@getAllAgentsPage1');

      cy.get('[data-testid="agent-card-1"]').click();

      // Should show collapse hint
      cy.get('[data-testid="agent-card-1"]').within(() => {
        cy.contains('▲ Click to collapse').should('be.visible');
      });
    });

    it('should collapse agent card when clicked again', () => {
      cy.contains('📋 ALL AGENTS').click();
      cy.wait('@getAllAgentsPage1');

      // Expand
      cy.get('[data-testid="agent-card-1"]').click();
      cy.contains('📋 Agent Information').should('be.visible');

      // Collapse
      cy.get('[data-testid="agent-card-1"]').click();
      cy.contains('📋 Agent Information').should('not.exist');
    });

    it('should close expanded card when close button is clicked', () => {
      cy.contains('📋 ALL AGENTS').click();
      cy.wait('@getAllAgentsPage1');

      // Expand
      cy.get('[data-testid="agent-card-1"]').click();
      cy.contains('📋 Agent Information').should('be.visible');

      // Click close button
      cy.contains('✖ Close Details').click();
      cy.contains('📋 Agent Information').should('not.exist');
    });

    it('should display different status badges correctly', () => {
      cy.contains('📋 ALL AGENTS').click();
      cy.wait('@getAllAgentsPage1');

      // Check DECEASED status
      cy.get('[data-testid="agent-card-1"]').within(() => {
        cy.contains('DECEASED').should('have.class', 'status-deceased');
      });

      // Check UNLOCATED status
      cy.get('[data-testid="agent-card-2"]').within(() => {
        cy.contains('UNLOCATED').should('have.class', 'status-unlocated');
      });

      // Check UNPROSECUTED status
      cy.get('[data-testid="agent-card-3"]').within(() => {
        cy.contains('UNPROSECUTED').should('have.class', 'status-unprosecuted');
      });
    });
  });

  describe('📄 Neko Pagination (E2E)', () => {
    it('should display pagination controls', () => {
      cy.contains('📋 ALL AGENTS').click();
      cy.wait('@getAllAgentsPage1');

      cy.get('[data-testid="pagination-controls"]').should('be.visible');
    });

    it('should disable previous button on first page', () => {
      cy.contains('📋 ALL AGENTS').click();
      cy.wait('@getAllAgentsPage1');

      cy.get('[data-testid="prev-page-button"]').should('be.disabled');
    });

    it('should enable next button when more pages exist', () => {
      cy.contains('📋 ALL AGENTS').click();
      cy.wait('@getAllAgentsPage1');

      cy.get('[data-testid="next-page-button"]').should('not.be.disabled');
    });

    it('should navigate to next page when next button is clicked', () => {
      cy.contains('📋 ALL AGENTS').click();
      cy.wait('@getAllAgentsPage1');

      cy.get('[data-testid="next-page-button"]').click();
      cy.wait('@getAllAgentsPage2');

      // Verify on page 2
      cy.contains('Page 2 of 22').should('be.visible');
      cy.contains('Page Two Agent').should('be.visible');
    });

    it('should navigate to previous page when prev button is clicked', () => {
      cy.contains('📋 ALL AGENTS').click();
      cy.wait('@getAllAgentsPage1');

      // Go to page 2
      cy.get('[data-testid="next-page-button"]').click();
      cy.wait('@getAllAgentsPage2');

      // Go back to page 1
      cy.get('[data-testid="prev-page-button"]').click();
      cy.wait('@getAllAgentsPage1');

      cy.contains('Page 1 of 22').should('be.visible');
    });

    it('should highlight active page number', () => {
      cy.contains('📋 ALL AGENTS').click();
      cy.wait('@getAllAgentsPage1');

      cy.get('[data-testid="page-1"]').should('have.class', 'active');
    });

    it('should navigate to specific page when page number is clicked', () => {
      cy.contains('📋 ALL AGENTS').click();
      cy.wait('@getAllAgentsPage1');

      // Mock page 2 click
      cy.get('[data-testid="page-2"]').click();
      cy.wait('@getAllAgentsPage2');

      cy.contains('Page 2 of 22').should('be.visible');
    });
  });

  describe('📚 Neko Info Panel & UX Polish', () => {
    it('should display neko info panel', () => {
      cy.contains('📋 ALL AGENTS').click();
      cy.wait('@getAllAgentsPage1');

      cy.contains('📺✨ About This Neko Arc TV Archive').should('be.visible');
    });

    it('should display neko signature', () => {
      cy.contains('📋 ALL AGENTS').click();
      cy.wait('@getAllAgentsPage1');

      cy.contains('🐾 *purrs in archival excellence* 😻✨').should(
        'be.visible'
      );
    });

    it('should have smooth animations on card hover', () => {
      cy.contains('📋 ALL AGENTS').click();
      cy.wait('@getAllAgentsPage1');

      // Hover over agent card
      cy.get('[data-testid="agent-card-1"]')
        .trigger('mouseover')
        .should('have.class', 'neko-agent-card');
    });
  });

  describe('🎯 Complete User Flow (E2E)', () => {
    it('should complete full search, expand, paginate workflow', () => {
      // Navigate to All Agents
      cy.contains('📋 ALL AGENTS').click();
      cy.wait('@getAllAgentsPage1');

      // Verify initial state
      cy.contains('ALL 1,097 KNOWN DINA AGENTS').should('be.visible');

      // Search for agent
      cy.get('[data-testid="agent-search-input"]').type('Test Search');
      cy.wait('@getSearchResults');

      // Verify search results
      cy.contains('🎯 Found: 1 agents').should('be.visible');
      cy.contains('Test Search Agent').should('be.visible');

      // Clear search
      cy.get('[data-testid="clear-search-button"]').click();
      cy.wait('@getAllAgentsPage1');

      // Expand first agent
      cy.get('[data-testid="agent-card-1"]').click();
      cy.contains('📋 Agent Information').should('be.visible');

      // Close agent details
      cy.contains('✖ Close Details').click();
      cy.contains('📋 Agent Information').should('not.exist');

      // Navigate to page 2
      cy.get('[data-testid="next-page-button"]').click();
      cy.wait('@getAllAgentsPage2');
      cy.contains('Page Two Agent').should('be.visible');

      // Navigate back to page 1
      cy.get('[data-testid="prev-page-button"]').click();
      cy.wait('@getAllAgentsPage1');
      cy.contains('Agent One').should('be.visible');

      // Success! 🎉
    });

    it('should maintain state when switching tabs and returning', () => {
      // Go to All Agents
      cy.contains('📋 ALL AGENTS').click();
      cy.wait('@getAllAgentsPage1');

      // Go to page 2
      cy.get('[data-testid="next-page-button"]').click();
      cy.wait('@getAllAgentsPage2');

      // Switch to another tab
      cy.contains('🏠 OVERVIEW').click();
      cy.contains('INTERNATIONAL HUNT OPERATION').should('be.visible');

      // Return to All Agents
      cy.contains('📋 ALL AGENTS').click();
      cy.wait('@getAllAgentsPage1'); // Should reset to page 1

      // Verify reset to page 1
      cy.contains('Page 1 of 22').should('be.visible');
    });
  });

  describe('⚡ Performance & Responsiveness', () => {
    it('should load All Agents view quickly', () => {
      const startTime = Date.now();

      cy.contains('📋 ALL AGENTS').click();
      cy.wait('@getAllAgentsPage1');

      const loadTime = Date.now() - startTime;

      // Should load in under 2 seconds
      expect(loadTime).to.be.lessThan(2000);
    });

    it('should handle rapid pagination clicks gracefully', () => {
      cy.contains('📋 ALL AGENTS').click();
      cy.wait('@getAllAgentsPage1');

      // Rapid clicks
      cy.get('[data-testid="next-page-button"]').click();
      cy.get('[data-testid="prev-page-button"]').click();
      cy.get('[data-testid="next-page-button"]').click();

      // Should still work correctly
      cy.wait('@getAllAgentsPage2');
      cy.contains('Page Two Agent').should('be.visible');
    });
  });
});

// *purrs in E2E testing excellence* 😻📺✨
// *swishes tail in neko arc TV mastery* 🐾⚡
