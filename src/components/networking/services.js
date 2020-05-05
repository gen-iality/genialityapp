import { firestore } from "../../helpers/firebase";
import API, { UsersApi } from "../../helpers/request";

const refUsersRequests = (eventId) => `${eventId}_users_requests`;
const refUsersList = (eventId) => `${eventId}_event_attendees`;

const filterList = (list, currentUser) => list.find((item) => item.account_id == currentUser);

// Funcion para consultar la informacion del actual usuario -------------------------------------------
export const getCurrentUser = (token) => {
  return new Promise(async (resolve, reject) => {
    if (!token) {
      resolve("guestUser");
    } else {
      try {
        const resp = await API.get(`/auth/currentUser?evius_token=${token}`);
        if (resp.status === 200) resolve(resp.data);
      } catch (error) {
        const { status } = error.response;
        console.log("STATUS", status, status === 401);
      }
    }
  });
};

// Funcion que obtiene el eventUserId del usuario actual
export const getCurrentEventUser = (eventId, userId) => {
  return new Promise(async (resolve, reject) => {
    const users = await UsersApi.getAll(eventId, "?pageSize=10000");
    resolve(filterList(users.data, userId));
  });
};

// User services
export const userRequest = {
  //   Obtiene la lista de los asistentes al evento -------------------------------------------
  getEventUserList: async (eventId, token) => {
    let refEventUser = refUsersList(eventId);

    return new Promise((resolve, reject) => {
      // Se obtiene el id del token recibido
      getCurrentUser(token).then(async (currentUser) => {
        let docs = [];
        const users = await UsersApi.getAll(eventId, "?pageSize=10000");

        if (!users) {
          resolve(docs);
        }

        docs = users.data.filter((user) => user.account_id != currentUser._id);
        resolve(docs);
      });
    });
  },
};
