import { data } from 'jquery';
import { SET_LANGUAGE } from './actions';

const initialState = {
  data: {
    language: 'es',
  },
  loading: false,
  error: null,
};

export default function eventsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_LANGUAGE:
      return {
        ...state,
        data: { ...data, language: action.payload },
        loading: true,
        error: null,
      };

    default:
      return state;
  }
}
