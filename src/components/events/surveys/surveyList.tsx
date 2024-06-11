import { useEffect, useState } from "react";

/** Redux */
import { connect } from "react-redux";
import * as surveysActions from "../../../redux/survey/actions";

/** Componentes */
import SurveyCard from "./components/surveyCard";

/** Context´s */
import { UseCurrentUser } from "../../../context/userContext";
import { UseSurveysContext } from "../../../context/surveysContext";

const { setCurrentSurvey, setSurveyResult } = surveysActions;

// Props that I found when the component it's called
interface Props {
  activity: any;
  setCurrentSurvey: any;
  setSurveyResult: any;
  currentUser: any;
  eventUser: any;
  showSurvey: any;
  surveyLabel: any;
  forceCheckVoted: any;
  loading: any;
  eventSurveys: any;
  publishedSurveys: any;
  listOfEventSurveys: any;
  loadingSurveys: any;
}

function SurveyList(props: any) {
  const cSurveys = UseSurveysContext();
  const { activity, setCurrentSurvey, setSurveyResult } = props;

  const currentUser = UseCurrentUser();
  
  // Invertir el orden del arreglo publishedSurveys
  const reversedSurveys = [...cSurveys.surveysToBeListedByActivity()].reverse();

  const handleClick = (currentSurvey: any) => {
    cSurveys.select_survey(currentSurvey);
  };

  return (
    <SurveyCard
      publishedSurveys={reversedSurveys}
      status={cSurveys.status}
      currentUser={currentUser}
      handleClick={handleClick}
      currentSurveyStatus={cSurveys.currentSurveyStatus}
    />
  );
}

const mapStateToProps = (state: any) => ({
  activity: state.stage.data.currentActivity,
});

const mapDispatchToProps = {
  setCurrentSurvey,
  setSurveyResult,
};

export default connect(mapStateToProps, mapDispatchToProps)(SurveyList);
