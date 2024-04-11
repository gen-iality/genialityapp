class Service {
  constructor(instance) {
    this.firestore = instance;
    //this.validateHasVideoconference=this.validateHasVideoconference.bind(this);
  }

  validateHasVideoconference = (event_id, activity_id) => {
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
      if (!event_id || !activity_id) resolve(false);
      this.firestore
        .collection("events")
        .doc(event_id)
        .collection("activities")
        .doc(activity_id)
        .get()
        .then((activity) => {
          // console.log('ACTIVITY==>', activity);
          if (!activity.exists) {
            // console.log('ACTIVITY UPDATE==>', activity);
            resolve(false);
          }
          // console.log('ACTIVITY UPDATE==>', activity);
          resolve(true);
        });
    });
  };

  createOrUpdateActivity = (event_id, activity_id, roomInfo, tabs) => {
    //SI EXISTE ACTIVITY ID SI NO SE ROMPE AL CREAR LA ACTIVIDAD
    // console.log('***SE EJECUTA LA ACTUALIZACION***');
    if (activity_id) {
      /* console.log(event_id, activity_id, roomInfo, tabs, 'service'); */
      const tabsSchema = {
        attendees: false,
        chat: true,
        games: false,
        surveys: false,
      };
      const {
        roomState,
        habilitar_ingreso,
        platform,
        meeting_id,
        isPublished,
        host_id,
        host_name,
        typeActivity,
      } = roomInfo;
      // eslint-disable-next-line no-unused-vars

      return new Promise((resolve, reject) => {
        this.validateHasVideoconference(event_id, activity_id).then(
          (existActivity) => {
            if (existActivity) {
              // console.log('avalibleGames', avalibleGames);

              this.firestore
                .collection("events")
                .doc(event_id)
                .collection("activities")
                .doc(activity_id)
                .update({
                  habilitar_ingreso,
                  platform,
                  meeting_id,
                  tabs,
                  isPublished: isPublished,
                  host_id,
                  host_name,
                  typeActivity: typeActivity || null,
                  transmition: roomInfo.transmition || null,
                  avalibleGames: roomInfo?.avalibleGames || [],
                })
                .then(() =>
                  resolve({
                    message: "Configuración actualizada",
                    state: "updated",
                  })
                )
                .catch((err) => console.error("11. ERROR==>", err));
            } else {
              this.firestore
                .collection("events")
                .doc(event_id)
                .collection("activities")
                .doc(activity_id)
                .set({
                  habilitar_ingreso,
                  platform,
                  meeting_id,
                  isPublished: isPublished || false,
                  host_id,
                  host_name,
                  tabs: tabsSchema,
                  typeActivity: typeActivity || null,
                  avalibleGames: roomInfo?.avalibleGames || [],
                  roomState: roomState || null,
                })
                .then(() =>
                  resolve({ message: "Configuración Creada", state: "created" })
                )
                .catch((err) => console.error("11. ERROR==>", err));
            }
          }
        );
      });
    }
  };

  getConfiguration = async (event_id, activity_id) => {
    try {
      const result = await this.firestore
        .collection("events")
        .doc(event_id)
        .collection("activities")
        .doc(activity_id)
        .get();

      if (!result.exists) {
        // Opción 1: Resolver con undefined o null si no hay datos
        return undefined;

        // Opción 2: Rechazar la promesa si se espera que la existencia de la actividad sea un requisito
        // throw new Error(`No se encontró la actividad con ID ${activity_id} en el evento ${event_id}`);
      }

      return result.data();
    } catch (err) {
      // Lanzar un Error con un mensaje más descriptivo que incluya información del error original
      throw new Error(
        `Hubo un problema al obtener la configuración: ${err.message}`
      );
    }
  };

  deleteActivity = (event_id, activity_id) => {
    return new Promise((resolve, reject) => {
      this.firestore
        .collection("events")
        .doc(event_id)
        .collection("activities")
        .doc(activity_id)
        .delete()
        .then(() => resolve("Eliminado"))
        .catch((err) => {
          reject("Hubo un problema ", err);
        });
    });
  };

  setZoomRoom = (token, data) => {
    const url = `https://apimeetings.evius.co:6490/crearroom?token=${token}`;

    return new Promise((resolve) => {
      try {
        fetch(url, {
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(data),
          method: "POST",
        })
          .then(async (response) => {
            if (response.status === 400) {
              resolve({
                message:
                  "No está disponible el host para la fecha/hora indicada",
                state: "error",
              });
            } else {
              return await response.json();
            }
          })
          .then((data) => {
            resolve(data);
          });
      } catch (err) {
        console.error("Error: " + err);
      }
    });
  };

  getZoomRoom = (data) => {
    const url = `https://apimeetings.evius.co:6490/obtenerMeeting`;

    return new Promise((resolve) => {
      try {
        fetch(url, {
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(data),
          method: "POST",
        })
          .then(async (response) => await response.json())
          .then((data) => {
            resolve(data);
          });
      } catch (err) {
        console.error("Error: " + err);
      }
    });
  };

  deleteZoomRoom = (event_id, meeting_id) => {
    const url = `https://apimeetings.evius.co:6490/deleteroom?meeting_id=${meeting_id}&event_id=${event_id}`;

    return new Promise((resolve) => {
      try {
        fetch(url, { method: "DELETE" }).then((response) => resolve(response));
      } catch (err) {
        console.error("Error: " + err);
      }
    });
  };
}

export default Service;
