const globals = require('globals');

module.exports = [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'coverage/**',
      '.husky/**',
      'public/**',
      'cypress/downloads/**',
      'cypress/screenshots/**',
      'cypress/videos/**',
      '*.config.js',
    ],
  },
  // JavaScript/JSX files
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // Warnings only - don't block CI/CD
      'no-console': 'off', // Allow console for now
      'no-unused-vars': 'off', // Allow unused vars for now
      'prefer-const': 'off',
      'no-var': 'warn',
    },
  },
  // TypeScript files
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: false, // Disable type checking to avoid performance issues
      },
    },
    rules: {
      // Warnings only - don't block CI/CD
      'no-console': 'off',
      'no-unused-vars': 'off',
      'prefer-const': 'off',
      'no-var': 'warn',
    },
  },
];
