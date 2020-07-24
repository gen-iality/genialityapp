import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const config = {
  apiKey: "AIzaSyATmdx489awEXPhT8dhTv4eQzX3JW308vc",
  authDomain: "eviusauth.firebaseapp.com",
  databaseURL: "https://eviusauth.firebaseio.com",
  projectId: "eviusauth",
  storageBucket: "eviusauth.appspot.com",
  messagingSenderId: "400499146867",
};

const andresConfig = {
  apiKey: "AIzaSyBHvn-YgeCNILbdgKXhcN7tiYyKLf_oUHY",
  authDomain: "mocion-agenda.firebaseapp.com",
  databaseURL: "https://mocion-agenda.firebaseio.com",
  projectId: "mocion-agenda",
  storageBucket: "mocion-agenda.appspot.com",
  messagingSenderId: "68248262397",
  appId: "1:68248262397:web:d60f7b8c084e433cf81094",
  measurementId: "G-HH8BTPMWJ1"
};

app.initializeApp(config);
const andresApp = app.initializeApp(andresConfig, 'ANDRES')

const firestore = app.firestore();
const fireStorage = app.storage();
const andresFirestore = andresApp.firestore();

firestore.settings({
  cacheSizeBytes: firestore.CACHE_SIZE_UNLIMITED,
});
firestore
  .enablePersistence()
  .then(() => {
    window.eviusFailedPersistenceEnabling = false;
  })
  .catch((err) => {
    console.log(err);
    window.eviusFailedPersistenceEnabling = true;
  });

const auth = app.auth();
const andresAuth = app.auth(andresApp)

window.firebase = app;

export { app, auth, firestore, fireStorage, andresAuth, andresFirestore };
