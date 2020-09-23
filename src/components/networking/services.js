import { sortBy, prop } from 'ramda';
import { firestore } from '../../helpers/firebase';
import API, { UsersApi, EventsApi } from '../../helpers/request';

const filterList = (list, currentUser) => list.find((item) => item.account_id === currentUser);

// Funcion para consultar la informacion del actual usuario -------------------------------------------
export const getCurrentUser = (token) => {
  return new Promise(async (resolve, reject) => {
    if (!token) {
      resolve('guestUser');
    } else {
      try {
        const resp = await API.get(`/auth/currentUser?evius_token=${token}`);
        if (resp.status === 200) {
          resolve(resp.data);
        }
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
    console.log('servicio de validacion de registro de usuario', currentEventUser);
    if (currentEventUser) resolve(currentEventUser);
    resolve(false);
  });
};

// User services
export const userRequest = {
  //   Obtiene la lista de los asistentes al evento -------------------------------------------
  getEventUserList: async (eventId, token) => {
    return new Promise((resolve) => {
      // Se obtiene el id del token recibido
      getCurrentUser(token).then(async (currentUser) => {
        let docs = [];
        const users = await UsersApi.getAll(eventId, '?pageSize=10000');

        if (!users) {
          resolve(docs);
        }

        docs = users.data.filter((user) => user.account_id !== currentUser._id);
        resolve(docs);
      });
    });
  }
};

export const getAgendasFromEventUser = (eventId, targetEventUserId) => {
  return new Promise((resolve, reject) => {
    firestore
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
            ...doc.data()
          });
        });

        resolve(data);
      })
      .catch(reject);
  });
};

export const createAgendaToEventUser = ({ eventId, currentEventUserId, targetEventUserId, timetableItem, message }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const existingAgendas = [];
      const existingAgendaResult = await firestore
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
          ...doc.data()
        });
      });

      if (existingAgendas.length > 0) {
        reject();
      } else {
        const newAgendaResult = await firestore
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
            message
          });
        // enviamos notificaciones por correo
        let data = {
          id_user_requested: targetEventUserId,
          id_user_requesting: currentEventUserId,
          request_id: newAgendaResult.id,
          user_name_requesting: 'Juan Carlos',
          event_id: eventId,
          state: 'send',
          request_type: 'meeting',
          start_time: new Date(timetableItem.timestamp_start).toLocaleTimeString()
        };

        EventsApi.sendMeetingRequest(eventId, data);

        resolve(newAgendaResult.id);
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const getPendingAgendasFromEventUser = (eventId, currentEventUserId) => {
  return new Promise((resolve, reject) => {
    firestore
      .collection('event_agendas')
      .doc(eventId)
      .collection('agendas')
      .where('attendees', 'array-contains', currentEventUserId)
      .where('request_status', '==', 'pending')
      .get()
      .then((result) => {
        const rawData = [];

        result.docs.forEach((doc) => {
          const newDataItem = { id: doc.id, ...doc.data() };

          if (newDataItem.owner_id !== currentEventUserId) {
            rawData.push(newDataItem);
          }
        });

        const data = sortBy(prop('timestamp_start'), rawData);
        resolve(data);
      })
      .catch(reject);
  });
};

export const getPendingAgendasSent = (eventId, currentEventUserId) => {
  return new Promise((resolve, reject) => {
    firestore
      .collection('event_agendas')
      .doc(eventId)
      .collection('agendas')
      .where('attendees', 'array-contains', currentEventUserId)
      .where('request_status', '==', 'pending')
      .get()
      .then((result) => {
        const rawData = [];

        result.docs.forEach((doc) => {
          const newDataItem = { id: doc.id, ...doc.data() };

          if (newDataItem.owner_id === currentEventUserId) {
            rawData.push(newDataItem);
          }
        });

        const data = sortBy(prop('timestamp_start'), rawData);
        resolve(data);
      })
      .catch(reject);
  });
};

export const getMeeting = (eventId, meeting_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await firestore
        .collection('event_agendas')
        .doc(eventId)
        .collection('agendas')
        .doc(meeting_id)
        .get();

      let meeting = result.data();
      resolve(meeting);
    } catch (error) {
      reject(error);
    }
  });
};

export const acceptOrRejectAgenda = (eventId, currentEventUserId, agenda, newStatus) => {
  const agendaId = agenda.id;
  const timestampStart = agenda.timestamp_start;
  const timestampEnd = agenda.timestamp_end;

  return new Promise(async (resolve, reject) => {
    try {
      const existingAgendaResult = await firestore
        .collection('event_agendas')
        .doc(eventId)
        .collection('agendas')
        .doc(agendaId)
        .get();
      const acceptedAgendasAtSameTimeResult = await firestore
        .collection('event_agendas')
        .doc(eventId)
        .collection('agendas')
        .where('attendees', 'array-contains', currentEventUserId)
        .where('request_status', '==', 'accepted')
        .where('timestamp_start', '==', timestampStart)
        .where('timestamp_end', '==', timestampEnd)
        .get();
      const acceptedAgendasAtSameTime = [];
      const existingAgenda = existingAgendaResult.data();

      acceptedAgendasAtSameTimeResult.docs.forEach((doc) => {
        const newDataItem = {
          id: doc.id,
          ...doc.data()
        };

        if (newDataItem.owner_id !== currentEventUserId) {
          acceptedAgendasAtSameTime.push(newDataItem);
        }
      });

      if (!existingAgenda || existingAgenda.request_status !== 'pending') {
        reject();
      } else if (newStatus === 'accepted' && acceptedAgendasAtSameTime.length > 0) {
        reject('HOURS_NOT_AVAILABLE');
      } else {
        await firestore
          .collection('event_agendas')
          .doc(eventId)
          .collection('agendas')
          .doc(agendaId)
          .update({ request_status: newStatus });
        resolve();
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const getAcceptedAgendasFromEventUser = (eventId, currentEventUserId) => {
  return new Promise((resolve, reject) => {
    firestore
      .collection('event_agendas')
      .doc(eventId)
      .collection('agendas')
      .where('attendees', 'array-contains', currentEventUserId)
      .where('request_status', '==', 'accepted')
      .get()
      .then((result) => {
        const rawData = [];

        result.docs.forEach((doc) => {
          const newDataItem = {
            id: doc.id,
            ...doc.data()
          };

          if (newDataItem.type !== 'reserved') {
            rawData.push(newDataItem);
          }
        });

        const data = sortBy(prop('timestamp_start'), rawData);
        resolve(data);
      })
      .catch(reject);
  });
};

export const deleteAgenda = (eventId, agendaId) => {
  return new Promise((resolve, reject) => {
    firestore
      .collection('event_agendas')
      .doc(eventId)
      .collection('agendas')
      .doc(agendaId)
      .delete()
      .then(resolve)
      .catch(reject);
  });
};
