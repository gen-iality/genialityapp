import { FB } from '@helpers/firestore-request'

function initRealTimeSurveyListening(idSurvey, updateSurveyDataCallback) {
  console.log('initRealTimeSurveyListening')
  console.log('updateSurveyStatusx')
  const unsubscribe = FB.Surveys.ref(idSurvey).onSnapshot(async (doc) => {
    const surveyRealTime = { ...doc.data(), _id_firebase: doc.id }
    updateSurveyDataCallback(surveyRealTime)
  })

  return unsubscribe
}

export default initRealTimeSurveyListening
