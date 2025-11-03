// 🐾⚡ NEKO DEFENSE DASHBOARD - ESLint 9 Flat Config (Pure) ⚡🐾
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const eslintConfig = [
  // Apply recommended rules
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Global configuration
  {
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
  },

  // Global ignores (replaces old .eslintignore)
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'dist/**',
      'build/**',
      'coverage/**',
      '.vercel/**',
      '*.config.js',
      '*.config.mjs',
      '.eslintrc.json.old',
      // Development/utility scripts with syntax issues
      'save-*.js',
      'enrich-*.js',
      'investigate-*.ts',
      'remove-hardcoded-credentials.js',
      'compressed-error-system.js',
      'terminal-error-collector.ts',
      'test-i18n-visual-*.js',
      'test-translation-system-puppeteer.js',
      'puppeteer-translation-ux-demo-*.js',
      'public/service-worker.js',
      'server/index-demo.js',
      'server/index-protected.js',
      'scripts/demo-dashboard-simple.ts',
    ],
  },

  // Project-specific rules
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    rules: {
      // Relax some rules for development
      'no-console': 'off', // Allow console for Node.js scripts
      'no-unused-vars': 'off', // Use TypeScript version instead
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],

      // TypeScript-specific
      '@typescript-eslint/no-explicit-any': 'off', // Allow any for rapid development
      '@typescript-eslint/no-var-requires': 'off', // Allow require() in .js files
      '@typescript-eslint/no-require-imports': 'off', // Allow require() for Node.js compat
      '@typescript-eslint/ban-ts-comment': 'off', // Allow @ts-ignore comments
      '@typescript-eslint/no-unused-expressions': 'off', // Allow standalone expressions in scripts
      '@typescript-eslint/ban-types': 'off', // Allow Function type for flexibility

      // Code quality
      'no-undef': 'error',
      'no-var': 'error',
      'prefer-const': 'warn',
      'no-duplicate-imports': 'error',
      'no-case-declarations': 'off', // Allow declarations in case blocks

      // Best practices
      'eqeqeq': ['warn', 'always'],
      'curly': ['warn', 'all'],
    },
  },

  // Test files - add Jest globals and relax rules
  {
    files: [
      '**/*.test.{js,jsx,ts,tsx}',
      '**/__tests__/**/*.{js,jsx,ts,tsx}',
      '**/tests/**/*.{js,jsx,ts,tsx}',
      '**/test-*.{js,jsx,ts,tsx}',
      '**/src/test-utils/**/*.{js,jsx,ts,tsx}',
      '**/src/setupTests.{js,ts}',
      '**/cypress/**/*.{js,jsx,ts,tsx}',
      '**/*-test.{js,jsx,ts,tsx}',
      '**/puppeteer-*.{js,jsx,ts,tsx}',
    ],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      'no-undef': 'off', // Allow test globals
    },
  },
];

export default eslintConfig;
