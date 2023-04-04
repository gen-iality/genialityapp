import { sortBy, prop } from 'ramda';
import { firestore } from '../../helpers/firebase';
import API, { UsersApi, EventsApi } from '../../helpers/request';
import { RequestMeetingState, shortName } from './utils/utils';

const filterList = (list, currentUser) => list.find((item) => item.account_id === currentUser);

// Funcion para consultar la informacion del actual usuario -------------------------------------------
export const getCurrentUser = (token) => {
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
    (async () => {
      if (!token) {
        resolve('guestUser');
      } else {
        try {
          const resp = await API.get(`/auth/currentUser`);
          if (resp.status === 200) {
            resolve(resp.data);
          }
        } catch (error) {
          const { status } = error.response;
          console.error('STATUS', status, status === 401);
        }
      }
    })();
  });
};

// Funcion que obtiene el eventUserId del usuario actual
export const getCurrentEventUser = (eventId, userId) => {
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
    (async () => {
      const users = await UsersApi.getAll(eventId, '?pageSize=10000');

      let currentEventUser = filterList(users.data, userId);

      if (currentEventUser) resolve(currentEventUser);
      resolve(false);
    })();
  });
};

// User services
export const userRequest = {
  //   Obtiene la lista de los asistentes al evento -------------------------------------------
  getEventUserList: async (eventId, token, currentUser) => {
    let docs = null;
    if (!currentUser) return null;
    try {
      const users = await UsersApi.getAll(eventId, '?pageSize=10000');

      if (users && currentUser) {
        docs = users.data.filter((user) => user && user.account_id !== currentUser._id);
      }
    } catch (error) {
      console.error(error);
    }
    return docs;
  },
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
            ...doc.data(),
          });
        });

        resolve(data);
      })
      .catch(reject);
  });
};

export const createAgendaToEventUser = ({
  eventId,
  eventUser,
  currentEventUserId,
  targetEventUserId,
  targetEventUser,
  timetableItem,
  message,
}) => {
  return new Promise((resolve, reject) => {
    (async () => {
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
            ...doc.data(),
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
              name: targetEventUser ? targetEventUser.properties.names : '',
              email: targetEventUser ? targetEventUser.properties.email : '',
              name_requesting: eventUser ? eventUser.properties.names : '',
              email_requesting: eventUser ? eventUser.properties.email : '',
              nuevapropiedad: 'asdfa',
              attendees: [ currentEventUserId, targetEventUserId ],
              owner_id: currentEventUserId,
              request_status: 'pending',
              type: 'meeting',
              timestamp_start: timetableItem.timestamp_start,
              timestamp_end: timetableItem.timestamp_end,
              message,
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
            start_time: new Date(timetableItem.timestamp_start).toLocaleTimeString(),
          };

          EventsApi.sendMeetingRequest(eventId, data);

          resolve(newAgendaResult.id);
        }
      } catch (error) {
        reject(error);
      }
    })();
  });
};
/**
 * Crea una solicitud de reunión.
 * @param {Object} params - Los parámetros para crear la solicitud de reunión.
 * @param {string} params.eventId - El identificador del evento.
 * @param {string} params.targetUser - El identificador del usuario objetivo de la reunión.
 * @param {string} params.message - El mensaje asociado con la solicitud de reunión.
 * @param {string} params.creatorUser - El identificador del usuario creador de la reunión.
 * @param {string} params.typeAttendace
 * @param {Date} params.startDate - La fecha y hora de inicio de la reunión.
 * @param {Date} params.endDate - La fecha y hora de finalización de la reunión.
 */
