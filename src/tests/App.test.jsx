import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

import { ThemeProvider } from '../components/ThemeContext';
import App from '../App';
import Login from '../components/Login';
import { afterAll, beforeAll } from '@jest/globals';
// import fetch from '../../__mocks__/fetch.js';
// import * as fetch from '../../__mocks__/fetch.js';

const mockClient = new ApolloClient({
  link: new HttpLink({ uri: '/mock' }),
  cache: new InMemoryCache()
});

// jest.mock('../components/Login', () => () => <div data-testid="mock-login">Mocked Login Page</div>);
// jest.mock('../../__mocks__/fetch', () =>
//   jest.fn().mockImplementation(() => Promise.resolve({ name: 'fetch' }))
// );
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
  jest.useFakeTimers();
  jest.spyOn(global, 'setTimeout');
  jest.spyOn(global, 'fetch');

  beforeAll(() => {
    global.fetch = jest.fn().mockImplementation((url) => {
      if (url === '/error') {
        return Promise.reject('Failed');
      }

      // Simulate a successful response similar to the real fetch()
      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ({ name: 'fetch' })
      });
    });
  });

  afterAll(() => {
    global.fetch.mockClear();
    delete global.fetch;
  });

  // it('renders the Loading Spinner as the App Component loads', async () => {
  //   const { asFragment } = renderWithMemoryRouterWrapper(<App />);

  //   await waitFor(async () => {
  //     const spinnerLabel = screen.getByText(/Authenticating/i);
  //     expect(spinnerLabel).toBeInTheDocument();
  //     await expect(fetch('/error')).rejects.toThrow('Failed');
  //   });

  //   expect(asFragment()).toMatchSnapshot();
  //   // expect(asFragment()).toBeDefined();
  // });
  it('renders the Login Screen as the App component finally mounts', async () => {
    const { asFragment } = renderWithMemoryRouterWrapper(<App />);

    // Waits for the final JSX fragment (Login Screen jsx)
    await waitFor(() => {
      expect(asFragment()).toBeDefined();
    });

    // Asynchronously render spied global apis (fetch and timeouts)
    // and ui elements of the Loading Spinner Fragment (Protected Route Screen jsx)
    expect(fetch).toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledWith('/api/isAuthenticated', {
      credentials: 'include',
      method: 'GET'
    });
    const spinnerLabel = screen.getByText(/Authenticating/i);
    expect(spinnerLabel).toBeInTheDocument();
    expect(setTimeout).toHaveBeenCalled();
    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);

    // Matches the Login jsx fragment snapshot with the final snapshot of the App
    // Render ui elements of the matched snapshots
    const { asFragment: loginSnapshot } = renderWithMemoryRouterWrapper(<Login />);

    expect(loginSnapshot()).toMatchSnapshot();
    const justChatCaption = screen.getByRole('heading', /JUSTCHAT/i);
    const loginGoogleBtn = screen.getByRole('link', { name: /Login with Google/i });
    expect(justChatCaption).toBeInTheDocument();
    expect(loginGoogleBtn).toBeInTheDocument();
  });

    it('tests the global fetch api', async () => {
      expect.assertions(3);
      const result = await fetch('/name');
      expect(fetch).toHaveBeenCalled();
      expect(fetch).toHaveBeenCalledWith('/name');
      expect(await result.json()).toEqual({ name: 'fetch' });
    });

  //   it('tests error with the fetch api', async () => {
  //     // expect.assertions(1);

  //     const result = await fetch('/error');

  //     await expect(result).rejects.toEqual('Failed');
  //   });
});
