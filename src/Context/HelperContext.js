import React, { createContext, useEffect } from 'react';
import { useState } from 'react';
import { firestore } from '../helpers/firebase';
import { AgendaApi,EventFieldsApi } from '../helpers/request';
import { UseEventContext } from './eventContext';
import { UseCurrentUser } from './userContext';

export const HelperContext = createContext();

const initialStateNotification = {
  notify: false,
  message: 'no message',
  type: 'none',
};

export const HelperContextProvider = ({ children }) => {
  let cEvent = UseEventContext();
  let cUser = UseCurrentUser();
  const [containtNetworking, setcontaintNetworking] = useState(false);
  const [infoAgenda, setinfoAgenda] = useState(null);
  const [isNotification, setisNotification] = useState(initialStateNotification);
  const [totalSolicitudAmistad, setTotalSolicitudAmistad] = useState(0);
  const [totalsolicitudAgenda, setTotalsolicitudAgenda] = useState(0);
  const [totalsolicitudes, setTotalsolicitudes] = useState(0);
  const [isOpenDrawerProfile, setisOpenDrawerProfile] = useState(false);
  const [propertiesProfile, setpropertiesProfile] = useState();

  const getProperties = async (eventId) => {
    let properties = await EventFieldsApi.getAll(eventId);
    if (properties.length > 0) {
      setpropertiesProfile({
        propertiesUserPerfil: properties,
      });
      return properties;
    }
    return null;
  };

  const ChangeActiveNotification = (notify, message, type, activity) => {
    setisNotification({
      notify,
      message,
      type,
      activity,
    });
  };

  const HandleChangeDrawerProfile = () => {
    setisOpenDrawerProfile(!isOpenDrawerProfile);
  };

  const GetInfoAgenda = async () => {
    const infoAgenda = await AgendaApi.byEvent(cEvent.value._id);
    setinfoAgenda(infoAgenda.data);
  };

  const containsNetWorking = () => {
    if (cEvent.value != undefined) {
      cEvent.value.itemsMenu['networking'] !== undefined && setcontaintNetworking(true);
    }
  };

  const obtenerNombreActivity = (activityID) => {
    const act = infoAgenda && infoAgenda.filter((ac) => ac._id == activityID);
    return act && act.length > 0 ? act[0] : null;
  };

  useEffect(() => {
    if (cEvent.value != null) {
      containsNetWorking();
      GetInfoAgenda();
      getProperties(cEvent.value._id)
    }
  }, [cEvent.value]);

  useEffect(() => {
    /*NOTIFICACIONES POR ACTIVIDAD*/

    async function fetchActivityChange() {
      firestore
        .collection('events')
        .doc(cEvent.value._id)
        .collection('activities')
        .onSnapshot((querySnapshot) => {
          if (querySnapshot.empty) return;
          let change = querySnapshot.docChanges()[0];
          if (
            change.doc.data().habilitar_ingreso == 'open_meeting_room' &&
            obtenerNombreActivity(change.doc.id)?.name != null &&
            change.type === 'modified'
          ) {
            let message = obtenerNombreActivity(change.doc.id)?.name + ' está en vivo..';
            ChangeActiveNotification(true, message, 'open', change.doc.id);
          } else if (
            change.doc.data().habilitar_ingreso == 'ended_meeting_room' &&
            obtenerNombreActivity(change.doc.id)?.name != null &&
            change.type === 'modified'
          ) {
            let message = obtenerNombreActivity(change.doc.id)?.name + 'ha terminado..';
            ChangeActiveNotification(true, message, 'ended', change.doc.id);
          } else if (
            change.doc.data().habilitar_ingreso == 'closed_meeting_room' &&
            change.type === 'modified' &&
            obtenerNombreActivity(change.doc.id)?.name != null
          ) {
            let message = obtenerNombreActivity(change.doc.id)?.name + 'está por iniciar';
            ChangeActiveNotification(true, message, 'close', change.doc.id);
          }
        });
    }

    if (cEvent.value != null) {
      fetchActivityChange();
    }
  }, [cEvent.value, firestore, infoAgenda]);

  useEffect(() => {
    async function fetchNetworkingChange() {
      firestore
        .collection('notificationUser')
        .doc(cUser.value._id)
        .collection('events')
        .doc(cEvent.value._id)
        .collection('notifications')
        .onSnapshot((querySnapshot) => {
          let contNotifications = 0;
          let notAg = [];
          let notAm = [];
          let change = querySnapshot.docChanges()[0];

          querySnapshot.docs.forEach((doc) => {
            let notification = doc.data();

            if (notification.state === '0') {
              contNotifications++;
            }
            //Notificacion tipo agenda
            if (notification.type == 'agenda' && notification.state === '0') {
              notAg.push(doc.data());
            }
            //Notificacion otra
            if (notification.type == 'amistad' && notification.state === '0') {
              notAm.push(doc.data());
            }
          });
          setTotalSolicitudAmistad(notAm.length);
          setTotalsolicitudAgenda(notAg.length);
          setTotalsolicitudes(notAm.length + notAg.length);

          if (change) {
            if (change.doc.data() && change.newIndex > 0) {
              // alert("NUEVA NOTIFICACION")
              ChangeActiveNotification(true, change.doc.data().message, 'networking');
            }
          }
        });
    }

    if (cUser.value != null && cEvent.value != null) {
      fetchNetworkingChange();
    }
  }, [cUser.value, cEvent.value]);

  return (
    <HelperContext.Provider
      value={{
        containtNetworking,
        infoAgenda,
        isNotification,
        ChangeActiveNotification,
        totalSolicitudAmistad,
        totalsolicitudAgenda,
        totalsolicitudes,
        HandleChangeDrawerProfile,
        propertiesProfile
      }}>
      {children}
    </HelperContext.Provider>
  );
};

export default HelperContext;
