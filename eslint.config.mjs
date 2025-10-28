import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import node from 'eslint-plugin-node';
import importPlugin from 'eslint-plugin-import';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.strict,

  {
    ignores: ['node_modules/**', 'dist/**', 'legacy/**', '**/*.test.ts', '**/*.config.cjs'],
  },

  {
    files: ['**/*.ts', '**/*.tsx'],

    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.json'],
        sourceType: 'module',
      },
    },

    plugins: {
      '@typescript-eslint': tseslint.plugin,
      node,
      import: importPlugin,
    },

    settings: {
      'import/resolver': {
        typescript: {
          project: ['./tsconfig.json'],
        },
        node: {
          extensions: ['.js'],
        },
      },
    },

    rules: {
      'import/extensions': [
        'error',
        'always',
        {
          js: 'always',
          ts: 'never',
          tsx: 'never',
        },
      ],

      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      'node/no-unsupported-features/es-syntax': 'off',
      'no-console': 'error',
      'no-var': 'error',
      'prefer-const': 'warn',
      'prettier/prettier': 'off',
    },
  },
];
