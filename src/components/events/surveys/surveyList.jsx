import React, { useEffect, useState } from 'react';

/** Helpers */
import { listenSurveysData } from '../../../helpers/helperEvent';

/** Redux */
import { connect } from 'react-redux';
import * as notificationsActions from '../../../redux/notifications/actions';
import * as surveysActions from '../../../redux/survey/actions';
import { setMainStage } from '../../../redux/stage/actions';

/** Componentes */
import SurveyCard from './components/surveyCard';
import notifications from '../Landing/notifications';

/** Context´s */
import { UseCurrentUser } from '../../../Context/userContext';

const { setNotification } = notificationsActions;
const { setCurrentSurvey, setSurveyResult } = surveysActions;

function SurveyList(props) {
   const {
      activity,
      setNotification,
      viewNotification,
      setCurrentSurvey,
      setSurveyResult,
      surveyStatusProgress,
      listOfEventSurveys,
      loadingSurveys,
   } = props;

   const currentUser = UseCurrentUser();

   const handleClick = (currentSurvey, status) => {
      if (activity !== null && currentSurvey.isOpened === 'true') {
         setSurveyResult('view');
      } else if (activity !== null && currentSurvey.isOpened === 'false') {
         setSurveyResult('results');
      }
      if (status === 'results') {
         setSurveyResult('results');
      }
      setCurrentSurvey(currentSurvey);
   };

   return (
      <SurveyCard
         publishedSurveys={listOfEventSurveys}
         surveyStatusProgress={surveyStatusProgress}
         loadingSurveys={loadingSurveys}
         currentUser={currentUser}
         handleClick={handleClick}
      />
   );
}

const mapStateToProps = (state) => ({
   activity: state.stage.data.currentActivity,
   viewNotification: state.notifications.data,
   currentActivity: state.survey.currentActivity,
});

const mapDispatchToProps = {
   setNotification,
   setCurrentSurvey,
   setMainStage,
   setSurveyResult,
};

export default connect(mapStateToProps, mapDispatchToProps)(SurveyList);
