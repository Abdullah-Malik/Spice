import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  // Base recommended configurations
  ...tseslint.configs.recommended,

  // Configuration for all TypeScript files
  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json', // Required for some advanced rules
      },
      globals: {
        ...globals.node, // Enables Node.js global variables
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ],
    },
  },

  // Configuration to disable rules that conflict with Prettier
  // This should always be the LAST item in the array.
  eslintConfigPrettier,
  
  // You can add ignores here
  {
    ignores: ['dist/', 'node_modules/', '.env', 'eslint.config.mjs'],
  }
);