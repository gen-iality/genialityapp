import { getUserByEmail } from '../components/networking/services';
import * as Cookie from 'js-cookie';
import { EventsApi } from './request';
import { firestore } from './firebase';

export const SendFriendship = async ({ eventUserIdReceiver, userName }, userActual, event) => {
  let eventUserId = userActual._id;

  let currentUserName = userActual.names || userActual.email;
  let currentUser = Cookie.get('evius_token');

  if (currentUser) {
    // Se valida si el usuario esta suscrito al evento
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
        var respInvitation = await EventsApi.sendInvitation(event._id, data);
        console.log("RESP INVITATION==>",respInvitation )
        return respInvitation;
      } catch (err) {
        let { data } = err.response;
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
 // console.log("EMAIL EMITED==>",notification.emailEmited)
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

/* SUCCESS
 notification.open({
    message: 'Solicitud enviada',
    description:
      'Le llegará un correo a la persona notificandole la solicitud, quién la aceptara o recharaza. Una vez la haya aceptado te llegará un correo confirmando y podrás regresar a esta misma sección en mis contactos a ver la información completa del nuevo contacto.',
    icon: <SmileOutlined style={{ color: '#108ee9' }} />,
    duration: 30,
  });

   message.warning('Para enviar la solicitud es necesario iniciar sesión');*/
