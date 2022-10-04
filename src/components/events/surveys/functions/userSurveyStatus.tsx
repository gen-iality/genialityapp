import { firestore } from '@helpers/firebase';

export function setUserSurveyStatus(surveyId: string, userId: string, status: string) {
  const firebaseRef = firestore
    .collection('votingStatusByUser')
    .doc(userId)
    .collection('surveyStatus')
    .doc(surveyId);

  try {
    firebaseRef.set({ surveyCompleted: status }, { merge: true });
    console.debug(`surveyId:${surveyId}, userId:${userId}`, 'changed');
  } catch (err) {
    console.error(`surveyId:${surveyId}, userId:${userId}`, err);
  }
}

export async function getUserSurveyStatus(surveyId: string, userId: string): Promise<any> {
  const firebaseRef = firestore
    .collection('votingStatusByUser')
    .doc(userId)
    .collection('surveyStatus')
    .doc(surveyId);

  try {
    const result = await firebaseRef.get();
    if (result.exists) {
      const document = result.data();
      console.debug(`surveyId:${surveyId}, userId:${userId}`, document);
      return document;
    } else {
      throw new Error('no found');
    }
  } catch (err) {
    console.error(`surveyId:${surveyId}, userId:${userId}`, err);
  }
}
