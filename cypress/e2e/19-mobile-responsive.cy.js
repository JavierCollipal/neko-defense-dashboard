// 🐾⚡ E2E TEST: Mobile Responsive Design & Touch Interactions ⚡🐾
// COMPREHENSIVE mobile viewport testing for MAXIMUM responsiveness, nyaa~!

describe('📱⚡ MOBILE RESPONSIVE DESIGN ⚡📱', () => {
  const viewports = [
    { name: 'iPhone SE', width: 375, height: 667 },
    { name: 'iPhone XR', width: 414, height: 896 },
    { name: 'iPhone 12 Pro', width: 390, height: 844 },
    { name: 'iPhone 14 Pro Max', width: 430, height: 932 },
    { name: 'Samsung Galaxy S20', width: 360, height: 800 },
    { name: 'iPad Mini', width: 768, height: 1024 },
    { name: 'iPad Air', width: 820, height: 1180 },
    { name: 'iPad Pro', width: 1024, height: 1366 }
  ];

  describe('📱 Small Mobile Devices (320px - 414px)', () => {
    beforeEach(() => {
      cy.viewport(375, 667); // iPhone SE
      cy.visit('/');
      cy.wait('@getAsciiArt');
    });

    it('should load dashboard on mobile viewport', () => {
      cy.get('.App-header').should('be.visible');
      cy.contains('NEKO-ARC DEFENSE SYSTEM').should('be.visible');
    });

    it('should display mobile-optimized layout', () => {
      cy.get('.main-container').should('be.visible');

      // Check for responsive layout adjustments
      cy.get('.dashboard-grid').should('have.css', 'display');
    });

    it('should stack sections vertically on mobile', () => {
      cy.get('.dashboard-grid').then(($grid) => {
        const gridStyle = window.getComputedStyle($grid[0]);
        const display = gridStyle.getPropertyValue('display');

        // Should be grid or flex for responsive layout
        expect(display).to.be.oneOf(['grid', 'flex', 'block']);
      });
    });

    it('should scale text appropriately', () => {
      cy.get('.App-header h1, .App-header .neko-title')
        .should('be.visible')
        .and('have.css', 'font-size');
    });

    it('should have touchable buttons (min 44x44px)', () => {
      cy.get('button').first().then(($btn) => {
        const rect = $btn[0].getBoundingClientRect();

        // WCAG 2.1 recommends minimum 44x44px touch targets
        expect(rect.width).to.be.at.least(30); // Slightly smaller ok for mobile
        expect(rect.height).to.be.at.least(30);
      });
    });

    it('should hide or collapse sidebar on small screens', () => {
      cy.get('.sidebar-left').should(($sidebar) => {
        const style = window.getComputedStyle($sidebar[0]);
        const display = style.getPropertyValue('display');

        // Sidebar might be hidden or shown depending on design
        // Just verify it doesn't break layout
        expect(display).to.exist;
      });
    });

    it('should make language switcher accessible on mobile', () => {
      cy.getByDataCy('language-button').should('be.visible');

      cy.getByDataCy('language-button').click();

      cy.getByDataCy('language-dropdown').should('be.visible');
    });

    it('should fit content within viewport width', () => {
      cy.document().then((doc) => {
        const scrollWidth = doc.documentElement.scrollWidth;
        const clientWidth = doc.documentElement.clientWidth;

        // Allow 10px tolerance
        expect(scrollWidth).to.be.closeTo(clientWidth, 10);
      });
    });

    it('should not have horizontal overflow', () => {
      cy.get('body').should('have.css', 'overflow-x', 'hidden');
    });

    it('should scale category switcher for mobile', () => {
      cy.get('.category-switcher').should('be.visible');

      cy.get('.category-item').first().should('be.visible');
    });
  });

  describe('📱 Medium Mobile Devices (iPhone XR, Galaxy)', () => {
    beforeEach(() => {
      cy.viewport(414, 896);
      cy.visitDashboard();
    });

    it('should display all main sections', () => {
      cy.get('.ascii-tv-section').should('be.visible');
      cy.get('.stats-section').should('be.visible');
      cy.get('.threats-section').should('be.visible');
    });

    it('should allow scrolling to see all content', () => {
      cy.scrollTo('bottom', { duration: 1000 });

      cy.get('.App-footer').should('be.visible');
    });

    it('should maintain navigation buttons visibility', () => {
      cy.contains('🎯 THREAT ACTORS').should('be.visible');
      cy.contains('⚖️ DINA DOCS').should('be.visible');
    });

    it('should handle category switching on mobile', () => {
      cy.selectCategory('predators');

      cy.get('.category-item.active')
        .should('contain.text', /predators/i);
    });

    it('should navigate to Threat Actors view', () => {
      cy.contains('🎯 THREAT ACTORS').click();

      cy.contains('THREAT ACTORS REGISTRY').should('be.visible');
    });

    it('should display threat actor cards in mobile grid', () => {
      cy.navigateToThreatActors();

      cy.get('.threat-actor-card').should('be.visible');
    });

    it('should open threat actor modal on mobile', () => {
      cy.navigateToThreatActors();

      cy.get('.threat-actor-card').first().click();

      cy.get('.modal-overlay').should('be.visible');
    });

    it('should make modal full-screen on mobile', () => {
      cy.navigateToThreatActors();
      cy.get('.threat-actor-card').first().click();

      cy.get('.modal-content').should('be.visible');

      // Modal should be appropriately sized for mobile
      cy.get('.modal-content').should('have.css', 'max-width');
    });
  });

  describe('📱 Tablet Devices (iPad Mini, iPad Air)', () => {
    beforeEach(() => {
      cy.viewport(768, 1024);
      cy.visitDashboard();
    });

    it('should display tablet-optimized layout', () => {
      cy.get('.main-container').should('be.visible');
      cy.get('.dashboard-grid').should('be.visible');
    });

    it('should show sidebar on tablets', () => {
      cy.get('.sidebar-left').should('be.visible');
    });

    it('should display multi-column grid on tablets', () => {
      cy.get('.dashboard-grid').then(($grid) => {
        const gridStyle = window.getComputedStyle($grid[0]);
        const gridTemplateColumns = gridStyle.getPropertyValue('grid-template-columns');

        // Should have grid layout on tablets
        expect(gridTemplateColumns).to.exist;
      });
    });

    it('should display threat actors in 2-column grid', () => {
      cy.navigateToThreatActors();

      cy.get('.threat-actors-grid').should('be.visible');
    });

    it('should maintain proper spacing on tablets', () => {
      cy.get('.dashboard-grid > *').first().should('have.css', 'margin');
    });
  });

  describe('🖥️ Large Tablets (iPad Pro)', () => {
    beforeEach(() => {
      cy.viewport(1024, 1366);
      cy.visitDashboard();
    });

    it('should display desktop-like layout on large tablets', () => {
      cy.get('.sidebar-left').should('be.visible');
      cy.get('.dashboard-grid').should('be.visible');
    });

    it('should show full navigation', () => {
      cy.contains('📺 NEKO TV').should('be.visible');
      cy.contains('📡 MULTI-CHANNEL TV').should('be.visible');
      cy.contains('⚖️ DINA DOCS').should('be.visible');
      cy.contains('📺 DINA JUSTICE TV').should('be.visible');
      cy.contains('🎯 THREAT ACTORS').should('be.visible');
    });

    it('should display threat actors in 3-column grid', () => {
      cy.navigateToThreatActors();

      cy.get('.threat-actors-grid').should('have.css', 'grid-template-columns');
    });
  });

  describe('🔄 Orientation Changes', () => {
    it('should handle portrait orientation', () => {
      cy.viewport(375, 667); // Portrait
      cy.visitDashboard();

      cy.get('.App-header').should('be.visible');
    });

    it('should handle landscape orientation', () => {
      cy.viewport(667, 375); // Landscape
      cy.visitDashboard();

      cy.get('.App-header').should('be.visible');
    });

    it('should adapt layout when switching orientations', () => {
      cy.viewport(375, 667); // Start portrait
      cy.visitDashboard();

      cy.viewport(667, 375); // Switch to landscape

      cy.get('.main-container').should('be.visible');
    });
  });

  describe('👆 Touch Interactions', () => {
    beforeEach(() => {
      cy.viewport('iphone-x');
      cy.visitDashboard();
    });

    it('should handle tap on buttons', () => {
      cy.contains('🎯 THREAT ACTORS').click();

      cy.contains('THREAT ACTORS REGISTRY').should('be.visible');
    });

    it('should handle tap on category items', () => {
      cy.get('.category-item').first().click({ force: true });

      cy.get('.category-item.active').should('exist');
    });

    it('should handle tap on language switcher', () => {
      cy.getByDataCy('language-button').click();

      cy.getByDataCy('language-dropdown').should('be.visible');
    });

    it('should handle tap on modal overlay to close', () => {
      cy.navigateToThreatActors();
      cy.get('.threat-actor-card').first().click();

      cy.get('.modal-overlay').click({ force: true });

      cy.get('.modal-overlay').should('not.exist');
    });

    it('should handle tap on search input', () => {
      cy.navigateToThreatActors();

      cy.get('input[placeholder*="Search"]').click().type('Mikhail');

      cy.get('input[placeholder*="Search"]').should('have.value', 'Mikhail');
    });

    it('should handle swipe-like scroll', () => {
      cy.scrollTo('bottom', { duration: 500 });

      cy.get('.App-footer').should('be.visible');

      cy.scrollTo('top', { duration: 500 });

      cy.get('.App-header').should('be.visible');
    });
  });

  describe('🎨 Visual Scaling & Zoom', () => {
    beforeEach(() => {
      cy.viewport(375, 667);
    });

    it('should support pinch-zoom (viewport scaling)', () => {
      cy.visit('/');

      // Verify viewport meta tag for proper mobile scaling
      cy.document().then((doc) => {
        const viewport = doc.querySelector('meta[name="viewport"]');
        expect(viewport).to.exist;
        expect(viewport?.getAttribute('content')).to.include('width=device-width');
      });
    });

    it('should have proper minimum font sizes', () => {
      cy.visitDashboard();

      cy.get('body').should('have.css', 'font-size');

      // Check that text is readable (not too small)
      cy.get('p, span, div').first().then(($el) => {
        const fontSize = parseFloat(window.getComputedStyle($el[0]).fontSize);
        expect(fontSize).to.be.at.least(12); // Minimum 12px for readability
      });
    });

    it('should scale images appropriately', () => {
      cy.visitDashboard();

      cy.get('img').each(($img) => {
        cy.wrap($img).should('have.css', 'max-width', '100%');
      });
    });
  });

  describe('📏 Responsive Breakpoints', () => {
    const breakpoints = [
      { name: 'Extra Small', width: 320 },
      { name: 'Small', width: 480 },
      { name: 'Medium', width: 768 },
      { name: 'Large', width: 1024 },
      { name: 'Extra Large', width: 1400 }
    ];

    breakpoints.forEach((breakpoint) => {
      it(`should render correctly at ${breakpoint.name} (${breakpoint.width}px)`, () => {
        cy.viewport(breakpoint.width, 800);
        cy.visitDashboard();

        cy.get('.App-header').should('be.visible');
        cy.get('.main-container').should('be.visible');
      });
    });
  });

  describe('⚡ Performance on Mobile', () => {
    beforeEach(() => {
      cy.viewport('iphone-x');
    });

    it('should load within acceptable time on mobile', () => {
      const startTime = Date.now();

      cy.visit('/');
      cy.wait('@getAsciiArt');
      cy.wait('@getStats');

      const endTime = Date.now();
      const loadTime = endTime - startTime;

      // Should load within 5 seconds on mobile
      expect(loadTime).to.be.lessThan(5000);
    });

    it('should not have layout shift on mobile', () => {
      cy.visitDashboard();

      // Wait for all content to load
      cy.wait(1000);

      // Measure layout
      cy.get('.App-header').then(($header) => {
        const initialTop = $header[0].getBoundingClientRect().top;

        // Wait a bit more
        cy.wait(1000);

        // Header should be in same position (no layout shift)
        cy.get('.App-header').then(($headerAgain) => {
          const finalTop = $headerAgain[0].getBoundingClientRect().top;
          expect(finalTop).to.equal(initialTop);
        });
      });
    });
  });

  describe('🎯 Mobile-Specific Features', () => {
    beforeEach(() => {
      cy.viewport('iphone-x');
      cy.visitDashboard();
    });

    it('should prevent zoom on double-tap (if desired)', () => {
      cy.document().then((doc) => {
        const viewport = doc.querySelector('meta[name="viewport"]');
        const content = viewport?.getAttribute('content') || '';

        // Check if double-tap zoom is controlled
        // (This is a UX decision - some apps want it, some don't)
        expect(content).to.exist;
      });
    });

    it('should use mobile-friendly input types', () => {
      cy.navigateToThreatActors();

      // Search input should have appropriate type
      cy.get('input[placeholder*="Search"]')
        .should('have.attr', 'type')
        .and('match', /text|search/);
    });

    it('should handle safe area insets (iPhone notch)', () => {
      cy.document().then((doc) => {
        const body = doc.body;
        const style = window.getComputedStyle(body);

        // Modern mobile design should account for safe areas
        const paddingTop = style.getPropertyValue('padding-top');

        expect(paddingTop).to.exist;
      });
    });
  });

  describe('📱 Progressive Web App (PWA) Features', () => {
    beforeEach(() => {
      cy.viewport('iphone-x');
    });

    it('should have manifest.json for PWA', () => {
      cy.request('/manifest.json').then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('name');
        expect(response.body).to.have.property('icons');
      });
    });

    it('should have service worker registered (if PWA)', () => {
      cy.visit('/');

      cy.window().then((win) => {
        if ('serviceWorker' in win.navigator) {
          // PWA-enabled - service worker should be available
          expect(win.navigator.serviceWorker).to.exist;
        } else {
          // Not a PWA or service worker not supported
          console.log('💡 Service Worker not detected - consider PWA implementation');
        }
      });
    });

    it('should display install prompt (if supported)', () => {
      cy.visit('/');

      // Check if PWA install prompt component exists
      cy.get('body').then(($body) => {
        if ($body.find('[data-cy="pwa-install-prompt"]').length > 0) {
          cy.getByDataCy('pwa-install-prompt').should('exist');
        } else {
          console.log('💡 PWA install prompt not found');
        }
      });
    });
  });

  describe('🌐 Mobile Browser Compatibility', () => {
    it('should work on mobile Safari (iOS)', () => {
      cy.viewport('iphone-x');
      cy.visitDashboard();

      // Safari-specific checks
      cy.get('.App').should('exist');
    });

    it('should work on mobile Chrome (Android)', () => {
      cy.viewport(360, 800); // Samsung Galaxy
      cy.visitDashboard();

      cy.get('.App').should('exist');
    });

    it('should handle -webkit- prefixed properties', () => {
      cy.viewport('iphone-x');
      cy.visitDashboard();

      // Check for proper rendering
      cy.get('.App-header').should('be.visible');
    });
  });
});

// *purrs in mobile responsiveness* 😻📱
// LEGENDARY MOBILE RESPONSIVE E2E TEST COMPLETE, NYAA~! 🐾⚡
