import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import EnvironmentPlugin from 'vite-plugin-environment';
import { createHtmlPlugin } from 'vite-plugin-html';

const path = require('path');
Object.assign(require('less').options, {
  javascriptEnabled: true,
  modifyVars: {},
});

export default defineConfig(({ mode }) => {
  // define: {
  //   'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
  //   'process.env.DEBUG': JSON.stringify(process.env.DEBUG),
  //   'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV === 'production'),
  // },

  return {
    plugins: [
      react(),
      //Permite cambiar estilos entre Evius y Geniality adcionando una clase global en el body en el index.html
      createHtmlPlugin({
        inject: {
          data: {
            globalPortalClassName: !mode.includes('geniality') ? 'evius' : 'geniality',
            titleGlobalPortal: !mode.includes('geniality') ? 'Eventos - Evius' : 'Cursos- Gen.iality',
            contentGlobalPortalHref: !mode.includes('geniality') ? 'Eventos' : 'Cursos',
            faviconGlobalPortalHref: !mode.includes('geniality')
              ? 'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Public%2FnewLogo.svg?alt=media&token=ab1ecb7f-c62b-476c-9835-214eddc41611'
              : 'https://firebasestorage.googleapis.com/v0/b/geniality-sas.appspot.com/o/public%2FIsotipo%20without%20background.png?alt=media&token=fcdc10f1-5f68-4f2d-8e39-ec791b030e60',
          },
        },
      }),
      // load environment variables for different development and production modes
      EnvironmentPlugin('all', { prefix: 'VITE_' }),
    ],
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            '@primary-color': '#333F44',
            '@secondary-color': '#C44D17',
          },
          javascriptEnabled: true,
        },
      },
    },
    resolve: {
      alias: [
        { find: '~', replacement: path.resolve(__dirname, 'src') },
        { find: '@', replacement: path.resolve(__dirname, 'src') },
        { find: '@adaptors', replacement: path.resolve(__dirname, 'src/adaptors') },
        { find: '@components', replacement: path.resolve(__dirname, 'src/components') },
        { find: '@antdComponents', replacement: path.resolve(__dirname, 'src/antdComponents') },
        { find: '@App', replacement: path.resolve(__dirname, 'src/App') },
        { find: '@containers', replacement: path.resolve(__dirname, 'src/containers') },
        { find: '@context', replacement: path.resolve(__dirname, 'src/context') },
        { find: '@exhibitors', replacement: path.resolve(__dirname, 'src/exhibitors') },
        { find: '@helpers', replacement: path.resolve(__dirname, 'src/helpers') },
        { find: '@PreloaderApp', replacement: path.resolve(__dirname, 'src/PreloaderApp') },
        { find: '@redux', replacement: path.resolve(__dirname, 'src/redux') },
        { find: '@styles', replacement: path.resolve(__dirname, 'src/styles') },
        { find: '@Utilities', replacement: path.resolve(__dirname, 'src/Utilities') },
        { find: '@Assets', replacement: path.resolve(__dirname, 'src/Assets') },
      ],
    },
    build: {
      // minify: false,  /** Use this comand in comand line to create build whitout minify code: node --max_old_space_size=16384 ./node_modules/vite/bin/vite.js build*/
      manifest: true,
      chunkSizeWarningLimit: 1600,
      commonjsOptions: {
        include: [/node_modules/],
      },
    },
    esbuild: {
      jsxInject: `import React from 'react'`,
      jsxFactory: 'h',
      jsxFragment: 'Fragment',
    },
  };
});
