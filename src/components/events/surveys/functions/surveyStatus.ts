import { firestore } from '@helpers/firebase';

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
  // Get reference
  const firebaseRef = firestore
    .collection('votingStatusByUser')
    .doc(userId)
    .collection('surveyStatus')
    .doc(surveyId);
  
  let newTried = triedCount + 1;
  newTried = Math.min(newTried, maxTries);

  let surveyCompleted = status;

  console.debug(`addTriesNumber (surveyId: ${surveyId}, userId: ${userId}, triedCount: ${triedCount}), maxTries: ${maxTries}, newTried: ${newTried}, surveyCompleted: ${surveyCompleted})`);

  await firebaseRef.set(
    { surveyCompleted, tried: newTried, },
    {merge: true},
  );
};
