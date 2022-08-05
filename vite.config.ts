import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import EnvironmentPlugin from 'vite-plugin-environment';

const path = require('path');
Object.assign(require('less').options, {
  javascriptEnabled: true,
  modifyVars: {},
});

export default defineConfig({
  define: {
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
    'process.env.DEBUG': JSON.stringify(process.env.DEBUG),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV === 'production'),
  },
  plugins: [
    react(),
    // EnvironmentPlugin(
    //   {
    //     VITE_AUTH_URL: 'http://localhost:3010',
    //     VITE_API_URL: 'https://devapi.evius.co',
    //     VITE_API_DEV_URL: 'https://devapi.evius.co',
    //     REACT_APP_SENTRY: 'https://d22c22662dfe45ab806c3bea19c1017b@o1156387.ingest.sentry.io/6237649',
    //     EVIUS_GOOGLE_MAPS_KEY: 'AIzaSyCmcIJ4xnytwh5ToGhN1Pl56RiualarBqk',
    //     VITE_API_EVIUS_ZOOM_SERVER: 'https://apimeetings.evius.co:6490/crearroom',
    //     VITE_API_GOOGLE_API_DOCUMENTS: 'http://docs.google.com/gview?embedded:true&url:',
    //     VITE_API_EVIUS_ZOOM_SURVEY: 'https://apimeetings.evius.co:6490/obtenerMeetingsPoll',
    //     TSC_WATCHFILE: 'UseFsEventsWithFallbackDynamicPolling',
    //     REACT_EDITOR: 'code',
    //     NODE_ENV: 'development',
    //     DEBUG: 'true',
    //     //FIREBASE CONFIG CHATEVIUS
    //     VITE_FB_APIKEY_CHATEVIUS: 'AIzaSyDaQI5E1P6mIhcNfDdRq8oSGpJ13Qllv00',
    //     VITE_FB_AUTHDOMAIN_CHATEVIUS: 'chateviusdev.firebaseapp.com',
    //     VITE_FB_DB_CHATEVIUS: 'https://chateviusdev-default-rtdb.firebaseio.com',
    //     VITE_PROJECTID_CHATEVIUS: 'chateviusdev',
    //     VITE_STORAGEBUCKET_CHATEVIUS: 'chateviusdev.appspot.com',
    //     VITE_MESSAGINGSENDER_CHATEVIUS: '520741764660',
    //     VITE_APPID_CHATEVIUS: '1:520741764660:web:7da078ca925a34c7db5461',
    //     VITE_MEASURENTID_CHATEVIUS: '',
    //     //FIREBASE CONFIG EVIUSAUTH
    //     VITE_FB_APIKEY_EVIUSAUTH: 'AIzaSyAohyXq3R4t3ao7KFzLDY7W6--g6kOuS7Q',
    //     VITE_FB_AUTHDOMAIN_EVIUSAUTH: 'eviusauthdev.firebaseapp.com',
    //     VITE_FB_DB_EVIUSAUTH: 'https://eviusauthdev-default-rtdb.firebaseio.com',
    //     VITE_PROJECTID_EVIUSAUTH: 'eviusauthdev',
    //     VITE_STORAGEBUCKET_EVIUSAUTH: 'eviusauthdev.appspot.com',
    //     VITE_MESSAGINGSENDER_EVIUSAUTH: '86708016609',
    //     VITE_MEASUREMENTID_EVIUSAUTH: '',
    //     VITE_APPID_EVIUSAUTH: '1:86708016609:web:129d087ffa3077a1ef2ea0',
    //   },
    //   { loadEnvFiles: false }
    // ),

    EnvironmentPlugin(
      {
        VITE_AUTH_URL: 'http://localhost:3010',
        VITE_API_URL: 'https://api.evius.co',
        VITE_API_DEV_URL: 'https://api.evius.co',
        REACT_APP_SENTRY: 'https://d22c22662dfe45ab806c3bea19c1017b@o1156387.ingest.sentry.io/6237649',
        EVIUS_GOOGLE_MAPS_KEY: 'AIzaSyCmcIJ4xnytwh5ToGhN1Pl56RiualarBqk',
        VITE_API_EVIUS_ZOOM_SERVER: 'https://apimeetings.evius.co:6490/crearroom',
        VITE_API_GOOGLE_API_DOCUMENTS: 'http://docs.google.com/gview?embedded:true&url:',
        VITE_API_EVIUS_ZOOM_SURVEY: 'https://apimeetings.evius.co:6490/obtenerMeetingsPoll',
        TSC_WATCHFILE: 'UseFsEventsWithFallbackDynamicPolling',
        REACT_EDITOR: 'code',
        // NODE_ENV: 'production',
        DEBUG: 'true',
        //FIREBASE CONFIG CHATEVIUS
        VITE_FB_APIKEY_CHATEVIUS: 'AIzaSyD4_AiJFGf1nIvn9BY_rZeoITinzxfkl70',
        VITE_FB_AUTHDOMAIN_CHATEVIUS: 'chatevius.firebaseapp.com',
        VITE_FB_DB_CHATEVIUS: 'https://chatevius.firebaseio.com',
        VITE_PROJECTID_CHATEVIUS: 'chatevius',
        VITE_STORAGEBUCKET_CHATEVIUS: 'chatevius.appspot.com',
        VITE_MESSAGINGSENDER_CHATEVIUS: '114050756597',
        VITE_APPID_CHATEVIUS: '1:114050756597:web:53eada24e6a5ae43fffabc',
        VITE_MEASURENTID_CHATEVIUS: 'G-5V3L65YQKP',
        //FIREBASE CONFIG EVIUSAUTH
        VITE_FB_APIKEY_EVIUSAUTH: 'AIzaSyDDnc9WHXf4CWwXCVggeiarYGu_xBgibJY',
        VITE_FB_AUTHDOMAIN_EVIUSAUTH: 'eviusauth.firebaseapp.com',
        VITE_FB_DB_EVIUSAUTH: 'https://eviusauth.firebaseio.com',
        VITE_PROJECTID_EVIUSAUTH: 'eviusauth',
        VITE_STORAGEBUCKET_EVIUSAUTH: 'eviusauth.appspot.com',
        VITE_MESSAGINGSENDER_EVIUSAUTH: '400499146867',
        VITE_MEASUREMENTID_EVIUSAUTH: '',
        VITE_APPID_EVIUSAUTH: '1:400499146867:web:5d0021573a43a1df',
      },
      { loadEnvFiles: false }
    ),
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
