// TODO: -> change andresFirestore to firestore
import { andresFirestore } from '../../helpers/firebase';
import API, { UsersApi } from '../../helpers/request';

const refUsersRequests = (eventId) => `${eventId}_users_requests`;
const refUsersList = (eventId) => `${eventId}_event_attendees`;

const filterList = (list, currentUser) => list.find((item) => item.account_id == currentUser);

// Funcion para consultar la informacion del actual usuario -------------------------------------------
export const getCurrentUser = (token) => {
  return new Promise(async (resolve, reject) => {
    if (!token) {
      resolve('guestUser');
    } else {
      try {
        const resp = await API.get(`/auth/currentUser?evius_token=${token}`);
        if (resp.status === 200) resolve(resp.data);
      } catch (error) {
        const { status } = error.response;
        console.log('STATUS', status, status === 401);
      }
    }
  });
};

// Funcion que obtiene el eventUserId del usuario actual
export const getCurrentEventUser = (eventId, userId) => {
  return new Promise(async (resolve, reject) => {
    const users = await UsersApi.getAll(eventId, '?pageSize=10000');
    let currentEventUser = filterList(users.data, userId);

    if (currentEventUser) resolve(currentEventUser);
    resolve(false);
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
        const users = await UsersApi.getAll(eventId, '?pageSize=10000');

        if (!users) {
          resolve(docs);
        }

        docs = users.data.filter((user) => user.account_id != currentUser._id);
        resolve(docs);
      });
    });
  },
};

export const getAgendasFromEventUser = (eventId, targetEventUserId) => {
  return new Promise((resolve, reject) => {
    andresFirestore
      .collection('event_agendas')
      .doc(eventId)
      .collection('agendas')
      .where('attendees', 'array-contains', targetEventUserId)
      .get()
      .then((result) => {
        const data = [];

        result.docs.forEach((doc) => {
          data.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        resolve(data);
      })
      .catch(reject);
  });
};

export const createAgendaToEventUser = ({ eventId, currentEventUserId, targetEventUserId, timetableItem }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const existingAgendas = [];
      const existingAgendaResult = await andresFirestore
        .collection('event_agendas')
        .doc(eventId)
        .collection('agendas')
        .where('attendees', 'array-contains', targetEventUserId)
        .where('timestamp_start', '==', timetableItem.timestamp_start)
        .where('timestamp_end', '==', timetableItem.timestamp_end)
        .where('request_status', '==', 'accepted')
        .get();

      existingAgendaResult.docs.forEach((doc) => {
        existingAgendas.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      if (existingAgendas.length > 0) {
        reject();
      } else {
        const newAgendaResult = await andresFirestore
          .collection('event_agendas')
          .doc(eventId)
          .collection('agendas')
          .add({
            name: '',
            attendees: [currentEventUserId, targetEventUserId],
            owner_id: currentEventUserId,
            request_status: 'pending',
            type: 'meeting',
            timestamp_start: timetableItem.timestamp_start,
            timestamp_end: timetableItem.timestamp_end,
          });
        resolve(newAgendaResult.id);
      }
    } catch (error) {
      reject(error);
    }
  });
};
