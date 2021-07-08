export const SET_VIRTUAL_CONFERENCE = 'SET_VIRTUAL_CONFERENCE'; //0x00
export const GET_VIRTUAL_CONFERENCE = 'GET_VIRTUAL_CONFERENCE'; //0x00

export const setVirtualConference = (view) => ({
  type: SET_VIRTUAL_CONFERENCE ,
  payload: view,
});

export const getVirtualConference = () => ({
  type: GET_VIRTUAL_CONFERENCE,
});
