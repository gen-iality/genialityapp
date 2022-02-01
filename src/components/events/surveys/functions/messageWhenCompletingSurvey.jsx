// Componente que se ejecuta antes del evento onComplete de la encuesta permite mostrar un texto con los puntos conseguidos
function MessageWhenCompletingSurvey(survey, surveyData, totalPoints) {
  let totalQuestions = 0;

  let questions = surveyData.pages;

  /** iteramos las preguntas para validar el puntaje total para la comparativa de puntaje ganado vs puntaje total */
  questions.forEach((item) => {
    if (item.questions) {
      if (item.questions.length === 1 && item.questions[0]?.points) {
        totalQuestions += parseInt(item.questions[0]?.points);
      } else if (item.questions.length === 2 && item.questions[1]?.points) {
        totalQuestions += parseInt(item.questions[1]?.points);
      }
    }
  });

  if (totalQuestions === 0) {
    //Número total de preguntas, se resta uno porque la primer pÃ¡gina es informativa
    totalQuestions = surveyData.pages.length - 1;
  }

  let textOnCompleted = survey.completedHtml;

  survey.currentPage.questions.forEach((question) => {
    let correctAnswer = question.correctAnswer !== undefined ? question.isAnswerCorrect() : undefined;
    if (correctAnswer) totalPoints += parseInt(question.points);
  });

  if (surveyData.allow_gradable_survey === 'true') {
    //const { minimumScore } = surveyData;

    let text = `Has obtenido ${totalPoints} de ${totalQuestions} puntos </br>`;
    if (surveyData.hasMinimumScore === 'true') {
      text +=
        totalPoints >= surveyData.minimumScore
          ? `${surveyData.win_Message ? surveyData.win_Message : ''}`
          : `${surveyData.lose_Message ? surveyData.lose_Message : ''}`;
    }

    survey.completedHtml = `${textOnCompleted}<br>${text}<br>${
      surveyData.neutral_Message ? surveyData.neutral_Message : ''
    }`;
  }
}

export default MessageWhenCompletingSurvey;
