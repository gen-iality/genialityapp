export const SET_CURRENT_SURVEY = 'SET_CURRENT_SURVEY';
export const UNSET_CURRENT_SURVEY = 'UNSET_CURRENT_SURVEY';
export const SET_SURVEY_VISIBLE = 'SET_SURVEY_VISIBLE';
export const SET_HAS_OPEN_SURVEYS = 'SET_HAS_OPEN_SURVEYS';

export const setCurrentSurvey = (survey) => ({
  type: SET_CURRENT_SURVEY,
  payload: survey,
});

export const unsetCurrentSurvey = () => ({
  type: UNSET_CURRENT_SURVEY,
});

export const setSurveyVisible = (isVisible) => ({
  type: SET_SURVEY_VISIBLE,
  payload: isVisible,
});

export const setHasOpenSurveys = (hasOpen) => ({
  type: SET_HAS_OPEN_SURVEYS,
  payload: hasOpen,
});
