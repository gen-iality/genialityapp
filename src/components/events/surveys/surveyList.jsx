import { useEffect, useState } from 'react';

/** Redux */
import { connect } from 'react-redux';
import * as surveysActions from '../../../redux/survey/actions';

/** Componentes */
import SurveyCard from './components/surveyCard';

/** Context´s */
import { UseCurrentUser } from '../../../context/userContext';
import { UseSurveysContext } from '../../../context/surveysContext';

const { setCurrentSurvey, setSurveyResult } = surveysActions;

function SurveyList(props) {
  const cSurveys = UseSurveysContext();
  console.log('test:cSurveys.currentSurveyStatus',cSurveys.currentSurveyStatus)
  const { activity, setCurrentSurvey, setSurveyResult } = props;

  const currentUser = UseCurrentUser();
  console.log('test:currentUser',currentUser)

  const handleClick = (currentSurvey) => {
    cSurveys.select_survey(currentSurvey);
  };
  return (
    <SurveyCard
      publishedSurveys={cSurveys.surveysToBeListedByActivity()}
      status={cSurveys.status}
      currentUser={currentUser}
      handleClick={handleClick}
      currentSurveyStatus={cSurveys.currentSurveyStatus}
    />
  );
}

const mapStateToProps = (state) => ({
  activity: state.stage.data.currentActivity,
});

const mapDispatchToProps = {
  setCurrentSurvey,
  setSurveyResult,
};

export default connect(mapStateToProps, mapDispatchToProps)(SurveyList);
