import { firestore } from '../../../helpers/firebase';

export const validateHasVideoconference = (event_id, activity_id) => {
  return new Promise((resolve, reject) => {
    firestore
      .collection('events')
      .doc(event_id)
      .collection('activities')
      .doc(activity_id)
      .onSnapshot((survey) => {
        if (!survey.exists) {
          resolve(false);
        }
        resolve(true);
      });
  });
};

export const createOrUpdateActivity = (event_id, activity_id, activityInfo, tabs) => {
  const tabsSchema = { attendees: false, chat: true, games: false, surveys: false };
  return new Promise((resolve, reject) => {
    validateHasVideoconference(event_id, activity_id).then((existSurvey) => {
      if (existSurvey) {
        firestore
          .collection('events')
          .doc(event_id)
          .collection('activities')
          .doc(activity_id)
          .update({
            habilitar_ingreso: activityInfo,
            tabs: tabs,
          })
          .then(() => resolve({ message: 'Configuracion actualizada', state: 'updated' }));
      } else {
        firestore
          .collection('events')
          .doc(event_id)
          .collection('activities')
          .doc(activity_id)
          .set({
            habilitar_ingreso: activityInfo,
            tabs: tabsSchema,
          })
          .then(() => resolve({ message: 'Configuracion Creada', state: 'created' }));
      }
    });
  });
};

export const getConfiguration = (event_id, activityId) => {
  return new Promise((resolve, reject) => {
    firestore
      .collection('events')
      .doc(event_id)
      .collection('activities')
      .doc(activityId)
      .get()
      .then((result) => {
        if (result.exists) {
          resolve(result.data());
        } else {
          resolve();
        }
      })
      .catch((err) => {
        reject('Hubo un problema ', err);
      });
  });
};
