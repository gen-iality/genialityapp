import { firestore } from './firebase';
import { EventFieldsApi } from './request';

// //METODO PARA OBTENER ENCUESTAS New
export function listenSurveysData(event_id, setListOfEventSurveys, setLoadingSurveys, activity, cUser) {
  firestore
  .collection('surveys')
  .where('eventId', '==', event_id)
  .where('isPublished', '==', 'true')
    .onSnapshot((querySnapshot) => {
      let eventSurveys = [];
      querySnapshot.forEach((doc) => {
        eventSurveys.push({ ...doc.data(), _id: doc.id });
      });
      const publishedSurveys = publishedSurveysByActivity(activity, eventSurveys, cUser);
console.log('published surveys 10. listensurveysdata',publishedSurveys)
          
          setListOfEventSurveys((prevSurveyList) => {
            //mostrar mediante alerta cuando cambie el estado publicado
            
            return publishedSurveys;
          });
          setLoadingSurveys(false);
    });
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

  publishedSurveys.forEach((survey,index,arr) => {
    let counterDocuments = 0;
    let filteredSurveys = [];
    if (!(Object.keys(currentUser).length === 0)) {
      firestore
      .collectionGroup('responses')
      .where('id_survey', '==', survey._id)
      .where('id_user', '==', currentUser._id)
      .get()
      .then((result) => {
        result.forEach(function(doc) {
          if (doc.exists) {
            counterDocuments++;
          }
        });
        
        if (counterDocuments > 0) {
          filteredSurveys.push({
            ...arr[index],
            userHasVoted: true,
            totalResponses: counterDocuments,
          });
        } else {
          filteredSurveys.push({
            ...arr[index],
            userHasVoted: false,
            totalResponses: counterDocuments,
          });
        }
      });
    } else {
      // // Esto solo se ejecuta si no hay algun usuario logeado
      // const guestUser = new Promise((resolve) => {
        //   let surveyId = localStorage.getItem(`userHasVoted_${survey._id}`);
        //   surveyId ? resolve(true) : resolve(false);
        // });
        // let guestHasVote = await guestUser;
        // filteredSurveys.push({ ...arr[index], userHasVoted: guestHasVote });
        
        console.log('USUARIO NO LOGUEADO (GUEST)');
      }
    });

  return filteredSurveys ;
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
