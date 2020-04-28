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
