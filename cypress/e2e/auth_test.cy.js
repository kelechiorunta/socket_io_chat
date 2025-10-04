describe('template spec', () => {
  it('passes', () => {
    // cy.visit('https://socket-io-chat-zory.onrender.com/');
    cy.login(Cypress.env('JUSTCHAT_USERNAME'), Cypress.env('JUSTCHAT_PASSWORD'));
  });
});
