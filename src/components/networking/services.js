import { firestore } from "../../helpers/firebase";
import { SurveysApi } from "../../helpers/request";

const refUsersRequests = (eventId) => `${eventId}_users_requests`;

export const networkingFire = {
  sendRequestToUser: async (eventId, data) => {
    console.log("Enviando solicitud", eventId, data);

    const exclude = ({ event_id, ...rest }) => rest;

    let refCollection = refUsersRequests(eventId);
    firestore
      .collection(refCollection)
      .add({ ...exclude(data), created_at: new Date(), updated_at: new Date() })
      .then((result) => {
        console.log("Se creo el documento", result);
      })
      .catch((err) => {
        console.log("Hubo un problema", err);
      });
  },
  acceptedRequest: async (eventId) => {
    console.log("Aceptando solicitud");
  },
  rejectRequest: async (eventId) => {
    console.log("Rechazando solicitud");
  },
};
