import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/database';

const config = {
  apiKey: 'AIzaSyATmdx489awEXPhT8dhTv4eQzX3JW308vc',
  authDomain: 'eviusauth.firebaseapp.com',
  databaseURL: 'https://eviusauth.firebaseio.com',
  projectId: 'eviusauth',
  storageBucket: 'eviusauth.appspot.com',
  messagingSenderId: '400499146867'
};

app.initializeApp(config);

const firestore = app.firestore();
const fireStorage = app.storage();
const fireRealtime = app.database();
const auth = app.auth();

firestore.settings({
  cacheSizeBytes: firestore.CACHE_SIZE_UNLIMITED
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
