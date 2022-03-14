import { useEffect } from 'react';
import { app, firestore } from './firebase';

export async function GetTokenUserFirebase() {
  return new Promise((resolve, reject) => {
    app.auth().onAuthStateChanged((user) => {
      if (user) {
        user
          .getIdToken()
          .then(async function(idToken) {
            resolve(idToken);
          })
          .catch((error) => {
            reject('Not user token: ', error);
          });
      }
    });
  });
}

export const useCheckinUser = (attende, eventId, type = 'event') => {
  const userRef = firestore.collection(`${eventId}_event_attendees`).doc(attende._id);
  if (type == 'event') {
    userRef.onSnapshot(function(doc) {
      if (doc.exists) {
        if (doc.data().checked_in === false) {
          userRef.set(
            {
              checked_in: true,
              checkedin_at: new Date(),
            },
            { merge: true }
          );
        }
      }
    });
  } else if (type == 'activity') {
    userRef.onSnapshot(function(doc) {
      if (doc.exists) {
        if (doc.data().checked_in === false) {
          userRef.set(
            {
              checked_in: true,
              checkedin_at: new Date(),
            },
            { merge: true }
          );
        }
      } else {
        firestore
          .collection(`${eventId}_event_attendees`)
          .doc(attende._id)
          .set({
            ...attende,
          });
      }
    });
  }
};
