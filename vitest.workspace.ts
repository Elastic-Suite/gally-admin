import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  {
    extends: 'vitest.config.ts',
    test: {
      name: 'node',
      environment: 'node',
      include: ['tests/**/*.test.ts'],
    },
  },
  {
    extends: 'vitest.config.ts',
    test: {
      name: 'browser',
      environment: 'happy-dom',
      include: ['tests/**/*.browser.test.ts'],
    },
  },
])
