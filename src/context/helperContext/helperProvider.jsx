import { useEffect, useReducer } from 'react'
import { HelperContext } from './helperContext'
import { useState } from 'react'
import { firestore, fireRealtime } from '@helpers/firebase'
import { AgendaApi, EventFieldsApi, EventsApi, Networking } from '@helpers/request'
import { useEventContext } from '../eventContext'
import { useCurrentUser } from '../userContext'
import { useUserEvent } from '../eventUserContext'
import { notification, Button, Row, Col } from 'antd'
import { MessageOutlined, SendOutlined, FileImageOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import {
  createChatInitalPrivate,
  createChatRoom,
} from '@components/networking/agendaHook'
import { maleIcons, femaleicons, imageforDefaultProfile } from '@helpers/constants'
import { useHistory } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { helperReducer, helperInitialState } from './helperReducer'

const initialStateNotification = {
  notify: false,
  message: 'no message',
  type: 'none',
}

export const HelperContextProvider = ({ children }) => {
  const [helperState, helperDispatch] = useReducer(helperReducer, helperInitialState)

  const cEvent = useEventContext()
  const cUser = useCurrentUser()
  const cEventuser = useUserEvent()

  const [containtNetworking, setContaintNetworking] = useState(false)
  const [infoAgenda, setInfoAgenda] = useState(null)
  const [isNotification, setIsNotification] = useState(initialStateNotification)
  const [totalSolicitudAmistad, setTotalSolicitudAmistad] = useState(0)
  const [totalsolicitudAgenda, setTotalsolicitudAgenda] = useState(0)
  const [totalsolicitudes, setTotalsolicitudes] = useState(0)
  const [propertiesProfile, setPropertiesProfile] = useState()
  const [propertiesOtherprofile, setPropertiesOtherprofile] = useState(null)
  const [activitiesEvent, setActivitiesEvent] = useState([]) // Who fool initializes null an array
  const [chatActual, setChatActual] = useState({
    chatid: null,
    idactualuser: null,
    idotheruser: null,
    chatname: null,
  })
  const [contacts, setContacts] = useState([])
  const [privateChatsList, setPrivatechatlist] = useState()
  const [attendeeList, setAttendeeList] = useState({})
  const [attendeeListPresence, setAttendeeListPresence] = useState({})
  const [isCollapsedMenuRigth, setIsCollapsedMenuRigth] = useState(true)
  const [chatAttendeChats, setChatAttendeChats] = useState('1')
  const [chatPublicPrivate, setChatPublicPrivate] = useState('public')
  const [eventPrivate, setEventPrivate] = useState({ private: false, section: 'evento' })
  const [totalPrivateMessages, setTotalPrivateMessages] = useState(0)
  const [requestSend, setRequestSend] = useState([])
  const [typeModal, setTypeModal] = useState(null)
  const [visibleLoginEvents, setVisibleLoginEvents] = useState(false)
  const [gameData, setGameData] = useState('')
  const [gameRanking, setGameRanking] = useState([])
  const [myScore, setMyScore] = useState([{ name: '', score: 0 }])
  const [theUserHasPlayed, setTheUserHasPlayed] = useState(null)
  const [updateEventUser, setUpdateEventUser] = useState(false)
  const [register, setRegister] = useState(null)

  function handleChangeTypeModal(type) {
    setTypeModal(type)
  }

  useEffect(() => {
    if (!cEvent.value) return
    const firstroute = Object.keys(cEvent.value.itemsMenu)
    if (firstroute[0] != undefined) {
      setEventPrivate({ private: false, section: firstroute[0] })
    }
  }, [])

  const generateUniqueIdFromOtherIds = (ida, idb) => {
    let chatid
    if (ida !== null && idb !== null) {
      if (ida < idb) {
        chatid = ida + '_' + idb
      } else {
        chatid = idb + '_' + ida
      }
    } else {
      chatid = null
    }

    return chatid
  }

  /*CERRAR Y ABRIR MENU DERECHO*/

  function HandleOpenCloseMenuRigth(status) {
    setIsCollapsedMenuRigth(status)
  }

  /*ENTRAR A CHAT O ATTENDE EN EL MENU*/
  function HandleChatOrAttende(key) {
    setChatAttendeChats(key)
  }

  /*ENTRAR A CHAT PUBLICO O PRIVADO*/
  function HandlePublicPrivate(key) {
    setChatPublicPrivate(key)
    if (key == 'public') {
      createChatRoom('event_' + cEvent.value._id)
    }
  }

  /*LECTURA DE MENSAJES*/
  function ReadMessages(data) {
    if (data == null) return

    const messages = data.participants.filter(
      (participant) => participant.idparticipant != cUser.value.uid,
    )
    setTotalPrivateMessages(parseInt(totalPrivateMessages - messages[0].countmessajes))
    messages[0].countmessajes = 0
    //otro participante
    const otherparticipant = data.participants.filter(
      (participant) => participant.idparticipant == cUser.value.uid,
    )
    const participants = [messages[0], otherparticipant[0]]
    firestore
      .doc(
        'eventchats/' +
          cEvent.value._id +
          '/userchats/' +
          cUser.value.uid +
          '/' +
          'chats/' +
          data.id,
      )
      .set({ participants: participants, ultimo_mensaje: '' }, { merge: true })
  }

  const openNotification = (data) => {
    const imageUrl = data.ultimo_mensaje
    const isAnImage = imageUrl
      ? imageUrl.includes('https://firebasestorage.googleapis.com')
      : false

    const btn = (
      <Button
        style={{
          backgroundColor: '#1CDCB7',
          borderColor: 'white',
          color: 'white',
          fontWeight: '700',
        }}
        icon={<SendOutlined />}
        type="primary"
        size="small"
        onClick={() => {
          setIsCollapsedMenuRigth(false)
          HandleChatOrAttende('1')
          HandlePublicPrivate('private')
          HandleGoToChat(
            cUser.value.uid,
            data.id,
            cUser.value.names ? cUser.value.names : cUser.value.name,
            'private',
            data,
          )
          // ReadMessages(data);
          notification.destroy()
        }}
      >
        Responder
      </Button>
    )

    const args = {
      message: (
        <Row justify="space-between">
          <Col style={{ fontWeight: 'bold' }}>{data.remitente}</Col>

          <Col>{dayjs().format('h:mm A')}</Col>
        </Row>
      ),
      description: isAnImage ? (
        <div style={{ color: 'grey' }}>
          <FileImageOutlined /> Imagen
        </div>
      ) : (
        <Row style={{ color: 'grey' }}>{data.ultimo_mensaje}</Row>
      ),
      duration: 8,
      icon: <MessageOutlined style={{ color: '#1CDCB7' }} />,
      btn,
    }

    notification.open(args)
  }

  function HandleGoToChat(idactualuser, idotheruser, chatname, section, callbackdata) {
    let data = {}
    const idactualuserEvent = cEventuser.value?._id
    if (!idactualuserEvent) return
    switch (section) {
      case 'private':
        data = {
          chatid: idotheruser,
          idactualuser: idactualuserEvent,
          idotheruser,
          chatname,
        }
        createChatInitalPrivate(idotheruser)

        break

      case 'attendee':
        data = {
          chatid: generateUniqueIdFromOtherIds(idactualuser, idotheruser),
          idactualuser: idactualuserEvent,
          idotheruser,
          chatname,
        }
        createChatInitalPrivate(generateUniqueIdFromOtherIds(idactualuser, idotheruser))
        break
    }

    setChatActual(data)
    ReadMessages(callbackdata)
  }

  const getProperties = async (eventId) => {
    const properties = await EventFieldsApi.getAll(eventId)
    if (properties.length > 0) {
      setPropertiesProfile({
        propertiesUserPerfil: properties,
      })
      return properties
    }
    return null
  }

  const GetActivitiesEvent = async (eventId) => {
    const activities = await AgendaApi.byEvent(eventId)

    if (activities.data.length > 0) {
      setActivitiesEvent(activities.data)
    }
  }

  const createNewOneToOneChat = (
    idcurrentUser,
    currentName,
    idOtherUser,
    otherUserName,
    imageOtherprofile,
  ) => {
    if (cEventuser.value == null) {
      handleChangeTypeModal('register')
      return
    }

    const newId = generateUniqueIdFromOtherIds(idcurrentUser, idOtherUser)
    let data = {}
    const imageProfileUseractual = cEventuser.value?.user?.picture
      ? cEventuser.value?.user?.picture
      : imageforDefaultProfile
    //agregamos una referencia al chat para el usuario actual
    data = {
      id: newId,
      name: otherUserName,
      participants: [
        {
          idparticipant: idcurrentUser,
          countmessajes: 0,
          profilePicUrl: imageProfileUseractual,
        },
        {
          idparticipant: idOtherUser,
          countmessajes: 0,
          profilePicUrl: imageOtherprofile,
        },
      ],
    }

    firestore
      .doc(
        'eventchats/' +
          cEvent.value._id +
          '/userchats/' +
          idcurrentUser +
          '/' +
          'chats/' +
          newId,
      )
      .set(data, { merge: true })

    data = {
      id: newId,
      name: currentName,
      participants: [
        {
          idparticipant: idcurrentUser,
          countmessajes: 0,
          profilePicUrl: imageProfileUseractual,
        },
        {
          idparticipant: idOtherUser,
          countmessajes: 0,
          profilePicUrl: imageOtherprofile,
        },
      ],
    }
    //agregamos una referencia al chat para el otro usuario del chat
    // data = { id: newId, name: currentName || '--', participants: [idcurrentUser, idOtherUser], type: 'onetoone' };
    firestore
      .doc(
        'eventchats/' +
          cEvent.value._id +
          '/userchats/' +
          idOtherUser +
          '/' +
          'chats/' +
          newId,
      )
      .set(data, { merge: true })

    HandleGoToChat(idcurrentUser, idOtherUser, currentName, 'attendee', null)
  }

  // Aca hay un bug al traer datos con bastantes campos
  const getPropertiesUserWithId = async (id) => {
    const eventUser = await EventsApi.getEventUser(id, cEvent.value._id)
    setPropertiesOtherprofile({
      _id: id,
      properties: eventUser.properties,
      eventUserId: eventUser._id,
    })
  }

  const ChangeActiveNotification = (notify, message, type, activity) => {
    setIsNotification({
      notify,
      message,
      type,
      activity,
    })
  }

  const monitorEventPresence = (
    event_id,
    attendeeListPresence,
    setAttendeeListPresence,
  ) => {
    const eventpresenceRef = fireRealtime.ref('status/' + event_id)
    eventpresenceRef.on('value', (snapshot) => {
      const data = snapshot.val()
      const datalist = []
      const attendeeListClone = { ...attendeeListPresence }

      if (data === null) return

      Object.keys(data).map((key) => {
        const attendee = attendeeListClone[key] || {}
        attendee['state'] = data[key]['state']
        attendee['last_changed'] = data[key]['last_changed']
        attendeeListClone[key] = attendee
        datalist.push(attendee)
      })

      setAttendeeListPresence(attendeeListClone)
    })
    return true
  }

  const GetInfoAgenda = async () => {
    const infoAgenda = await AgendaApi.byEvent(cEvent.value._id)
    setInfoAgenda(infoAgenda.data)
  }

  const containsNetWorking = () => {
    if (cEvent.value != undefined) {
      cEvent.value.itemsMenu &&
        cEvent.value.itemsMenu['networking'] !== undefined &&
        setContaintNetworking(true)
    }
  }

  const obtenerContactos = async () => {
    // Servicio que trae los contactos
    const contacts = await Networking.getContactList(
      cEvent.value._id,
      cEventuser.value?._id,
    )
    let { data } = await Networking.getInvitationsSent(
      cEvent.value._id,
      cEventuser.value?._id,
    )
    if (contacts) {
      setContacts(contacts)
    }

    if (data) {
      data = data.filter((request) => !request.response || request.response == 'accepted')
      setRequestSend(data)
    }
  }

  const obtenerNombreActivity = (activityID) => {
    const act = infoAgenda && infoAgenda.filter((ac) => ac._id == activityID)
    return act && act.length > 0 ? act[0] : null
  }

  function visibilityLoginEvents(value) {
    alert('CHANGE STATUS' + value)
    setVisibleLoginEvents(value)
  }

  useEffect(() => {
    if (cEvent?.value != null) {
      containsNetWorking()
      GetInfoAgenda()
      getProperties(cEvent.value._id)
      GetActivitiesEvent(cEvent.value._id)
    }
  }, [cEvent.value])

  /* CARGAR CHAT PRIVADOS */
  useEffect(() => {
    if (cEvent.value == null || cUser.value == null || cUser.value == undefined) return
    firestore
      .collection(
        'eventchats/' +
          cEvent.value._id +
          '/userchats/' +
          cUser.value.uid +
          '/' +
          'chats/',
      )
      .onSnapshot(function (querySnapshot) {
        const list = []
        let data
        let newmsj = 0
        querySnapshot.forEach((doc) => {
          data = doc.data()

          if (data.newMessages) {
            newmsj += !isNaN(parseInt(data.newMessages.length))
              ? parseInt(data.newMessages.length)
              : 0
          }

          list.push(data)
        })
        let totalNewMessages = 0
        list.map((privateuser) => {
          const countsmsj =
            privateuser?.participants &&
            privateuser.participants.filter(
              (participant) => participant.idparticipant !== cUser.value.uid,
            )
          if (countsmsj && countsmsj[0]?.countmessajes != undefined) {
            totalNewMessages = totalNewMessages + countsmsj[0].countmessajes
          }
        })

        setTotalPrivateMessages(totalNewMessages)
        setPrivatechatlist(list)
      })

    /*  CARGAR CHATS ATTENDES DEL USURIO*/
    if (cEvent.value == null) return
    const colletion_name = cEvent.value._id + '_event_attendees'
    let attendee
    firestore
      .collection(colletion_name)
      .orderBy('state_id', 'asc')
      .limit(100)
      .onSnapshot(function (querySnapshot) {
        const list = {}

        querySnapshot.forEach((doc) => {
          attendee = doc.data()
          const localattendee = attendeeList[attendee.user?.uid] || {}
          list[attendee.user?.uid] = { ...localattendee, ...attendee }
        })

        setAttendeeList(list)
      })

    /*DETERMINA ONLINE Y OFFLINE DE LOS USERS*/
    monitorEventPresence(cEvent.value._id, attendeeList, setAttendeeListPresence)
  }, [cEvent.value, cUser.value])

  useEffect(() => {
    if (cEvent.value == null || cUser.value == null || cUser.value == undefined) return
    async function fethcNewMessages() {
      let ultimomsj = null
      firestore
        .collection(
          'eventchats/' +
            cEvent.value._id +
            '/userchats/' +
            cUser.value.uid +
            '/' +
            'chats/',
        )
        .onSnapshot(function (querySnapshot) {
          if (
            querySnapshot.docChanges()[0] &&
            querySnapshot.docChanges()[0].type == 'modified' &&
            querySnapshot.docChanges()[0].doc.data().ultimo_mensaje != '' &&
            ultimomsj != querySnapshot.docChanges()[0].doc.data().ultimo_mensaje
          ) {
            openNotification(querySnapshot.docChanges()[0].doc.data())
            ultimomsj = querySnapshot.docChanges()[0].doc.data().ultimo_mensaje
          }
        })
    }

    if (cEvent.value != null) {
      fethcNewMessages()
    }
  }, [cEvent.value, cUser.value])

  useEffect(() => {
    /*NOTIFICACIONES POR LECCIÓN*/

    async function fetchActivityChange() {
      firestore
        .collection('events')
        .doc(cEvent.value._id)
        .collection('activities')
        .onSnapshot((querySnapshot) => {
          if (querySnapshot.empty) return
          const change = querySnapshot.docChanges()[0]
          if (
            change.doc.data().habilitar_ingreso == 'open_meeting_room' &&
            obtenerNombreActivity(change.doc.id)?.name != null &&
            change.type === 'modified'
          ) {
            const message =
              obtenerNombreActivity(change.doc.id)?.name + ' ' + ' está en vivo..'
            ChangeActiveNotification(true, message, 'open', change.doc.id)
          } else if (
            change.doc.data().habilitar_ingreso == 'ended_meeting_room' &&
            obtenerNombreActivity(change.doc.id)?.name != null &&
            change.type === 'modified'
          ) {
            const message =
              obtenerNombreActivity(change.doc.id)?.name + ' ' + 'ha terminado..'
            ChangeActiveNotification(true, message, 'ended', change.doc.id)
          } else if (
            change.doc.data().habilitar_ingreso == 'closed_meeting_room' &&
            change.type === 'modified' &&
            obtenerNombreActivity(change.doc.id)?.name != null
          ) {
            const message =
              obtenerNombreActivity(change.doc.id)?.name + ' ' + 'está por iniciar'
            ChangeActiveNotification(true, message, 'close', change.doc.id)
          }
        })
    }

    if (cEvent.value != null) {
      fetchActivityChange()
    }
  }, [cEvent.value, firestore, infoAgenda])

  useEffect(() => {
    async function fetchNetworkingChange() {
      firestore
        .collection('notificationUser')
        .doc(cUser.value._id)
        .collection('events')
        .doc(cEvent.value._id)
        .collection('notifications')
        .onSnapshot((querySnapshot) => {
          let contNotifications = 0
          const notAg = []
          const notAm = []
          const change = querySnapshot.docChanges()[0]

          querySnapshot.docs.forEach((doc) => {
            const notification = doc.data()

            if (notification.state === '0') {
              contNotifications++
            }
            //Notificacion tipo agenda
            if (notification.type == 'agenda' && notification.state === '0') {
              notAg.push(doc.data())
            }
            //Notificacion otra
            if (notification.type == 'amistad' && notification.state === '0') {
              notAm.push(doc.data())
            }
          })
          setTotalSolicitudAmistad(notAm.length)
          setTotalsolicitudAgenda(notAg.length)
          setTotalsolicitudes(notAm.length + notAg.length)

          if (change) {
            if (
              change.doc.data() &&
              change.newIndex > 0 &&
              change.doc.data().state === '0'
            ) {
              // alert("NUEVA NOTIFICACION")
              ChangeActiveNotification(true, change.doc.data().message, 'networking')
            }
          }
        })
    }

    if (cUser.value != null && cUser.value != undefined && cEvent.value != null) {
      fetchNetworkingChange()
    }
  }, [cUser.value, cEvent.value])

  useEffect(() => {
    if (cEventuser.value != null && cEvent.value != null) {
      obtenerContactos()
    }
  }, [cEventuser.value, cEvent.value])

  /*VALIDACION DE CURSO TOTALMENTE PRIVADO*/
  function GetPermissionsEvent() {
    if (cEvent.value != null) {
      const routePermissions =
        cEvent.value &&
        cEvent.value.itemsMenu &&
        Object.values(cEvent.value.itemsMenu)?.filter(
          (item) => item.section === 'tickets',
        )
      if (
        routePermissions &&
        routePermissions[0] &&
        routePermissions[0].permissions == 'assistants' &&
        cEventuser.value == null
      ) {
        setEventPrivate({
          private: true,
          section: 'permissions',
        })
      }
    }
  }

  return (
    <HelperContext.Provider
      value={{
        ...helperState,
        helperDispatch,
        containtNetworking,
        infoAgenda,
        isNotification,
        ChangeActiveNotification,
        totalSolicitudAmistad,
        totalsolicitudAgenda,
        totalsolicitudes,
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
        seteventPrivate: setEventPrivate,
        GetPermissionsEvent,
        totalPrivateMessages,
        requestSend,
        obtenerContactos,
        typeModal,
        handleChangeTypeModal,
        visibleLoginEvents,
        visibilityLoginEvents,
        gameData,
        setGameData,
        theUserHasPlayed,
        setTheUserHasPlayed,
        femaleicons,
        maleIcons,
        gameRanking,
        setGameRanking,
        myScore,
        setMyScore,
        updateEventUser,
        setUpdateEventUser,
        register,
        setRegister,
      }}
    >
      {children}
    </HelperContext.Provider>
  )
}
