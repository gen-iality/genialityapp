import { firestore } from '../../../../helpers/firebase';

async function InitSurveysCompletedListener(currentUser,setSurveyStatusProgress) {
   const userId = currentUser.value._id;

   const firebaseRef = firestore
      .collection('votingStatusByUser')
      .doc(userId)
      .collection('surveyStatus');

   // console.log('10. Se ejecuta la funcion del listener');

   const unSuscribe = firebaseRef.onSnapshot((snapShot) => {
      let surveysCompleted = {};
      snapShot.forEach((data) => {
         if (data.data()) {
            surveysCompleted[data.id] = data.data();
            // console.log('10. initSurveysCompletedListener ', data.data());
         }
      });
      setSurveyStatusProgress(surveysCompleted);
   });

   return unSuscribe
}

export default InitSurveysCompletedListener;