export const createMeetingRequest = ({
  eventId,
  targetUser,
  creatorUser,
  message,
  typeAttendace,
  startDate,
  endDate,
}) => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
       //Crear solicitud sin importar las solicitudes existentes
       const participants = [
         {
           id: creatorUser.value.user._id,
           name: creatorUser.value.user.names,
           email: creatorUser.value.user.email || '',
           attendance: typeAttendace.unconfirmed,
          },
          {
            id: targetUser.user._id,
            name: targetUser.user.names,
            email: targetUser.user.email || '',
            attendance: typeAttendace.unconfirmed,
          },
        ];
       
        const meeting = {
          name: `Reunion entre ${shortName(targetUser.user.names)} y ${shortName(creatorUser.value.user.names)} `,
          participants: participants,
          place: 'evius meet',
          start: startDate,
          end: endDate,
          dateUpdated: Date.now(),
        };
        
        const requestMeenting={
          user_to : {
            id : targetUser.user._id,
            name : targetUser.user.names,
            email : targetUser.user.email || ''
          },
          user_from : {
            id : creatorUser.value.user._id,
            name : creatorUser.value.user.names,
            email :creatorUser.value.user.email || ''
          },
          meeting,
          date:startDate,
          message,
          status:RequestMeetingState.pending
        }
        const newAgendaResult = await firestore
        .collection('networkingByEventId')
        .doc(eventId)
        .collection('meeting_request')
        .add(requestMeenting);
        // enviamos notificaciones por correo
        let data = {
          id_user_requested: requestMeenting.to,
          id_user_requesting: requestMeenting.from,
      request_id: newAgendaResult.id,
      user_name_requesting: 'Juan Carlos',
      event_id: eventId,
      state: 'send',
      request_type: 'meeting',
      start_time: new Date(startDate).toLocaleTimeString(),
    };
    //todo: Arreglar not found de sendEmail
    await EventsApi.sendMeetingRequest(eventId, data);
     resolve(newAgendaResult.id);
      } catch (error) {
        reject(error);
      }
    })();
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
  return new Promise((resolve, reject) => {
    (async () => {
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
    })();
  });
};

export const acceptOrRejectAgenda = (eventId, currentEventUserId, agenda, newStatus) => {
  const agendaId = agenda.id;
  const timestampStart = agenda.timestamp_start;
  const timestampEnd = agenda.timestamp_end;

  return new Promise((resolve, reject) => {
    (async () => {
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
            ...doc.data(),
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
          //ENVIO DE CORREOS
          let status = newStatus == 'accepted' ? 'accept' : 'reject';
          EventsApi.acceptOrRejectRequest(eventId, agendaId, status);
          //console.log("RESPUESTA_MAIL==>", respuesta);
          resolve();
        }
      } catch (error) {
        reject(error);
      }
    })();
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
            ...doc.data(),
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

//METODO QUE OBTIENE EL USUARIO A PARTIR DEL EMAIL Y LO DEVUELVE CON EL EVENTUSER_ID
export const getUserByEmail = async (user, eventid) => {
  try {
    const userByEmail = await UsersApi.findByEmail(user.email);
    let datauser;
    if (userByEmail[ 0 ]) {
      datauser = await getUserEvent(userByEmail[ 0 ]._id, eventid);
    } else {
      datauser = await getUserEvent(user._id, eventid);
    }
    datauser = { ...datauser, userEvent: datauser._id };
    return datauser;
  } catch (error) {
    return null;
  }
};

// OBTENER USUARIO A PARTIR DEL ACCOUNT ID
export const getUserEvent = async (id, eventid) => {
  const dataUser = await UsersApi.getAll(eventid, `?filtered=[{"field":"account_id","value":"${id}"}]`);
  let user = dataUser.data.filter((u) => u.account_id && u.account_id.trim() == id.trim())[ 0 ];
  return user;
};

// OBTENER USUARIO A PARTIR DEL CORREO
export const getUserEventbyEmail = async (email, eventid) => {
  const dataUser = await UsersApi.findByEmail(eventid, `?filtered=[{"field":"email","value":"${email}"}]`);
  // let user = dataUser.data.filter((u) => u.email && u.email.trim() == email.trim())[0];
  return dataUser;
};

// OBTENER USUARIO A PARTIR DEL EVENTUSER_ID
export const getUsersId = async (id, eventid) => {
  const dataUser = await UsersApi.getOne(eventid,id)
  return dataUser; 
};

/*export const getUserByEventUser = async (eventuser, eventid) => {
  
  
  const levu = await UsersApi.getAll(eventid);
  const user = await levu.data.filter((u) => u.user != null && u._id === eventuser)[0];
  return user;
};*/
