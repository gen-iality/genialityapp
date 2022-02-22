import { useEffect } from 'react';
import { app, firestore } from './firebase';

export async function GetTokenUserFirebase() {
  return new Promise((resolve, reject) => {
    app.auth().onAuthStateChanged((user) => {
      if (user) {
        user.getIdToken().then(async function (idToken) {
          resolve(idToken);
        });
      } else {
        reject('unauthenticated user');
      }
    });
  });
}


export const useCheckinUser = (attende, eventId, type = 'event') => {
  console.log("habla vale mia", {
    attende,
    eventId,
    type
  })
  const userRef = firestore.collection(`${eventId}_event_attendees`).doc(attende._id);
  if (type == 'event') {
    userRef.onSnapshot(function (doc) {
      if (doc.exists) {
        if (doc.data().checked_in === false) {
          userRef.set({
            checked_in: true,
            checkedin_at: new Date(),
          }, { merge: true });
        }
      }
    });
  } else if (type == 'activity') {
    console.log("holis")
    userRef.onSnapshot(function (doc) {
      if (doc.exists) {
        console.log("si existe ya")
        if (doc.data().checked_in === false) {
          userRef.set({
            checked_in: true,
            checkedin_at: new Date(),
          }, { merge: true });
        }
      } else {
        console.log("entro aca")
        firestore.collection(`${eventId}_event_attendees`).doc(attende._id).set({
          ...attende,
        })
      }
    });
  }
}