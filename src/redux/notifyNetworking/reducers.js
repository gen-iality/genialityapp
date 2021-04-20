import { SET_NOTIFICATIONSN } from './actions';

const initialState = {
  data: {
    total: 0,
  },
};

export default function notificationsNetReducer(state = initialState, action) {
  switch (action.type) {
    case SET_NOTIFICATIONSN:
      return {
        data: action.payload,
      };
    default:
      return state;
  }
}
