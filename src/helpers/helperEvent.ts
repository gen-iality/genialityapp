import { parseStringBoolean } from '@/Utilities/parseStringBoolean';
import { SurveyRow } from 'survey-react';
import { firestore } from './firebase';
import { EventFieldsApi } from './request';

//METODO PARA SABER SI ESTA EN EL HOME DE EVIUS O EN UN EVENTO
export function isHome() {
  let isHome = window.location.pathname.includes('/landing');
  if (isHome) {
    return false;
  } else {
    return true;
  }
}

// //METODO PARA OBTENER ENCUESTAS New
export function listenSurveysData(
  event_id: any,
  dispatch: any,
  cUser: any,
  activity: any
  //visualizarEncuesta
) {
  firestore
    .collection('surveys')
    .where('eventId', '==', event_id)
    .onSnapshot((querySnapshot) => {
      const surveys = querySnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }) as any)
      // That's must to do something when the survey change
      const changeInSurvey = changeInSurveyDocChanges(querySnapshot.docChanges());
      const  publishedSurveys = surveys.filter(survey => parseStringBoolean(survey.isPublished))
      dispatch({ type: 'data_loaded', payload: { publishedSurveys, changeInSurvey } });
    }, onError => console.log('onError:', onError));
}

function changeInSurveyDocChanges(docChanges: any) {
  let changeInSurvey = null;
  if (docChanges.length) {
    let lastChange = docChanges[docChanges.length - 1];
    switch (lastChange.type) {
      case 'removed':
        changeInSurvey = null;
        break;
      case 'added':
      case 'modified':
      default:
        changeInSurvey = { ...lastChange.doc.data(), _id: lastChange.doc.id };
        break;
    }
  }
  return changeInSurvey;
}

export function publishedSurveysByActivity(currentActivity: any, eventSurveys: any, currentUser: any) {
  let publishedSurveys = [];
  if (currentActivity !== null) {
    // Listado de encuestas publicadas del evento
    publishedSurveys = eventSurveys.filter(
      (survey: any) =>
        (parseStringBoolean(survey.isPublished)) &&
        ((currentActivity && survey.activity_id === currentActivity._id) || parseStringBoolean(survey.isGlobal))
    );
    if (!currentUser || Object.keys(currentUser).length === 0) {
      publishedSurveys = publishedSurveys.filter((item: any) => {
        return item.allow_anonymous_answers !== 'false';
      });
    }
  }

  return publishedSurveys;
}

//monitorear nuevos mensajes
export let monitorNewChatMessages = (event: any, user: any) => {
  let totalNewMessages = 0;
  firestore
    .collection('eventchats/' + event._id + '/userchats/' + user.uid + '/' + 'chats/')
    .onSnapshot(function(querySnapshot) {
      let data;
      querySnapshot.forEach((doc) => {
        data = doc.data();
        if (data.newMessages) {
          totalNewMessages += !isNaN(parseInt(data.newMessages.length)) ? parseInt(data.newMessages.length) : 0;
        }
      });
    });

  return totalNewMessages;
};

//obtener propiedades del evento
export let getProperties = async (event: any) => {
  let properties = await EventFieldsApi.getAll(event._id);
  let propertiesdata;
  if (properties.length > 0) {
    propertiesdata = properties;
  }
  return propertiesdata;
};

///zoom externo

export const zoomExternoHandleOpen = (activity: any, eventUser: any, isMobile: any, TicketsApi: any, event: any) => {
  let name = eventUser && eventUser.properties && eventUser.properties.names ? eventUser.properties.names : 'Anónimo';
  let urlMeeting = null;

  name =
    eventUser && eventUser.properties.casa && eventUser.properties.casa
      ? '(' + eventUser.properties.casa + ')' + name
      : name;

  if (isMobile) {
    urlMeeting = 'zoomus://zoom.us/join?confno=' + activity.meeting_id + '&uname=' + name;
  } else {
    urlMeeting = 'zoommtg://zoom.us/join?confno=' + activity.meeting_id + '&uname=' + name;
  }

  if (activity.zoomPassword) {
    urlMeeting += '&password=' + activity.zoomPassword;
  }
  window.location.href = urlMeeting;

  try {
    if (eventUser) {
      // TicketsApi.checkInAttendee(event._id, eventUser._id);
      //Activity.checkInAttendeeActivity(this.props.cEvent._id, props.currentActivity._id, eventUser.account_id);
    }
  } catch (e) {
    console.error('fallo el checkin:', e);
  }
};

//obtener las generaltabs del evento

export const GetGeneralTabsByEvent = (event_id: any, setgeneraltabs: any) => {
  firestore
    .collection('events')
    .doc(event_id)
    .onSnapshot(function(eventSnapshot) {
      // @ts-ignore
      if (eventSnapshot.exists) {
        // @ts-ignore
        if (eventSnapshot.data().tabs !== undefined) {
          // @ts-ignore
          setgeneraltabs(eventSnapshot.data().tabs);
        }
      }
    });
};

export const useEventWithCedula = (event: any) => {
  let label = 'Contraseña';
  let isArkmed = false;

  if (EventsWithDni.includes(event?.author_id)) {
    isArkmed = true;
    label = 'Cedula';
  }

  return {
    label,
    isArkmed,
  };
};

export const EventsWithDni = ['62171ec163b90f7cc421c3a3'];
