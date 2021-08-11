import { SET_CURRENT_SURVEY, UNSET_CURRENT_SURVEY, SET_SURVEY_VISIBLE, SET_HAS_OPEN_SURVEYS,GET_CURRENT_SURVEY, SET_SURVEY_RESULT, SET_CURRENT_SURVEY_STATUS } from './actions';

const initialState = {
  data: {
    currentSurvey: null,
    currentSurveyStatus: null,
    surveyVisible: false,
    result: 'view',
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

    case SET_CURRENT_SURVEY_STATUS:
      return {
        ...state,
        data: { ...state.data, currentSurveyStatus: action.payload },
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
    case SET_SURVEY_RESULT:
      return {
        ...state,
        data: { ...state.data, result: action.payload },
        loading: true,
        error: null,
      };

    case SET_HAS_OPEN_SURVEYS:
      return {
        ...state,
        data: { ...state.data, hasOpenSurveys: action.payload },
      };
      case GET_CURRENT_SURVEY:
      return {
        currentSurvey: state.currentSurvey,
        loading: state.loading,
        error: null,
      };

    default:
      return state;
  }
}
