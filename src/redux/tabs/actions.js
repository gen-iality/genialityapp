export const SET_GENERAL_TABS = 'SET_GENERAL_TABS'; //0x00
export const GET_GENERAL_TABS = 'GET_GENERAL_TABS'; //0x00

export const setGeneralTabs = (tabs) => ({
  type: SET_GENERAL_TABS,
  payload: tabs,
});

export const getGeneralTabs = () => ({
  type: GET_GENERAL_TABS,
});
