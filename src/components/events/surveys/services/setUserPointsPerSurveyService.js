import { FB } from '@helpers/firestore-request'

async function setUserPointsPerSurvey(
  surveyId,
  user,
  totalPoints,
  totalQuestions,
  timeSpent,
) {
  const { email, _id } = user
  const userName = user.names ? user.names : user.name ? user.name : 'Anonymous'
  const doc = await FB.Surveys.Ranking.get(surveyId, _id)

  let partialPoints = 0
  if (doc && doc.correctAnswers) {
    partialPoints = doc.correctAnswers
  }
  //Guarda el puntaje del usuario
  await FB.Surveys.Ranking.edit(surveyId, _id, {
    userId: _id,
    userName: userName,
    userEmail: email,
    totalQuestions: totalQuestions,
    correctAnswers: totalPoints + partialPoints,
    registerDate: new Date(),
    timeSpent: timeSpent,
  })
}

export default setUserPointsPerSurvey
