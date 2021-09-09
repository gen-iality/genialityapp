import { firestoreeviuschat, app } from '../../helpers/firebase';
export const createChatRoom = (idroom) => {
  console.log('creando este chat para ver de one');
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
            profilePicUrl: 'https://portal.evius.co/wp-content/uploads/2021/03/logo_1.png',
            text: 'Bienvenidos al chat de Evius.co',
            timestamp: app.firestore.FieldValue.serverTimestamp(),
          })
          .then(function(messageRef) {})
          .then(() => console.log('se escribio el msj'))
          .catch(function(error) {
            console.error('There was an error uploading a file to Cloud Storage:', error);
          });
      } else {
        console.log('hay documentos', doc.data());
      }
    })
    .then(() => console.log('se escribio el msj'))
    .catch(function(error) {
      console.error('There was an error uploading a file to Cloud Storage:', error);
    });
};
