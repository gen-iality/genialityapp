class Service {
  constructor(instance) {
    this.firestore = instance;
  }

  validateHasVideoconference = (event_id, activity_id) => {
    if (!event_id || !activity_id) return false;

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
    console.log(event_id, activity_id, roomInfo, tabs, 'service');
    const tabsSchema = { attendees: false, chat: true, games: false, surveys: false };
    const {
      roomState,
      habilitar_ingreso,
      platform,
      meeting_id,
      isPublished,
      host_id,
      host_name,
      avalibleGames,
    } = roomInfo;
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
              habilitar_ingreso,
              platform,
              meeting_id,
              tabs,
              isPublished,
              host_id,
              host_name,
              avalibleGames,
            })
            .then(() => resolve({ message: 'Configuracion actualizada', state: 'updated' }));
        } else {
          this.firestore
            .collection('events')
            .doc(event_id)
            .collection('activities')
            .doc(activity_id)
            .set({
              habilitar_ingreso,
              platform,
              meeting_id,
              isPublished: isPublished || null,
              host_id,
              host_name,
              tabs: tabsSchema,
              avalibleGames: avalibleGames || null,
              roomState: roomState || null,
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

  setZoomRoom = (token, data) => {
    const url = `https://apimeetings.evius.co:6490/crearroom?token=${token}`;

    return new Promise((resolve) => {
      try {
        fetch(url, {
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(data),
          method: 'POST',
        })
          .then(async (response) => {
            if (response.status === 400) {
              resolve({ message: 'No está disponible el host para la fecha/hora indicada', state: 'error' });
            } else {
              return await response.json();
            }
          })
          .then((data) => {
            resolve(data);
          });
      } catch (err) {
        console.error('Error: ' + err);
      }
    });
  };

  getZoomRoom = (data) => {
    const url = `https://apimeetings.evius.co:6490/obtenerMeeting`;

    return new Promise((resolve) => {
      try {
        fetch(url, {
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(data),
          method: 'POST',
        })
          .then(async (response) => await response.json())
          .then((data) => {
            resolve(data);
          });
      } catch (err) {
        console.error('Error: ' + err);
      }
    });
  };

  deleteZoomRoom = (event_id, meeting_id) => {
    const url = `https://apimeetings.evius.co:6490/deleteroom?meeting_id=${meeting_id}&event_id=${event_id}`;

    return new Promise((resolve) => {
      try {
        fetch(url, { method: 'DELETE' }).then((response) => resolve(response));
      } catch (err) {
        console.error('Error: ' + err);
      }
    });
  };
}

export default Service;
