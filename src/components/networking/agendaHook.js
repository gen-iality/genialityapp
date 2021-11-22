import { firestoreeviuschat, app } from '../../helpers/firebase';
var hoy = new Date();

function formatAMPM(hoy) {
  var hours = hoy.getHours();
  var minutes = hoy.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

export const createChatRoom = (idroom) => {
  let refchatroom = firestoreeviuschat.collection('messages' + idroom).doc('initial');
  refchatroom
    .get()
    .then((doc) => {
      if (!doc.exists) {
        firestoreeviuschat
          .collection('messages' + idroom)
          .doc('initial')
          .set({
            name: 'Evius.co',
            profilePicUrl:
              'https://storage.googleapis.com/eviusauth.appspot.com/evius/events/Re391nNxdz7DhzJLuRekOW67j9ejpDYLsJ6xOE8U.jpg',
            text: 'Bienvenidos al chat de Evius.co',
            timestamp: formatAMPM(new Date()),
          })
          .then(function(messageRef) {})
          .then(() => console.log('chat  iniciado'))
          .catch(function(error) {
            console.error('There was an error uploading a file to Cloud Storage:', error);
          });
      } else {
      }
    })
    .then(() => {})
    .catch(function(error) {
      console.error('There was an error uploading a file to Cloud Storage:', error);
    });
};

const addInitalMessage = (colection) => {
  firestoreeviuschat
    .collection(colection)
    .add({
      name: 'Evius',
      text: 'Bienvenidos al chat de Evius',
      profilePicUrl: 'https://cutt.ly/sRxhivy',
      timestamp: formatAMPM(new Date()),
    })
    .then(function(messageRef) {})
    .then(() => {})
    .catch(function(error) {
      console.error('There was an error uploading a file to Cloud Storage:', error);
    });
};

export const createChatInitalPrivate = (idchat) => {
  firestoreeviuschat
    .collection('messages' + idchat)
    .get()
    .then((response) => {
      if (response.docs.length == 0) {
        addInitalMessage('messages' + idchat);
      }
    });
};
