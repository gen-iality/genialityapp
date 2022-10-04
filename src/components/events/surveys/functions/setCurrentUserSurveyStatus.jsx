import { firestore } from '../../../../helpers/firebase';

export function setCurrentUserSurveyStatus(surveyData, currentUser, status) {
  const surveyId = surveyData._id;
  const userId = currentUser.value._id;
  const firebaseRef = firestore
    .collection('votingStatusByUser')
    .doc(userId)
    .collection('surveyStatus')
    .doc(surveyId);

  return firebaseRef.set({ surveyCompleted: status }, { merge: true });
}

export function getCurrentUserSurveyStatus(surveyId, userId) {
  /* return firestore
    .collection('votingStatusByUser')
    .doc(userId)
    .collection('surveyStatus')
    .doc(surveyId)
    .get(); */

  return new Promise((resolve, reject) => {
    firestore
      .collection('votingStatusByUser')
      .doc(userId)
      .collection('surveyStatus')
      .doc(surveyId)
      .get()
      .then(result => {
        if (result.exists) {
          console.log('1000.result.data()', result.data());
          resolve(result.data());
        } else {
          resolve();
        }
      })
      .catch(err => {
        reject('Hubo un problema ', err);
      });
  });
}
