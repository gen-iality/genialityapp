import { SET_CURRENT_SURVEY, UNSET_CURRENT_SURVEY, SET_SURVEY_VISIBLE, SET_HAS_OPEN_SURVEYS } from './actions';

const initialState = {
  data: {
    currentSurvey: null,
    surveyVisible: false,
    hasOpenSurveys: false,
  },
  loading: false,
  error: null,
};

export default function eventReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_SURVEY:
      return {
        ...state,
        data: { ...state.data, currentSurvey: action.payload },
        loading: true,
        error: null,
      };
    case UNSET_CURRENT_SURVEY:
      return {
        ...state,
        data: { ...state.data, currentSurvey: null },
        loading: true,
        error: null,
      };

    case SET_SURVEY_VISIBLE:
      return {
        ...state,
        data: { ...state.data, surveyVisible: action.payload },
        loading: true,
        error: null,
      };

    case SET_HAS_OPEN_SURVEYS:
      return {
        ...state,
        data: { ...state.data, hasOpenSurveys: action.payload },
      };

    default:
      return state;
  }
}
