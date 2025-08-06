import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import importPlugin from 'eslint-plugin-import'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'

export default tseslint.config([
  globalIgnores(['dist', 'build', '.react-router']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      'react-refresh/only-export-components': 'off',
      'no-empty-pattern': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      // import rules
      'import/no-named-as-default-member': 'off',
      'import/no-unresolved': 'off',
      'import/first': 'warn',
      'import/newline-after-import': 'warn',
      'import/no-duplicates': 'warn',
      'import/no-extraneous-dependencies': 'off',
      'import/prefer-default-export': 'off',
      'import/no-named-as-default': 'off',
      'import/no-cycle': 'off',
      'import/order': [
        'warn',
        {
          groups: [
            'builtin', // Node.js built-in module
            'external', // third-party module
            'internal', // module inside the application
            'parent', // module imported from the parent directory
            ['sibling', 'index'], // sibling modules with the same or higher directory
            'object',
            'type',
          ],
          pathGroups: [
            {
              pattern: '~/**',
              group: 'internal',
            },
            {
              pattern: '#/**',
              group: 'type',
            },
            {
              pattern: '*.{scss,css,less,styl,stylus}',
              group: 'parent',
            },
            {
              pattern: '*.{js,jsx,ts,tsx}',
              group: 'sibling',
            },
          ],
          'newlines-between': 'always', // Insert blank lines between groups
          pathGroupsExcludedImportTypes: ['sibling', 'index'],
          warnOnUnassignedImports: true,
          alphabetize: { order: 'asc', caseInsensitive: true }, // For each group, sort alphabetically.
        },
      ],
    },
  },
])
