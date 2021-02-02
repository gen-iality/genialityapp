class Service {
  constructor(instance) {
    this.firestore = instance;
  }

  validateHasVideoconference = (event_id, activity_id) => {
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
      this.firestore
        .collection('events')
        .doc(event_id)
        .collection('activities')
        .doc(activity_id)
        .onSnapshot((activity) => {
          if (!activity.exists) {
            resolve(false);
          }
          resolve(true);
        });
    });
  };

  createOrUpdateActivity = (event_id, activity_id, roomInfo, tabs) => {
    const tabsSchema = { attendees: false, chat: true, games: false, surveys: false };
    const { roomStatus, platform, meeting_id, isPublished } = roomInfo;
    console.log('room info', roomInfo);
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
      this.validateHasVideoconference(event_id, activity_id).then((existActivity) => {
        if (existActivity) {
          this.firestore
            .collection('events')
            .doc(event_id)
            .collection('activities')
            .doc(activity_id)
            .update({
              habilitar_ingreso: roomStatus,
              platform,
              meeting_id,
              tabs,
              isPublished,
            })
            .then(() => resolve({ message: 'Configuracion actualizada', state: 'updated' }));
        } else {
          this.firestore
            .collection('events')
            .doc(event_id)
            .collection('activities')
            .doc(activity_id)
            .set({
              habilitar_ingreso: roomStatus,
              platform,
              meeting_id,
              isPublished,
              tabs: tabsSchema,
            })
            .then(() => resolve({ message: 'Configuracion Creada', state: 'created' }));
        }
      });
    });
  };

  getConfiguration = (event_id, activity_id) => {
    return new Promise((resolve, reject) => {
      this.firestore
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
}

export default Service;
