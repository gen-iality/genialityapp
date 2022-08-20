import { firestore } from '../../../../helpers/firebase';
import { SurveyPage } from '../services/services';

function initRealTimeSurveyListening(idSurvey, currentUser, mongoData, updateSurveyDataCallback) {
  let currentPageNo = 0;
  

  let unsubscribe = firestore
    .collection('surveys')
    .doc(idSurvey)
    .onSnapshot(async (doc) => {
      let surveyRealTime = { ...doc.data(), _id_firebase: doc.id };
      console.log('surveyDataRealTime=>', surveyRealTime);

      //revisando si estamos retomando la encuesta en alguna página particular
      if (currentUser && currentUser.value._id && surveyRealTime) {
        currentPageNo = await SurveyPage.getCurrentPage(idSurvey, currentUser.value._id);
        surveyRealTime.currentPage = currentPageNo ? currentPageNo : 0;
        
        updateSurveyDataCallback(mongoData); 
        //updateSurveyDataCallback({...mongoData, ...surveyRealTime}); 
      }
    });

    return unsubscribe;
}

export default initRealTimeSurveyListening;
