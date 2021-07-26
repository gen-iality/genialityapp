import { firestore } from '../../../../helpers/firebase';

export function SetUserCompletedSurvey(surveyData, currentUser, status) {
   const surveyId = surveyData._id;
   const userId = currentUser.value._id;
console.log("10. =>> ",surveyId, userId )
   firestore
      .collection('surveys')
      .doc(surveyId)
      .collection('votingStatusByUser')
      .doc(userId)
      .set({
         surveyCompleted: status,
      });
}

export function ListenUserCompletedSurvey(surveyData, currentUser, setUserHasVoted) {
   const surveyId = surveyData._id;
   const userId = currentUser.value._id;

   firestore
      .collection('surveys')
      .doc(surveyId)
      .collection('votingStatusByUser')
      .doc(userId)
      .onSnapshot((doc) => {
         setUserHasVoted(() => {
            if (doc.data()) {
               return { completeSurvey: doc.data().surveyCompleted, surveyId: surveyId };
            }
         });
      });
}
