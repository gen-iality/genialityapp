import React from 'react';
import { firestore, fireRealtime, auth, app } from '../helpers/firebase';
import { getCurrentUser } from '../helpers/request';
const userContext = React.createContext({ user: {} }); // Create a context object
//https://firebase.google.com/docs/firestore/solutions/presence
// Fetch the current user's ID from Firebase Authentication.
var uid = 'a'; //auth.currentUser.uid || null;

export {
  userContext // Export it so it can be used by other Components
};
