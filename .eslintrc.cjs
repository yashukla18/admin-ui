module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: [
    'dist',
    '.eslintrc.cjs',
    'babel.config.cjs',
    'src/theme.d.ts',
    'vite.config.ts',
    'lint-staged.config.cjs',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
    babelOptions: {
      presets: ['@babel/preset-react'],
    },
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint', 'prettier', 'react-refresh'],
  rules: {
    'no-var': 'error',
    'prefer-const': 'error',
    '@typescript-eslint/no-extra-semi': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['warn'],
    'react/destructuring-assignment': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'off',
    'padding-line-between-statements': [
      2,
      {
        blankLine: 'always',
        prev: ['const', 'let'],
        next: '*',
      },
      {
        blankLine: 'any',
        prev: ['const', 'let'],
        next: ['const', 'let'],
      },
    ],
    'no-void': [
      2,
      {
        allowAsStatement: true,
      },
    ],
    'import/no-unresolved': 'off',
    'max-len': [
      2,
      {
        code: 120,
        tabWidth: 2,
        ignoreUrls: true,
        ignoreComments: true,
        ignoreStrings: true,
      },
    ],
    'import/prefer-default-export': 'off',
    'no-debugger': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    'react/function-component-definition': 0,
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn'],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'off',
    'react/jsx-props-no-spreading': 'off',
    'import/no-useless-path-segments': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/require-default-props': 'off',
    'react/prop-types': 'off',
    'no-restricted-imports': [
      'warn',
      {
        name: '@emotion/styled',
        message: 'Please use import from @mui/material/styles.',
      },
    ],
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        checksVoidReturn: false,
      },
    ],
    '@typescript-eslint/naming-convention': 'off',
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
  },
};