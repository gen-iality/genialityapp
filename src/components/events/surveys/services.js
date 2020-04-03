import { firestore } from "../../../helpers/firebase";

export const SurveyAnswers = {
  registerWithUID: async (surveyId, questionId, dataAnswer) => {
    const { responseData, date, uid } = dataAnswer;

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
  registerLikeGuest: async (surveyId, questionId, dataAnswer) => {
    const { responseData, date, uid } = dataAnswer;

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
  }
};
