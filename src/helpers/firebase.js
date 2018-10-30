import firebase from 'firebase';
const config = {
    apiKey: "AIzaSyATmdx489awEXPhT8dhTv4eQzX3JW308vc",
    authDomain: "eviusauth.firebaseapp.com",
    databaseURL: "https://eviusauth.firebaseio.com",
    projectId: "eviusauth",
    storageBucket: "eviusauth.appspot.com",
    messagingSenderId: "400499146867"
};
firebase.initializeApp(config);

const firestore = firebase.firestore();
firestore.settings({
timestampsInSnapshots: true
});

export {firebase,firestore};
