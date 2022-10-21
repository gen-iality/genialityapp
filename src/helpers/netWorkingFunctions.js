import { getUserByEmail } from '@components/networking/services';
import { EventsApi } from './request';
import { firestore } from './firebase';
import { GetTokenUserFirebase } from './HelperAuth';

export const SendFriendship = async ({ eventUserIdReceiver, userName }, userActual, event) => {
  const eventUserId = userActual._id;

  const currentUserName = userActual.names || userActual.email;
  const currentUser = await GetTokenUserFirebase();

  if (currentUser) {
    // Se valida si el usuario esta suscrito al curso
    if (eventUserId) {
      // Se usan los EventUserId
      const data = {
        id_user_requested: eventUserId,
        id_user_requesting: eventUserIdReceiver,
        user_name_requested: currentUserName,
        user_name_requesting: userName,
        event_id: event._id,
        state: 'send',
      };

      // Se ejecuta el servicio del api de evius
      try {
        const respInvitation = await EventsApi.sendInvitation(event._id, data);
        return respInvitation;
      } catch (err) {
        const { data } = err.response;
        return null;
      }
    } else {
      return null;
    }
  } else {
    return null;
  }
};

export const loadDataUser = async (user, event) => {
  const resp = await getUserByEmail(user, event._id);
  return resp;
};

export const addNotification = (notification, event, user) => {
  if (notification.emailEmited != null && notification.emailEmited) {
    firestore
      .collection('notificationUser')
      .doc(notification.idReceive)
      .collection('events')
      .doc(event._id)
      .collection('notifications')
      .doc(notification.idEmited)
      .set({
        emailEmited: notification.emailEmited,
        message: notification.message,
        name: notification.name,
        state: notification.state,
        type: notification.type,
      });
  } else {
    firestore
      .collection('notificationUser')
      .doc(user._id)
      .collection('events')
      .doc(event._id)
      .collection('notifications')
      .doc(notification.idEmited)
      .set(
        {
          state: notification.state,
        },
        { merge: true }
      );
  }
};

export const isMyContacts = (contact, listContacts) => {
  let resp = false;
  if (Array.isArray(listContacts)) {
    listContacts.map((contacts) => {
      if (contacts._id == contact.eventUserId) {
        resp = true;
        return;
      }
    })
  }
  return resp;
}

export const haveRequest = (user, listRequest, socialZone = 0) => {
  if (listRequest.length > 0) {
    const request = listRequest?.filter((userRequest) => socialZone == 0 ? userRequest.id_user_requesting == user?._id : userRequest?.id_user_requesting == user?.eventUserId);
    if (request.length > 0) {
      return true;
    }
    else {
      return false;
    }
  }
  return false;
}