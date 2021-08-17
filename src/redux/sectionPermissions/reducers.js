import { SET_SECTION_PERMISSIONS, GET_SECTION_PERMISSIONS } from './actions';

const initialState = {
  view: false,
  loading: false,
  error: null,
  section: null,
  ticketview:false,
};

export default function viewSectionPermissions(state = initialState, action) {
  switch (action.type) {
    case SET_SECTION_PERMISSIONS:
      return {
        ...state,
        view: action.payload.view,
        section: action.payload.section,
        ticketview:action.payload.ticketview,
      };

    case GET_SECTION_PERMISSIONS:
      return {
        view: state.view,
        loading: true,
        error: null,
        section: state.section,
        ticketview:state.ticketview,
      };
    default:
      return state;
  }
}
