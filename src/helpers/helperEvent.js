import { firestore } from './firebase'
import { EventFieldsApi } from './request'

//METODO PARA SABER SI SE ESTÁ POSICIONADO EN EL HOME DE GENIALITY
export function isHome() {
  const isHome =
    window.location.pathname.startsWith('/landing') ||
    window.location.pathname.startsWith('/organization')
  if (isHome) {
    return false
  } else {
    return true
  }
}

//METODO PARA SABER SI SE ESTÁ POSICIONADO EN LA LANDING DEL EVENTO
export function isEvent() {
  const isEvent = window.location.pathname.startsWith('/landing')
  if (isEvent) {
    return true
  } else {
    return false
  }
}

// //METODO PARA OBTENER ENCUESTAS New
export function listenSurveysData(
  event_id,
  dispatch,

  //visualizarEncuesta
) {
  console.log('600.listenSurveysData')
  firestore
    .collection('surveys')
    .where('eventId', '==', event_id)
    .where('isPublished', '==', 'true')
    .onSnapshot((querySnapshot) => {
      const eventSurveys = []
      querySnapshot.forEach((doc) => {
        eventSurveys.push({ ...doc.data(), _id: doc.id })
      })

      const changeInSurvey = changeInSurveyDocChanges(querySnapshot.docChanges())
      const publishedSurveys = eventSurveys

      dispatch({ type: 'data_loaded', payload: { publishedSurveys, changeInSurvey } })
    })
}

function changeInSurveyDocChanges(docChanges) {
  let changeInSurvey = null
  if (docChanges.length) {
    const lastChange = docChanges[docChanges.length - 1]
    switch (lastChange.type) {
      case 'removed':
        changeInSurvey = null
        break
      case 'added':
      case 'modified':
      default:
        changeInSurvey = { ...lastChange.doc.data(), _id: lastChange.doc.id }
        break
    }
  }
  return changeInSurvey
}

export function publishedSurveysByActivity(currentActivity, eventSurveys, currentUser) {
  let publishedSurveys = []
  if (currentActivity !== null) {
    // Listado de encuestas publicadas del curso
    publishedSurveys = eventSurveys.filter(
      (survey) =>
        (survey.isPublished === 'true' || survey.isPublished) &&
        ((currentActivity && survey.activity_id === currentActivity._id) ||
          survey.isGlobal === 'true'),
    )
    if (!currentUser || Object.keys(currentUser).length === 0) {
      publishedSurveys = publishedSurveys.filter((item) => {
        return item.allow_anonymous_answers !== 'false'
      })
    }
  }

  return publishedSurveys
}

//monitorear nuevos mensajes
export const monitorNewChatMessages = (event, user) => {
  let totalNewMessages = 0
  firestore
    .collection('eventchats/' + event._id + '/userchats/' + user.uid + '/' + 'chats/')
    .onSnapshot(function (querySnapshot) {
      let data
      querySnapshot.forEach((doc) => {
        data = doc.data()
        if (data.newMessages) {
          totalNewMessages += !isNaN(parseInt(data.newMessages.length))
            ? parseInt(data.newMessages.length)
            : 0
        }
      })
    })

  return totalNewMessages
}

//obtener propiedades del curso
export const getProperties = async (event) => {
  const properties = await EventFieldsApi.getAll(event._id)
  let propertiesdata
  if (properties.length > 0) {
    propertiesdata = properties
  }
  return propertiesdata
}

///zoom externo

export const zoomExternoHandleOpen = (activity, eventUser, isMobile) => {
  let name =
    eventUser && eventUser.properties && eventUser.properties.names
      ? eventUser.properties.names
      : 'Anónimo'
  let urlMeeting = null

  name =
    eventUser && eventUser.properties.casa && eventUser.properties.casa
      ? '(' + eventUser.properties.casa + ')' + name
      : name

  if (isMobile) {
    urlMeeting = 'zoomus://zoom.us/join?confno=' + activity.meeting_id + '&uname=' + name
  } else {
    urlMeeting = 'zoommtg://zoom.us/join?confno=' + activity.meeting_id + '&uname=' + name
  }

  if (activity.zoomPassword) {
    urlMeeting += '&password=' + activity.zoomPassword
  }
  window.location.href = urlMeeting

  try {
    if (eventUser) {
    }
  } catch (e) {
    console.error('fallo el checkin:', e)
  }
}

//obtener las generaltabs del curso

export const GetGeneralTabsByEvent = (event_id, setGeneralTabs) => {
  firestore
    .collection('events')
    .doc(event_id)
    .onSnapshot(function (eventSnapshot) {
      if (eventSnapshot.exists) {
        if (eventSnapshot.data().tabs !== undefined) {
          setGeneralTabs(eventSnapshot.data().tabs)
        }
      }
    })
}

export const useEventWithCedula = (event) => {
  let label = 'Contraseña'
  let isArkmed = false

  if (EventsWithDni.includes(event?.author_id)) {
    isArkmed = true
    label = 'Cedula'
  }

  return {
    label,
    isArkmed,
  }
}

export const EventsWithDni = ['62171ec163b90f7cc421c3a3']
