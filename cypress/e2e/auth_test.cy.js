describe('template spec', () => {
  // SESSION BASED AUTHENTICAION
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
    cy.contains('JUSTCHAT').should('be.visible');
  });

  // GOOGLE OAUTH TESTING
  it('mocks Google OAuth redirect and code exchange for access token', () => {
    // Visit your login page
    cy.visit('https://socket-io-chat-zory.onrender.com/login');

    // Intercept the call to Google's authorization endpoint
    cy.intercept('GET', 'https://accounts.google.com/oauth2/v2/auth*', (req) => {
      // Simulate/Stub Google's response with redirect status code and authorization url with query authorization code
      req.reply({
        statusCode: 302,
        headers: {
          location:
            'https://socket-io-chat-zory.onrender.com/api/oauth2/redirect/google?code=mock_auth_code'
        }
      });
    }).as('googleAuth');

    // Intercept the backend Google redirect route
    cy.intercept(
      'GET',
      'https://socket-io-chat-zory.onrender.com/api/oauth2/redirect/google',
      (req) => {
        // Stub the responses for the cy.wait() for testing
        req.reply({
          statusCode: 200,
          headers: {
            'set-cookie': 'auth_session=fake_auth_cookie; Path=/; HttpOnly'
          },
          body: {
            success: true,
            user: { name: 'Mock User', email: 'mockuser@gmail.com' }
          }
        });
      }
    ).as('GoogleOAuthCallback');

    cy.intercept('POST', 'https://oauth2.googleapis.com/token', {
      statusCode: 200,

      body: {
        access_token: 'mock_access_token',
        refresh_token: 'mock_refresh_token',
        expires_in: 3600,
        token_type: 'Bearer',
        id_token: 'mock_id_token'
      }
    }).as('mockGoogleToken');

    // Trigger the simulated link navigation from your frontend to initiate the OAuth redirect
    cy.window().then((win) => {
      const params = new URLSearchParams({
        client_id: Cypress.env('JUSTCHAT_CLIENT_ID'), //'mock-client-id',
        client_secret: Cypress.env('JUSTCHAT_CLIENT_SECRET'), //'mock-client-id',
        redirect_uri: 'https://socket-io-chat-zory.onrender.com/api/oauth2/redirect/google',
        response_type: 'code',
        scope: 'openid email profile',
        access_type: 'offline'
      });

      return (win.location.href = `https://accounts.google.com/oauth2/v2/auth?${params.toString()}`);
    });

    // Trigger the browser request that would simulate the redirect request
    cy.window().then((win) => {
      // Simulate your front-end code calling the redirect endpoint
      return win.fetch('https://socket-io-chat-zory.onrender.com/api/oauth2/redirect/google');
    });

    // Wait for the interception to complete and verify redirect
    cy.wait('@googleAuth').then(({ response }) => {
      expect(response.statusCode).to.eq(302);
      expect(response.headers.location).to.include('?code=mock_auth_code');
    });

    // Wait for the intercepted redirect and verify successful OAuth
    cy.wait('@GoogleOAuthCallback').then(({ response }) => {
      expect(response.statusCode).to.eq(200);
      expect(response.body.success).to.eq(true);
      expect(response.body.user.email).to.eq('mockuser@gmail.com');
    });
  });
});
