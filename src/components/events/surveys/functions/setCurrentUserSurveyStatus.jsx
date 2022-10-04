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

export async function  getCurrentUserSurveyStatus(surveyId, userId) {
  const result = await firestore
    .collection('votingStatusByUser')
    .doc(userId)
    .collection('surveyStatus')
    .doc(surveyId)
    .get();

  if (result.exists) {
    const document = result.data();
    console.log('1000.result.data()', document);
    return document;
  } else {
    console.debug('1000.result.data()', 'no exist', surveyId, userId);
  }
}
