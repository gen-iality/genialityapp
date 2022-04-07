import { useState } from 'react';
import { HelperState } from './interfaces/interfaces';
import { HelperAction } from './types/types';

export const helperInitialState: HelperState = {
  reloadTemplatesCms: false,
  tabsGenerals: {},
  currentAuthScreen: 'login',
};

export const helperReducer = (state: HelperState, action: HelperAction) => {
  console.log('🚀 REDUCER ACTION', action);
  console.log('🚀 REDUCER ACTIONTYPE ', action.type);

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
      return { ...state, currentAuthScreen: 'login' };

    case 'showRegister':
      return { ...state, currentAuthScreen: 'register' };

    //   case 'selectLiveBroadcast':
    //     return {
    //       ...state,
    //     };

    default:
      console.log('🚀 FUERA DEL REDUCER');
      return state;
  }
};
