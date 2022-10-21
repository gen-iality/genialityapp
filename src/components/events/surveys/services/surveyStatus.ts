import { QuizStatus } from '@components/quiz/types';
import { firestore } from '@helpers/firebase';

export const getRef = (surveyId: string, userId: string) => {
  return firestore
    .collection('votingStatusByUser')
    .doc(userId)
    .collection('surveyStatus')
    .doc(surveyId);
};

export const setStatus = async (surveyId: string, userId: string, status: string): Promise<void> => {
  const firebaseRef = getRef(surveyId, userId);

  try {
    await firebaseRef.set({ surveyCompleted: status }, { merge: true });
    console.debug(`surveyId:${surveyId}, userId:${userId}`, 'changed');
  } catch (err) {
    console.error(`surveyId:${surveyId}, userId:${userId}`, err);
  }
};

/**
 * Reset the survey status to enable restarting the survey.
 * @param surveyId Survey ID.
 * @param userId User ID.
 */
export const resetStatusByRestartAnswering = async (surveyId: string, userId: string): Promise<void> => {
  const firebaseRef = getRef(surveyId, userId);
  
  try {
    await firebaseRef.set({ surveyCompleted: 'running', right: 0 }, {merge: true});
  } catch(err) {
    console.error(`surveyId:${surveyId}, userId:${userId}`, err);
  }
};

/**
 * Add tries to a survey status.
 * @param surveyId The survey ID.
 * @param userId The user ID who is answering this survey.
 * @param triedCount The tried amount.
 * @param maxTries The max tried amount.
 * @param status The survey status
 */
 export const addTriesNumber = async (
  surveyId: string,
  userId: string,
  triedCount: number, // Take from context please
  maxTries: number, // Take from context please
  status: string, // Got from survey callback
) => {
  const firebaseRef = getRef(surveyId, userId);

  let newTried = triedCount + 1;
  newTried = Math.min(newTried, maxTries);

  const surveyCompleted = status;

  try {
    await firebaseRef.set(
      { surveyCompleted, tried: newTried, },
      {merge: true},
    );
    console.debug(`addTriesNumber (surveyId: ${surveyId}, userId: ${userId}, triedCount: ${triedCount}), maxTries: ${maxTries}, newTried: ${newTried}, surveyCompleted: ${surveyCompleted})`);
  } catch(err) {
    console.error(`surveyId:${surveyId}, userId:${userId}`, err);
  }
};

/**
 * Given a user's survey adds a passed earned points.
 * @param surveyId The current survey ID.
 * @param userId The current user ID.
 * @param nextPoints The acumulative points.
 */
export const addRightPoints = async (
  surveyId: string,
  userId: string,
  nextPoints: number,
) => {
  // Get last points
  const firebaseRef = getRef(surveyId, userId);

  // Create the payload
  let acumulativePoints = 0;

  try {
    const result = await firebaseRef.get();
    // Check if there is saved points
    if (result?.exists) {
      const {
        right = 0, // By default
      } = result.data() as QuizStatus;
      acumulativePoints = acumulativePoints + right;
      // Add points
    }
    // Speak pretty goodly with Firestore
    await firebaseRef.set(
      { right: acumulativePoints + nextPoints } as QuizStatus, // Add values
      {merge: true},
    );
    console.debug(`save survey status /votingStatusByUser/${userId}/surveyStatus/${surveyId}`, 'value', acumulativePoints, '->', acumulativePoints + nextPoints);
  } catch (err) {
    console.error(`surveyId:${surveyId}, userId:${userId}`, err);
  }
};

export const getStatus = async (surveyId: string, userId: string): Promise<any> => {
  const firebaseRef = getRef(surveyId, userId);

  try {
    const result = await firebaseRef.get();
    if (result?.exists) {
      const document = result.data();
      console.debug(`surveyId:${surveyId}, userId:${userId}`, document);
      return document;
    } else {
      throw new Error('no found');
    }
  } catch (err) {
    console.error(`surveyId:${surveyId}, userId:${userId}`, err);
  }
};

export const getRightPoints = async (surveyId: string, userId: string) => {
  const firebaseRef = getRef(surveyId, userId);

  try {
    const result = await firebaseRef.get();
    if (result?.exists) {
      const data = result.data();
      return data?.right || 0;
    }
    return 0;
  } catch(err) {
    console.error(`surveyId:${surveyId}, userId:${userId}`, err);
    return 0;
  }
};
