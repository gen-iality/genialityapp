export const SET_TOP_BANNER = 'SET_TOP_BANNER'; //0x00
export const GET_TOP_BANNER = 'GET_TOP_BANNER '; //0x00

export const setTopBanner = (view) => ({
  type: SET_TOP_BANNER ,
  payload: view,
});

export const getTopBanner = () => ({
  type: GET_TOP_BANNER,
});
