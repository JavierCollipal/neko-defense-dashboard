// 🐾⚡ DEBUG TEST: Check what's happening ⚡🐾
describe('🔍 Debug Test', () => {
  it('should visit dashboard and log console output', () => {
    // Capture console logs
    cy.visit('/', {
      onBeforeLoad(win) {
        cy.spy(win.console, 'log').as('consoleLog');
        cy.spy(win.console, 'error').as('consoleError');
      }
    });

    // Wait a bit for page to load
    cy.wait(3000);

    // Check what was logged
    cy.get('@consoleLog').should('have.been.called');

    // Print all console logs
    cy.get('@consoleLog').then((spy) => {
      console.log('=== BROWSER CONSOLE LOGS ===');
      spy.getCalls().forEach((call, index) => {
        console.log(`[${index}]`, call.args);
      });
    });

    // Check if any errors
    cy.get('@consoleError').then((spy) => {
      if (spy.called) {
        console.log('=== BROWSER CONSOLE ERRORS ===');
        spy.getCalls().forEach((call, index) => {
          console.log(`[${index}]`, call.args);
        });
      }
    });

    // Check if Dashboard rendered
    cy.get('body').then(($body) => {
      console.log('=== BODY HTML ===');
      console.log($body.html().substring(0, 500));
    });
  });
});
