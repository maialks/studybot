import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import node from 'eslint-plugin-node';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.strict,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      node,
    },
    rules: {
      // TypeScript rules
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-empty-function': 'off',

      // Node.js rules
      'node/no-unsupported-features/es-syntax': 'off',

      // General JS rules
      'no-console': 'error',
      'no-var': 'error',
      'prefer-const': 'warn',

      // Prettier compatibility
      'prettier/prettier': 'off',
    },
    ignores: ['**/node_modules/**', '**/dist/**', '**/legacy/**', '**/*.test.ts'],
  },
];
