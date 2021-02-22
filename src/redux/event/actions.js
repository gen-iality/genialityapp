export const SET_EVENT_DATA = 'SET_EVENT_DATA';
export const GET_EVENT_DATA = 'GET_EVENT_DATA';

export const setEventData = (event) => ({
  type: SET_EVENT_DATA,
  payload: event,
});

export const getEventData = () => ({
  type: SET_EVENT_DATA,
});
