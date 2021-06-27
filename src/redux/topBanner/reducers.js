import { SET_TOP_BANNER, GET_TOP_BANNER } from './actions';

const initialState = {
  view: true,
  loading: false,
  error: null,
};

export default function topBannerReducer(state = initialState, action) {
  switch (action.type) {
    case SET_TOP_BANNER:
      return {
        ...state,
        view:action.payload 
       }  

    case GET_TOP_BANNER:
      return {
        view: state.view,
        loading: true,
        error: null,
      };
    default:
      return state;
  }
}
