import { SET_CURRENT_SURVEY, UNSET_CURRENT_SURVEY } from './actions';

const initialState = {
  data: {
    currentSurvey: null,
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

    default:
      return state;
  }
}
