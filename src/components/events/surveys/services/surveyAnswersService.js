import { firestore, fireRealtime } from '../../../../helpers/firebase';
import { SurveysApi } from '../../../../helpers/request';
import countAnswers from './counstAnswersService';

const surveyAnswers = {
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
};

export default surveyAnswers;
