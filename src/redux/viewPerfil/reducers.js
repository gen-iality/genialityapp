import { SET_VIEW_PERFIL, GET_VIEW_PERFIL } from './actions';

const initialState = {
  view: true,
  loading: false,
  error: null,
};

export default function viewPerfilReducer(state = initialState, action) {
  switch (action.type) {
    case SET_VIEW_PERFIL:
      return {
        ...state,
        view:action.payload 
       }  

    case GET_VIEW_PERFIL:
      return {
        view: state.view,
        loading: true,
        error: null,
      };
    default:
      return state;
  }
}
