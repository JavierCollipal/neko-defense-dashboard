// 🐾⚡ NEKO DEFENSE DASHBOARD - JEST CONFIGURATION ⚡🐾
module.exports = {
  // Test environment
  testEnvironment: 'node',

  // Test match patterns (exclude E2E tests from unit test runs)
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/__tests__/**/*.spec.js',
    '**/server/**/*.test.js',
    '**/server/**/*.spec.js',
    '!**/__tests__/e2e/**', // Exclude E2E tests
  ],

  // Coverage configuration
  collectCoverage: true,
  collectCoverageFrom: [
    'server/models/User.js',
    'server/models/Achievement.js',
    'server/models/Content.js',
    'server/models/Comment.js',
    'server/middleware/auth.js',
    '!server/**/*.test.js',
    '!server/**/*.spec.js',
  ],

  // Coverage thresholds (RULE 33: minimum 80% coverage!)
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  // Coverage reporters
  coverageReporters: ['text', 'lcov', 'html', 'json'],

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/server/__tests__/setup.js'],

  // Module paths
  moduleDirectories: ['node_modules', 'server'],

  // Clear mocks between tests
  clearMocks: true,

  // Test timeout (10 seconds for MongoDB operations)
  testTimeout: 10000,

  // Verbose output
  verbose: true,

  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/cypress/',
    '/.next/',
    '/dist/',
    '/build/',
  ],
};
