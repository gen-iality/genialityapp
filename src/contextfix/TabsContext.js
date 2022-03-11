// import React, { createContext, useEffect } from 'react';
// import { useState } from 'react';
// import { firestore, fireRealtime } from '../helpers/firebase';
// import { UseEventContext } from './eventContext';
// import { UseCurrentUser } from './userContext';
// import { notification, Button, Row, Col } from 'antd';
// import { MessageOutlined, SendOutlined } from '@ant-design/icons';
// import moment from 'moment';

// export const TabsContext = createContext();

// export const HelperTabsProvider = ({ children }) => {
//   let cEvent = UseEventContext();
//   let cUser = UseCurrentUser();
//   const [isOpenDrawerProfile, setisOpenDrawerProfile] = useState(false);
//   const [chatActual, setchatActual] = useState({
//     chatid: null,
//     idactualuser: null,
//     idotheruser: null,
//     chatname: null,
//   });
//   const [privateChatsList, setPrivatechatlist] = useState();
//   const [attendeeList, setAttendeeList] = useState({});
//   const [attendeeListPresence, setAttendeeListPresence] = useState({});
//   const [isCollapsedMenuRigth, setisCollapsedMenuRigth] = useState(true);
//   const [chatAttendeChats, setchatAttendeChats] = useState('1');
//   const [chatPublicPrivate, setchatPublicPrivate] = useState('public');
//   const [totalPrivateMessages, settotalPrivateMessages] = useState(0);

 

//   let generateUniqueIdFromOtherIds = (ida, idb) => {
//     let chatid;
//     if (ida !== null && idb !== null) {
//       if (ida < idb) {
//         chatid = ida + '_' + idb;
//       } else {
//         chatid = idb + '_' + ida;
//       }
//     } else {
//       chatid = null;
//     }

//     return chatid;
//   };

//   /*CERRAR Y ABRIR MENU DERECHO*/

//   function HandleOpenCloseMenuRigth() {
//     setisCollapsedMenuRigth(!isCollapsedMenuRigth);
//   }

//   /*ENTRAR A CHAT O ATTENDE EN EL MENU*/
//   function HandleChatOrAttende(key) {
//     console.log('attende or chats', key);
//     setchatAttendeChats(key);
//   }

//   /*ENTRAR A CHAT PUBLICO O PRIVADO*/
//   function HandlePublicPrivate(key) {
//     setchatPublicPrivate(key);
//   }

//   /*LECTURA DE MENSAJES*/
//   function ReadMessages(data) {
//     if (data == null) return;

//     let messages = data.participants.filter((participant) => participant.idparticipant != cUser.value.uid);
//     settotalPrivateMessages(parseInt(totalPrivateMessages - messages[0].countmessajes));
//     messages[0].countmessajes = 0;
//     //otro participante
//     let otherparticipant = data.participants.filter((participant) => participant.idparticipant == cUser.value.uid);
//     let participants = [messages[0], otherparticipant[0]];
//     firestore
//       .doc('eventchats/' + cEvent.value._id + '/userchats/' + cUser.value.uid + '/' + 'chats/' + data.id)
//       .set({ participants: participants, ultimo_mensaje: '' }, { merge: true });
//   }

//   const openNotification = (data) => {
//     const btn = (
//       <Button
//         style={{ backgroundColor: '#1CDCB7', borderColor: 'white', color: 'white', fontWeight: '700' }}
//         icon={<SendOutlined />}
//         type='primary'
//         size='small'
//         onClick={() => {
//           setisCollapsedMenuRigth(false);
//           HandleChatOrAttende('1');
//           HandlePublicPrivate('private');
//           HandleGoToChat(
//             cUser.value.uid,
//             data.id,
//             cUser.value.names ? cUser.value.names : cUser.value.name,
//             'private',
//             data
//           );
//           // ReadMessages(data);
//           notification.destroy();
//         }}>
//         Responder
//       </Button>
//     );

//     const args = {
//       message: (
//         <Row justify='space-between'>
//           <Col style={{ fontWeight: 'bold' }}>{data.remitente}</Col>

//           <Col>{moment().format('h:mm A')}</Col>
//         </Row>
//       ),
//       description: <Row style={{ color: 'grey' }}>{data.ultimo_mensaje}</Row>,
//       duration: 8,
//       icon: <MessageOutlined style={{ color: '#1CDCB7' }} />,
//       btn,
//     };

//     notification.open(args);
//   };

//   function HandleGoToChat(idactualuser, idotheruser, chatname, section, callbackdata) {
//     let data = {};

//     switch (section) {
//       case 'private':
//         data = {
//           chatid: idotheruser,
//           idactualuser,
//           idotheruser,
//           chatname,
//         };
//         break;

//       case 'attendee':
//         data = {
//           chatid: generateUniqueIdFromOtherIds(idactualuser, idotheruser),
//           idactualuser,
//           idotheruser,
//           chatname,
//         };
//         break;
//     }

//     setchatActual(data);
//     ReadMessages(callbackdata);
//   }

