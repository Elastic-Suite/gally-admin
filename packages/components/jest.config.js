module.exports = {
  collectCoverageFrom: [
    '<rootDir>/components/**/*.{jsx,tsx,js,ts}',
    '<rootDir>/hooks/**/*.{jsx,tsx,js,ts}',
    // '<rootDir>/pages/**/*.{jsx,tsx,js,ts}',
    '<rootDir>/services/**/*.{jsx,tsx,js,ts}',
    '<rootDir>/store/**/*.{jsx,tsx,js,ts}',
    '!<rootDir>/components/stateful*/**/*.{jsx,tsx,js,ts}',
    '!<rootDir>/**/*.stories.{jsx,tsx,js,ts}',
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  setupFilesAfterEnv: ['./setupTests.ts'],
  testEnvironment: 'jsdom',
  collectCoverage: true,
  coverageReporters: ['lcov', 'text-summary', 'cobertura'],
  coverageDirectory: '<rootDir>/coverage',
}
