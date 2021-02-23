export const SET_SURVEY_DATA = 'SET_SURVEY_DATA';

export const setStageData = (survey) => ({
  type: SET_SURVEY_DATA,
  payload: survey,
});
