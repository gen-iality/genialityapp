import { firestore } from '../../../../helpers/firebase';
import { SurveyPage } from '../services/services';

function initRealTimeSurveyListening(idSurvey, updateSurveyDataCallback) {
  let unsubscribe = firestore
    .collection('surveys')
    .doc(idSurvey)
    .onSnapshot(async (doc) => {
      let surveyRealTime = { ...doc.data(), _id_firebase: doc.id };
      console.log('surveyDataRealTime=>', surveyRealTime);
      updateSurveyDataCallback(surveyRealTime);
      //updateSurveyDataCallback({...mongoData, ...surveyRealTime}); 
      //revisando si estamos retomando la encuesta en alguna página particular
    });

  return unsubscribe;
}

export default initRealTimeSurveyListening;
