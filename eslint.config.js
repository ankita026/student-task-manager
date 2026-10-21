
import globals from 'globals';
import js from '@eslint/js';

export default [
  {
    ignores: ['node_modules/**', 'coverage/**'],
  },
  {
    files: ['script.js', 'tests/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': 'warn',
    },
  },
];
