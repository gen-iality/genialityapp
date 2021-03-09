export const SET_STAGE_DATA = 'SET_STAGE_DATA';
export const GO_TO_ACTIVITY = 'GO_TO_ACTIVITY';
export const SET_MAIN_STAGE = 'SET_MAIN_STAGE';
export const SET_TABS = 'SET_TABS';

export const setStageData = (stage) => ({
  type: SET_STAGE_DATA,
  payload: stage,
});

export const gotoActivity = (activity) => ({
  type: GO_TO_ACTIVITY,
  payload: activity,
});

export const setMainStage = (mainStage) => ({
  type: SET_MAIN_STAGE,
  payload: mainStage,
});

export const setActiveTab = (tab) => ({
  type: SET_MAIN_STAGE,
  payload: tab,
});

export const setTabs = (tabs) => ({
  type: SET_TABS,
  payload: tabs,
});
