import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/database';

const config = {
  apiKey: process.env.VITE_FB_APIKEY_CHATEVIUS,
  authDomain: process.env.VITE_FB_AUTHDOMAIN_CHATEVIUS,
  databaseURL: process.env.VITE_FB_DB_CHATEVIUS,
  projectId: process.env.VITE_PROJECTID_CHATEVIUS,
  storageBucket: process.env.VITE_STORAGEBUCKET_CHATEVIUS,
  appId: process.env.VITE_APPID_CHATEVIUS,
  messagingSenderId: process.env.VITE_MESSAGINGSENDER_CHATEVIUS,
  measurementId: process.env.VITE_MEASUREMENTID_CHATEVIUS,
};

app.initializeApp(config);

const firestore = app.firestore();
const fireStorage = app.storage();
const fireRealtime = app.database();
const auth = app.auth();

firestore.settings({
  cacheSizeBytes: firestore.CACHE_SIZE_UNLIMITED,
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

export { app, auth, firestore, fireStorage, fireRealtime };
