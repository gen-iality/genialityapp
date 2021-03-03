export const SET_NOTIFICATIONS = 'SET_NOTIFICATION';

export const setNotification = (message) => ({
  type: SET_NOTIFICATIONS,
  payload: message,
});
