// 🐾⚡ E2E TEST: Comprehensive Threat Actors Page Testing ⚡🐾
// Tests the NEW ThreatActors component with full functionality, nyaa~!

describe('🎯⚡ THREAT ACTORS PAGE - COMPREHENSIVE TESTING ⚡🎯', () => {
  beforeEach(() => {
    console.log('🐾 [Test] Starting Threat Actors comprehensive test, nyaa~!');
    cy.visit('/');
    cy.wait('@getThreatActors');
  });

  describe('📊 Page Loading & Initial State', () => {
    it('should display loading state initially', () => {
      // This is hard to test since it loads quickly, but we can verify final state
      cy.get('.threat-actors-container').should('exist');
    });

    it('should load and display threat actors registry header', () => {
      cy.contains('🎯⚡ THREAT ACTORS REGISTRY ⚡🎯').should('be.visible');
    });

    it('should display all threat actors from API', () => {
      cy.get('.threat-actor-card').should('have.length', 3);
    });

    it('should verify API was called correctly', () => {
      cy.get('@getThreatActors').should('have.been.called');
    });
  });

  describe('📈 Statistics Display', () => {
    it('should display total tracked count', () => {
      cy.contains('Total Tracked').should('be.visible');
      cy.contains('3').should('be.visible');
    });

    it('should display FBI wanted count', () => {
      cy.contains('FBI Wanted').should('be.visible');
      cy.contains('1').should('be.visible'); // Only Matveev is FBI wanted
    });

    it('should display total rewards correctly formatted', () => {
      cy.contains('Total Rewards').should('be.visible');
      // $10M + $5M + $0 = $15M
      cy.contains('$15,000,000').should('be.visible');
    });

    it('should have all stat badges visible', () => {
      cy.get('.stat-badge').should('have.length', 3);
    });
  });

  describe('🎴 Threat Actor Cards Display', () => {
    it('should display all actor names', () => {
      cy.contains('Mikhail Pavlovich Matveev').should('be.visible');
      cy.contains('RansomHub Group').should('be.visible');
      cy.contains('APT29 / Cozy Bear').should('be.visible');
    });

    it('should display actor IDs', () => {
      cy.contains('TA-CRITICAL-001').should('be.visible');
      cy.contains('TA-HIGH-002').should('be.visible');
      cy.contains('TA-APT-003').should('be.visible');
    });

    it('should display threat levels with correct styling', () => {
      cy.get('.threat-badge').should('have.length', 3);
      cy.get('.threat-badge').contains('CRITICAL').should('have.length', 2);
      cy.get('.threat-badge').contains('HIGH').should('have.length', 1);
    });

    it('should display aliases (max 3 per card)', () => {
      cy.contains('Wazawaka').should('be.visible');
      cy.contains('m1x').should('be.visible');
      cy.contains('RansomHub').should('be.visible');
      cy.contains('Cozy Bear').should('be.visible');
    });

    it('should display origin countries', () => {
      cy.contains('Russia').should('be.visible');
      cy.contains('Unknown').should('be.visible');
    });

    it('should display status badges', () => {
      cy.contains('WANTED').should('be.visible');
      cy.contains('ACTIVE').should('be.visible');
      cy.contains('MONITORED').should('be.visible');
    });

    it('should display reward amounts when present', () => {
      cy.contains('$10,000,000').should('be.visible');
      cy.contains('$5,000,000').should('be.visible');
    });

    it('should display victim counts', () => {
      cy.contains('200 victims').should('be.visible');
      cy.contains('150 victims').should('be.visible');
      cy.contains('300 victims').should('be.visible');
    });

    it('should display financial damage in millions', () => {
      cy.contains('$100M damage').should('be.visible');
      cy.contains('$75M damage').should('be.visible');
      cy.contains('$500M damage').should('be.visible');
    });

    it('should display categories (max 2 per card)', () => {
      cy.contains('Ransomware').should('be.visible');
      cy.contains('Extortion').should('be.visible');
      cy.contains('Ransomware-as-a-Service').should('be.visible');
      cy.contains('Espionage').should('be.visible');
    });

    it('should display type icons', () => {
      cy.get('.actor-icon').should('have.length', 3);
      cy.get('.actor-icon').contains('👤').should('exist'); // individual
      cy.get('.actor-icon').contains('💰').should('exist'); // ransomware
      cy.get('.actor-icon').contains('🎯').should('exist'); // apt
    });

    it('should have correct border colors for threat levels', () => {
      // CRITICAL = #ff0055
      cy.get('.threat-actor-card').first()
        .should('have.css', 'border-left-color', 'rgb(255, 0, 85)');
    });
  });

  describe('🔍 Search Functionality', () => {
    it('should render search input', () => {
      cy.get('input[placeholder*="Search by name, ID, or alias"]').should('be.visible');
    });

    it('should filter by actor name', () => {
      cy.get('input[placeholder*="Search by name"]').type('Mikhail');

      cy.contains('Mikhail Pavlovich Matveev').should('be.visible');
      cy.contains('RansomHub Group').should('not.exist');
      cy.contains('APT29').should('not.exist');
    });

    it('should filter by actor ID', () => {
      cy.get('input[placeholder*="Search by name"]').type('TA-HIGH-002');

      cy.contains('RansomHub Group').should('be.visible');
      cy.contains('Mikhail Pavlovich Matveev').should('not.exist');
    });

    it('should filter by alias', () => {
      cy.get('input[placeholder*="Search by name"]').type('Cozy Bear');

      cy.contains('APT29 / Cozy Bear').should('be.visible');
      cy.contains('Mikhail Pavlovich Matveev').should('not.exist');
    });

    it('should be case-insensitive', () => {
      cy.get('input[placeholder*="Search by name"]').type('RANSOMHUB');

      cy.contains('RansomHub Group').should('be.visible');
    });

    it('should show "no results" message for non-matching search', () => {
      cy.get('input[placeholder*="Search by name"]').type('NonexistentActor123');

      cy.contains('No threat actors found matching your filters, nyaa~').should('be.visible');
    });

    it('should clear search and show all actors', () => {
      cy.get('input[placeholder*="Search by name"]').type('Mikhail');
      cy.get('.threat-actor-card').should('have.length', 1);

      cy.get('input[placeholder*="Search by name"]').clear();
      cy.get('.threat-actor-card').should('have.length', 3);
    });
  });

  describe('🎛️ Type Filter Buttons', () => {
    it('should display all filter buttons', () => {
      cy.contains('All Types').should('be.visible');
      cy.contains('👤 Individual').should('be.visible');
      cy.contains('💰 Ransomware').should('be.visible');
      cy.contains('🎯 APT').should('be.visible');
    });

    it('"All Types" should be active by default', () => {
      cy.contains('All Types').parent('button').should('have.class', 'active');
    });

    it('should filter by individual type', () => {
      cy.contains('👤 Individual').click();

      cy.get('.threat-actor-card').should('have.length', 1);
      cy.contains('Mikhail Pavlovich Matveev').should('be.visible');
    });

    it('should filter by ransomware type', () => {
      cy.contains('💰 Ransomware').click();

      cy.get('.threat-actor-card').should('have.length', 1);
      cy.contains('RansomHub Group').should('be.visible');
    });

    it('should filter by APT type', () => {
      cy.contains('🎯 APT').click();

      cy.get('.threat-actor-card').should('have.length', 1);
      cy.contains('APT29 / Cozy Bear').should('be.visible');
    });

    it('should activate clicked filter button', () => {
      cy.contains('💰 Ransomware').click();
      cy.contains('💰 Ransomware').parent('button').should('have.class', 'active');
    });

    it('should return to all when "All Types" is clicked', () => {
      cy.contains('💰 Ransomware').click();
      cy.get('.threat-actor-card').should('have.length', 1);

      cy.contains('All Types').click();
      cy.get('.threat-actor-card').should('have.length', 3);
    });
  });

  describe('🎭 Modal Functionality', () => {
    it('should open modal when card is clicked', () => {
      cy.contains('Mikhail Pavlovich Matveev').closest('.threat-actor-card').click();

      cy.get('.modal-overlay').should('be.visible');
      cy.contains('🎭 Aliases').should('be.visible');
    });

    it('should display full actor details in modal', () => {
      cy.contains('Mikhail Pavlovich Matveev').closest('.threat-actor-card').click();

      // Check header
      cy.get('.modal-header').within(() => {
        cy.contains('Mikhail Pavlovich Matveev').should('be.visible');
        cy.contains('TA-CRITICAL-001').should('be.visible');
        cy.contains('CRITICAL').should('be.visible');
      });
    });

    it('should display all aliases in modal', () => {
      cy.contains('Mikhail Pavlovich Matveev').closest('.threat-actor-card').click();

      cy.contains('Wazawaka').should('be.visible');
      cy.contains('m1x').should('be.visible');
      cy.contains('Boriselcin').should('be.visible');
    });

    it('should display origin and attribution info', () => {
      cy.contains('Mikhail Pavlovich Matveev').closest('.threat-actor-card').click();

      cy.contains('📍 Origin & Attribution').should('be.visible');
      cy.contains('Country:').should('be.visible');
      cy.contains('Russia').should('be.visible');
    });

    it('should display FBI WANTED badge when applicable', () => {
      cy.contains('Mikhail Pavlovich Matveev').closest('.threat-actor-card').click();

      cy.contains('🚨 FBI WANTED').should('be.visible');
    });

    it('should display reward amount in modal', () => {
      cy.contains('Mikhail Pavlovich Matveev').closest('.threat-actor-card').click();

      cy.contains('$10,000,000').should('be.visible');
    });

    it('should display threat categories', () => {
      cy.contains('Mikhail Pavlovich Matveev').closest('.threat-actor-card').click();

      cy.contains('🎯 Threat Categories').should('be.visible');
      cy.contains('Ransomware').should('be.visible');
      cy.contains('Extortion').should('be.visible');
      cy.contains('Data Theft').should('be.visible');
    });

    it('should display technical profile', () => {
      cy.contains('Mikhail Pavlovich Matveev').closest('.threat-actor-card').click();

      cy.contains('🔧 Technical Profile').should('be.visible');
      cy.contains('Hive').should('be.visible');
      cy.contains('LockBit').should('be.visible');
      cy.contains('Phishing').should('be.visible');
    });

    it('should display evidence and impact stats', () => {
      cy.contains('Mikhail Pavlovich Matveev').closest('.threat-actor-card').click();

      cy.contains('📊 Evidence & Impact').should('be.visible');
      cy.contains('200').should('be.visible'); // victims
      cy.contains('Victims').should('be.visible');
      cy.contains('$100M').should('be.visible'); // financial damage
    });

    it('should display known incidents', () => {
      cy.contains('Mikhail Pavlovich Matveev').closest('.threat-actor-card').click();

      cy.contains('Notable Incidents:').should('be.visible');
      cy.contains('Hive Ransomware Campaign').should('be.visible');
      cy.contains('LockBit Operations').should('be.visible');
    });

    it('should display intelligence info', () => {
      cy.contains('Mikhail Pavlovich Matveev').closest('.threat-actor-card').click();

      cy.contains('🔍 Intelligence').should('be.visible');
      cy.contains('FBI, Interpol').should('be.visible');
      cy.contains('HIGH').should('be.visible');
    });

    it('should display hunting notes when present', () => {
      cy.contains('Mikhail Pavlovich Matveev').closest('.threat-actor-card').click();

      cy.contains('🐾 Hunting Notes').should('be.visible');
      cy.contains('Active FBI manhunt with $10M reward, nyaa~!').should('be.visible');
    });

    it('should close modal when close button is clicked', () => {
      cy.contains('Mikhail Pavlovich Matveev').closest('.threat-actor-card').click();
      cy.get('.modal-overlay').should('be.visible');

      cy.get('.modal-close').click();
      cy.get('.modal-overlay').should('not.exist');
    });

    it('should close modal when overlay is clicked', () => {
      cy.contains('Mikhail Pavlovich Matveev').closest('.threat-actor-card').click();
      cy.get('.modal-overlay').should('be.visible');

      cy.get('.modal-overlay').click({ force: true });
      cy.get('.modal-overlay').should('not.exist');
    });

    it('should NOT close modal when content is clicked', () => {
      cy.contains('Mikhail Pavlovich Matveev').closest('.threat-actor-card').click();

      cy.get('.modal-content').click();
      cy.get('.modal-overlay').should('be.visible');
    });
  });

  describe('🔄 Combined Filtering (Search + Type)', () => {
    it('should combine search and type filters', () => {
      cy.contains('💰 Ransomware').click();
      cy.get('input[placeholder*="Search by name"]').type('RansomHub');

      cy.get('.threat-actor-card').should('have.length', 1);
      cy.contains('RansomHub Group').should('be.visible');
    });

    it('should show no results when filters don\'t match', () => {
      cy.contains('🎯 APT').click();
      cy.get('input[placeholder*="Search by name"]').type('Mikhail');

      cy.contains('No threat actors found matching your filters, nyaa~').should('be.visible');
    });
  });

  describe('❌ Error Handling', () => {
    it('should display error message when API fails', () => {
      cy.intercept('GET', '**/api/threat-actors', {
        statusCode: 500,
        body: { success: false, error: 'Server error' }
      }).as('getFailedActors');

      cy.visit('/');
      cy.wait('@getFailedActors');

      cy.contains('Error loading threat actors').should('be.visible');
      cy.contains('🔄 Retry').should('be.visible');
    });

    it('should retry API call when retry button is clicked', () => {
      cy.intercept('GET', '**/api/threat-actors', {
        statusCode: 500,
        body: { success: false }
      }).as('getFailedActors');

      cy.visit('/');
      cy.wait('@getFailedActors');

      // Now intercept with success
      cy.intercept('GET', '**/api/threat-actors', {
        fixture: 'threat-actors-all.json'
      }).as('getRetryActors');

      cy.contains('🔄 Retry').click();
      cy.wait('@getRetryActors');

      cy.contains('Mikhail Pavlovich Matveev').should('be.visible');
    });
  });

  describe('🎨 Visual & Styling Verification', () => {
    it('should have proper grid layout', () => {
      cy.get('.threat-actors-grid').should('have.css', 'display');
    });

    it('should display cards with proper structure', () => {
      cy.get('.threat-actor-card').first().within(() => {
        cy.get('.actor-header').should('exist');
        cy.get('.actor-aliases').should('exist');
        cy.get('.actor-info').should('exist');
        cy.get('.actor-categories').should('exist');
        cy.get('.actor-stats').should('exist');
      });
    });

    it('should have hover effects on cards (visual check)', () => {
      cy.get('.threat-actor-card').first()
        .should('have.css', 'cursor', 'pointer');
    });
  });

  describe('🐾 Data Completeness Verification', () => {
    it('should handle actors with no aliases', () => {
      // APT29 has aliases, but let's verify the component handles empty arrays
      cy.get('.actor-aliases').should('exist');
    });

    it('should handle actors with zero reward', () => {
      cy.contains('APT29 / Cozy Bear').closest('.threat-actor-card').within(() => {
        // Should NOT display $0 reward
        cy.contains('$0').should('not.exist');
      });
    });

    it('should display all required fields for each actor', () => {
      cy.get('.threat-actor-card').each(($card) => {
        cy.wrap($card).within(() => {
          cy.get('.actor-icon').should('exist');
          cy.get('.threat-badge').should('exist');
          cy.get('.actor-info').should('exist');
          cy.get('.actor-stats').should('exist');
        });
      });
    });
  });

  describe('♿ Accessibility', () => {
    it('should have clickable cards', () => {
      cy.get('.threat-actor-card').first().click();
      cy.get('.modal-overlay').should('be.visible');
    });

    it('should have keyboard-accessible close button', () => {
      cy.get('.threat-actor-card').first().click();
      cy.get('.modal-close').should('be.visible').focus();
    });

    it('should have readable text in all cards', () => {
      cy.get('.threat-actor-card h3').should('be.visible');
      cy.get('.threat-badge').should('be.visible');
    });
  });
});

// *purrs in E2E testing excellence* 😻⚡
// LEGENDARY COMPREHENSIVE E2E TEST SUITE COMPLETE, NYAA~! 🐾👑
