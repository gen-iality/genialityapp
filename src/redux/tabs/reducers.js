import { SET_GENERAL_TABS, GET_GENERAL_TABS } from './actions';

const initialState = {
  generalTabs: {},
  loading: false,
  error: null,
};

export default function tabsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_GENERAL_TABS:
      return {
        ...state,
        generalTabs: action.payload,
        loading: true,
        error: null,
      };

    case GET_GENERAL_TABS:
      return {
        generalTabs: state.generalTabs,
        loading: true,
        error: null,
      };
    default:
      return state;
  }
}
