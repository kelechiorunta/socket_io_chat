// const { jest } = require('@jest/globals');

const fetch = jest.fn(() =>
  Promise.resolve({
    ok: true
    // json: async () => ({ user: { id: 1, name: 'Mock User' } })
  })
);

export default fetch;
