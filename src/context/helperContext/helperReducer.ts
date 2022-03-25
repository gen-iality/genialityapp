import { HelperState } from './interfaces/interfaces';
import { HelperAction } from './types/types';

export const helperInitialState: HelperState = {
  helperOptions: {},
};

export const helperReducer = (state: HelperState, action: HelperAction): HelperState => {
  console.log('🚀 REDUCER ACTIONTYPE ', action.type);

  return { ...state };
  // switch (action.type) {
  //   case 'type':
  //     return {
  //       ...state,
  //     };

  //   case 'toggleType':
  //     return {
  //       ...state,
  //     };

  //   case 'selectLiveBroadcast':
  //     return {
  //       ...state,
  //     };

  //   default:
  //     console.log('🚀 FUERA DEL REDUCER');
  //     break;
  // }
};
