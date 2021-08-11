import { firestore } from '../../../../helpers/firebase';

const userGamification = {
   getListPoints: (eventId, setRankingList) => {
      firestore.collection(`${eventId}_users_gamification`).onSnapshot((docs) => {
         let userList = [];
         let pointsList = [];
         docs.forEach((infoDoc) => {
            userList.push(infoDoc.data().user_name);
            pointsList.push(infoDoc.data().points);
         });
         setRankingList({ userList, pointsList });
      });
   },
   // Servicio que obtiene los puntos de un usuario
   getUserPoints: async (eventId, userId) => {
      return new Promise((resolve, reject) => {
         firestore
            .collection(`${eventId}_users_gamification`)
            .doc(userId)
            .get()
            .then((doc) => {
               if (doc.exists) {
                  resolve({ message: 'Se encontro un registro', status: true, data: doc.data() });
               }
               resolve({ message: 'No se encontraron registros', status: false });
            })
            .catch((err) => {
               console.error('err:', err);
               reject({ message: 'Ha ocurrido un error', err });
            });
      });
   },
   // Servicio que registra o actualiza los puntos de un usuario
   registerPoints: async (eventId, userInfo) => {
      // Verifica si ya hay un documento que almacene los puntos del usuario, para crearlo o actualizarlo
      let response = await userGamification.getUserPoints(eventId, userInfo.user_id);
      //

      if (!response.status) {
         firestore
            .collection(`${eventId}_users_gamification`)
            .doc(userInfo.user_id)
            .set({ ...userInfo, created_at: new Date(), updated_at: new Date() })
            .then(() => {})
            .catch((err) => {
               console.error('Ha ocurrido un error', err);
            });
      } else {
         let { points } = userInfo;
         let { data } = response;
         isNaN(data.points) ? points : points += data.points;

         firestore
            .collection(`${eventId}_users_gamification`)
            .doc(userInfo.user_id)
            .update({ points, updated_at: new Date() })
            .then(() => {})
            .catch((err) => {
               console.error('Ha ocurrido un error', err);
            });
      }
   },
};

export default userGamification;
