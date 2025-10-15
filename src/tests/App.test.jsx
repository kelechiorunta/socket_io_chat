import React, { act } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

import { ThemeProvider } from '../components/ThemeContext';
import App from '../App';
import Login from '../components/Login';

const mockClient = new ApolloClient({
  link: new HttpLink({ uri: '/mock' }),
  cache: new InMemoryCache()
});

// jest.mock('../components/Login', () => () => <div data-testid="mock-login">Mocked Login Page</div>);

const renderWithMemoryRouterWrapper = (component) => {
  return render(
    <MemoryRouter>
      <ApolloProvider client={mockClient}>
        <ThemeProvider>{component}</ThemeProvider>
      </ApolloProvider>
    </MemoryRouter>
  );
};
describe('Tests App Component', () => {
  it('renders the App Component and the Login Screen shows up', async () => {
    const { asFragment } = renderWithMemoryRouterWrapper(<App />);

    await waitFor(() => {
      expect(asFragment()).toBeDefined();
    });

    const { asFragment: loginSnapshot } = renderWithMemoryRouterWrapper(<Login />);

    expect(loginSnapshot()).toMatchSnapshot();
    expect(screen.getByText(/justchat/i)).toBeInTheDocument();
    const loginGoogleBtn = screen.getByRole('link', { name: /Login with Google/i });
    expect(loginGoogleBtn).toBeInTheDocument();
  });
});
