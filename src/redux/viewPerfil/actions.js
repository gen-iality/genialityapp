export const SET_VIEW_PERFIL = 'SET_VIEW_PERFIL'; //0x00
export const GET_VIEW_PERFIL= 'GET_VIEW_PERFIL'; //0x00

export const setViewPerfil = (view) => ({
  type: SET_VIEW_PERFIL ,
  payload: view,
});

export const getViewPerfil = () => ({
  type: GET_VIEW_PERFIL,
});
