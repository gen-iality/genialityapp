import React from 'react';
import { firestore, fireRealtime, auth, app } from '../helpers/firebase';
import { getCurrentUser } from '../helpers/request';
const userContext = React.createContext({ user: {} }); // Create a context object
//https://firebase.google.com/docs/firestore/solutions/presence
// Fetch the current user's ID from Firebase Authentication.
var uid = 'a'; //auth.currentUser.uid || null;

let initUser = async () => {
  const user = await getCurrentUser();
  console.log(user);
  if (!user) return;

  initUserPresence(user.uid);
};
initUser();

// auth.onAuthStateChanged(function(user) {
//   if (user) {
//     // User is signed in.
//     console.log('usuarop', user);
//   } else {
//     // No user is signed in.
//     console.log('nouser', user);
//   }
// });
let initUserPresence = (uid) => {
  // Create a reference to this user's specific status node.
  // This is where we will store data about being online/offline.
  var userStatusDatabaseRef = fireRealtime.ref('/status/' + uid);

  // We'll create two constants which we will write to
  // the Realtime database when this device is offline
  // or online.
  var isOfflineForDatabase = {
    state: 'offline',
    last_changed: app.database.ServerValue.TIMESTAMP
  };

  var isOnlineForDatabase = {
    state: 'online',
    last_changed: app.database.ServerValue.TIMESTAMP
  };

  // Create a reference to the special '.info/connected' path in
  // Realtime Database. This path returns `true` when connected
  // and `false` when disconnected.
  fireRealtime.ref('.info/connected').on('value', function(snapshot) {
    // If we're not currently connected, don't do anything.
    if (snapshot.val() == false) {
      return;
    }

    // If we are currently connected, then use the 'onDisconnect()'
    // method to add a set which will only trigger once this
    // client has disconnected by closing the app,
    // losing internet, or any other means.
    userStatusDatabaseRef
      .onDisconnect()
      .set(isOfflineForDatabase)
      .then(function() {
        // The promise returned from .onDisconnect().set() will
        // resolve as soon as the server acknowledges the onDisconnect()
        // request, NOT once we've actually disconnected:
        // https://firebase.google.com/docs/reference/js/firebase.database.OnDisconnect
        console.log('estamos conectados');
        // We can now safely set ourselves as 'online' knowing that the
        // server will mark us as offline once we lose connection.
        userStatusDatabaseRef.set(isOnlineForDatabase);
      });
  });
};

export {
  userContext // Export it so it can be used by other Components
};
