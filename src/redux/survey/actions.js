export const SET_CURRENT_SURVEY = 'SET_CURRENT_SURVEY';

export const setCurrentSurvey = (survey) => ({
  type: SET_CURRENT_SURVEY,
  payload: survey,
});
