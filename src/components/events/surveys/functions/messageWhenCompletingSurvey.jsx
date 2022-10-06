import { getRightPoints } from './userSurveyStatus';

// Componente que se ejecuta antes del curso onComplete de la encuesta permite mostrar un texto con los puntos conseguidos
async function messageWhenCompletingSurvey(surveyModel, surveyConfig, userId) {
  let totalSurveyPoints = 0;

  let questions = surveyConfig.pages;

  /** iteramos las preguntas para validar el puntaje total para la comparativa de puntaje ganado vs puntaje total */
  questions.forEach(item => {
    if (item.questions) {
      if (item.questions.length === 1 && item.questions[0]?.points) {
        totalSurveyPoints += parseInt(item.questions[0]?.points);
      } else if (item.questions.length === 2 && item.questions[1]?.points) {
        totalSurveyPoints += parseInt(item.questions[1]?.points);
      }
    }
  });

  if (totalSurveyPoints === 0) {
    //Número total de preguntas, se resta uno porque la primer pÃ¡gina es informativa
    totalSurveyPoints = surveyConfig.pages.length - 1;
  }

  let textOnCompleted = surveyModel.completedHtml;

  /* survey.currentPage.questions.forEach((question) => {
    let correctAnswer = question.correctAnswer !== undefined ? question.isAnswerCorrect() : undefined;
    if (correctAnswer) totalPoints += parseInt(question.points);
  }); */

  let totalPoints = await getRightPoints(surveyConfig._id, userId);
  console.log('600 MessageWhenCompletingSurvey getRightPoints totalPoints', totalPoints);

  if (surveyConfig.allow_gradable_survey === 'true') {
    //const { minimumScore } = surveyConfig;

    let text = `Has obtenido ${totalPoints} de ${totalSurveyPoints} puntos </br>`;
    if (surveyConfig.hasMinimumScore === 'true') {
      text +=
        totalPoints >= surveyConfig.minimumScore
          ? `${surveyConfig.win_Message ? surveyConfig.win_Message : ''}`
          : `${surveyConfig.lose_Message ? surveyConfig.lose_Message : ''}`;
    }

    surveyModel.completedHtml = `${textOnCompleted}<br>${text}<br>${
      surveyConfig.neutral_Message ? surveyConfig.neutral_Message : ''
    }`;
  }
}

export default messageWhenCompletingSurvey;
