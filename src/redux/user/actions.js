export const ADD_LOGIN_INFO = 'ADD_LOGIN_INFO';
export const SHOW_MENU = 'SHOW_MENU';
export const GET_USER = 'GET_USER';

const loginInformation = (data) => ({ type: ADD_LOGIN_INFO, data });

export function showMenu() {
  return { type: SHOW_MENU };
}

export const addLoginInformation = (data) => (dispatch) => {
  dispatch(loginInformation(data));
};

export const getUser = () => ({
  type: GET_USER,
});
