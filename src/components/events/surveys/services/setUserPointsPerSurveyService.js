import { firestore } from '../../../../helpers/firebase';

function setUserPointsPerSurvey(surveyId, user, totalPoints, totalQuestions) {
   const { email, _id } = user;
   const userName = user.names ? user.names : user.name ? user.name : 'Anonymous';
   //Guarda el puntaje del usuario
   firestore
      .collection('surveys')
      .doc(surveyId)
      .collection('ranking')
      .doc(_id)
      .set({
         userName: userName,
         userEmail: email,
         totalQuestions: totalQuestions,
         correctAnswers: totalPoints,
         registerDate: new Date(),
      });
}

export default setUserPointsPerSurvey;
