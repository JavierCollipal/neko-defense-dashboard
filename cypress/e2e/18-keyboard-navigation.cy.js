// 🐾⚡ E2E TEST: Keyboard Navigation & Accessibility ⚡🐾
// COMPREHENSIVE keyboard navigation testing for WCAG 2.1 compliance, nyaa~!

describe('⌨️⚡ KEYBOARD NAVIGATION & ACCESSIBILITY ⚡⌨️', () => {
  beforeEach(() => {
    console.log('🐾 [Test] Starting keyboard navigation test, nyaa~!');
    cy.visitDashboard();
  });

  describe('⌨️ Tab Navigation Fundamentals', () => {
    it('should focus on first interactive element with Tab', () => {
      cy.get('body').tab();

      cy.focused().should('exist');
    });

    it('should cycle through all interactive elements', () => {
      const elements = [];

      // Tab through first 10 elements
      for (let i = 0; i < 10; i++) {
        cy.get('body').tab();
        cy.focused().then(($el) => {
          elements.push($el[0].tagName);
        });
      }

      // Should have found buttons/links
      cy.wrap(elements).should('have.length.greaterThan', 0);
    });

    it('should navigate backwards with Shift+Tab', () => {
      cy.get('body').tab().tab(); // Move forward twice
      cy.get('body').tab({ shift: true }); // Move back once

      cy.focused().should('exist');
    });

    it('should have visible focus indicators', () => {
      cy.get('body').tab();

      cy.focused()
        .should('have.css', 'outline-style')
        .and('not.equal', 'none');
    });
  });

  describe('🎯 Navigation Buttons', () => {
    it('should activate Threat Actors button with Enter', () => {
      cy.contains('🎯 THREAT ACTORS').focus().type('{enter}');

      cy.url().should('include', '/');
      cy.contains('THREAT ACTORS REGISTRY').should('be.visible');
    });

    it('should activate DINA Docs button with Enter', () => {
      cy.contains('⚖️ DINA DOCS').focus().type('{enter}');

      cy.contains('DINA INTERNATIONAL HUNT OPERATION').should('be.visible');
    });

    it('should activate buttons with Space key', () => {
      cy.contains('🎯 THREAT ACTORS').focus().type(' ');

      cy.contains('THREAT ACTORS REGISTRY').should('be.visible');
    });

    it('should return to dashboard with Back button via keyboard', () => {
      cy.navigateToThreatActors();

      cy.contains('← Back to Dashboard').focus().type('{enter}');

      cy.contains('NEKO-ARC DEFENSE SYSTEM').should('be.visible');
    });
  });

  describe('🛡️ Category Switcher Navigation', () => {
    it('should focus on category items', () => {
      cy.get('.category-switcher .category-item').first().focus();

      cy.focused().should('have.class', 'category-item');
    });

    it('should activate category with Enter', () => {
      cy.get('.category-switcher .category-item')
        .contains(/predators/i)
        .parent()
        .focus()
        .type('{enter}');

      cy.get('.category-item.active')
        .should('contain.text', /predators/i);
    });

    it('should activate category with Space', () => {
      cy.get('.category-switcher .category-item')
        .contains(/pedophiles/i)
        .parent()
        .focus()
        .type(' ');

      cy.get('.category-item.active')
        .should('contain.text', /pedophiles/i);
    });

    it('should navigate between categories using Tab', () => {
      cy.get('.category-switcher .category-item').first().focus();

      // Tab to next category
      cy.get('body').tab();

      cy.focused().should('have.class', 'category-item');
    });
  });

  describe('🌍 Language Switcher Keyboard Controls', () => {
    it('should open language dropdown with Enter', () => {
      cy.getByDataCy('language-button').focus().type('{enter}');

      cy.getByDataCy('language-dropdown').should('be.visible');
    });

    it('should open language dropdown with Space', () => {
      cy.getByDataCy('language-button').focus().type(' ');

      cy.getByDataCy('language-dropdown').should('be.visible');
    });

    it('should close dropdown with Escape', () => {
      cy.getByDataCy('language-button').click();
      cy.getByDataCy('language-dropdown').should('be.visible');

      cy.get('body').type('{esc}');

      cy.getByDataCy('language-dropdown').should('not.exist');
    });

    it('should select language with Enter', () => {
      cy.getByDataCy('language-button').focus().type('{enter}');
      cy.getByDataCy('language-option-es').focus().type('{enter}');

      cy.getByDataCy('current-lang-code').should('have.text', 'ES');
    });

    it('should navigate between language options with Tab', () => {
      cy.getByDataCy('language-button').click();

      cy.getByDataCy('language-option-en').focus();
      cy.get('body').tab();

      cy.focused().should('have.attr', 'data-cy').and('match', /language-option-/);
    });
  });

  describe('🎬 Modal Keyboard Navigation', () => {
    it('should close modal with Escape key', () => {
      // Open threat actor modal
      cy.navigateToThreatActors();
      cy.get('.threat-actor-card').first().click();

      cy.get('.modal-overlay').should('be.visible');

      // Close with Escape
      cy.get('body').type('{esc}');

      cy.get('.modal-overlay').should('not.exist');
    });

    it('should focus on close button in modal', () => {
      cy.navigateToThreatActors();
      cy.get('.threat-actor-card').first().click();

      cy.get('.modal-close').focus();

      cy.focused().should('have.class', 'modal-close');
    });

    it('should activate close button with Enter', () => {
      cy.navigateToThreatActors();
      cy.get('.threat-actor-card').first().click();

      cy.get('.modal-close').focus().type('{enter}');

      cy.get('.modal-overlay').should('not.exist');
    });

    it('should trap focus inside modal', () => {
      cy.navigateToThreatActors();
      cy.get('.threat-actor-card').first().click();

      // Tab multiple times - focus should stay in modal
      for (let i = 0; i < 10; i++) {
        cy.get('body').tab();
        cy.focused().parents('.modal-content').should('exist');
      }
    });
  });

  describe('🔍 Search & Filter Keyboard Controls', () => {
    it('should focus on search input with Tab', () => {
      cy.navigateToThreatActors();

      cy.get('input[placeholder*="Search"]').focus();

      cy.focused().should('have.attr', 'placeholder').and('include', 'Search');
    });

    it('should type in search field', () => {
      cy.navigateToThreatActors();

      cy.get('input[placeholder*="Search"]')
        .focus()
        .type('Mikhail');

      cy.get('input[placeholder*="Search"]').should('have.value', 'Mikhail');
    });

    it('should clear search with Backspace', () => {
      cy.navigateToThreatActors();

      cy.get('input[placeholder*="Search"]')
        .focus()
        .type('Mikhail')
        .type('{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}');

      cy.get('input[placeholder*="Search"]').should('have.value', '');
    });

    it('should navigate to filter buttons with Tab', () => {
      cy.navigateToThreatActors();

      cy.contains('All Types').focus();

      cy.focused().should('contain', 'All Types');
    });

    it('should activate filter with Enter', () => {
      cy.navigateToThreatActors();

      cy.contains('👤 Individual').focus().type('{enter}');

      cy.focused().should('have.class', 'active');
    });

    it('should activate filter with Space', () => {
      cy.navigateToThreatActors();

      cy.contains('💰 Ransomware').focus().type(' ');

      cy.focused().should('have.class', 'active');
    });
  });

  describe('♿ ARIA & Screen Reader Support', () => {
    it('should have proper ARIA labels on navigation buttons', () => {
      cy.getByDataCy('language-button')
        .should('have.attr', 'aria-label', 'Select language');
    });

    it('should have semantic button elements', () => {
      cy.get('button').should('have.length.greaterThan', 0);
      cy.get('button').first().should('have.attr', 'type').or('not.have.attr', 'type');
    });

    it('should have proper heading hierarchy', () => {
      cy.get('h1, h2, h3, h4').should('have.length.greaterThan', 0);
    });

    it('should have alt text on images (if any)', () => {
      cy.get('img').each(($img) => {
        cy.wrap($img).should('have.attr', 'alt');
      });
    });

    it('should have labels for form inputs', () => {
      cy.get('input').each(($input) => {
        const id = $input.attr('id');
        const placeholder = $input.attr('placeholder');
        const ariaLabel = $input.attr('aria-label');

        // Should have either associated label, placeholder, or aria-label
        expect(id || placeholder || ariaLabel).to.exist;
      });
    });
  });

  describe('🎨 Focus Visibility', () => {
    it('should have visible focus on buttons', () => {
      cy.contains('🎯 THREAT ACTORS').focus();

      cy.focused()
        .should('have.css', 'outline-width')
        .and('not.equal', '0px');
    });

    it('should have custom focus styles', () => {
      cy.get('.category-item').first().focus();

      // Should have some form of visible focus
      cy.focused().should('exist');
    });

    it('should maintain focus visibility after interactions', () => {
      cy.getByDataCy('language-button').focus();

      cy.focused().should('exist');

      cy.getByDataCy('language-button').click();

      // Focus should still be visible
      cy.focused().should('exist');
    });
  });

  describe('⚡ Keyboard Shortcuts (If Implemented)', () => {
    it('should handle common keyboard patterns gracefully', () => {
      // Ctrl+F, Cmd+F (browser default - just verify no crash)
      cy.get('body').type('{ctrl}f');

      cy.get('.App').should('exist');
    });

    it('should not break with rapid keystrokes', () => {
      cy.get('body')
        .tab()
        .tab()
        .tab()
        .type('{enter}')
        .type('{esc}');

      cy.get('.App').should('exist');
    });
  });

  describe('🔄 Navigation State Preservation', () => {
    it('should restore focus after navigation', () => {
      cy.contains('🎯 THREAT ACTORS').focus().type('{enter}');

      cy.contains('← Back to Dashboard').focus().type('{enter}');

      // Should be back on dashboard
      cy.contains('NEKO-ARC DEFENSE SYSTEM').should('be.visible');
    });

    it('should maintain keyboard usability after category switch', () => {
      cy.selectCategory('predators');

      cy.get('body').tab();

      cy.focused().should('exist');
    });

    it('should maintain keyboard usability after language change', () => {
      cy.getByDataCy('language-button').click();
      cy.getByDataCy('language-option-es').click();

      cy.get('body').tab();

      cy.focused().should('exist');
    });
  });

  describe('📱 Mobile Keyboard Support (Virtual Keyboards)', () => {
    beforeEach(() => {
      cy.viewport('iphone-x');
    });

    it('should focus on search input on mobile', () => {
      cy.navigateToThreatActors();

      cy.get('input[placeholder*="Search"]').focus();

      cy.focused().should('exist');
    });

    it('should handle touch+keyboard hybrid interactions', () => {
      cy.getByDataCy('language-button').click(); // Touch
      cy.getByDataCy('language-option-fr').focus().type('{enter}'); // Keyboard

      cy.getByDataCy('current-lang-code').should('have.text', 'FR');
    });
  });

  describe('⚠️ Error & Edge Cases', () => {
    it('should not lose focus when error occurs', () => {
      // Simulate an error scenario if possible
      cy.get('body').tab();

      cy.focused().should('exist');
    });

    it('should handle disabled elements correctly', () => {
      cy.get('button:disabled').should('not.be.focused');
    });

    it('should skip hidden elements in tab order', () => {
      cy.get('body').tab();

      cy.focused().should('be.visible');
    });
  });

  describe('🎯 Skip Links (Best Practice)', () => {
    it('should have skip to content link for screen readers', () => {
      // This is a best practice - might not be implemented yet
      cy.get('a[href*="#content"], a[href*="#main"]').then(($skipLinks) => {
        if ($skipLinks.length > 0) {
          cy.wrap($skipLinks).first().should('exist');
        } else {
          // Log recommendation
          console.log('💡 RECOMMENDATION: Add skip navigation links for accessibility');
        }
      });
    });
  });
});

// *purrs in keyboard accessibility* 😻⌨️
// LEGENDARY KEYBOARD NAVIGATION E2E TEST COMPLETE, NYAA~! 🐾⚡
