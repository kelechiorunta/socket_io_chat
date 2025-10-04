// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', (username, password) => {
  cy.session(
    [username],
    () => {
      cy.visit('https://socket-io-chat-zory.onrender.com/');

      // Should be on a new URL which includes '/login'
      cy.url().should('include', '/login');

      // Submission of the fields handled by Formik

      cy.get('input[name=username]').type(username);
      cy.get('input[name=username]').should('have.value', username);
      cy.get('input[name=password]').type(password);
      cy.get('input[name=password]').should('have.value', password);

      cy.contains('button', 'Login').click();
      cy.contains('button', 'Logging in...').should('be.disabled');

      cy.url().should('include', '/');
    },
    { validate: () => cy.getCookie('auth_session').should('exist') }
  );
});
