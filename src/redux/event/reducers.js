import { SET_EVENT_DATA } from './actions';

const initialState = {
  data: {},
  loading: false,
  error: null,
};

export default function eventsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_EVENT_DATA:
      return {
        ...state,
        data: action.payload,
        loading: true,
        error: null,
      };

    default:
      return state;
  }
}
