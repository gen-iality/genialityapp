import { saveCheckInAttendee } from '@/services/checkinServices/checkinServices';
import { useEffect } from 'react';
import { app, firestore } from './firebase';

export async function GetTokenUserFirebase() {
  return new Promise((resolve, reject) => {
    app.auth().onAuthStateChanged(user => {
      if (user) {
        user
          .getIdToken()
          .then(async function(idToken) {
            resolve(idToken);
          })
          .catch(error => {
            reject('Not user token: ', error);
          });
      } else {
        resolve(user);
      }
    });
  });
}

export const checkinAttendeeInActivity = (attende, activityId) => {
  /** We use the activity id plus _event_attendees to be able to reuse the checkIn component per event */
  const userRef = firestore.collection(`${activityId}_event_attendees`).doc(attende._id);
  userRef.get().then(function(doc) {
    if (doc.exists) {
      console.log('exist* attendee', `${activityId}_event_attendees`, attende._id);
      if (!doc.data().checked_in) {
        console.log('update* attendee', `${activityId}_event_attendees`, attende._id);
        userRef.update(
          {
            checkinsList: app.firestore.FieldValue.arrayUnion(new Date()),
            checked_in: true,
            checkedin_at: new Date(),
          },
          { merge: true },
        );
      }
    } else {
      console.log('set* attendee', `${activityId}_event_attendees`, attende._id);
      firestore
        .collection(`${activityId}_event_attendees`)
        .doc(attende._id)
        .set({
          ...attende,
          checkinsList: app.firestore.FieldValue.arrayUnion(new Date()),
          checked_in: true,
          checkedin_at: new Date(),
        });
    }
  });
};

export const checkinAttendeeInEvent = (attende, eventId) => {
  const userRef = firestore.collection(`${eventId}_event_attendees`).doc(attende._id);

  userRef.onSnapshot(function(doc) {
    if (doc.exists) {
      if (!doc.data().checked_in) {
        /** We register the checkIn by calling the back */
        saveCheckInAttendee({ _id: attende._id, checked: true, notification: false, type: 'Virtual' });
      }
    }
  });
};
