import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    env: {
      JUSTCHAT_USERNAME: 'Kelechi',
      JUSTCHAT_PASSWORD: 'keleman4xst'
    }
  }
});
