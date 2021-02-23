import { SET_STAGE_DATA, GO_TO_ACTIVITY } from './actions';

const initialState = {
  data: {
    mainStage: null,
    currentActivity: null,
    collapsed: null,
    tabSelected: -1,
  },
  loading: false,
  error: null,
};

export default function stagesReducer(state = initialState, action) {
  switch (action.type) {
    case SET_STAGE_DATA:
      return {
        ...state,
        data: action.payload,
        loading: true,
        error: null,
      };
    case GO_TO_ACTIVITY:
      return {
        ...state,
        data: { ...state.data, currentActivity: action.payload },
        loading: true,
        error: null,
      };

    default:
      return state;
  }
}
