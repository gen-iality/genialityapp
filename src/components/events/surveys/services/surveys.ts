import { firestore } from '@helpers/firebase';

export const getRef = (surveyId: string) => (
  firestore
    .collection('surveys')
    .doc(surveyId)
);

export const getUserProgressRef = (surveyId: string, userId: string) => (
  getRef(surveyId)
    .collection('userProgress')
    .doc(userId)
);

export const getAnswersRef = (surveyId: string, userId: string) => (
  getRef(surveyId)
    .collection('answers')
    .doc(userId)
);

export const getCurrentPage = async (surveyId: string, userId: string) => {
  const firebaseRef = getUserProgressRef(surveyId, userId);

  try {
    const result = await firebaseRef.get();

    if (result.exists) {
      const data = result.data();
      return (data && data.currentPageNo) || 0;
    }

    return 0;
  } catch(err) {
    console.error(`surveyId:${surveyId}, userId:${userId}`, err);
    return 0;
  }
};

export const setCurrentPage = async (surveyId: string, userId: string, currentPageNo: number) => {
  const firebaseRef = getUserProgressRef(surveyId, userId);

  try {
    await firebaseRef.set(
      { currentPageNo },
      { merge: true },
    );
    console.debug(
      `surveyId:${surveyId}, userId:${userId}`, // Info debug
      `changed currentPageNo: ${currentPageNo}`,
    );
  } catch(err) {
    console.error(`surveyId:${surveyId}, userId:${userId}`, err);
  }
};