//import { initializeApp } from 'firebase/app';
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
  apiKey: 'AIzaSyATmdx489awEXPhT8dhTv4eQzX3JW308vc',
  authDomain: 'eviusauth.firebaseapp.com',
  databaseURL: 'https://eviusauth.firebaseio.com',
  projectId: 'eviusauth',
  storageBucket: 'eviusauth.appspot.com',
  messagingSenderId: '400499146867',
};

const configEviuschat = {
  apiKey: 'AIzaSyD4_AiJFGf1nIvn9BY_rZeoITinzxfkl70',
  authDomain: 'chatevius.firebaseapp.com',
  databaseURL: 'https://chatevius.firebaseio.com',
  projectId: 'chatevius',
  storageBucket: 'chatevius.appspot.com',
  messagingSenderId: '114050756597',
  appId: '1:114050756597:web:53eada24e6a5ae43fffabc',
  measurementId: 'G-5V3L65YQKP',
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
