import { firestore, fireRealtime } from '../../../../helpers/firebase';
import { SurveysApi, TicketsApi } from '../../../../helpers/request';
import * as Cookie from 'js-cookie';
import updateTotalVoteMultipleAnswer from './updateTotalVoteMultipleAnswer';
import updateTotalVoteSingleAnswer from './updateTotalVoteSingleAnswer';

// Funcion para realizar conteo de las opciones por pregunta
const countAnswers = (surveyId, questionId, optionQuantity, optionIndex, voteValue) => {
   // Se valida si el voto tiene valor de lo contrario sumara 1
   let vote = typeof voteValue == 'number' ? parseFloat(voteValue) : 1;

   const updateTotalVoteParameters = {
      optionIndex,
      vote,
   };

   const realTimeRef = fireRealtime.ref(`surveys/${surveyId}/answer_count/${questionId}`);
   /** Cifra aleatoria que se agrega como tolerancia para el setTimeOut que envuelve las transacciones */
   const randomNumber = Math.random() * (0.8 - 0.3) + 0.3;
   const toleranceTime = Math.round(randomNumber * 100) / 100;

   /** setTimeOut que nos permite crear delay entre insersiones ya que si no se pone firebase RealTime espera el bloque completo de transacciones para actualizarlas y se incrementan los tiempos de respuesta */
   setTimeout(() => {
      realTimeRef.transaction((questionAnswerCount) => {
         if (questionAnswerCount) {
            if (optionIndex && optionIndex.length && optionIndex.length > 0) {
               updateTotalVoteMultipleAnswer(updateTotalVoteParameters, questionAnswerCount);
            } else {
               updateTotalVoteSingleAnswer(updateTotalVoteParameters, questionAnswerCount);
            }
         } else {
            // Se crea un objeto que se asociara a las opciones de las preguntas
            // Y se inicializan con valores en 0, para luego realizar el conteo
            let firstData = {};
            for (var i = 0; i < optionQuantity; i++) {
               let idResponse = i.toString();

               // Se valida si se escogio mas de una opcion en la pregunta o no
               if (optionIndex && optionIndex.length && optionIndex.length > 0) {
                  firstData[idResponse] = optionIndex.includes(i) ? vote : 0;
               } else {
                  firstData[idResponse] = optionIndex == idResponse ? vote : 0;
               }
            }

            // Valida si la colleccion existe, si no, se asigna el arreglo con valores iniciales
            questionAnswerCount = firstData;
         }
         return questionAnswerCount;
      });
   }, toleranceTime);
};

export const SurveyPage = {
   // Obtiene la pagina actual de la encuesta
   // eslint-disable-next-line no-unused-vars
   getCurrentPage: (surveyId, uid) => {
      return new Promise((resolve, reject) => {
         try {
            firestore
               .collection('surveys')
               .doc(surveyId)
               .collection('userProgress')
               .doc(uid)
               .get()
               .then((doc) => {
                  if (doc.exists) {
                     let { currentPageNo } = doc.data();
                     resolve(currentPageNo);
                  } else {
                     resolve(0);
                  }
               });
         } catch (e) {
            reject(e);
         }
      });
   },

   // Actualiza la pagina actual de la encuesta
   setCurrentPage: (surveyId, uid, currentPageNo) => {
      return new Promise((resolve, reject) => {
         let metaData = { currentPageNo: currentPageNo };
         firestore
            .collection('surveys')
            .doc(surveyId)
            .collection('userProgress')
            .doc(uid)
            .set(metaData, { merge: true })
            .then(() => {
               resolve(currentPageNo);
            })
            .catch((err) => {
               reject(err);
            });
      });
   },
};

