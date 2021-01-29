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

export const createOrUpdateActivity = (event_id, activity_id, roomInfo, tabs) => {
  const tabsSchema = { attendees: false, chat: true, games: false, surveys: false };
  const { roomStatus, platform, meeting_id } = roomInfo;
  console.log('Create or Update', event_id, activity_id, roomInfo, tabs);

  return new Promise((resolve, reject) => {
    validateHasVideoconference(event_id, activity_id).then((existSurvey) => {
      if (existSurvey) {
        firestore
          .collection('events')
          .doc(event_id)
          .collection('activities')
          .doc(activity_id)
          .update({
            habilitar_ingreso: roomStatus,
            platform,
            meeting_id,
            tabs,
          })
          .then(() => resolve({ message: 'Configuracion actualizada', state: 'updated' }));
      } else {
        firestore
          .collection('events')
          .doc(event_id)
          .collection('activities')
          .doc(activity_id)
          .set({
            habilitar_ingreso: roomStatus,
            platform,
            meeting_id,
            tabs: tabsSchema,
          })
          .then(() => resolve({ message: 'Configuracion Creada', state: 'created' }));
      }
    });
  });
};

export const getConfiguration = (event_id, activity_id) => {
  return new Promise((resolve, reject) => {
    firestore
      .collection('events')
      .doc(event_id)
      .collection('activities')
      .doc(activity_id)
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
