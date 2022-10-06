import { firestore } from '@helpers/firebase';

export const setUserSurveyStatus = setStatus;
export const getUserSurveyStatus = getStatus;

export async function setStatus(surveyId: string, userId: string, status: string): Promise<void> {
  const firebaseRef = firestore
    .collection('votingStatusByUser')
    .doc(userId)
    .collection('surveyStatus')
    .doc(surveyId);

  try {
    await firebaseRef.set({ surveyCompleted: status }, { merge: true });
    console.debug(`surveyId:${surveyId}, userId:${userId}`, 'changed');
  } catch (err) {
    console.error(`surveyId:${surveyId}, userId:${userId}`, err);
  }
}

export async function getStatus(surveyId: string, userId: string): Promise<any> {
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
