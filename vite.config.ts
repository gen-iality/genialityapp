import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import EnvironmentPlugin from 'vite-plugin-environment';
import tsconfigPaths from 'vite-tsconfig-paths';
Object.assign(require('less').options, {
  javascriptEnabled: true,
  modifyVars: {},
});

export default defineConfig({
  plugins: [
    react(),
    EnvironmentPlugin(
      {
        VITE_AUTH_URL: 'http://localhost:3010',
        VITE_API_URL: 'https://devapi.evius.co',
        VITE_API_DEV_URL: 'https://devapi.evius.co',
        VITE_SENTRY: 'https://d22c22662dfe45ab806c3bea19c1017b@o1156387.ingest.sentry.io/6237649',
        EVIUS_GOOGLE_MAPS_KEY: 'AIzaSyCmcIJ4xnytwh5ToGhN1Pl56RiualarBqk',
        VITE_API_EVIUS_ZOOM_SERVER: 'https://apimeetings.evius.co:6490/crearroom',
        VITE_API_GOOGLE_API_DOCUMENTS: 'http://docs.google.com/gview?embedded:true&url:',
        VITE_API_EVIUS_ZOOM_SURVEY: 'https://apimeetings.evius.co:6490/obtenerMeetingsPoll',
        TSC_WATCHFILE: 'UseFsEventsWithFallbackDynamicPolling',
        REACT_EDITOR: 'code',
        NODE_ENV: 'development',
        DEBUG: 'true',
      },
      { loadEnvFiles: true }
    ),
    EnvironmentPlugin(
      {
        VITE_AUTH_URL: 'http://localhost:3010',
        VITE_API_URL: 'https://devapi.evius.co',
        VITE_API_DEV_URL: 'https://devapi.evius.co',
        VITE_SENTRY: 'https://d22c22662dfe45ab806c3bea19c1017b@o1156387.ingest.sentry.io/6237649',
        EVIUS_GOOGLE_MAPS_KEY: 'AIzaSyCmcIJ4xnytwh5ToGhN1Pl56RiualarBqk',
        VITE_API_EVIUS_ZOOM_SERVER: 'https://apimeetings.evius.co:6490/crearroom',
        VITE_API_GOOGLE_API_DOCUMENTS: 'http://docs.google.com/gview?embedded:true&url:',
        VITE_API_EVIUS_ZOOM_SURVEY: 'https://apimeetings.evius.co:6490/obtenerMeetingsPoll',
        TSC_WATCHFILE: 'UseFsEventsWithFallbackDynamicPolling',
        REACT_EDITOR: 'code',
        NODE_ENV: 'staging',
        DEBUG: 'true',
      },
      { loadEnvFiles: true }
    ),
    tsconfigPaths(),
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
      {
        find: /^~/,
        replacement: '@',
      },
    ],
  },
  build: {
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
});
