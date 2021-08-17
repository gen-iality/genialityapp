import { SET_SECTION_PERMISSIONS, GET_SECTION_PERMISSIONS } from './actions';

const initialState = {
  view: false,
  loading: false,
  error: null,
  section: null,
};

export default function viewSectionPermissions(state = initialState, action) {
  switch (action.type) {
    case SET_SECTION_PERMISSIONS:
      return {
        ...state,
        view: action.payload.view,
        section: action.payload.section,
      };

    case GET_SECTION_PERMISSIONS:
      return {
        view: state.view,
        loading: true,
        error: null,
        section: state.section,
      };
    default:
      return state;
  }
}
