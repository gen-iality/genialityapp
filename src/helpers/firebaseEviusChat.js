import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/database';

const config = {
  apiKey: 'AIzaSyD4_AiJFGf1nIvn9BY_rZeoITinzxfkl70',
  authDomain: 'chatevius.firebaseapp.com',
  databaseURL: 'https://chatevius.firebaseio.com',
  projectId: 'chatevius',
  storageBucket: 'chatevius.appspot.com',
  messagingSenderId: '114050756597',
  appId: '1:114050756597:web:53eada24e6a5ae43fffabc',
  measurementId: 'G-5V3L65YQKP',
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
