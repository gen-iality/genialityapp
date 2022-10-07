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

let eviusaauth = app.initializeApp(config);
let eviuschat = app.initializeApp(configEviuschat, 'secondary');

const firestore = eviusaauth.firestore();
const fireStorage = eviusaauth.storage();
const fireRealtime = eviusaauth.database();
const auth = eviusaauth.auth();

//const firestoreDB = getFirestore(app);

const firestoreeviuschat = eviuschat.firestore();
const realTimeviuschat = eviuschat.database();

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
    console.error(err);
    window.eviusFailedPersistenceEnabling = true;
  });

window.firebase = app;

export { app, auth, firestore, fireStorage, fireRealtime, firestoreeviuschat, realTimeviuschat };
