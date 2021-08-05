export const SET_SPACE_NETWORKING = 'SET_SPACE_NETWORKING'; //0x00
export const GET_SPACE_NETWORKING = 'GET_SPACE_NETWORKING'; //0x00

export const setSpaceNetworking = (view) => ({
  type: SET_SPACE_NETWORKING,
  payload: view,
});

export const getSpaceNetworking = () => ({
  type: GET_SPACE_NETWORKING,
});