//   let createNewOneToOneChat = (idcurrentUser, currentName, idOtherUser, otherUserName) => {
//     let newId = generateUniqueIdFromOtherIds(idcurrentUser, idOtherUser);
//     let data = {};
//     //agregamos una referencia al chat para el usuario actual
//     data = {
//       id: newId,
//       name: otherUserName,
//       participants: [
//         { idparticipant: idcurrentUser, countmessajes: 0 },
//         { idparticipant: idOtherUser, countmessajes: 0 },
//       ],
//     };
//     firestore
//       .doc('eventchats/' + cEvent.value._id + '/userchats/' + idcurrentUser + '/' + 'chats/' + newId)
//       .set(data, { merge: true });

//     data = {
//       id: newId,
//       name: currentName,
//       participants: [
//         { idparticipant: idcurrentUser, countmessajes: 0 },
//         { idparticipant: idOtherUser, countmessajes: 0 },
//       ],
//     };
//     //agregamos una referencia al chat para el otro usuario del chat
//     // data = { id: newId, name: currentName || '--', participants: [idcurrentUser, idOtherUser], type: 'onetoone' };
//     firestore
//       .doc('eventchats/' + cEvent.value._id + '/userchats/' + idOtherUser + '/' + 'chats/' + newId)
//       .set(data, { merge: true });

//     console.log('chatuser', newId);
//     HandleGoToChat(idcurrentUser, idOtherUser, currentName, 'attendee', null);
//   };

//   const monitorEventPresence = (event_id, attendeeListPresence, setAttendeeListPresence) => {
//     var eventpresenceRef = fireRealtime.ref('status/' + event_id);
//     eventpresenceRef.on('value', (snapshot) => {
//       const data = snapshot.val();
//       let datalist = [];
//       let attendeeListClone = { ...attendeeListPresence };

//       if (data === null) return;

//       Object.keys(data).map((key) => {
//         let attendee = attendeeListClone[key] || {};
//         attendee['state'] = data[key]['state'];
//         attendee['last_changed'] = data[key]['last_changed'];
//         attendeeListClone[key] = attendee;
//         datalist.push(attendee);
//       });

//       setAttendeeListPresence(attendeeListClone);
//     });
//     return true;
//   };

//   /* CARGAR CHAT PRIVADOS */
//   useEffect(() => {
//     if (cEvent.value == null || cUser.value == null) return;
//     firestore
//       .collection('eventchats/' + cEvent.value._id + '/userchats/' + cUser.value.uid + '/' + 'chats/')
//       .onSnapshot(function(querySnapshot) {
//         let list = [];
//         let data;
//         let newmsj = 0;
//         querySnapshot.forEach((doc) => {
//           data = doc.data();

//           if (data.newMessages) {
//             newmsj += !isNaN(parseInt(data.newMessages.length)) ? parseInt(data.newMessages.length) : 0;
//           }

//           list.push(data);
//         });

//         let totalNewMessages = 0;
//         list.map((privateuser) => {
//           let countsmsj =
//             privateuser?.participants &&
//             privateuser.participants.filter((participant) => participant.idparticipant !== cUser.value.uid);
//           if (countsmsj && countsmsj[0]?.countmessajes != undefined) {
//             totalNewMessages = totalNewMessages + countsmsj[0].countmessajes;
//           }
//         });
//         settotalPrivateMessages(totalNewMessages);
//         setPrivatechatlist(list);
//       });

//     /*  CARGAR CHATS ATTENDES DEL USURIO*/
//     if (cEvent.value == null) return;
//     let colletion_name = cEvent.value._id + '_event_attendees';
//     let attendee;
//     firestore
//       .collection(colletion_name)
//       .orderBy('state_id', 'asc')
//       .onSnapshot(function(querySnapshot) {
//         let list = {};

//         querySnapshot.forEach((doc) => {
//           attendee = doc.data();
//           let localattendee = attendeeList[attendee.user?.uid] || {};
//           list[attendee.user?.uid] = { ...localattendee, ...attendee };
//         });

//         setAttendeeList(list);
//       });

//     /*DETERMINA ONLINE Y OFFLINE DE LOS USERS*/
//     monitorEventPresence(cEvent.value._id, attendeeList, setAttendeeListPresence);
//   }, [cEvent.value, cUser.value]);

//   useEffect(() => {
//     if (cEvent.value == null || cUser.value == null) return;
//     async function fethcNewMessages() {
//       firestore
//         .collection('eventchats/' + cEvent.value._id + '/userchats/' + cUser.value.uid + '/' + 'chats/')
//         .onSnapshot(function(querySnapshot) {
//           if (
//             querySnapshot.docChanges()[0] &&
//             querySnapshot.docChanges()[0].type == 'modified' &&
//             querySnapshot.docChanges()[0].doc.data().ultimo_mensaje != ''
//           ) {
//             openNotification(querySnapshot.docChanges()[0].doc.data());
//           }
//         });
//     }

//     if (cEvent.value != null) {
//       fethcNewMessages();
//     }
//   }, [attendeeList]);

//   return (
//     <TabsContext.Provider
//       value={{
//         chatActual,
//         HandleGoToChat,
//         createNewOneToOneChat,
//         privateChatsList,
//         attendeeList,
//         attendeeListPresence,
//         isCollapsedMenuRigth,
//         HandleOpenCloseMenuRigth,
//         HandleChatOrAttende,
//         chatAttendeChats,
//         HandlePublicPrivate,
//         chatPublicPrivate,
//         totalPrivateMessages,
//       }}>
//       {children}
//     </TabsContext.Provider>
//   );
// };

// export default TabsContext;
