// Importa las librerías de Firebase
import app from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import 'firebase/compat/database';

/**
 * FIRESTORE algunas veces se demora en traer los datos
 * para cosas super realtime usar firebase realtime
 * https://stackoverflow.com/questions/46717898/firestore-slow-performance-issue-on-getting-data
 */
const config = {
  apiKey: process.env.VITE_FB_APIKEY_EVIUSAUTH,
  authDomain: process.env.VITE_FB_AUTHDOMAIN_EVIUSAUTH,
  databaseURL: process.env.VITE_FB_DB_EVIUSAUTH,
  projectId: process.env.VITE_PROJECTID_EVIUSAUTH,
  storageBucket: process.env.VITE_STORAGEBUCKET_EVIUSAUTH,
  appId: process.env.VITE_APPID_EVIUSAUTH,
  messagingSenderId: process.env.VITE_MESSAGINGSENDER_EVIUSAUTH,
  measurementId: process.env.VITE_MEASUREMENTID_EVIUSAUTH,
};

const configEviuschat = {
  apiKey: process.env.VITE_FB_APIKEY_CHATEVIUS,
  authDomain: process.env.VITE_FB_AUTHDOMAIN_CHATEVIUS,
  databaseURL: process.env.VITE_FB_DB_CHATEVIUS,
  projectId: process.env.VITE_PROJECTID_CHATEVIUS,
  storageBucket: process.env.VITE_STORAGEBUCKET_CHATEVIUS,
  appId: process.env.VITE_APPID_CHATEVIUS,
  messagingSenderId: process.env.VITE_MESSAGINGSENDER_CHATEVIUS,
  measurementId: process.env.VITE_MEASUREMENTID_CHATEVIUS,
};

// Inicializa las aplicaciones de Firebase
let eviusaauth, eviuschat;

try {
  eviusaauth = app.initializeApp(config);
} catch (error) {
  console.error('Error initializing eviusaauth app:', error);
}

try {
  eviuschat = app.initializeApp(configEviuschat, 'secondary');
} catch (error) {
  console.error('Error initializing eviuschat app:', error);
}

// Configura Firestore, Storage, Realtime Database y Auth
const firestore = eviusaauth ? eviusaauth.firestore() : null;
const fireStorage = eviusaauth ? eviusaauth.storage() : null;
const fireRealtime = eviusaauth ? eviusaauth.database() : null;
const auth = eviusaauth ? eviusaauth.auth() : null;

if (fireRealtime) {
  fireRealtime.ref(".info/connected").on("value", (snapshot) => {
    const isConnected = snapshot.val();
    if (isConnected === false) {
      console.log("Client is not connected to Firebase.");
    } else {
      console.log("Client is connected to Firebase.");
    }
  });
}

const firestoreeviuschat = eviuschat ? eviuschat.firestore() : null;
const realTimeviuschat = eviuschat ? eviuschat.database() : null;

// Configura Firestore con persistencia
if (firestore) {
  firestore.settings({
    cacheSizeBytes: firestore.CACHE_SIZE_UNLIMITED,
    merge: true,
  });

  firestore
    .enablePersistence({ synchronizeTabs: true })
    .then(() => {
      window.eviusFailedPersistenceEnabling = false;
    })
    .catch((err) => {
      console.error('Error enabling persistence:', err);
      window.eviusFailedPersistenceEnabling = true;
    });
}

// Exporta las instancias
export {
  app,
  auth,
  firestore,
  fireStorage,
  fireRealtime,
  firestoreeviuschat,
  realTimeviuschat,
};
