module.exports = {
  '*.{js,ts,tsx}': 'eslint --fix ./src',
  '*.{ts,tsx}': 'prettier --write ./src',
  '**/*.ts?(x)': () => 'npm run typecheck',
};
