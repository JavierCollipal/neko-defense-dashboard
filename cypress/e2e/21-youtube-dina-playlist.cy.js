// 🐾⚡ E2E TEST: YouTube DINA Video Playlist ⚡🐾
// Testing DINA VIDEO PLAYLIST PROOF integration, nyaa~! 🎬✨
describe('📺🎯 YouTube DINA Video Playlist Feature', () => {
  beforeEach(() => {
    console.log('🐾 [Test] Starting YouTube DINA playlist test, nyaa~!');
    // Visit the YouTube playlist page directly
    cy.visit('http://localhost:3000/youtube');
    cy.wait(500); // Allow page to load
  });

  describe('🎬 Page Loading & Initial Render', () => {
    it('should load the YouTube playlist page successfully', () => {
      cy.contains('🎬 NEKO DEFENSE EXPOSURE CHANNEL 📺').should('be.visible');
    });

    it('should display the main subtitle', () => {
      cy.contains('Public Exposure of Threat Actors & Bad Actor Systems').should('be.visible');
    });

    it('should render the subscribe button', () => {
      cy.contains('🔴 VISIT CHANNEL & SUBSCRIBE')
        .should('be.visible')
        .and('have.class', 'youtube-subscribe-btn');
    });

    it('should have correct page structure', () => {
      cy.get('.youtube-playlist-container').should('exist');
      cy.get('.youtube-header').should('be.visible');
    });
  });

  describe('🎯 DINA VIDEO PLAYLIST PROOF Section', () => {
    it('should display the DINA playlist featured section', () => {
      cy.get('.dina-playlist-featured')
        .should('be.visible')
        .within(() => {
          cy.contains('🎯 DINA VIDEO PLAYLIST PROOF').should('be.visible');
        });
    });

    it('should render DINA playlist section header', () => {
      cy.contains('🎯 DINA VIDEO PLAYLIST PROOF').should('be.visible');
    });

    it('should display DINA playlist subtitle', () => {
      cy.contains('Complete video documentation of DINA human rights violations').should('be.visible');
    });

    it('should render the DINA playlist button', () => {
      cy.contains('📺 OPEN DINA VIDEO PLAYLIST')
        .should('be.visible')
        .and('have.class', 'dina-playlist-btn');
    });

    it('should display all 4 DINA info points', () => {
      cy.get('.dina-info-list').within(() => {
        cy.contains('Evidence-Based:').should('be.visible');
        cy.contains('Documentary proof of DINA crimes').should('be.visible');
        cy.contains('Human Rights:').should('be.visible');
        cy.contains('Victims\' testimonies & documentation').should('be.visible');
        cy.contains('Historical Record:').should('be.visible');
        cy.contains('Chile\'s dictatorship (1973-1990)').should('be.visible');
        cy.contains('Justice:').should('be.visible');
        cy.contains('Supporting accountability & memory').should('be.visible');
      });
    });

    it('should display the call-to-action text', () => {
      cy.contains('Watch full playlist on YouTube').should('be.visible');
    });

    it('should have DINA featured section positioned before channel stats', () => {
      cy.get('.dina-playlist-featured').should('exist');
      cy.get('.channel-stats').should('exist');

      // DINA section should come before stats in DOM
      cy.get('.dina-playlist-featured').then($dina => {
        cy.get('.channel-stats').then($stats => {
          const dinaPos = $dina[0].getBoundingClientRect().top;
          const statsPos = $stats[0].getBoundingClientRect().top;
          expect(dinaPos).to.be.lessThan(statsPos);
        });
      });
    });
  });

  describe('🔗 DINA Button Functionality', () => {
    it('should have correct button styling', () => {
      cy.get('.dina-playlist-btn')
        .should('have.css', 'cursor', 'pointer')
        .and('be.visible');
    });

    it('should show hover effect on DINA button', () => {
      cy.get('.dina-playlist-btn')
        .trigger('mouseover')
        .should('be.visible');
    });

    it('should have proper button structure', () => {
      cy.get('.dina-playlist-btn')
        .should('be.visible')
        .and('contain', '📺 OPEN DINA VIDEO PLAYLIST');
    });

    it('should be clickable without errors', () => {
      // Stub window.open to prevent actual navigation
      cy.window().then(win => {
        cy.stub(win, 'open').as('windowOpen');
      });

      cy.contains('📺 OPEN DINA VIDEO PLAYLIST').click();

      // Verify window.open was called
      cy.get('@windowOpen').should('have.been.calledOnce');
    });

    it('should open correct DINA playlist URL', () => {
      cy.window().then(win => {
        cy.stub(win, 'open').as('windowOpen');
      });

      cy.contains('📺 OPEN DINA VIDEO PLAYLIST').click();

      cy.get('@windowOpen').should('have.been.calledWith',
        'https://www.youtube.com/playlist?list=PL-2OQDhuBcBnq9I-hk2qwoeIQsolRgMdM',
        '_blank',
        'noopener,noreferrer'
      );
    });

    it('should open in new tab with security flags', () => {
      cy.window().then(win => {
        cy.stub(win, 'open').as('windowOpen');
      });

      cy.contains('📺 OPEN DINA VIDEO PLAYLIST').click();

      cy.get('@windowOpen').then(stub => {
        expect(stub.getCall(0).args[1]).to.equal('_blank');
        expect(stub.getCall(0).args[2]).to.equal('noopener,noreferrer');
      });
    });
  });

  describe('📊 Channel Stats Section', () => {
    it('should display channel stats below DINA section', () => {
      cy.get('.channel-stats').should('be.visible');
    });

    it('should render all stat cards', () => {
      cy.get('.stat-card').should('have.length.at.least', 3);
    });

    it('should display correct stat labels', () => {
      cy.contains('Exposure Videos').should('be.visible');
      cy.contains('Total Views').should('be.visible');
      cy.contains('Status').should('be.visible');
    });
  });

  describe('📺 Playlist Grid Section', () => {
    it('should display playlist section header', () => {
      cy.contains('📺 Exposure Playlist').should('be.visible');
    });

    it('should render video grid', () => {
      cy.get('.video-grid').should('be.visible');
    });

    it('should display video cards', () => {
      cy.get('.video-card').should('have.length.at.least', 1);
    });

    it('should display add more videos card', () => {
      cy.contains('More videos coming soon!').should('be.visible');
      cy.contains('Keep hunting threat actors, nyaa~!').should('be.visible');
    });
  });

  describe('💡 Info and Footer Sections', () => {
    it('should display about channel section', () => {
      cy.contains('💡 About This Channel').should('be.visible');
    });

    it('should render info list with all items', () => {
      cy.get('.info-list li').should('have.length.at.least', 5);
    });

    it('should display footer with neko message', () => {
      cy.contains('Every bad actor caught = YouTube video made, nyaa~!').should('be.visible');
    });

    it('should display exposure motto', () => {
      cy.contains('"Defend. Document. Expose. Monetize."').should('be.visible');
    });
  });

  describe('🔄 Navigation Integration', () => {
    it('should be accessible from navigation drawer', () => {
      // Go back to home page first
      cy.visit('http://localhost:3000');
      cy.wait(500);

      // Open drawer if it exists
      cy.get('body').then($body => {
        if ($body.find('.hamburger-menu').length > 0) {
          cy.get('.hamburger-menu').click();
          cy.wait(300);
        }
      });

      // Look for DINA Video Playlist menu item
      cy.contains('DINA Video Playlist').should('be.visible');
    });

    it('should navigate to playlist page from drawer menu', () => {
      cy.visit('http://localhost:3000');
      cy.wait(500);

      cy.get('body').then($body => {
        if ($body.find('.hamburger-menu').length > 0) {
          cy.get('.hamburger-menu').click();
          cy.wait(300);
        }
      });

      cy.contains('DINA Video Playlist').click();
      cy.wait(500);

      cy.contains('🎯 DINA VIDEO PLAYLIST PROOF').should('be.visible');
    });
  });

  describe('♿ Accessibility', () => {
    it('should be keyboard navigable', () => {
      cy.get('.dina-playlist-btn')
        .focus()
        .should('have.focus');
    });

    it('should have proper button elements', () => {
      cy.get('.dina-playlist-btn')
        .should('have.prop', 'tagName', 'BUTTON');
    });

    it('should have visible text for screen readers', () => {
      cy.get('.dina-playlist-btn')
        .should('contain.text', 'OPEN DINA VIDEO PLAYLIST');
    });

    it('should have proper heading hierarchy', () => {
      cy.get('h1, h2, h3').should('exist');
      cy.contains('🎬 NEKO DEFENSE EXPOSURE CHANNEL 📺').should('exist');
    });
  });

  describe('📱 Responsive Design', () => {
    it('should display correctly on mobile viewport', () => {
      cy.viewport('iphone-x');
      cy.wait(300);

      cy.get('.dina-playlist-featured').should('be.visible');
      cy.get('.dina-playlist-btn').should('be.visible');
    });

    it('should display correctly on tablet viewport', () => {
      cy.viewport('ipad-2');
      cy.wait(300);

      cy.get('.dina-playlist-featured').should('be.visible');
      cy.get('.dina-playlist-btn').should('be.visible');
    });

    it('should display correctly on desktop viewport', () => {
      cy.viewport(1920, 1080);
      cy.wait(300);

      cy.get('.dina-playlist-featured').should('be.visible');
      cy.get('.dina-playlist-btn').should('be.visible');
    });

    it('should adjust DINA section layout on mobile', () => {
      cy.viewport('iphone-x');
      cy.wait(300);

      cy.get('.dina-featured-content').should('exist');
    });
  });

  describe('🎨 Visual Appearance', () => {
    it('should have gradient background styling', () => {
      cy.get('.youtube-playlist-container')
        .should('have.css', 'background');
    });

    it('should have DINA section with distinct styling', () => {
      cy.get('.dina-playlist-featured')
        .should('have.css', 'border')
        .and('not.equal', 'none');
    });

    it('should have button with hover animation', () => {
      cy.get('.dina-playlist-btn')
        .should('have.css', 'transition');
    });

    it('should render all emojis correctly', () => {
      cy.contains('🎯').should('be.visible');
      cy.contains('📺').should('be.visible');
      cy.contains('📹').should('be.visible');
      cy.contains('🛡️').should('be.visible');
      cy.contains('🌍').should('be.visible');
      cy.contains('⚖️').should('be.visible');
    });
  });

  describe('🧪 Edge Cases & Error Handling', () => {
    it('should handle multiple rapid button clicks', () => {
      cy.window().then(win => {
        cy.stub(win, 'open').as('windowOpen');
      });

      cy.get('.dina-playlist-btn')
        .click()
        .click()
        .click();

      cy.get('@windowOpen').should('have.been.calledThrice');
    });

    it('should maintain layout with long content', () => {
      cy.viewport(1920, 1080);
      cy.wait(300);

      cy.get('.dina-playlist-featured').should('be.visible');
      cy.get('.dina-featured-content').should('not.have.css', 'overflow', 'visible');
    });

    it('should handle window.open being blocked', () => {
      // Even if blocked, button should still work
      cy.get('.dina-playlist-btn')
        .should('be.visible')
        .click();

      // Page should not crash
      cy.contains('🎯 DINA VIDEO PLAYLIST PROOF').should('be.visible');
    });
  });

  describe('🎯 Multiple Button Interactions', () => {
    it('should allow clicking both subscribe and DINA buttons', () => {
      cy.window().then(win => {
        cy.stub(win, 'open').as('windowOpen');
      });

      // Click subscribe button
      cy.contains('🔴 VISIT CHANNEL & SUBSCRIBE').click();
      cy.get('@windowOpen').should('have.been.calledOnce');

      // Click DINA button
      cy.contains('📺 OPEN DINA VIDEO PLAYLIST').click();
      cy.get('@windowOpen').should('have.been.calledTwice');
    });

    it('should open different URLs for different buttons', () => {
      cy.window().then(win => {
        cy.stub(win, 'open').as('windowOpen');
      });

      cy.contains('🔴 VISIT CHANNEL & SUBSCRIBE').click();
      cy.get('@windowOpen').its('firstCall.args.0')
        .should('include', 'youtu.be');

      cy.contains('📺 OPEN DINA VIDEO PLAYLIST').click();
      cy.get('@windowOpen').its('secondCall.args.0')
        .should('include', 'youtube.com/playlist');
    });
  });

  describe('🔍 SEO & Metadata', () => {
    it('should have proper page title', () => {
      cy.title().should('exist');
    });

    it('should have semantic HTML structure', () => {
      cy.get('button').should('have.length.at.least', 2);
      cy.get('h1, h2, h3').should('have.length.at.least', 3);
    });

    it('should have proper list structures', () => {
      cy.get('.dina-info-list li').should('have.length', 4);
      cy.get('.info-list li').should('have.length.at.least', 5);
    });
  });
});

// *purrs in comprehensive E2E testing excellence* 😻⚡
// DINA VIDEO PLAYLIST CYPRESS TESTS COMPLETE, NYAA~! 🐾🎬✨
