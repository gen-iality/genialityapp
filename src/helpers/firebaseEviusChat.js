import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/database';

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
