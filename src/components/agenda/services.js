import { firestore } from "../../helpers/firebase";
import Moment from "moment";

const refActivity = firestore.collection("activities");

export const validateActivityCreated = (activityId) => {
  return new Promise((resolve, reject) => {
    refActivity.doc(activityId).onSnapshot((survey) => {
      if (!survey.exists) {
        resolve(false);
      }
      resolve(true);
    });
  });
};

export const createOrUpdateActivity = (activityId, event_id, activityInfo) => {
  console.log(activityId, activityInfo);
  return new Promise((resolve, reject) => {
    validateActivityCreated(activityId).then((existSurvey) => {
      if (existSurvey) {
        refActivity
          .doc(event_id)
          .collection(activityId)
          .doc("virtualconference")
          .update({ habilitar_ingreso: activityInfo })
          .then(() => resolve({ message: "Configuracion actualizada", state: "updated" }));
      } else {
        refActivity
          .doc(event_id)
          .collection(activityId)
          .doc("virtualconference")
          .set({ habilitar_ingreso: activityInfo })
          .then(() => resolve({ message: "Configuracion Creada", state: "created" }));
      }
    });
  });
};

export const getConfiguration = (event_id, activityId) => {
  return new Promise((resolve, reject) => {
    refActivity
      .doc(event_id)
      .collection(activityId)
      .doc("virtualconference")
      .get()
      .then((result) => {
        if (result.exists) {
          resolve(result.data());
        }
      })
      .catch((err) => {
        reject("Hubo un problema ", err);
      });
  });
};
