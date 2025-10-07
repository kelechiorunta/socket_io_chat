// Api testing with windows fetch API

describe('fetch api testing', () => {
  // Spies on window.fetch before loading Cypress tests
  beforeEach(() => {
    cy.visit('https://socket-io-chat-zory.onrender.com/', {
      onBeforeLoad(win) {
        cy.spy(win, 'fetch');
      }
    });
  });

  it('calls /api/isAuthenticated', () => {
    // Confirms the window fetch makes a get request to the route /api/isAuthenticated
    cy.window().its('fetch').should('be.calledWith', '/api/isAuthenticated');
    // Sees the loader/spinner text while authenticating
    cy.get('div')
      .contains('Authenticating, please wait...', { matchCase: false })
      .should('be.visible');
  });
});
