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
    // Confirms the window fetch is called once
    cy.window().its('fetch').should('have.been.calledOnce');
    // Sees the loader/spinner text while authenticating
    cy.get('div')
      .contains('Authenticating, please wait...', { matchCase: false })
      .should('be.visible');

    cy.fixture('example').then((data) => {
      cy.window().then((win) => {
        //attaches fixture to browser window
        win.data = data;
      });
    });

    cy.window().its('data.email').should('eq', 'hello@cypress.io');
  });
});