export const SurveyAnswers = {
   // Servicio para registrar votos para un usuario logeado
   registerWithUID: (surveyId, questionId, dataAnswer, counter) => {
      const { responseData, date, uid, email, names, voteValue } = dataAnswer;
      const { optionQuantity, optionIndex, correctAnswer } = counter;
      let data = {
         response: responseData || '',
         created: date,
         id_user: uid,
         user_email: email,
         user_name: names,
         id_survey: surveyId,
      };

      if (correctAnswer !== undefined) {
         data['correctAnswer'] = correctAnswer;
      }

      if (responseData && responseData?.length > 0) {
         countAnswers(surveyId, questionId, optionQuantity, optionIndex, voteValue);
      }

      firestore
         .collection('surveys')
         .doc(surveyId)
         .collection('answers')
         .doc(questionId)
         .collection('responses')
         .doc(uid)
         .set(data);
   },
   // Servicio para registrar votos para un usuario sin logeo
   registerLikeGuest: async (surveyId, questionId, dataAnswer, counter) => {
      const { responseData, date, uid } = dataAnswer;
      const { optionQuantity, optionIndex, correctAnswer } = counter;

      let data =
         correctAnswer !== undefined
            ? {
                 response: responseData,
                 created: date,
                 id_user: uid,
                 id_survey: surveyId,
                 correctAnswer,
              }
            : {
                 response: responseData,
                 created: date,
                 id_user: uid,
                 id_survey: surveyId,
              };

      countAnswers(surveyId, questionId, optionQuantity, optionIndex);

      return new Promise((resolve, reject) => {
         firestore
            .collection('surveys')
            .doc(surveyId)
            .collection('answers')
            .doc(questionId)
            .collection('responses')
            .add(data)
            .then(() => {
               resolve('Las respuestas han sido enviadas');
            })
            .catch((err) => {
               reject(err);
            });
      });
   },
   // Servicio para obtener el conteo de las respuestas y las opciones de las preguntas
   getAnswersQuestion: async (surveyId, questionId, eventId, updateData, operation) => {
      // eslint-disable-next-line no-unused-vars
      let dataSurvey = await SurveysApi.getOne(eventId, surveyId);
      let options = dataSurvey.questions.find((question) => question.id === questionId);

      const realTimeRef = fireRealtime.ref(`surveys/${surveyId}/answer_count/${questionId}`);

      realTimeRef.on('value', (listResponse) => {
         if (listResponse.exists()) {
            let result = [];
            let total = 0;
            result = listResponse.val();
            switch (operation) {
               case 'onlyCount':
                  Object.keys(result).map((item) => {
                     if (Number.isInteger(parseInt(item)) && Number.isInteger(result[item])) {
                        if (parseInt(item) >= 0) {
                           result[item] = [result[item]];
                        }
                     }
                  });
                  break;

               case 'participationPercentage':
                  Object.keys(result).map((item) => {
                     if (Number.isInteger(parseInt(item)) && Number.isInteger(result[item])) {
                        if (parseInt(item) >= 0) {
                           total = total + result[item];
                        }
                     }
                  });

                  Object.keys(result).map((item) => {
                     if (Number.isInteger(parseInt(item)) && Number.isInteger(result[item])) {
                        if (parseInt(item) >= 0) {
                           const calcPercentage = Math.round((result[item] / total) * 100);
                           result[item] = [result[item], calcPercentage];
                        }
                     }
                  });
                  break;

               case 'registeredPercentage':
                  //result = result;
                  break;
            }
            updateData({ answer_count: result, options });
         }
      });
   },
   // Servicio para validar si un usuario ha respondido la encuesta
   getUserById: async (eventId, survey, userId, onlyQuantityDocs) => {
      let counterDocuments = 0;

      // eslint-disable-next-line no-unused-vars
      return new Promise((resolve, reject) => {
         firestore
            .collectionGroup('responses')
            .where('id_survey', '==', survey._id)
            .where('id_user', '==', userId)
            .get()
            .then((result) => {
               result.forEach(function(doc) {
                  if (doc.exists) {
                     counterDocuments++;
                  }
               });

               if (onlyQuantityDocs) {
                  resolve(counterDocuments);
               }

               if (counterDocuments > 0 && survey.questions && counterDocuments === survey.questions.length) {
                  resolve(true);
               } else {
                  resolve(false);
               }
            });
      });
   },
};

export const Trivia = {
   setTriviaRanking: (surveyId, user, totalPoints, totalQuestions) => {
      const { email, _id } = user;
      const userName = user.names ? user.names : user.name ? user.name : 'Anonymous';
      firestore
         .collection('surveys')
         .doc(surveyId)
         .collection('ranking')
         .doc(_id)
         .set({
            userName: userName,
            userEmail: email,
            totalQuestions: totalQuestions,
            correctAnswers: totalPoints,
            registerDate: new Date(),
         });
   },
};

export const UserGamification = {
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
      let response = await UserGamification.getUserPoints(eventId, userInfo.user_id);
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

         points += data.points;

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

export const Users = {
   getUsers: async (eventId) => {
      const snapshot = await firestore.collection(`${eventId}_event_attendees`).get();
      return snapshot.docs.map((doc) => doc.data());
   },
};

export const listenSurveysData = (event, activity, currentUser, callback) => {
   // console.log("lo que recibo",event,activity, currentUser,)

   //Agregamos un listener a firestore para detectar cuando cambia alguna propiedad de las encuestas
   let $query = firestore.collection('surveys');

   //Le agregamos el filtro por evento

   if (event && event._id) {
      $query = $query.where('eventId', '==', event._id);
   }

   $query.onSnapshot((surveySnapShot) => {
      // Almacena el Snapshot de todas las encuestas del evento

      const eventSurveys = [];
      let publishedSurveys = [];

      if (surveySnapShot.size === 0) {
         const result = { selectedSurvey: {}, surveyVisible: false, publishedSurveys: [], hasOpenSurveys: false };
         callback(result);
         return;
      }

      surveySnapShot.forEach(function(doc) {
         eventSurveys.push({ ...doc.data(), _id: doc.id });
      });

      // Listado de encuestas publicadas del evento
      publishedSurveys = eventSurveys.filter(
         (survey) =>
            (survey.isPublished === 'true' || survey.isPublished === true) &&
            ((activity && survey.activity_id === activity._id) || survey.isGlobal === 'true')
      );

      // el currentUser tomado de redux cuando no hay sesion corresponde a un objeto vacio
      if (Object.keys(currentUser).length === 0) {
         publishedSurveys = publishedSurveys.filter((item) => {
            return item.allow_anonymous_answers !== 'false';
         });
      }

      const openSurveys = publishedSurveys.filter(
         (survey) => survey.isOpened && (survey.isOpened == 'true' || survey.isOpened == true)
      );

      const hasOpenSurveys = openSurveys.length > 0 ? true : false;

      const surveyVisible = publishedSurveys && publishedSurveys.length;

      const result = { publishedSurveys, surveyVisible, loading: true, hasOpenSurveys };

      callback(result);
   });
};

// funcion para obtener el EventUser y los votos
export async function getCurrentEvenUser(eventId, setEventUsers, setVoteWeight) {
   let evius_token = Cookie.get('evius_token');
   let eventUser = [];
   let voteWeight = 1;
   if (evius_token) {
      let response = await TicketsApi.getByEvent(eventId, evius_token);

      if (response.data.length > 0) {
         voteWeight = 0;
         eventUser = response.data;
         response.data.forEach((item) => {
            if (item.properties.pesovoto) voteWeight += parseFloat(item.properties.pesovoto);
         });
      }
   }
   setEventUsers(eventUser);
   setVoteWeight(voteWeight);
}
