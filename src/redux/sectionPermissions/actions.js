export const SET_SECTION_PERMISSIONS = 'SET_SECTION_PERMISSIONS'; //0x00
export const GET_SECTION_PERMISSIONS = 'GET_SECTION_PERMISSIONS'; //0x00

export const setSectionPermissions = (view) => ({
  type: SET_SECTION_PERMISSIONS,
  payload: view,
});

export const getSectionPermissions = () => ({
  type: GET_SECTION_PERMISSIONS,
});
