import { log10 } from 'core-js/fn/number';

export const SET_LANGUAGE = 'SET_LANGUAGE'; //0x00

export const setEventData = (language) => ({
  type: SET_LANGUAGE,
  payload: language,
});
