import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import prettier from 'eslint-plugin-prettier';
import importPlugin from 'eslint-plugin-import';

/**
 * @type {import('eslint').Linter.Config}
 */
export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  { rules: { 'react/react-in-jsx-scope': 'off' } },
  {
    plugins: { prettier },
    rules: { 'prettier/prettier': ['error', { singleQuote: true }] },
  },
  // Renderer process rules
  {
    files: ['src/windows/**/*.{js,jsx,ts,tsx}'],
    plugins: { import: importPlugin },
    languageOptions: {
      globals: {
        ...globals.browser
      }
    },
    rules: {
      'import/no-nodejs-modules': 'error',
      'no-undef': 'error',
    },
  },
  // Main process rules
  {
    files: ['src/actions/**/*.{js,jsx,ts,tsx}', 'src/tray.tsx'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.nodeBuiltin
      }
    },
    rules: {
      'no-undef': [
        'error',
      ]
    }
  },
];
