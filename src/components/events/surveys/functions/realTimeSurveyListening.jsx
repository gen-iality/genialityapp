import React from 'react';
import { firestore } from '../../../../helpers/firebase';
import { SurveyPage } from '../services/services';

function RealTimeSurveyListening(idSurvey, currentUser, startingSurveyComponent) {
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
         startingSurveyComponent(surveyRealTime);
      });
}

export default RealTimeSurveyListening;
