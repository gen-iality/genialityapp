import { useState } from 'react';
import { HelperState } from './interfaces/interfaces';
import { HelperAction } from './types/types';

export const helperInitialState: HelperState = {
  reloadTemplatesCms: false,
  tabsGenerals: {},
  currentAuthScreen: 'login',
  controllerLoginVisible: { visible: false, idOrganization: '', organization: '', logo: '' },
  currentActivity: null,
};

export const helperReducer = (state: HelperState, action: HelperAction) => {
  console.log(`🚀 REDUCER ACTION ${action?.type}`, action);

  switch (action.type) {
    case 'reloadTemplatesCms':
      return {
        ...state,
        reloadTemplatesCms: true,
      };

    case 'changeTabs':
      return {
        ...state,
        tabsGenerals: action.tabs,
      };

    case 'showLogin':
      return {
        ...state,
        currentAuthScreen: 'login',
        controllerLoginVisible: {
          visible: action?.visible,
          idOrganization: action.idOrganization,
          organization: action.organization,
          logo: action.logo,
        },
      };

    case 'showRegister':
      return {
        ...state,
        currentAuthScreen: 'register',
        controllerLoginVisible: {
          visible: action?.visible,
          idOrganization: action.idOrganization,
          organization: action.organization,
          logo: action.logo,
        },
      };

    case 'currentActivity':
      return {
        ...state,
        currentActivity: action.currentActivity,
      };

    //   case 'selectLiveBroadcast':
    //     return {
    //       ...state,
    //     };

    default:
      console.log('🚀 FUERA DEL REDUCER');
      return state;
  }
};
