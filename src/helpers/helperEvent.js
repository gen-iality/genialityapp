import { firestore } from './firebase';
import { EventFieldsApi } from './request';

// //METODO PARA OBTENER ENCUESTAS
// export async function listenSurveysData(event_id) {
//   // if (!event_id) {
//   //   return [];
//   // }
//   let eventSurveys = [];
//   let $query = firestore.collection('surveys').where('eventId', '==', event_id);
//   $query.onSnapshot(async (surveySnapShot) => {
//     if (surveySnapShot.size === 0) {
//       this.setState({ selectedSurvey: {}, surveyVisible: false, publishedSurveys: [] });
//       return;
//     }
//     surveySnapShot.forEach(function(doc) {
//       eventSurveys.push({ ...doc.data(), _id: doc.id });
//     });
//   });
//   console.log("10_ listado de surveys en el helper: ", eventSurveys);
//   return eventSurveys;
// }

// //METODO PARA OBTENER ENCUESTAS New
export async function listenSurveysData(event_id) {
  return new Promise((resolve, reject)=>{
      let query = firestore.collection("surveys").where('eventId', '==', event_id);
  query.onSnapshot(async(querySnapshot) => {
    let eventSurveys = [];
    querySnapshot.forEach((doc) => {
      eventSurveys.push({ ...doc.data(), _id: doc.id });
    });
    if(eventSurveys.length !== 0){
      // console.log("10_", eventSurveys)
      resolve(eventSurveys);
    }else{
      reject(eventSurveys)
    }
  });
  })
}

export function publishedSurveysByActivity(currentActivity, eventSurveys, currentUser) {
  let publishedSurveys = [];
  if (currentActivity !== null) {
    // Listado de encuestas publicadas del evento
    publishedSurveys = eventSurveys.filter(
      (survey) =>
        (survey.isPublished === 'true' || survey.isPublished === true) &&
        ((currentActivity && survey.activity_id === currentActivity._id) || survey.isGlobal === 'true')
    );
    // console.log('holispublishjed', publishedSurveys);
    if (!currentUser || Object.keys(currentUser).length === 0) {
      publishedSurveys = publishedSurveys.filter((item) => {
        return item.allow_anonymous_answers !== 'false';
      });
    }
  }

  return publishedSurveys;
}

//monitorear nuevos mensajes
export let monitorNewChatMessages = (event, user) => {
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
export let getProperties = async (event) => {
  let properties = await EventFieldsApi.getAll(event._id);
  let propertiesdata;
  if (properties.length > 0) {
    propertiesdata = properties;
  }
  return propertiesdata;
};

///zoom externo

export const zoomExternoHandleOpen = (activity, eventUser, isMobile, TicketsApi, event) => {
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
      TicketsApi.checkInAttendee(event._id, eventUser._id);
      //Activity.checkInAttendeeActivity(this.props.cEvent._id, props.currentActivity._id, eventUser.account_id);
    }
  } catch (e) {
    console.error('fallo el checkin:', e);
  }
};

//obtener las generaltabs del evento

export const GetGeneralTabsByEvent = (event_id, setgeneraltabs) => {
  firestore
    .collection('events')
    .doc(event_id)
    .onSnapshot(function(eventSnapshot) {
      if (eventSnapshot.exists) {
        if (eventSnapshot.data().tabs !== undefined) {
          setgeneraltabs(eventSnapshot.data().tabs);
        }
      }
    });
};
