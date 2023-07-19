import { firestore, fireRealtime } from '@helpers/firebase'
import { FB } from '@helpers/firestore-request'
import dayjs from 'dayjs'

export const validateSurveyCreated = (surveyId) => {
  return new Promise((resolve) => {
    FB.Surveys.ref(surveyId).onSnapshot((survey) => {
      if (!survey.exists) {
        resolve(false)
      }
      resolve(true)
    })
  })
}

/**
 * Create or update survey data in firebase
 *
 * Take in mind: if you use SurveysApi, you have to know that Back-End update
 * the survey for Firebase too.
 *
 * @param {string} surveyId The survey ID
 * @param {any} status any data
 * @param {any} surveyInfo any data again
 * @returns An object with the value message of the result
 */
export const createOrUpdateSurvey = (surveyId, status, surveyInfo) => {
  return new Promise((resolve) => {
    //Abril 2021 @todo migracion de estados de firestore a firebaserealtime
    const eventId = 'general'
    fireRealtime.ref('events/' + eventId + '/surveys/' + surveyId).update(surveyInfo)

    validateSurveyCreated(surveyId).then((existSurvey) => {
      if (existSurvey) {
        FB.Surveys.update(surveyId, { ...status }).then(() =>
          resolve({ message: 'Evaluación actualizada', state: 'updated' }),
        )
      } else {
        FB.Surveys.edit(surveyId, { ...surveyInfo, ...status }).then(() =>
          resolve({ message: 'Evaluación creada', state: 'created' }),
        )
      }
    })
  })
}

export const deleteSurvey = (surveyId) => {
  return new Promise((resolve) => {
    FB.Surveys.delete(surveyId).then(() =>
      resolve({ message: 'Evaluación eliminada', state: 'deleted' }),
    )
  })
}

export const getTotalVotes = (surveyId, question) => {
  return new Promise((resolve, reject) => {
    firestore
      .collection(`surveys/${surveyId}/answers/${question.id}/responses`)
      .get()
      .then((result) => {
        if (result.empty) {
          resolve({ ...question, quantityResponses: 0 })
        }
        resolve({ ...question, quantityResponses: result.size })
      })
      .catch((err) => {
        reject('Hubo un problema ', err)
      })
  })
}

export const getAnswersByQuestion = (surveyId, questionId) => {
  return new Promise((resolve, reject) => {
    const docs = []
    firestore
      .collection(`surveys/${surveyId}/answers/${questionId}/responses`)
      .orderBy('created', 'desc')
      .get()
      .then((result) => {
        if (result.empty) {
          resolve(false)
        }
        result.forEach((infoDoc) => {
          const creation_date_text = dayjs
            .unix(infoDoc.data().created.seconds)
            .format('DD MMM YYYY hh:mm a')
          docs.push({ ...infoDoc.data(), creation_date_text })
        })
        resolve(docs)
      })
      .catch((err) => {
        reject('Hubo un problema ', err)
      })
  })
}

export const getTriviaRanking = (surveyId) => {
  return new Promise((resolve, reject) => {
    const list = []
    FB.Surveys.Ranking.collection(surveyId)
      .get()
      .then((result) => {
        if (!result.empty) {
          result.forEach((item) => {
            const registerDate = dayjs
              .unix(item.data().registerDate.seconds)
              .format('DD MMM YYYY hh:mm:ss a')

            list.push({ ...item.data(), registerDate })
          })

          resolve(list)
        }
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export const getSurveyConfiguration = (surveyId) => {
  return new Promise((resolve, reject) => {
    if (!surveyId) {
      reject('Survey ID required')
    }

    FB.Surveys.get(surveyId).then((data) => resolve(data))
  })
}
