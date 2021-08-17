import { firestore } from '../../../../helpers/firebase';

async function InitSurveysCompletedListener(currentUser,setCurrentSurveyStatus) {
   const userId = currentUser.value._id;

   const firebaseRef = firestore
      .collection('votingStatusByUser')
      .doc(userId)
      .collection('surveyStatus');

  
   const unSuscribe = firebaseRef.onSnapshot((snapShot) => {
      let surveysCompleted = {};
      snapShot.forEach((data) => {
         if (data.data()) {
            surveysCompleted[data.id] = data.data();
         }
      });
      setCurrentSurveyStatus(surveysCompleted);
   });

   return unSuscribe
}

export default InitSurveysCompletedListener;
