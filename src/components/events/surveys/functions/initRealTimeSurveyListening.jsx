import { firestore } from '@helpers/firebase';

function initRealTimeSurveyListening(idSurvey, updateSurveyDataCallback) {
  console.log('initRealTimeSurveyListening');
  console.log('updateSurveyStatusx');
  const unsubscribe = firestore
    .collection('surveys')
    .doc(idSurvey)
    .onSnapshot(async (doc) => {
      const surveyRealTime = { ...doc.data(), _id_firebase: doc.id };
      console.log('surveyDataRealTime=>', surveyRealTime);
      updateSurveyDataCallback(surveyRealTime);
    });

  return unsubscribe;
}

export default initRealTimeSurveyListening;
