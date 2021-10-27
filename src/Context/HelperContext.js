import React, { createContext, useEffect } from 'react';
import { useState } from 'react';
import { firestore, fireRealtime } from '../helpers/firebase';
import { AgendaApi, EventFieldsApi, EventsApi, Networking } from '../helpers/request';
import { UseEventContext } from './eventContext';
import { UseCurrentUser } from './userContext';
import { UseUserEvent } from './eventUserContext';
import { notification, Button, Row, Col } from 'antd';
import { MessageOutlined, SendOutlined } from '@ant-design/icons';
import moment from 'moment';
import { createChatInitalPrivate, createChatRoom } from '../components/networking/agendaHook';
import { getGender } from 'gender-detection-from-name';
import { maleIcons, femaleicons } from '../helpers/constants';

export const HelperContext = createContext();

export function knowMaleOrFemale(nombre) {
  return getGender(nombre, 'es');
}

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
  const [isCollapsedMenuRigth, setisCollapsedMenuRigth] = useState(true);
  const [chatAttendeChats, setchatAttendeChats] = useState('1');
  const [chatPublicPrivate, setchatPublicPrivate] = useState('public');
  const [eventPrivate, seteventPrivate] = useState({ private: false, section: 'evento' });
  const [totalPrivateMessages, settotalPrivateMessages] = useState(0);
  const imageforDefaultProfile = 'https://cdn-icons-png.flaticon.com/512/3237/3237447.png';
  const [requestSend, setRequestSend] = useState([]);
  const [typeModal, setTypeModal] = useState(null);
  const [tabLogin, setTabLogin] = useState('1');
  const [currentActivity, setcurrenActivity] = useState(null);
  const [theUserHasPlayed, setTheUserHasPlayed] = useState(null);

  function handleChangeCurrentActivity(activity) {
    setcurrenActivity(activity);
  }

  function handleChangeTypeModal(type) {
    setTypeModal(type);
  }
  function handleChangeTabModal(tab) {
    setTabLogin(tab);
  }

  useEffect(() => {
    if (!cEvent.value) return;
    let firstroute = Object.keys(cEvent.value.itemsMenu);
    if (firstroute[0] != undefined) {
      seteventPrivate({ private: false, section: firstroute[0] });
    }
  }, []);

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

  /*CERRAR Y ABRIR MENU DERECHO*/

  function HandleOpenCloseMenuRigth() {
    setisCollapsedMenuRigth(!isCollapsedMenuRigth);
  }

  /*ENTRAR A CHAT O ATTENDE EN EL MENU*/
  function HandleChatOrAttende(key) {
    setchatAttendeChats(key);
  }

  /*ENTRAR A CHAT PUBLICO O PRIVADO*/
  function HandlePublicPrivate(key) {
    setchatPublicPrivate(key);
    console.log('private key: ' + key);
    if (key == 'public') {
      createChatRoom('event_' + cEvent.value._id);
    }
  }

  /*LECTURA DE MENSAJES*/
  function ReadMessages(data) {
    if (data == null) return;

    let messages = data.participants.filter((participant) => participant.idparticipant != cUser.value.uid);
    settotalPrivateMessages(parseInt(totalPrivateMessages - messages[0].countmessajes));
    messages[0].countmessajes = 0;
    //otro participante
    let otherparticipant = data.participants.filter((participant) => participant.idparticipant == cUser.value.uid);
    let participants = [messages[0], otherparticipant[0]];
    firestore
      .doc('eventchats/' + cEvent.value._id + '/userchats/' + cUser.value.uid + '/' + 'chats/' + data.id)
      .set({ participants: participants, ultimo_mensaje: '' }, { merge: true });
  }

  const openNotification = (data) => {
    const btn = (
      <Button
        style={{ backgroundColor: '#1CDCB7', borderColor: 'white', color: 'white', fontWeight: '700' }}
        icon={<SendOutlined />}
        type='primary'
        size='small'
        onClick={() => {
          setisCollapsedMenuRigth(false);
          HandleChatOrAttende('1');
          HandlePublicPrivate('private');
          HandleGoToChat(
            cUser.value.uid,
            data.id,
            cUser.value.names ? cUser.value.names : cUser.value.name,
            'private',
            data
          );
          // ReadMessages(data);
          notification.destroy();
        }}>
        Responder
      </Button>
    );

    const args = {
      message: (
        <Row justify='space-between'>
          <Col style={{ fontWeight: 'bold' }}>{data.remitente}</Col>

          <Col>{moment().format('h:mm A')}</Col>
        </Row>
      ),
      description: <Row style={{ color: 'grey' }}>{data.ultimo_mensaje}</Row>,
      duration: 8,
      icon: <MessageOutlined style={{ color: '#1CDCB7' }} />,
      btn,
    };

    notification.open(args);
  };

  function HandleGoToChat(idactualuser, idotheruser, chatname, section, callbackdata) {
    let data = {};
    let idactualuserEvent = cEventuser.value?._id;
    if (!idactualuserEvent) return;
    switch (section) {
      case 'private':
        data = {
          chatid: idotheruser,
          idactualuser: idactualuserEvent,
          idotheruser,
          chatname,
        };
        createChatInitalPrivate(idotheruser);

        break;

      case 'attendee':
        data = {
          chatid: generateUniqueIdFromOtherIds(idactualuser, idotheruser),
          idactualuser: idactualuserEvent,
          idotheruser,
          chatname,
        };
        createChatInitalPrivate(generateUniqueIdFromOtherIds(idactualuser, idotheruser));
        break;
    }

    setchatActual(data);
    ReadMessages(callbackdata);
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

  let createNewOneToOneChat = (idcurrentUser, currentName, idOtherUser, otherUserName, imageOtherprofile) => {
    if (cEventuser.value == null) {
      handleChangeTypeModal('register');
      return;
    }

    let newId = generateUniqueIdFromOtherIds(idcurrentUser, idOtherUser);
    let data = {};
    let imageProfileUseractual = cEventuser.value?.user?.picture
      ? cEventuser.value?.user?.picture
      : imageforDefaultProfile;
    //agregamos una referencia al chat para el usuario actual
    data = {
      id: newId,
      name: otherUserName,
      participants: [
        { idparticipant: idcurrentUser, countmessajes: 0, profilePicUrl: imageProfileUseractual },
        { idparticipant: idOtherUser, countmessajes: 0, profilePicUrl: imageOtherprofile },
      ],
    };

    firestore
      .doc('eventchats/' + cEvent.value._id + '/userchats/' + idcurrentUser + '/' + 'chats/' + newId)
      .set(data, { merge: true });

    data = {
      id: newId,
      name: currentName,
      participants: [
        { idparticipant: idcurrentUser, countmessajes: 0, profilePicUrl: imageProfileUseractual },
        { idparticipant: idOtherUser, countmessajes: 0, profilePicUrl: imageOtherprofile },
      ],
    };
    //agregamos una referencia al chat para el otro usuario del chat
    // data = { id: newId, name: currentName || '--', participants: [idcurrentUser, idOtherUser], type: 'onetoone' };
    firestore
      .doc('eventchats/' + cEvent.value._id + '/userchats/' + idOtherUser + '/' + 'chats/' + newId)
      .set(data, { merge: true });

    HandleGoToChat(idcurrentUser, idOtherUser, currentName, 'attendee', null);
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
    let contacts = await Networking.getContactList(cEvent.value._id, cEventuser.value?._id);
    let { data } = await Networking.getInvitationsSent(cEvent.value._id, cEventuser.value?._id);
    if (contacts) {
      setContacts(contacts);
    }

    if (data) {
      data = data.filter((request) => !request.response || request.response == 'accepted');
      // console.log('DATA REQUEST==>', data);
      setRequestSend(data);
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

        let totalNewMessages = 0;
        list.map((privateuser) => {
          let countsmsj =
            privateuser?.participants &&
            privateuser.participants.filter((participant) => participant.idparticipant !== cUser.value.uid);
          if (countsmsj && countsmsj[0]?.countmessajes != undefined) {
            totalNewMessages = totalNewMessages + countsmsj[0].countmessajes;
          }
        });
        settotalPrivateMessages(totalNewMessages);
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
    if (cEvent.value == null || cUser.value == null) return;
    async function fethcNewMessages() {
      let ultimomsj = null;
      firestore
        .collection('eventchats/' + cEvent.value._id + '/userchats/' + cUser.value.uid + '/' + 'chats/')
        .onSnapshot(function(querySnapshot) {
          if (
            querySnapshot.docChanges()[0] &&
            querySnapshot.docChanges()[0].type == 'modified' &&
            querySnapshot.docChanges()[0].doc.data().ultimo_mensaje != '' &&
            ultimomsj != querySnapshot.docChanges()[0].doc.data().ultimo_mensaje
          ) {
            openNotification(querySnapshot.docChanges()[0].doc.data());
            ultimomsj = querySnapshot.docChanges()[0].doc.data().ultimo_mensaje;
          }
        });
    }

    if (cEvent.value != null) {
      fethcNewMessages();
    }
  }, [cEvent.value, cUser.value]);

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

  /*VALIDACION DE EVENTO TOTALMENTE PRIVADO*/
  function GetPermissionsEvent() {
    if (cEvent.value != null) {
      let routePermissions =
        cEvent.value &&
        cEvent.value.itemsMenu &&
        Object.values(cEvent.value.itemsMenu)?.filter((item) => item.section === 'tickets');
      if (
        routePermissions &&
        routePermissions[0] &&
        routePermissions[0].permissions == 'assistants' &&
        cEventuser.value == null
      ) {
        seteventPrivate({
          private: true,
          section: 'permissions',
        });
      }
    }
  }

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
        isCollapsedMenuRigth,
        HandleOpenCloseMenuRigth,
        HandleChatOrAttende,
        chatAttendeChats,
        HandlePublicPrivate,
        chatPublicPrivate,
        eventPrivate,
        seteventPrivate,
        GetPermissionsEvent,
        totalPrivateMessages,
        imageforDefaultProfile,
        requestSend,
        obtenerContactos,
        typeModal,
        handleChangeTypeModal,
        handleChangeTabModal,
        tabLogin,
        theUserHasPlayed,
        setTheUserHasPlayed,
        knowMaleOrFemale,
        femaleicons,
        maleIcons,
        handleChangeCurrentActivity,
        currentActivity,
      }}>
      {children}
    </HelperContext.Provider>
  );
};

export default HelperContext;
