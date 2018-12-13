export const ADD_LOGIN_INFO     = "ADD_LOGIN_INFO";

const loginInformation = (data) => ({
    type: ADD_LOGIN_INFO,
    data
});

export const addLoginInformation = (data) => (dispatch) => {
    dispatch(loginInformation(data));
};