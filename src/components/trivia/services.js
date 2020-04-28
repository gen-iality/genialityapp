import { firestore } from "../../helpers/firebase";

export const getTotalVotes = (surveyId, question) => {
  return new Promise((resolve, reject) => {
    firestore
      .collection(`surveys/${surveyId}/answers/${question.id}/responses`)
      .get()
      .then((result) => {
        if (result.empty) {
          resolve({ ...question, quantityResponses: 0 });
        }
        resolve({ ...question, quantityResponses: result.size });
      })
      .catch((err) => {
        reject("Hubo un problema ", err);
      });
  });
};

export const getAnswersByQuestion = (surveyId, questionId) => {
  console.log(surveyId, questionId);
  return new Promise((resolve, reject) => {
    let docs = [];
    firestore
      .collection(`surveys/${surveyId}/answers/${questionId}/responses`)
      .orderBy("created", "desc")
      .get()
      .then((result) => {
        if (result.empty) {
          resolve(false);
        }
        result.forEach((infoDoc) => {
          docs.push({ ...infoDoc.data(), _id: infoDoc.id });
        });
        resolve(docs);
      })
      .catch((err) => {
        reject("Hubo un problema ", err);
      });
  });
};
