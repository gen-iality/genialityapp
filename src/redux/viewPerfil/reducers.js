import { SET_VIEW_PERFIL, GET_VIEW_PERFIL } from './actions';

const initialState = {
  view: false,
  loading: false,
  error: null,
  perfil: null,
};

export default function viewPerfilReducer(state = initialState, action) {
  switch (action.type) {
    case SET_VIEW_PERFIL:
      return {
        ...state,
        view: action.payload.view,
        perfil: action.payload.perfil,
      };

    case GET_VIEW_PERFIL:
      return {
        view: state.view,
        loading: true,
        error: null,
        pefil: state.pefil,
      };
    default:
      return state;
  }
}
