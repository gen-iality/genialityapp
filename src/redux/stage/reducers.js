import { SET_STAGE_DATA } from './actions';

const initialState = {
  data: {},
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

    default:
      return state;
  }
}
