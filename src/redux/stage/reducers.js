import { SET_STAGE_DATA, GO_TO_ACTIVITY, SET_MAIN_STAGE, SET_TABS } from './actions';

const initialState = {
  data: {
    mainStage: null, //videconference, media, survey, game
    currentActivity: null,
    collapsed: null,
    tabSelected: -1,
    tabs: {
      chat: true,
      atteendes: true,
      surveys: true,
      games: true,
    },
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

    case SET_MAIN_STAGE:
      return {
        ...state,
        data: { ...state.data, mainStage: action.payload },
        loading: true,
        error: null,
      };
    case SET_TABS:
      return {
        ...state,
        data: { ...state.data, tabs: action.payload },
        loading: true,
        error: null,
      };

    default:
      return state;
  }
}
