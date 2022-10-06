import { firestore } from '../../../../helpers/firebase';

function initRealTimeSurveyListening(idSurvey, updateSurveyDataCallback) {
  console.log('initRealTimeSurveyListening');
  console.log('updateSurveyStatusx');
  let unsubscribe = firestore
    .collection('surveys')
    .doc(idSurvey)
    .onSnapshot(async (doc) => {
      let surveyRealTime = { ...doc.data(), _id_firebase: doc.id };
      console.log('surveyDataRealTime=>', surveyRealTime);
      updateSurveyDataCallback(surveyRealTime);
    });

  return unsubscribe;
}

export default initRealTimeSurveyListening;
