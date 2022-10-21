import { firestoreeviuschat, app } from '@helpers/firebase';
const hoy = new Date();

function formatAMPM(hoy) {
  let hours = hoy.getHours();
  let minutes = hoy.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  const strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

export const createChatRoom = (idroom) => {
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
    .then(function (messageRef) { })
    .then(() => { })
    .catch(function (error) {
      console.error('There was an error uploading a file to Cloud Storage:', error);
    });
};

export const createChatInitalPrivate = (idchat) => {
};
