import StateMessages from './stateMessages';

const MIN_ANSWER_FEEDBACK_TIME = 3;

function TimerAndMessageForTheNextQuestion(
   survey,
   secondsToGo,
   setTimerPausa,
   setFeedbackMessage,
   setShowMessageOnComplete,
   rankingPoints,
   freezeGame,
   setShowOrHideSurvey,
   messageType
) {
   // secondsToGo = secondsToGo ? secondsToGo : 0;
   // secondsToGo += MIN_ANSWER_FEEDBACK_TIME;
   secondsToGo = MIN_ANSWER_FEEDBACK_TIME;
   survey.showTimerPanel = '';
   survey.showTimerPanelMode = '';

   const timer = setInterval(() => {
      secondsToGo -= 1;

      rankingPoints = !rankingPoints ? 0 : rankingPoints;

      if (!messageType) {
         messageType = rankingPoints > 0 ? 'success' : 'error';
      }

      let mensaje = StateMessages(messageType, rankingPoints);
      let mensaje_espera = `${mensaje.subTitle} Espera el tiempo indicado para seguir con el cuestionario.`;
      let mensaje_congelado = `El juego se encuentra en pausa. Espera hasta que el moderador  reanude el juego`;
      mensaje.subTitle = secondsToGo > 0 ? mensaje_espera + ' ' + secondsToGo : mensaje_congelado;
      setFeedbackMessage(mensaje);

      if (secondsToGo <= 0 && (freezeGame === false || freezeGame === 'false')) {
         setShowOrHideSurvey(true);
         clearInterval(timer);
         setShowMessageOnComplete(false);
         setFeedbackMessage({});
         survey.startTimer();
         survey.showTimerPanel = 'top';
         survey.showTimerPanelMode = 'page';
      }
   }, 1000);

   setTimerPausa(timer);
}

export default TimerAndMessageForTheNextQuestion;
