import { SET_SURVEY_LIST } from './actions';

const initialState = {
  data: {
    publishedSurveys: [],
  },
  loading: false,
  error: null,
};

export default function stagesReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SURVEY_LIST:
      return {
        ...state,
        data: { ...state.data, publishedSurveys: action.payload },
        loading: true,
        error: null,
      };

    default:
      return state;
  }
}
