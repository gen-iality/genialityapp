export const SET_CURRENT_SURVEY = 'SET_CURRENT_SURVEY';
export const UNSET_CURRENT_SURVEY = 'UNSET_CURRENT_SURVEY';

export const setCurrentSurvey = (survey) => ({
  type: SET_CURRENT_SURVEY,
  payload: survey,
});

export const unsetCurrentSurvey = () => ({
  type: UNSET_CURRENT_SURVEY,
});
