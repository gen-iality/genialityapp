
import { firestore } from '@helpers/firebase';

export async function getAcumulativePoints(surveyId, userId) {
  let acumulativePoints = await firestore
      .collection('votingStatusByUser')
      .doc(userId)
      .collection('surveyStatus')
      .doc(surveyId)
      .get()

      return acumulativePoints.data().right || 0;
}

export default getAcumulativePoints;
