import { firestoreeviuschat, app } from "../../helpers/firebase";
export const createChatRoom = (idroom) => {
  console.log("creando este chat para ver de one");
  let refchatroom = firestoreeviuschat
    .collection("messages" + idroom)
    .doc("initial");
  refchatroom
    .get()
    .then((doc) => {
      if (!doc.exists) {
        firestoreeviuschat
          .collection("messages" + idroom)
          .doc("initial")
          .set({
            name: "Evius.co",
            profilePicUrl:
              "https://storage.googleapis.com/eviusauth.appspot.com/evius/events/Re391nNxdz7DhzJLuRekOW67j9ejpDYLsJ6xOE8U.jpg",
            text: "Bienvenidos al chat de Evius.co",
            timestamp: app.firestore.FieldValue.serverTimestamp(),
          })
          .then(function(messageRef) {})
          .then(() => console.log("chat  iniciado"))
          .catch(function(error) {
            console.error(
              "There was an error uploading a file to Cloud Storage:",
              error
            );
          });
      } else {
        // console.log("hay documentos", doc.data());
      }
    })
    .then(() => console.log("chat  iniciado"))
    .catch(function(error) {
      console.error(
        "There was an error uploading a file to Cloud Storage:",
        error
      );
    });
};

const addInitalMessage = (colection) => {
  firestoreeviuschat
    .collection(colection)
    .add({
      name: "Evius",
      text: "Bienvenidos al chat de Evius",
      profilePicUrl: "https://cutt.ly/sRxhivy",
      timestamp: app.firestore.FieldValue.serverTimestamp(),
    })
    .then(function(messageRef) {})
    .then(() => console.log("chat  iniciado"))
    .catch(function(error) {
      console.error(
        "There was an error uploading a file to Cloud Storage:",
        error
      );
    });
};

export const createChatInitalPrivate = (idchat) => {
  firestoreeviuschat
    .collection("messages" + idchat)
    .get()
    .then((response) => {
      // console.log("responsebusqueda",response.docs.length);
      if (response.docs.length == 0) {
        addInitalMessage("messages" + idchat);
      }
    });
};
