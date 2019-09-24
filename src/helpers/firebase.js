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
});
firestore.enablePersistence(experimentalTabSynchronization:true)
    .catch((err)=> {
        console.log(err);
    });
const auth = app.auth();
window.firebase = app;
export {app,auth,firestore};
