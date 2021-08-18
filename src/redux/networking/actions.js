export const SET_SPACE_NETWORKING = 'SET_SPACE_NETWORKING'; //0x00
export const GET_SPACE_NETWORKING = 'GET_SPACE_NETWORKING';
export const SET_USER_AGENDA = 'SET_USER_AGENDA';
export const GET_USER_AGENDA = 'GET_USER_AGENDA'; //0x00

export const setSpaceNetworking = (view) => ({
  type: SET_SPACE_NETWORKING,
  payload: view,
});

export const getSpaceNetworking = () => ({
  type: GET_SPACE_NETWORKING,
});

export const setUserAgenda = (user) => ({
  type: SET_USER_AGENDA,
  payload: user,
});

export const getUserAgeda = () => ({
  type: GET_USER_AGENDA,

});
