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


export const useCheckinUser = (AttendeId, eventId) => {
  console.log("cuantos usuarios estan en el evento");
  const userRef = firestore.collection(`${eventId}_event_attendees`).doc(AttendeId);
  userRef.onSnapshot(function (doc) {
    if (doc.exists) {
      userRef.set({
        checkin: true,
        checkedin_at: new Date(),
      }, { merge: true });
    }
  });
}