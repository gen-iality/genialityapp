import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const config = {
    apiKey: "AIzaSyATmdx489awEXPhT8dhTv4eQzX3JW308vc",
    authDomain: "eviusauth.firebaseapp.com",
    databaseURL: "https://eviusauth.firebaseio.com",
    projectId: "eviusauth",
    storageBucket: "eviusauth.appspot.com",
    messagingSenderId: "400499146867"
};
app.initializeApp(config);

const firestore = app.firestore();
firestore.settings({
    cacheSizeBytes: firestore.CACHE_SIZE_UNLIMITED
})
firestore.enablePersistence().then(() => { window.evius = { failedPersistenceEnabling: false } })
    .catch((err) => { console.log(err); window.evius = { failedPersistenceEnabling: true } });
const auth = app.auth();
window.firebase = app;
export { app, auth, firestore };
