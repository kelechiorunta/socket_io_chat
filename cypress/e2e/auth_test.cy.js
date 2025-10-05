describe('template spec', () => {
  it('passes cached session', () => {
    // cy.visit('https://socket-io-chat-zory.onrender.com/');
    cy.login(Cypress.env('JUSTCHAT_USERNAME'), Cypress.env('JUSTCHAT_PASSWORD'));
  });

  //VALIDATION OF THE CUSTOM API SIGNIN LOGIN AUTHENTICATION REQUEST
  it('validates the custom api post request signin authentication', () => {
    cy.intercept('POST', '/api/signin', {
      body: {
        username: Cypress.env('JUSTCHAT_USERNAME'),
        password: Cypress.env('JUSTCHAT_PASSWORD')
      }
    }).as('signin');
    cy.request('POST', 'https://socket-io-chat-zory.onrender.com/api/signin', {
      username: Cypress.env('JUSTCHAT_USERNAME'),
      password: Cypress.env('JUSTCHAT_PASSWORD')
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  // CUSTOM LOGIN AUTHENTICATION WITH USERNAME AND PASSWORD
  it('username_password authentication test login', () => {
    cy.visit('https://socket-io-chat-zory.onrender.com/');

    cy.url().should('include', '/login');

    cy.intercept('GET', '/api/isAuthenticated').as('isAuthenticated');

    cy.get('input[name=username]').type(Cypress.env('JUSTCHAT_USERNAME'));
    cy.get('input[name=username]').should('have.value', Cypress.env('JUSTCHAT_USERNAME'));
    cy.get('input[name=password]').type(Cypress.env('JUSTCHAT_PASSWORD'));
    cy.get('input[name=password]').should('have.value', Cypress.env('JUSTCHAT_PASSWORD'));
    cy.contains('button', 'Login').click();
    cy.contains('button', 'Logging in...').should('be.disabled');

    cy.wait('@isAuthenticated').then(({ response }) => {
      expect(response.statusCode).to.eq(200);
    });

    cy.getCookie('auth_session').should('exist');
  });
});
