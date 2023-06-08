import { FB } from '@helpers/firestore-request'

function listenSurveysData(event, activity, currentUser, callback) {
  //Listener a firestore para detectar cuando cambia alguna propiedad de las encuestas
  let $query = FB.Surveys.collection()

  //Filtro por curso
  if (event && event._id) {
    $query = $query.where('eventId', '==', event._id)
  }

  $query.onSnapshot((surveySnapShot) => {
    const eventSurveys = [] // Almacena el Snapshot de todas las encuestas del curso
    let publishedSurveys = []

    if (surveySnapShot.size === 0) {
      const result = {
        selectedSurvey: {},
        surveyVisible: false,
        publishedSurveys: [],
        hasOpenSurveys: false,
      }
      callback(result)
      return
    }

    surveySnapShot.forEach(function (doc) {
      eventSurveys.push({ ...doc.data(), _id: doc.id })
    })

    // Listado de encuestas publicadas del curso
    publishedSurveys = eventSurveys.filter(
      (survey) =>
        (survey.isPublished === 'true' || survey.isPublished) &&
        ((activity && survey.activity_id === activity._id) || survey.isGlobal === 'true'),
    )

    // Cuando el currentUser se toma de redux sin una sesion corresponde a un objeto vacio
    if (Object.keys(currentUser).length === 0) {
      publishedSurveys = publishedSurveys.filter((item) => {
        return item.allow_anonymous_answers !== 'false'
      })
    }

    const openSurveys = publishedSurveys.filter(
      (survey) => survey.isOpened && (survey.isOpened == 'true' || survey.isOpened),
    )

    const hasOpenSurveys = openSurveys.length > 0

    const surveyVisible = publishedSurveys && publishedSurveys.length

    const result = { publishedSurveys, surveyVisible, loading: true, hasOpenSurveys }

    callback(result)
  })
}

export default listenSurveysData
