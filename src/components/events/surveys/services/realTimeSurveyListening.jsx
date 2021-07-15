import React from 'react';
import { firestore } from '../../../../helpers/firebase';
import { SurveyPage } from './services';

function RealTimeSurveyListening(idSurvey, currentUser, setFreezeGame, realTimeSurvey) {
   //    let currentPageNo = 0;

   firestore
      .collection('surveys')
      .doc(idSurvey)
      .onSnapshot(async (doc) => {
         let surveyRealTime = doc.data();

         //revisando si estamos retomando la encuesta en alguna página particular
         //  if (currentUser && currentUser._id) {
         //     currentPageNo = await SurveyPage.getCurrentPage(idSurvey, currentUser._id);
         //     surveyRealTime.currentPage = currentPageNo ? currentPageNo : 0;
         //  }

         setFreezeGame(surveyRealTime.freezeGame);
         realTimeSurvey(surveyRealTime);
      });
}

export default RealTimeSurveyListening;
