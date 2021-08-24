import React, { createContext, useEffect } from 'react';
import { useState } from 'react';
import { firestore, fireRealtime } from '../helpers/firebase';
import { AgendaApi, EventFieldsApi, EventsApi, Networking } from '../helpers/request';
import { UseEventContext } from './eventContext';
import { UseCurrentUser } from './userContext';
import { UseUserEvent } from './eventUserContext';

export const HelperContext = createContext();

const initialStateNotification = {
  notify: false,
  message: 'no message',
  type: 'none',
};

export const HelperContextProvider = ({ children }) => {
  let cEvent = UseEventContext();
  let cUser = UseCurrentUser();
  let cEventuser = UseUserEvent();
  const [containtNetworking, setcontaintNetworking] = useState(false);
  const [infoAgenda, setinfoAgenda] = useState(null);
  const [isNotification, setisNotification] = useState(initialStateNotification);
  const [totalSolicitudAmistad, setTotalSolicitudAmistad] = useState(0);
  const [totalsolicitudAgenda, setTotalsolicitudAgenda] = useState(0);
  const [totalsolicitudes, setTotalsolicitudes] = useState(0);
  const [isOpenDrawerProfile, setisOpenDrawerProfile] = useState(false);
  const [propertiesProfile, setpropertiesProfile] = useState();
  const [propertiesOtherprofile, setpropertiesOtherprofile] = useState(null);
  const [activitiesEvent, setactivitiesEvent] = useState(null);
  const [chatActual, setchatActual] = useState({
    chatid: null,
    idactualuser: null,
    idotheruser: null,
    chatname: null,
  });
  const [contacts, setContacts] = useState([]);
  const [privateChatsList, setPrivatechatlist] = useState();
  const [attendeeList, setAttendeeList] = useState({});
  const [attendeeListPresence, setAttendeeListPresence] = useState({});

  let generateUniqueIdFromOtherIds = (ida, idb) => {
    let chatid;
    if (ida !== null && idb !== null) {
      if (ida < idb) {
        chatid = ida + '_' + idb;
      } else {
        chatid = idb + '_' + ida;
      }
    } else {
      chatid = null;
    }

    return chatid;
  };

  function HandleGoToChat(idactualuser, idotheruser, chatname, section) {
    let data = {};

    switch (section) {
      case 'private':
        data = {
          chatid: idotheruser,
          idactualuser,
          idotheruser,
          chatname,
        };
        break;

      case 'attendee':
        data = {
          chatid: generateUniqueIdFromOtherIds(idactualuser, idotheruser),
          idactualuser,
          idotheruser,
          chatname,
        };
        break;
    }

    setchatActual(data);
  }

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

  const GetActivitiesEvent = async (eventId) => {
    let activities = await AgendaApi.byEvent(eventId);

    if (activities.data.length > 0) {
      setactivitiesEvent(activities.data);
    }
  };

  let createNewOneToOneChat = (idcurrentUser, currentName, idOtherUser, otherUserName) => {
    let newId = generateUniqueIdFromOtherIds(idcurrentUser, idOtherUser);
    let data = {};

    console.log('=====idcurrentUser===================', idcurrentUser);
    console.log('=========idOtherUser=================', idOtherUser);

    //agregamos una referencia al chat para el usuario actual
    data = { id: newId, name: otherUserName };
    firestore
      .doc('eventchats/' + cEvent.value._id + '/' + 'chats/' + newId)
      .set(data, { merge: true });

    // dataotheruser = { id: newId, name: currentName };

    // //agregamos una referencia al chat para el otro usuario del chat
    // // data = { id: newId, name: currentName || '--', participants: [idcurrentUser, idOtherUser], type: 'onetoone' };
    // firestore
    //   .doc('eventchats/' + cEvent.value._id + '/userchats/' + idOtherUser + '/' + 'chats/' + newId)
    //   .set(dataotheruser, { merge: true });

    console.log('chatuser', newId);
    HandleGoToChat(idcurrentUser, idOtherUser, currentName, 'attendee');
  };

  // ACA HAY UN BUG AL TRAER DATOS CON BASTANTES CAMPOS
  const getPropertiesUserWithId = async (id) => {
    const eventUser = await EventsApi.getEventUser(id, cEvent.value._id);
    //console.log("RESPUESTA=>",eventUser)
    setpropertiesOtherprofile({ _id: id, properties: eventUser.properties, eventUserId: eventUser._id });
  };

  const ChangeActiveNotification = (notify, message, type, activity) => {
    setisNotification({
      notify,
      message,
      type,
      activity,
    });
  };

  const monitorEventPresence = (event_id, attendeeListPresence, setAttendeeListPresence) => {
    var eventpresenceRef = fireRealtime.ref('status/' + event_id);
    eventpresenceRef.on('value', (snapshot) => {
      const data = snapshot.val();
      let datalist = [];
      let attendeeListClone = { ...attendeeListPresence };

      if (data === null) return;

      Object.keys(data).map((key) => {
        let attendee = attendeeListClone[key] || {};
        attendee['state'] = data[key]['state'];
        attendee['last_changed'] = data[key]['last_changed'];
        attendeeListClone[key] = attendee;
        datalist.push(attendee);
      });

      setAttendeeListPresence(attendeeListClone);
    });
    return true;
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
      cEvent.value.itemsMenu && cEvent.value.itemsMenu['networking'] !== undefined && setcontaintNetworking(true);
    }
  };

  const obtenerContactos = async () => {
    // Servicio que trae los contactos
    let contacts = await Networking.getContactList(cEvent.value._id, cEventuser.value._id);
    if (contacts) {
      setContacts(contacts);
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
      getProperties(cEvent.value._id);
      GetActivitiesEvent(cEvent.value._id);
    }
  }, [cEvent.value]);

  /* CARGAR CHAT PRIVADOS */
  useEffect(() => {
    if (cEvent.value == null || cUser.value == null) return;
    firestore
      .collection('eventchats/' + cEvent.value._id + '/userchats/' + cUser.value.uid + '/' + 'chats/')
      .onSnapshot(function(querySnapshot) {
        let list = [];
        let data;
        let newmsj = 0;
        querySnapshot.forEach((doc) => {
          data = doc.data();

          if (data.newMessages) {
            newmsj += !isNaN(parseInt(data.newMessages.length)) ? parseInt(data.newMessages.length) : 0;
          }

          list.push(data);
        });

        setPrivatechatlist(list);
      });

    /*  CARGAR CHATS ATTENDES DEL USURIO*/
    if (cEvent.value == null) return;
    let colletion_name = cEvent.value._id + '_event_attendees';
    let attendee;
    firestore
      .collection(colletion_name)
      .orderBy('state_id', 'asc')
      .onSnapshot(function(querySnapshot) {
        let list = {};

        querySnapshot.forEach((doc) => {
          attendee = doc.data();
          let localattendee = attendeeList[attendee.user?.uid] || {};
          list[attendee.user?.uid] = { ...localattendee, ...attendee };
        });

        setAttendeeList(list);
      });

    /*DETERMINA ONLINE Y OFFLINE DE LOS USERS*/
    monitorEventPresence(cEvent.value._id, attendeeList, setAttendeeListPresence);
  }, [cEvent.value, cUser.value]);

  useEffect(() => {
    if (cEvent.value == null || cEvent.value == null) return;
    console.log(' cUser.value', cUser.value);
    // async function fethcNewMessages() {
    //   firestore
    //     .collection('eventchats/' + cEvent.value._id + '/userchats/' + cUser.value._id + '/' + 'chats/')
    //     .onSnapshot(function(querySnapshot) {
    //       let data;
    //       querySnapshot.forEach((doc) => {
    //         data = doc.data();
    //         console.log('====================================');
    //         console.log('datamsj', data);
    //         console.log('====================================');
    //       });
    //     });
    // }

    // if (cEvent.value != null) {
    //   fethcNewMessages();
    // }
  }, [firestore, cEvent.value]);

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
            let message = obtenerNombreActivity(change.doc.id)?.name + ' ' + ' está en vivo..';
            ChangeActiveNotification(true, message, 'open', change.doc.id);
          } else if (
            change.doc.data().habilitar_ingreso == 'ended_meeting_room' &&
            obtenerNombreActivity(change.doc.id)?.name != null &&
            change.type === 'modified'
          ) {
            let message = obtenerNombreActivity(change.doc.id)?.name + ' ' + 'ha terminado..';
            ChangeActiveNotification(true, message, 'ended', change.doc.id);
          } else if (
            change.doc.data().habilitar_ingreso == 'closed_meeting_room' &&
            change.type === 'modified' &&
            obtenerNombreActivity(change.doc.id)?.name != null
          ) {
            let message = obtenerNombreActivity(change.doc.id)?.name + ' ' + 'está por iniciar';
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
            if (change.doc.data() && change.newIndex > 0 && change.doc.data().state === '0') {
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

  useEffect(() => {
    if (cEventuser.value != null && cEvent.value != null) {
      obtenerContactos();
    }
  }, [cEventuser.value, cEvent.value]);

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
        propertiesProfile,
        getPropertiesUserWithId,
        propertiesOtherprofile,
        activitiesEvent,
        chatActual,
        HandleGoToChat,
        contacts,
        createNewOneToOneChat,
        privateChatsList,
        attendeeList,
        attendeeListPresence,
      }}>
      {children}
    </HelperContext.Provider>
  );
};

export default HelperContext;
