import { firestore } from "../../../helpers/firebase";
import { SurveysApi } from "../../../helpers/request";

// Funcion para crear e inicializar la collecion del conteo de las respuestas por preguntas
const createAndInitializeCount = (surveyId, questionId, optionQuantity, optionIndex, voteValue) => {
  return new Promise((resolve, reject) => {
    // Se referencia la colleccion a usar
    const ref_quantity = firestore
      .collection("surveys")
      .doc(surveyId)
      .collection("answer_count")
      .doc(questionId);

    // Se valida si el voto tiene valor de lo contrario sumara 1
    let vote = voteValue ? parseInt(voteValue) : 1;

    // Se crea un objeto que se asociara a las opciones de las preguntas
    // Y se inicializan con valores en 0, para luego realizar el conteo
    let firstData = {};
    for (var i = 0; i < optionQuantity; i++) {
      let idResponse = i.toString();

      // Se valida si se escogio mas de una opcion en la pregunta o no
      if (optionIndex.length > 1) {
        firstData[idResponse] = optionIndex.includes(i) ? vote : 0;
      } else {
        firstData[idResponse] = optionIndex == idResponse ? vote : 0;
      }
    }

    // Valida si la colleccion existe, si no, se asigna el arreglo con valores iniciales
    ref_quantity.get().then((data) => {
      if (!data.exists) {
        ref_quantity.set(firstData);
      }
    });

    // Se resuelve la promesa si la coleccion ya existe
    ref_quantity.get().then((data) => {
      if (data.exists) {
        resolve({ message: "Existe el documento", optionIndex, surveyId, questionId });
      }
    });
  });
};

// Funcion para realizar conteo de las opciones por pregunta
const countAnswers = (surveyId, questionId, optionQuantity, optionIndex, voteValue) => {
  createAndInitializeCount(surveyId, questionId, optionQuantity, optionIndex, voteValue).then(
    ({ surveyId, message, questionId, optionIndex }) => {
      // Se valida si el voto tiene valor de lo contrario sumara 1
      let vote = voteValue ? parseInt(voteValue) : 1;

      const shard_ref = firestore
        .collection("surveys")
        .doc(surveyId)
        .collection("answer_count")
        .doc(questionId);

      // Se obtiene el index de la opcion escogida
      const position = optionIndex;

      // Update count in a transaction
      return firestore.runTransaction((t) => {
        return t.get(shard_ref).then((doc) => {
          // Condiciona si tiene mas de una opcion escogida
          if (position.length > 1) {
            position.forEach((element) => {
              const new_count = doc.data()[element] + vote;
              t.update(shard_ref, { [element]: new_count });
            });
          } else {
            const new_count = doc.data()[position] + vote;
            t.update(shard_ref, { [position]: new_count });
          }

          // console.log(doc.data()[position]);
        });
      });
    }
  );
};

export const SurveyPage = {
  // Obtiene la pagina actual de la encuesta
  getCurrentPage: (surveyId, self) => {
    firestore
      .collection("surveys")
      .doc(surveyId)
      .onSnapshot((survey) => {
        let { currentPage } = survey.data();
        self.setState({ currentPage });
      });
  },

  // Actualiza la pagina actual de la encuesta
  setCurrentPage: (surveyId, page) => {
    firestore
      .collection("surveys")
      .doc(surveyId)
      .update({ currentPage: page });
  },
};

