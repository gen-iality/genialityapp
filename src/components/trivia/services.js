import { firestore, fireRealtime } from '../../helpers/firebase';
import Moment from 'moment';

const refSurvey = firestore.collection('surveys');

export const validateSurveyCreated = (surveyId) => {
  return new Promise((resolve) => {
    refSurvey.doc(surveyId).onSnapshot((survey) => {
      if (!survey.exists) {
        resolve(false);
      }
      resolve(true);
    });
  });
};

export const createOrUpdateSurvey = (surveyId, status, surveyInfo) => {
  return new Promise((resolve) => {
    //Abril 2021 @todo migracion de estados de firestore a firebaserealtime
    //let eventId = surveyInfo.eventId || 'general';
    let eventId = 'general';
    fireRealtime.ref('events/' + eventId + '/surveys/' + surveyId).update(surveyInfo);

    validateSurveyCreated(surveyId).then((existSurvey) => {
      if (existSurvey) {
        refSurvey
          .doc(surveyId)
          .update({ ...status })
          .then(() => resolve({ message: 'Evaluación actualizada', state: 'updated' }));
      } else {
        refSurvey
          .doc(surveyId)
          .set({ ...surveyInfo, ...status })
          .then(() => resolve({ message: 'Evaluación creada', state: 'created' }));
      }
    });
  });
};

export const deleteSurvey = (surveyId) => {
  return new Promise((resolve) => {
    refSurvey
      .doc(surveyId)
      .delete()
      .then(() => resolve({ message: 'Evaluación eliminada', state: 'deleted' }));
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
          docs.push({ ...infoDoc.data(), creation_date_text });
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
            let registerDate = Moment.unix(item.data().registerDate.seconds).format('DD MMM YYYY hh:mm:ss a');

            list.push({ ...item.data(), registerDate });
          });

          resolve(list);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getSurveyConfiguration = (surveyId) => {
  return new Promise((resolve, reject) => {
    if (!surveyId) {
      reject('Survey ID required');
    }

    firestore
      .collection('surveys')
      .doc(surveyId)
      .get()
      .then((result) => {
        if (result.exists) {
          const data = result.data();
          resolve(data);
        }
      });
  });
};
