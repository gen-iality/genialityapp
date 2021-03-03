import { SET_NOTIFICATIONS } from './actions';

const initialState = {
  data: {
    message: null, //videconference, media, survey, game
    type: null,
  },
};

export default function notificationsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_NOTIFICATIONS:
      return {
        data: action.payload,
      };
    default:
      return state;
  }
}
