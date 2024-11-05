import eslintConfig from '@react-appkit/eslint-config';

export default [
  ...eslintConfig,
  {
    files: ['src/main/**/*.{ts,tsx}', 'src/entrypoints/main.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/renderer/**/*'],
              message:
                '\nCannot import code that is meant for the renderer process.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/renderer/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../**/main/**/*'],
              message:
                '\nCannot import code that is meant for the main process.\nThe only exception is the "main/api" collection, and in order to import it, you must do so explicitly via "@react-appkit/runtime/main/api/*".',
            },
          ],
        },
      ],
    },
  },
];
