import { firestore } from "../../../helpers/firebase";
import { SurveysApi } from "../../../helpers/request";

// Funcion para crear e inicializar la collecion del conteo de las respuestas por preguntas
const createAndInitializeCount = (surveyId, questionId, optionQuantity, optionIndex) => {
  return new Promise((resolve, reject) => {
    // Se referencia la colleccion a usar
    const ref_quantity = firestore
      .collection("surveys")
      .doc(surveyId)
      .collection("answer_count")
      .doc(questionId);

    // Se crea un objeto que se asociara a las opciones de las preguntas
    // Y se inicializan con valores en 0, para luego realizar el conteo
    let firstData = {};
    for (var i = 0; i < optionQuantity; i++) {
      let idResponse = i.toString();
      firstData[idResponse] = 0;
    }

    // Valida si la colleccion existe, si no, se asigna el arreglo con valores iniciales
    ref_quantity.get().then(data => {
      if (!data.exists) {
        ref_quantity.set(firstData);
      }
    });

    // Se resuelve la promesa si la coleccion ya existe
    ref_quantity.onSnapshot(data => {
      if (data.exists) {
        resolve({ message: "Existe el documento", optionIndex, surveyId, questionId });
      }
    });
  });
};

// Funcion para realizar conteo de las opciones por pregunta
const countAnswers = (surveyId, questionId, optionQuantity, optionIndex) => {
  createAndInitializeCount(surveyId, questionId, optionQuantity, optionIndex).then(
    ({ surveyId, message, questionId, optionIndex }) => {
      const shard_ref = firestore
        .collection("surveys")
        .doc(surveyId)
        .collection("answer_count")
        .doc(questionId);

      // Se obtiene el index de la opcion escogida
      const position = optionIndex;

      // Update count in a transaction
      return firestore.runTransaction(t => {
        return t.get(shard_ref).then(doc => {
          const new_count = doc.data()[position] + 1;
          t.update(shard_ref, { [position]: new_count });
          // console.log(doc.data()[position]);
        });
      });
    }
  );
};

export const SurveyAnswers = {
  registerWithUID: async (surveyId, questionId, dataAnswer, counter) => {
    const { responseData, date, uid } = dataAnswer;
    const { optionQuantity, optionIndex } = counter;

    countAnswers(surveyId, questionId, optionQuantity, optionIndex);

    return new Promise((resolve, reject) => {
      firestore
        .collection("surveys")
        .doc(surveyId)
        .collection("answers")
        .doc(questionId)
        .collection("responses")
        .doc(uid)
        .set({
          response: responseData,
          created: date,
          id_user: uid
        })
        .then(() => {
          console.log("Document successfully updated!");
          resolve("Las respuestas han sido enviadas");
        })
        .catch(err => {
          console.log("Document successfully updated!");
          reject(err);
        });
    });
  },
  registerLikeGuest: async (surveyId, questionId, dataAnswer, counter) => {
    const { responseData, date, uid } = dataAnswer;
    const { optionQuantity, optionIndex } = counter;

    countAnswers(surveyId, questionId, optionQuantity, optionIndex);

    return new Promise((resolve, reject) => {
      firestore
        .collection("surveys")
        .doc(surveyId)
        .collection("answers")
        .doc(questionId)
        .collection("responses")
        .add({
          response: responseData,
          created: date,
          id_user: uid
        })
        .then(() => {
          console.log("Document successfully updated!");
          resolve("Las respuestas han sido enviadas");
        })
        .catch(err => {
          console.log("Document successfully updated!");
          reject(err);
        });
    });
  },
  getAnswersQuestion: async (surveyId, questionId, eventId) => {
    let docs = [];

    return new Promise(async (resolve, reject) => {
      let dataSurvey = await SurveysApi.getOne(eventId, surveyId);
      let options = dataSurvey.questions.find(question => question.id == questionId);

      firestore
        .collection("surveys")
        .doc(surveyId)
        .collection("answer_count")
        .doc(questionId)
        .onSnapshot(listResponse => {
          resolve({ answer_count: listResponse.data(), options });
        });
    });
  },
  getUserById: async (eventId, surveyId, userId) => {
    let counterDocuments = 0;

    return new Promise((resolve, reject) => {
      firestore
        .collectionGroup("responses")
        .where("id_user", "==", userId)
        .get()
        .then(result => {
          result.forEach(function(doc) {
            if (doc.exists) {
              counterDocuments++;
            }
          });
          if (counterDocuments > 0) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
    });
  }
};
