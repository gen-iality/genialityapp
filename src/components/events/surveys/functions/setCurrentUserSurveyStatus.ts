import { firestore } from '../../../../helpers/firebase';

function SetCurrentUserSurveyStatus(surveyData: any, currentUser: any, status: any) {
   const surveyId = surveyData._id;
   const userId = currentUser.value._id;
   const firebaseRef = firestore
      .collection('votingStatusByUser')
      .doc(userId)
      .collection('surveyStatus')
      .doc(surveyId);

   firebaseRef.set({
      surveyCompleted: status,
   });
}

export default SetCurrentUserSurveyStatus

