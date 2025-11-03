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
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-var-requires': 'off', // Allow require() in .js files
      '@typescript-eslint/no-require-imports': 'off', // Allow require() for Node.js compat
      '@typescript-eslint/ban-ts-comment': 'warn', // Warn instead of error for @ts-ignore

      // Code quality
      'no-undef': 'error',
      'no-var': 'error',
      'prefer-const': 'warn',
      'no-duplicate-imports': 'error',

      // Best practices
      'eqeqeq': ['warn', 'always'],
      'curly': ['warn', 'all'],
    },
  },
];

export default eslintConfig;
