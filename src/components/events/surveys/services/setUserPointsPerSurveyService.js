import { firestore } from '../../../../helpers/firebase';

async function setUserPointsPerSurvey(surveyId, user, totalPoints, totalQuestions) {
  const { email, _id } = user;
  const userName = user.names ? user.names : user.name ? user.name : 'Anonymous';
  const doc = await firestore
    .collection('surveys')
    .doc(surveyId)
    .collection('ranking')
    .doc(_id)
    .get();

  let partialPoints = 0;
  if (doc && doc.data() && doc.data().correctAnswers) {
    partialPoints = doc.data().correctAnswers;
  }
  //Guarda el puntaje del usuario
  firestore
    .collection('surveys')
    .doc(surveyId)
    .collection('ranking')
    .doc(_id)
    .set({
      userId: _id,
      userName: userName,
      userEmail: email,
      totalQuestions: totalQuestions,
      correctAnswers: totalPoints + partialPoints,
      registerDate: new Date(),
    });
}

export default setUserPointsPerSurvey;
