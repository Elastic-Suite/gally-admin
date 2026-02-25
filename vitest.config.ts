import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  test: {
    // Integration tests need longer timeouts (network calls to real Gally instance)
    testTimeout: 60_000,
    hookTimeout: 120_000,

    // Run tests sequentially (they depend on Gally state)
    sequence: {
      concurrent: false,
    },

    include: ['tests/**/*.test.ts'],
  },
});
