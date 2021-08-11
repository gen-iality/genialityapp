export const SET_CURRENT_SURVEY = 'SET_CURRENT_SURVEY';
export const UNSET_CURRENT_SURVEY = 'UNSET_CURRENT_SURVEY';
export const SET_SURVEY_VISIBLE = 'SET_SURVEY_VISIBLE';
export const SET_HAS_OPEN_SURVEYS = 'SET_HAS_OPEN_SURVEYS';
export const GET_CURRENT_SURVEY="GET_CURRENT_SURVEY";
export const SET_SURVEY_RESULT="SET_SURVEY_RESULT";
export const SET_CURRENT_SURVEY_STATUS="SET_CURRENT_SURVEY_STATUS";

export const setCurrentSurvey = (survey) => ({
  type: SET_CURRENT_SURVEY,
  payload: survey,
});

export const setCurrentSurveyStatus = (surveyStatus) => ({
  type: SET_CURRENT_SURVEY_STATUS,
  payload: surveyStatus,
});

export const unsetCurrentSurvey = () => ({
  type: UNSET_CURRENT_SURVEY,
});

export const setSurveyVisible = (isVisible) => ({
  type: SET_SURVEY_VISIBLE,
  payload: isVisible,
});

export const setSurveyResult = (result) => ({
  type: SET_SURVEY_RESULT,
  payload: result,
});

export const setHasOpenSurveys = (hasOpen) => ({
  type: SET_HAS_OPEN_SURVEYS,
  payload: hasOpen,
});

export const currentSurvey= () => ({
  type: GET_CURRENT_SURVEY 
});
