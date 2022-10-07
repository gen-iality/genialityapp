import { firestore } from '@helpers/firebase';

const refActivity = firestore.collection('events');

export const validateActivityCreated = (activityId, event_id) => {
  return new Promise((resolve, reject) => {
    refActivity
      .doc(event_id)
      .collection('activities')
      .doc(activityId)
      .onSnapshot((survey) => {
        if (!survey.exists) {
          resolve(false);
        }
        resolve(true);
      });
  });
};

export const createOrUpdateActivity = (activityId, event_id, activityInfo, tabs) => {
  const tabsSchema = { attendees: false, chat: true, games: false, surveys: false };
  return new Promise((resolve, reject) => {
    validateActivityCreated(activityId, event_id).then((existSurvey) => {
      if (existSurvey) {
        refActivity
          .doc(event_id)
          .collection('activities')
          .doc(activityId)
          .update({
            habilitar_ingreso: activityInfo,
            tabs: tabs,
          })
          .then(() => resolve({ message: 'Configuración actualizada', state: 'updated' }));
      } else {
        refActivity
          .doc(event_id)
          .collection('activities')
          .doc(activityId)
          .set({
            habilitar_ingreso: activityInfo,
            tabs: tabsSchema,
          })
          .then(() => resolve({ message: 'Configuracioón Creada', state: 'created' }));
      }
    });
  });
};

export const getConfiguration = (event_id, activityId) => {
  return new Promise((resolve, reject) => {
    refActivity
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
