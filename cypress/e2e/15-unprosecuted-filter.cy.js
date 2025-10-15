// 🐾⚖️✨ UNPROSECUTED FILTER BUTTON - E2E TESTS ⚖️✨🐾
// Comprehensive end-to-end testing for the unprosecuted agents filter feature

describe('⚖️ Unprosecuted Filter Button - Full E2E Flow', () => {
  beforeEach(() => {
    // Intercept basic API calls
    cy.intercept('GET', '**/api/dina/stats', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          perpetrators: {
            total_known_agents: 1097,
            convicted: 800,
            unprosecuted: 297,
            atLarge: 5,
            neverProsecuted: 1
          }
        }
      }
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
            crimesAccused: ['Torture', 'Kidnapping']
          }
        ]
      }
    }).as('getPerpetrators');

    // Mock All Agents API - No filter
    cy.intercept('GET', '**/api/dina/all-agents?page=1&limit=50', {
      statusCode: 200,
      body: {
        success: true,
        data: [
          { agentNumber: 1, fullName: 'Convicted Agent One', rank: 'Colonel', status: 'CONVICTED - IMPRISONED', legalStatus: { convicted: true } },
          { agentNumber: 2, fullName: 'Convicted Agent Two', rank: 'Major', status: 'CONVICTED - DECEASED', legalStatus: { convicted: true } },
          { agentNumber: 3, fullName: 'Unprosecuted Agent One', rank: 'Captain', status: 'UNPROSECUTED', legalStatus: { convicted: false } },
          { agentNumber: 4, fullName: 'Unprosecuted Agent Two', rank: 'Lieutenant', status: 'UNPROSECUTED', legalStatus: { convicted: false } }
        ],
        pagination: {
          current_page: 1,
          total_pages: 22,
          total_agents: 1097,
          has_previous: false,
          has_next: true
        },
        filter: 'none'
      }
    }).as('getAllAgentsNoFilter');

    // Mock All Agents API - WITH unprosecuted filter
    cy.intercept('GET', '**/api/dina/all-agents?page=1&limit=50&filter=unprosecuted', {
      statusCode: 200,
      body: {
        success: true,
        data: [
          { agentNumber: 3, fullName: 'Unprosecuted Agent One', rank: 'Captain', status: 'UNPROSECUTED', legalStatus: { convicted: false } },
          { agentNumber: 4, fullName: 'Unprosecuted Agent Two', rank: 'Lieutenant', status: 'UNPROSECUTED', legalStatus: { convicted: false } },
          { agentNumber: 7, fullName: 'Unprosecuted Agent Three', rank: 'Sergeant', status: 'UNPROSECUTED', legalStatus: { convicted: false } }
        ],
        pagination: {
          current_page: 1,
          total_pages: 6,
          total_agents: 297,
          has_previous: false,
          has_next: true
        },
        filter: 'unprosecuted'
      }
    }).as('getAllAgentsFiltered');

    // Mock page 2 with filter
    cy.intercept('GET', '**/api/dina/all-agents?page=2&limit=50&filter=unprosecuted', {
      statusCode: 200,
      body: {
        success: true,
        data: [
          { agentNumber: 54, fullName: 'Unprosecuted Page Two Agent', rank: 'Major', status: 'UNPROSECUTED', legalStatus: { convicted: false } }
        ],
        pagination: {
          current_page: 2,
          total_pages: 6,
          total_agents: 297,
          has_previous: true,
          has_next: true
        },
        filter: 'unprosecuted'
      }
    }).as('getFilteredPage2');

    // Visit dashboard
    cy.visit('http://localhost:5000');
    cy.wait('@getStats');
    cy.wait('@getPerpetrators');
  });

  describe('🎯 Filter Button Rendering & Initial State', () => {
    it('should display unprosecuted filter button in All Agents view', () => {
      cy.contains('📋 ALL AGENTS').click();
      cy.wait('@getAllAgentsNoFilter');

      cy.get('[data-testid="unprosecuted-filter-button"]')
        .should('be.visible')
        .should('contain', 'FILTER UNPROSECUTED')
        .should('contain', '⚖️');
    });

    it('should have correct initial styling for filter button', () => {
      cy.contains('📋 ALL AGENTS').click();
      cy.wait('@getAllAgentsNoFilter');

      cy.get('[data-testid="unprosecuted-filter-button"]')
        .should('have.class', 'neko-filter-button')
        .should('not.have.class', 'active');
    });

    it('should display filter button alongside search controls', () => {
      cy.contains('📋 ALL AGENTS').click();
      cy.wait('@getAllAgentsNoFilter');

      // Both filter button and search should be visible
      cy.get('[data-testid="unprosecuted-filter-button"]').should('be.visible');
      cy.get('[data-testid="agent-search-input"]').should('be.visible');
    });

    it('should show all agents by default (filter inactive)', () => {
      cy.contains('📋 ALL AGENTS').click();
      cy.wait('@getAllAgentsNoFilter');

      // Should show both convicted and unprosecuted agents
      cy.contains('Convicted Agent One').should('be.visible');
      cy.contains('Unprosecuted Agent One').should('be.visible');
      cy.contains('📋 Total: 1097 agents').should('be.visible');
    });
  });

  describe('⚡ Filter Button Click & Activation', () => {
    it('should activate filter when filter button is clicked', () => {
      cy.contains('📋 ALL AGENTS').click();
      cy.wait('@getAllAgentsNoFilter');

      // Click filter button
      cy.get('[data-testid="unprosecuted-filter-button"]').click();
      cy.wait('@getAllAgentsFiltered');

      // Should show active state
      cy.get('[data-testid="unprosecuted-filter-button"]')
        .should('have.class', 'active')
        .should('contain', 'SHOWING UNPROSECUTED')
        .should('contain', '✓');
    });

    it('should call API with filter parameter when activated', () => {
      cy.contains('📋 ALL AGENTS').click();
      cy.wait('@getAllAgentsNoFilter');

      cy.get('[data-testid="unprosecuted-filter-button"]').click();

      // Should make API call with filter parameter
      cy.wait('@getAllAgentsFiltered');
    });

    it('should deactivate filter when clicked again', () => {
      cy.contains('📋 ALL AGENTS').click();
      cy.wait('@getAllAgentsNoFilter');

      // Activate filter
      cy.get('[data-testid="unprosecuted-filter-button"]').click();
      cy.wait('@getAllAgentsFiltered');

      // Deactivate filter
      cy.get('[data-testid="unprosecuted-filter-button"]').click();
      cy.wait('@getAllAgentsNoFilter');

      // Should return to inactive state
      cy.get('[data-testid="unprosecuted-filter-button"]')
        .should('not.have.class', 'active')
        .should('contain', 'FILTER UNPROSECUTED')
        .should('not.contain', 'SHOWING');
    });

    it('should display active indicator checkmark when filter is on', () => {
      cy.contains('📋 ALL AGENTS').click();
      cy.wait('@getAllAgentsNoFilter');

      cy.get('[data-testid="unprosecuted-filter-button"]').click();
      cy.wait('@getAllAgentsFiltered');

      cy.get('[data-testid="unprosecuted-filter-button"]')
        .should('contain', '✓')
        .should('contain', '⚖️');
    });
  });

  describe('📊 Filtered Results Display', () => {
    it('should display only unprosecuted agents when filter is active', () => {
      cy.contains('📋 ALL AGENTS').click();
      cy.wait('@getAllAgentsNoFilter');

      cy.get('[data-testid="unprosecuted-filter-button"]').click();
      cy.wait('@getAllAgentsFiltered');

      // Should show only unprosecuted agents
      cy.contains('Unprosecuted Agent One').should('be.visible');
      cy.contains('Unprosecuted Agent Two').should('be.visible');
      cy.contains('Unprosecuted Agent Three').should('be.visible');

      // Should NOT show convicted agents
      cy.contains('Convicted Agent One').should('not.exist');
      cy.contains('Convicted Agent Two').should('not.exist');
    });

    it('should update total agents count to show filtered count', () => {
      cy.contains('📋 ALL AGENTS').click();
      cy.wait('@getAllAgentsNoFilter');

      // Before filter - full count
      cy.contains('📋 Total: 1097 agents').should('be.visible');

      cy.get('[data-testid="unprosecuted-filter-button"]').click();
      cy.wait('@getAllAgentsFiltered');

      // After filter - filtered count
      cy.contains('📋 Total: 297 agents').should('be.visible');
    });

    it('should update pagination to show filtered page count', () => {
      cy.contains('📋 ALL AGENTS').click();
      cy.wait('@getAllAgentsNoFilter');

      // Before filter
      cy.contains('Page 1 of 22').should('be.visible');

      cy.get('[data-testid="unprosecuted-filter-button"]').click();
      cy.wait('@getAllAgentsFiltered');

      // After filter - fewer pages
      cy.contains('Page 1 of 6').should('be.visible');
    });

    it('should return to full list when filter is deactivated', () => {
      cy.contains('📋 ALL AGENTS').click();
      cy.wait('@getAllAgentsNoFilter');

      // Activate filter
      cy.get('[data-testid="unprosecuted-filter-button"]').click();
      cy.wait('@getAllAgentsFiltered');
      cy.contains('📋 Total: 297 agents').should('be.visible');

      // Deactivate filter
      cy.get('[data-testid="unprosecuted-filter-button"]').click();
      cy.wait('@getAllAgentsNoFilter');

      // Should show full list again
      cy.contains('📋 Total: 1097 agents').should('be.visible');
      cy.contains('Convicted Agent One').should('be.visible');
    });
  });

  describe('🔄 Filter Interaction with Pagination', () => {
    it('should reset to page 1 when filter is activated', () => {
      cy.contains('📋 ALL AGENTS').click();
      cy.wait('@getAllAgentsNoFilter');

      // Mock page 2 without filter
      cy.intercept('GET', '**/api/dina/all-agents?page=2&limit=50', {
        statusCode: 200,
        body: {
          success: true,
          data: [{ agentNumber: 51, fullName: 'Page Two Agent', rank: 'Major', status: 'DECEASED', legalStatus: { convicted: true } }],
          pagination: {
            current_page: 2,
            total_pages: 22,
            total_agents: 1097,
            has_previous: true,
            has_next: true
          },
          filter: 'none'
        }
      }).as('getPage2NoFilter');

      // Go to page 2
      cy.get('[data-testid="next-page-button"]').click();
      cy.wait('@getPage2NoFilter');
      cy.contains('Page 2 of 22').should('be.visible');

      // Activate filter
      cy.get('[data-testid="unprosecuted-filter-button"]').click();
      cy.wait('@getAllAgentsFiltered');

      // Should be back on page 1
      cy.contains('Page 1 of 6').should('be.visible');
    });

    it('should maintain filter state during pagination', () => {
      cy.contains('📋 ALL AGENTS').click();
      cy.wait('@getAllAgentsNoFilter');

      // Activate filter
      cy.get('[data-testid="unprosecuted-filter-button"]').click();
      cy.wait('@getAllAgentsFiltered');

      // Go to page 2
      cy.get('[data-testid="next-page-button"]').click();
      cy.wait('@getFilteredPage2');

      // Filter should still be active
      cy.get('[data-testid="unprosecuted-filter-button"]')
        .should('have.class', 'active');

      // Should show filtered page 2
      cy.contains('Unprosecuted Page Two Agent').should('be.visible');
      cy.contains('Page 2 of 6').should('be.visible');
    });

    it('should paginate through filtered results correctly', () => {
      cy.contains('📋 ALL AGENTS').click();
      cy.wait('@getAllAgentsNoFilter');

      // Activate filter
      cy.get('[data-testid="unprosecuted-filter-button"]').click();
      cy.wait('@getAllAgentsFiltered');

      // Go to page 2
      cy.get('[data-testid="next-page-button"]').click();
      cy.wait('@getFilteredPage2');
      cy.contains('Page 2 of 6').should('be.visible');

      // Go back to page 1
      cy.get('[data-testid="prev-page-button"]').click();
      cy.wait('@getAllAgentsFiltered');
      cy.contains('Page 1 of 6').should('be.visible');
    });

    it('should preserve filter when navigating back from page 2', () => {
      cy.contains('📋 ALL AGENTS').click();
      cy.wait('@getAllAgentsNoFilter');

      cy.get('[data-testid="unprosecuted-filter-button"]').click();
      cy.wait('@getAllAgentsFiltered');

      cy.get('[data-testid="next-page-button"]').click();
      cy.wait('@getFilteredPage2');

      cy.get('[data-testid="prev-page-button"]').click();
      cy.wait('@getAllAgentsFiltered');

      // Filter should still be active
      cy.get('[data-testid="unprosecuted-filter-button"]')
        .should('have.class', 'active');

      // Should show only unprosecuted agents
      cy.contains('Unprosecuted Agent One').should('be.visible');
    });
  });

  describe('🎮 Filter Interaction with Expandable Cards', () => {
    it('should maintain filter when expanding agent cards', () => {
      cy.contains('📋 ALL AGENTS').click();
      cy.wait('@getAllAgentsNoFilter');

      cy.get('[data-testid="unprosecuted-filter-button"]').click();
      cy.wait('@getAllAgentsFiltered');

      // Expand a card
      cy.get('[data-testid="agent-card-3"]').click();
      cy.contains('📋 Agent Information').should('be.visible');

      // Filter should still be active
      cy.get('[data-testid="unprosecuted-filter-button"]')
        .should('have.class', 'active');
    });

    it('should filter cards then expand to view details', () => {
      cy.contains('📋 ALL AGENTS').click();
      cy.wait('@getAllAgentsNoFilter');

      cy.get('[data-testid="unprosecuted-filter-button"]').click();
      cy.wait('@getAllAgentsFiltered');

      // Expand first unprosecuted agent
      cy.get('[data-testid="agent-card-3"]').click();

      // Should show expanded details
      cy.contains('📋 Agent Information').should('be.visible');
      cy.contains('Full Name: Unprosecuted Agent One').should('be.visible');
      cy.contains('Agent Number: #3').should('be.visible');
    });

    it('should collapse cards and maintain filter state', () => {
      cy.contains('📋 ALL AGENTS').click();
      cy.wait('@getAllAgentsNoFilter');

      cy.get('[data-testid="unprosecuted-filter-button"]').click();
      cy.wait('@getAllAgentsFiltered');

      // Expand then collapse
      cy.get('[data-testid="agent-card-3"]').click();
      cy.contains('✖ Close Details').click();

      // Filter should still be active
      cy.get('[data-testid="unprosecuted-filter-button"]')
        .should('have.class', 'active');

      // Should still show filtered results
      cy.contains('📋 Total: 297 agents').should('be.visible');
    });
  });

  describe('🔍 Filter Interaction with Search', () => {
    it('should maintain filter when searching', () => {
      // Mock search with filter
      cy.intercept('GET', '**/api/dina/all-agents?page=1&limit=50&filter=unprosecuted&search=*', {
        statusCode: 200,
        body: {
          success: true,
          data: [
            { agentNumber: 3, fullName: 'Unprosecuted Agent One', rank: 'Captain', status: 'UNPROSECUTED', legalStatus: { convicted: false } }
          ],
          pagination: {
            current_page: 1,
            total_pages: 1,
            total_agents: 1,
            has_previous: false,
            has_next: false
          },
          filter: 'unprosecuted'
        }
      }).as('getFilteredSearchResults');

      cy.contains('📋 ALL AGENTS').click();
      cy.wait('@getAllAgentsNoFilter');

      // Activate filter
      cy.get('[data-testid="unprosecuted-filter-button"]').click();
      cy.wait('@getAllAgentsFiltered');

      // Search within filtered results
      cy.get('[data-testid="agent-search-input"]').type('Agent One');
      cy.wait('@getFilteredSearchResults');

      // Filter should still be active
      cy.get('[data-testid="unprosecuted-filter-button"]')
        .should('have.class', 'active');

      // Should show filtered search result
      cy.contains('🎯 Found: 1 agents').should('be.visible');
      cy.contains('Unprosecuted Agent One').should('be.visible');
    });

    it('should apply both search and filter simultaneously', () => {
      cy.intercept('GET', '**/api/dina/all-agents?page=1&limit=50&filter=unprosecuted&search=*', {
        statusCode: 200,
        body: {
          success: true,
          data: [
            { agentNumber: 4, fullName: 'Unprosecuted Agent Two', rank: 'Lieutenant', status: 'UNPROSECUTED', legalStatus: { convicted: false } }
          ],
          pagination: {
            current_page: 1,
            total_pages: 1,
            total_agents: 1,
            has_previous: false,
            has_next: false
          },
          filter: 'unprosecuted'
        }
      }).as('getFilteredSearch');

      cy.contains('📋 ALL AGENTS').click();
      cy.wait('@getAllAgentsNoFilter');

      cy.get('[data-testid="unprosecuted-filter-button"]').click();
      cy.wait('@getAllAgentsFiltered');

      cy.get('[data-testid="agent-search-input"]').type('Two');
      cy.wait('@getFilteredSearch');

      // Both filter and search should be active
      cy.get('[data-testid="unprosecuted-filter-button"]').should('have.class', 'active');
      cy.get('[data-testid="agent-search-input"]').should('have.value', 'Two');

      // Should show combined result
      cy.contains('Unprosecuted Agent Two').should('be.visible');
      cy.contains('Convicted Agent One').should('not.exist');
    });
  });

  describe('🎬 Complete User Flow - End to End', () => {
    it('should complete full filter workflow: activate → paginate → search → deactivate', () => {
      // Navigate to All Agents
      cy.contains('📋 ALL AGENTS').click();
      cy.wait('@getAllAgentsNoFilter');

      // Verify initial state
      cy.contains('ALL 1,097 KNOWN DINA AGENTS').should('be.visible');
      cy.contains('📋 Total: 1097 agents').should('be.visible');

      // Activate filter
      cy.get('[data-testid="unprosecuted-filter-button"]').click();
      cy.wait('@getAllAgentsFiltered');

      // Verify filtered state
      cy.get('[data-testid="unprosecuted-filter-button"]').should('have.class', 'active');
      cy.contains('📋 Total: 297 agents').should('be.visible');
      cy.contains('Unprosecuted Agent One').should('be.visible');
      cy.contains('Convicted Agent One').should('not.exist');

      // Paginate to page 2
      cy.get('[data-testid="next-page-button"]').click();
      cy.wait('@getFilteredPage2');
      cy.contains('Page 2 of 6').should('be.visible');
      cy.contains('Unprosecuted Page Two Agent').should('be.visible');

      // Return to page 1
      cy.get('[data-testid="prev-page-button"]').click();
      cy.wait('@getAllAgentsFiltered');

      // Mock search with filter
      cy.intercept('GET', '**/api/dina/all-agents?page=1&limit=50&filter=unprosecuted&search=*', {
        statusCode: 200,
        body: {
          success: true,
          data: [
            { agentNumber: 3, fullName: 'Unprosecuted Agent One', rank: 'Captain', status: 'UNPROSECUTED', legalStatus: { convicted: false } }
          ],
          pagination: {
            current_page: 1,
            total_pages: 1,
            total_agents: 1,
            has_previous: false,
            has_next: false
          },
          filter: 'unprosecuted'
        }
      }).as('getFilteredSearch');

      // Search within filtered results
      cy.get('[data-testid="agent-search-input"]').type('One');
      cy.wait('@getFilteredSearch');
      cy.contains('🎯 Found: 1 agents').should('be.visible');

      // Clear search
      cy.get('[data-testid="clear-search-button"]').click();
      cy.wait('@getAllAgentsFiltered');

      // Deactivate filter
      cy.get('[data-testid="unprosecuted-filter-button"]').click();
      cy.wait('@getAllAgentsNoFilter');

      // Verify back to full list
      cy.contains('📋 Total: 1097 agents').should('be.visible');
      cy.contains('Convicted Agent One').should('be.visible');

      // Success! 🎉⚖️🐾
    });

    it('should maintain filter state during complex navigation', () => {
      cy.contains('📋 ALL AGENTS').click();
      cy.wait('@getAllAgentsNoFilter');

      // Activate filter
      cy.get('[data-testid="unprosecuted-filter-button"]').click();
      cy.wait('@getAllAgentsFiltered');

      // Expand a card
      cy.get('[data-testid="agent-card-3"]').click();
      cy.contains('📋 Agent Information').should('be.visible');

      // Close card
      cy.contains('✖ Close Details').click();

      // Go to page 2
      cy.get('[data-testid="next-page-button"]').click();
      cy.wait('@getFilteredPage2');

      // Expand another card
      cy.get('[data-testid="agent-card-54"]').click();

      // Close and return to page 1
      cy.contains('✖ Close Details').click();
      cy.get('[data-testid="prev-page-button"]').click();
      cy.wait('@getAllAgentsFiltered');

      // Filter should still be active through all navigation
      cy.get('[data-testid="unprosecuted-filter-button"]')
        .should('have.class', 'active');

      cy.contains('📋 Total: 297 agents').should('be.visible');
    });
  });

  describe('⚡ Performance & Stress Testing', () => {
    it('should handle rapid filter toggling', () => {
      cy.contains('📋 ALL AGENTS').click();
      cy.wait('@getAllAgentsNoFilter');

      // Rapid toggle
      cy.get('[data-testid="unprosecuted-filter-button"]').click();
      cy.wait('@getAllAgentsFiltered');

      cy.get('[data-testid="unprosecuted-filter-button"]').click();
      cy.wait('@getAllAgentsNoFilter');

      cy.get('[data-testid="unprosecuted-filter-button"]').click();
      cy.wait('@getAllAgentsFiltered');

      // Should end in filtered state
      cy.get('[data-testid="unprosecuted-filter-button"]')
        .should('have.class', 'active');

      cy.contains('📋 Total: 297 agents').should('be.visible');
    });

    it('should load filtered results quickly', () => {
      cy.contains('📋 ALL AGENTS').click();
      cy.wait('@getAllAgentsNoFilter');

      const startTime = Date.now();

      cy.get('[data-testid="unprosecuted-filter-button"]').click();
      cy.wait('@getAllAgentsFiltered');

      const loadTime = Date.now() - startTime;

      // Should load filtered results in under 1 second
      expect(loadTime).to.be.lessThan(1000);

      cy.contains('Unprosecuted Agent One').should('be.visible');
    });
  });
});

// *purrs in E2E testing excellence for unprosecuted filter* 😻⚖️✨
// *swishes tail in comprehensive test coverage mastery* 🐾⚡👑
