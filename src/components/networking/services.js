import { firestore } from "../../helpers/firebase";
import API from "../../helpers/request";

const refUsersRequests = (eventId) => `${eventId}_users_requests`;
const refUsersList = (eventId) => `${eventId}_event_attendees`;

const filterList = (list, currentUser) => list.filter((item) => item.account_id !== currentUser);

// Funcion para consultar la informacion del actual usuario
export const getCurrentUserId = (token) => {
  return new Promise(async (resolve, reject) => {
    if (!token) {
      resolve("guestUser");
    } else {
      try {
        const resp = await API.get(`/auth/currentUser?evius_token=${token}`);
        if (resp.status === 200) resolve(resp.data._id);
      } catch (error) {
        const { status } = error.response;
        console.log("STATUS", status, status === 401);
      }
    }
  });
};

export const getCurrentEventUser = (eventId, userId) => {
  return new Promise((resolve, reject) => {
    let refEventUser = refUsersList(eventId);

    firestore
      .collection(refEventUser)
      .where("account_id", "==", userId)
      .get()
      .then((docs) => {
        docs.forEach((infoDoc) => {
          resolve(infoDoc.data());
        });
      })
      .catch((err) => {
        console.log("Hubo un problema: ", err);
      });
  });
};

export const networkingFire = {
  sendRequestToUser: async (eventId, data) => {
    console.log("Enviando solicitud", eventId, data);

    const exclude = ({ event_id, ...rest }) => rest;

    return new Promise((resolve, reject) => {
      if (data.id_user_requested) {
        let refCollection = refUsersRequests(eventId);
        firestore
          .collection(refCollection)
          .add({ ...exclude(data), created_at: new Date(), updated_at: new Date() })
          .then((result) => {
            resolve({ message: "Se ha enviado la solicitud", state: true });
          })
          .catch((err) => {
            reject("Hubo un problema: ", err);
          });
      } else {
        resolve({ message: "Debe estar registrado en el evento para agregar usuarios", state: false });
      }
    });
  },
  acceptedRequest: async (eventId) => {
    console.log("Aceptando solicitud");
  },
  rejectRequest: async (eventId) => {
    console.log("Rechazando solicitud");
  },
};

// User services
export const userRequest = {
  // Obtiene las solicitudes de un usuario
  getUserRequestList: async (eventId, currentUser) => {
    return new Promise((resolve, reject) => {
      let refCollection = refUsersRequests(eventId);

      firestore
        .collection(refCollection)
        .where("id_user_requesting", "==", currentUser)
        .onSnapshot((docs) => {
          console.log(docs, docs.empty);
          let requestList = [];
          if (docs.empty) {
            resolve(false);
          }
          docs.forEach((infoDoc) => {
            console.log("----", infoDoc);
            requestList.push({ _id: infoDoc.id, ...infoDoc.data() });
          });

          resolve(requestList);
        });
    });
  },

  //   Obtiene los contactos de un usuario
  getUserContactList: async () => {
    console.log("Obteniendo la lista de contactos");
  },

  //   Obtiene la lista de los asistentes al evento
  getEventUserList: async (eventId, token) => {
    let refEventUser = refUsersList(eventId);

    return new Promise((resolve, reject) => {
      // Se obtiene el id del token recibido
      getCurrentUserId(token).then(async (userId) => {
        firestore
          .collection(refEventUser)
          .orderBy("updated_at", "desc")
          .onSnapshot((docs) => {
            let docsList = [];
            if (docs.empty) resolve(false);
            docs.forEach((infoDoc) => {
              // Se obtiene la lista de los asistentes si poseen el 'Account_id' y se excluye el usuario actual
              if (infoDoc.data().account_id && infoDoc.data().account_id != userId) docsList.push(infoDoc.data());
            });
            resolve(docsList);
          });
      });
    });
  },
};
