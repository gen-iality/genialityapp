import { SET_VIRTUAL_CONFERENCE, GET_VIRTUAL_CONFERENCE } from './actions';

const initialState = {
  view: true,
  loading: false,
  error: null,
};

export default function virtualConferenceReducer(state = initialState, action) {
  switch (action.type) {
    case SET_VIRTUAL_CONFERENCE:
      return {
        ...state,
        view: action.payload,
      };

    case GET_VIRTUAL_CONFERENCE:
      return {
        view: state.view,
        loading: true,
        error: null,
      };
    default:
      return state;
  }
}
