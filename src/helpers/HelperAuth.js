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
      if (!doc.data().checked_in) {
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
export const checkinAttendeeInActivity = (attende, eventId, activityId) => {
  const userRef = firestore.collection(`${eventId}_event_attendees`).doc(attende._id);

  const unSuscribe = userRef.onSnapshot(async function(doc) {
    if (doc.exists) {
      const activityProperties = doc.data()?.activityProperties;

      if (activityProperties && activityProperties?.length > 0) {
        const addedToTheActivityButWithoutChecking = activityProperties.find((activityPropertie) => {
          return activityPropertie.activity_id === activityId && !activityPropertie.checked_in;
        });

        const withoutAddingToTheActivityAndWithoutChecking = activityProperties.find((activityPropertie) => {
          return activityPropertie.activity_id === activityId;
        });

        if (addedToTheActivityButWithoutChecking) {
          await saveCheckInAttendee({
            _id: attende._id,
            checked: true,
            notification: false,
            type: 'Virtual',
            activityId,
          });
          return;
        }
        if (!withoutAddingToTheActivityAndWithoutChecking) {
          await saveCheckInAttendee({
            _id: attende._id,
            checked: true,
            notification: false,
            type: 'Virtual',
            activityId,
          });
          return;
        }
      } else {
        saveCheckInAttendee({ _id: attende._id, checked: true, notification: false, type: 'Virtual', activityId });
      }
    }
  });
  return unSuscribe;
};
