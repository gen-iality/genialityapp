import { firestore } from '../../helpers/firebase';
import Moment from 'moment';

const refSurvey = firestore.collection('surveys');

export const validateSurveyCreated = (surveyId) => {
  return new Promise((resolve, reject) => {
    refSurvey.doc(surveyId).onSnapshot((survey) => {
      if (!survey.exists) {
        resolve(false);
      }
      resolve(true);
    });
  });
};

export const createOrUpdateSurvey = (surveyId, status, surveyInfo) => {
  return new Promise((resolve, reject) => {
    validateSurveyCreated(surveyId).then((existSurvey) => {
      if (existSurvey) {
        refSurvey
          .doc(surveyId)
          .update({ ...status })
          .then(() => resolve({ message: 'Encuesta Actualizada', state: 'updated' }));
      } else {
        refSurvey
          .doc(surveyId)
          .set({ ...surveyInfo, ...status })
          .then(() => resolve({ message: 'Encuesta Creada', state: 'created' }));
      }
    });
  });
};

export const deleteSurvey = (surveyId) => {
  return new Promise((resolve, reject) => {
    refSurvey
      .doc(surveyId)
      .delete()
      .then(() => resolve({ message: 'Encuesta Eliminada', state: 'deleted' }));
  });
};

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
        reject('Hubo un problema ', err);
      });
  });
};

export const getAnswersByQuestion = (surveyId, questionId) => {
  return new Promise((resolve, reject) => {
    let docs = [];
    firestore
      .collection(`surveys/${surveyId}/answers/${questionId}/responses`)
      .orderBy('created', 'desc')
      .get()
      .then((result) => {
        if (result.empty) {
          resolve(false);
        }
        result.forEach((infoDoc) => {
          let creation_date_text = Moment.unix(infoDoc.data().created.seconds).format('DD MMM YYYY hh:mm a');
          docs.push({ ...infoDoc.data(), _id: infoDoc.id, creation_date_text });
        });
        resolve(docs);
      })
      .catch((err) => {
        reject('Hubo un problema ', err);
      });
  });
};

export const getTriviaRanking = (surveyId) => {
  return new Promise((resolve, reject) => {
    const list = [];
    firestore
      .collection('surveys')
      .doc(surveyId)
      .collection('ranking')
      .get()
      .then((result) => {
        if (!result.empty) {
          result.forEach((item) => {
            let registerDate = Moment.unix(item.data().registerDate.seconds).format('DD MMM YYYY hh:mm a');

            list.push({ ...item.data(), _id: item.id, registerDate });
          });

          resolve(list);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};
