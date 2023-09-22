import { firestore } from '../../../../helpers/firebase';

async function setUserPointsPerSurvey(surveyId: string, user: any, totalPoints: any, totalQuestions: any, timeSpent: any) {
  const { email, _id } = user;
  const userName = user.names ? user.names : user.name ? user.name : 'Anonymous';
  const doc = await firestore
    .collection('surveys')
    .doc(surveyId)
    .collection('ranking')
    .doc(_id)
    .get();

  let partialPoints = 0;
  // @ts-ignore
  if (doc && doc.data() && doc.data().correctAnswers) {
    // @ts-ignore
    partialPoints = doc.data().correctAnswers;
  }
  //Guarda el puntaje del usuario
  console.log('TEST', 'Guarda puntaje')
  await firestore
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
      timeSpent: timeSpent,
    });
}

export default setUserPointsPerSurvey;
