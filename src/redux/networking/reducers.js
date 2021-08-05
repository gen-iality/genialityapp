import { SET_SPACE_NETWORKING, GET_SPACE_NETWORKING } from './actions';

const initialState = {
  view: true,
  loading: false,
  error: null,
};

export default function spaceNetworkingReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SPACE_NETWORKING:
      return {
        ...state,
        view: action.payload,
      };

    case GET_SPACE_NETWORKING:
      return {
        view: state.view,
        loading: true,
        error: null,
      };
    default:
      return state;
  }
}
