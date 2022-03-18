import React from 'react';
import { typeActivityData } from './constants/constants';
import { TypeActivityState } from './interfaces/interfaces';
import { TypeActivityAction } from './types/types';

export const initialState: TypeActivityState = {
  openModal: false,
  activityOptions: typeActivityData,
};

export const typeActivityReducer = (state: TypeActivityState, action: TypeActivityAction): TypeActivityState => {
  // console.log('🚀 debug ~ typeActivityReducer ~ action', action);
  console.log('🚀 debug ~ TYPE++++++++++++++', action.type);
  console.log('🚀 debug ~ typeActivityReducer ~ state', state);
  switch (action.type) {
    // case 'type':
    //   return {
    //     ...state,
    //     activityOptions: [...state.activityOptions, action.payload],
    //   };
    case 'toggleType':
      return {
        ...state,
        openModal: true,
        activityOptions: initialState.activityOptions,
      };
    case 'toggleProvider':
      return {
        ...state,
        openModal: true,
        activityOptions: initialState.activityOptions[action.payload.id],
      };

    case 'toggleOrigin':
      return {
        ...state,
        openModal: true,
        activityOptions: initialState.activityOptions[action.payload.id],
      };
    case 'toggleCloseModal':
      return {
        ...state,
        openModal: action.payload,
        activityOptions: initialState.activityOptions,
      };

    default:
      return state;
  }
};
