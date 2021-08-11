import React, { useEffect, useState } from 'react';

/** Redux */
import { connect } from 'react-redux';
import * as surveysActions from '../../../redux/survey/actions';
import { setMainStage } from '../../../redux/stage/actions';

/** Componentes */
import SurveyCard from './components/surveyCard';

/** Context´s */
import { UseCurrentUser } from '../../../Context/userContext';

const { setCurrentSurvey, setSurveyResult } = surveysActions;

function SurveyList(props) {
   const {
      activity,
      setCurrentSurvey,
      setSurveyResult,
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
         loadingSurveys={loadingSurveys}
         currentUser={currentUser}
         handleClick={handleClick}
      />
   );
}

const mapStateToProps = (state) => ({
   activity: state.stage.data.currentActivity,
   currentActivity: state.survey.currentActivity,
});

const mapDispatchToProps = {
   setCurrentSurvey,
   setMainStage,
   setSurveyResult,
};

export default connect(mapStateToProps, mapDispatchToProps)(SurveyList);
