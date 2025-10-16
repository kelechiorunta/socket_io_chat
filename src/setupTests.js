// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import fetch from '../__mocks__/fetch.js';

const originalWarn = console.warn;
const originalError = console.error;

console.warn = (...args) => {
  if (
    args[0]?.includes('React Router Future Flag Warning') ||
    args[0]?.includes('Auth check failed: Unauthorized')
  ) {
    return;
  }
  originalWarn(...args);

  console.error = (...args) => {
    if (args[0]?.includes('Auth check failed: Unauthorized')) {
      return;
    }
    originalError(...args);
  };
};

global.fetch = fetch;
