/// <reference types="vite/client" />

import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';
import * as path from 'path';
import babel from '@rollup/plugin-babel';
import mkcert from 'vite-plugin-mkcert'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const devMode = mode === 'development';
  const startupUrlMode = mode === 'development' || mode === 'local' ? 'dev' : mode;
  const allowedEnvs = ['development', 'test', 'sandbox'];
  const PARSED_NODE_ENV = allowedEnvs.includes(mode) ? mode : 'production';
  return {
    plugins: [
      react(),
      svgr({
        svgrOptions: {},
      }),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
      }),
      mkcert()
    ],
    define: {
      // process, --circular dependency if included in the build
      'process.env': env,
      'process.env.NODE_ENV': JSON.stringify(PARSED_NODE_ENV),
    },
    resolve: {
      alias: [
        { find: '@*', replacement: path.resolve(__dirname, './src') },
        { find: '@assets', replacement: path.resolve(__dirname, './src/assets') },
        { find: '@components', replacement: path.resolve(__dirname, './src/components') },
        { find: '@configs', replacement: path.resolve(__dirname, './src/configs') },
        { find: '@constants', replacement: path.resolve(__dirname, './src/constants') },
        { find: '@context', replacement: path.resolve(__dirname, './src/context') },
        { find: '@features', replacement: path.resolve(__dirname, './src/features') },
        { find: '@hooks', replacement: path.resolve(__dirname, './src/hooks') },
        { find: '@interfaces', replacement: path.resolve(__dirname, './src/interfaces') },
        { find: '@layouts', replacement: path.resolve(__dirname, './src/layouts') },
        { find: '@locales', replacement: path.resolve(__dirname, './src/locales') },
        { find: '@mock', replacement: path.resolve(__dirname, './src/mock') },
        { find: '@pages', replacement: path.resolve(__dirname, './src/pages') },
        { find: '@routes', replacement: path.resolve(__dirname, './src/routes') },
        { find: '@services', replacement: path.resolve(__dirname, './src/services') },
        { find: '@store', replacement: path.resolve(__dirname, './src/store') },
        { find: '@stores', replacement: path.resolve(__dirname, './src/stores') },
        { find: '@styles', replacement: path.resolve(__dirname, './src/styles') },
        { find: '@test', replacement: path.resolve(__dirname, './src/test') },
        { find: '@utils', replacement: path.resolve(__dirname, './src/utils') },
      ],
    },
    build: {
      outDir: './build',
      sourcemap: false,
      rollupOptions: {
        output: {
          chunkFileNames: devMode ? 'assets/js/[name].js' : 'assets/js/[name].[hash].js',
          entryFileNames: devMode ? 'assets/js/[name].js' : 'assets/js/[name].[hash].js',
          assetFileNames: (assetInfo) => {
            let extType = assetInfo?.name?.split('.').at(1) || 'styles';

            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
              extType = 'img';
            }
            return devMode ? `assets/${extType}/[name]-[hash][extname]` : `assets/[name]-[hash][extname]`;
          },
        },
      },
    },
    server: {
      open: `https://signin.${startupUrlMode}.youscience.com/?redirectUrl=https://${startupUrlMode}.youscience.com:3000/`,
      port: 3000,
      host: true,
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
    },
  };
});
