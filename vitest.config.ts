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

    // Run test files sequentially to avoid race conditions
    // (all tests share the same Gally instance state)
    fileParallelism: false,

    // Run tests within each file sequentially (they depend on Gally state)
    sequence: {
      concurrent: false,
    },

    include: ['tests/**/*.test.ts'],
  },
});