export const SurveyAnswers = {
  // Servicio para registrar votos para un usuario logeado
  registerWithUID: async (surveyId, questionId, dataAnswer, counter) => {
    const { responseData, date, uid, email, names, voteValue } = dataAnswer;
    const { optionQuantity, optionIndex, correctAnswer } = counter;

    let data =
      correctAnswer !== undefined
        ? {
            response: responseData,
            created: date,
            id_user: uid,
            user_email: email,
            user_name: names,
            id_survey: surveyId,
            correctAnswer,
          }
        : {
            response: responseData,
            created: date,
            id_user: uid,
            user_email: email,
            user_name: names,
            id_survey: surveyId,
          };

    countAnswers(surveyId, questionId, optionQuantity, optionIndex, voteValue);

    return new Promise((resolve, reject) => {
      firestore
        .collection("surveys")
        .doc(surveyId)
        .collection("answers")
        .doc(questionId)
        .collection("responses")
        .doc(uid)
        .set(data)
        .then(() => {
          console.log("Document successfully updated!");
          // resolve("Las respuestas han sido enviadas");
          resolve("El voto ha sido registrado");
        })
        .catch((err) => {
          console.log("Document successfully updated!");
          reject(err);
        });
    });
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
        .collection("surveys")
        .doc(surveyId)
        .collection("answers")
        .doc(questionId)
        .collection("responses")
        .add(data)
        .then(() => {
          console.log("Document successfully updated!");
          resolve("Las respuestas han sido enviadas");
        })
        .catch((err) => {
          console.log("Document successfully updated!");
          reject(err);
        });
    });
  },
  // Servicio para obtener el conteo de las respuestas y las opciones de las preguntas
  getAnswersQuestion: async (surveyId, questionId, eventId, updateData) => {
    let docs = [];

    return new Promise(async (resolve, reject) => {
      let dataSurvey = await SurveysApi.getOne(eventId, surveyId);
      let options = dataSurvey.questions.find((question) => question.id == questionId);

      firestore
        .collection("surveys")
        .doc(surveyId)
        .collection("answer_count")
        .doc(questionId)
        .onSnapshot((listResponse) => {
          updateData({ answer_count: listResponse.data(), options });
        });
    });
  },
  // Servicio para validar si un usuario ha respondido la encuesta
  getUserById: async (eventId, survey, userId, onlyQuantityDocs) => {
    let counterDocuments = 0;

    return new Promise((resolve, reject) => {
      firestore
        .collectionGroup("responses")
        .where("id_survey", "==", survey._id)
        .where("id_user", "==", userId)
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

          if (counterDocuments > 0 && counterDocuments == survey.questions.length) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
    });
  },
};

export const UserGamification = {
  getListPoints: (eventId, getRankingList) => {
    firestore.collection(`${eventId}_users_gamification`).onSnapshot((docs) => {
      let userList = [];
      let pointsList = [];
      docs.forEach((infoDoc) => {
        userList.push(infoDoc.data().user_name);
        pointsList.push(infoDoc.data().points);
      });
      getRankingList({ userList, pointsList });
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
            resolve({ message: "Se encontro un registro", status: true, data: doc.data() });
          }
          resolve({ message: "No se encontraron registros", status: false });
        })
        .catch((err) => {
          console.log("err:", err);
          reject({ message: "Ha ocurrido un error", err });
        });
    });
  },
  // Servicio que registra o actualiza los puntos de un usuario
  registerPoints: async (eventId, userInfo) => {
    // Verifica si ya hay un documento que almacene los puntos del usuario, para crearlo o actualizarlo
    let response = await UserGamification.getUserPoints(eventId, userInfo.user_id);
    // console.log("response:", response);

    if (!response.status) {
      firestore
        .collection(`${eventId}_users_gamification`)
        .doc(userInfo.user_id)
        .set({ ...userInfo, created_at: new Date(), updated_at: new Date() })
        .then(() => {
          console.log("Puntos registrados satisfactoriamente");
        })
        .catch((err) => {
          console.log("Ha ocurrido un error", err);
        });
    } else {
      let { points } = userInfo;
      let { data } = response;

      points += data.points;

      firestore
        .collection(`${eventId}_users_gamification`)
        .doc(userInfo.user_id)
        .update({ points, updated_at: new Date() })
        .then(() => {
          console.log("Puntos registrados satisfactoriamente");
        })
        .catch((err) => {
          console.log("Ha ocurrido un error", err);
        });
    }
  },
};
