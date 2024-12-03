import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import globals from 'globals';
import path from 'path';
import process from 'process';

export default [
  {
    ignores: ['dist', 'node_modules', 'build'],
  },
  {
    files: [path.join(process.cwd(), 'src', '**', '*.{js,ts,svelte}')],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: path.resolve(process.cwd(), 'tsconfig.json'),
        tsconfigRootDir: process.cwd(),
      },
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      svelte,
    },
    settings: {
      'svelte3/typescript': true,
    },
    extends: [
      js.configs.recommended,
      'plugin:svelte/recommended',
      'plugin:@typescript-eslint/recommended',
    ],
    overrides: [
      {
        files: ['*.svelte'],
        processor: 'svelte3/svelte3',
      },
    ],
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'svelte/indent': ['error', 2],
      'svelte/no-unused-vars': 'warn',
      'svelte/no-at-html-tags': 'warn',
    },
  },
];
