export default {
  env: {
    development: {
      presets: [['@babel/preset-react', { development: true }]],
    },
  },
  presets: ['@babel/preset-env', '@babel/preset-typescript', '@babel/preset-react'],
  plugins: [
    [
      'babel-plugin-direct-import',
      {
        modules: [
          '@mui/material',
          '@mui/icons-material',
          '@youscience/core',
          '@youscience/theme',
          '@youscience/assets',
        ],
      },
    ],
  ],
};
