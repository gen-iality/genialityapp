import React, { useState, useEffect } from 'react';
import { Result, Button } from 'antd';
import { BulbOutlined } from '@ant-design/icons';
import { SurveyPage, UserGamification, Trivia, getCurrentEvenUser } from './services/services';
import Graphics from './graphics';
import { UseEventContext } from '../../../Context/eventContext';
import * as Survey from 'survey-react';
import InternarlSurveyStyles from './components/internarlSurveyStyles';
import LoadSelectedSurvey from './services/loadSelectedSurvey';
import RegisterVote from './services/registerVote';
import TimerAndMessageForTheNextQuestion from './services/timerAndMessageForTheNextQuestion';
import HelpFiftyFifty from './services/helpFiftyFifty';
import MessageWhenCompletingSurvey from './services/messageWhenCompletingSurvey';
import RealTimeSurveyListening from './services/realTimeSurveyListening';
import TimeLimitPerQuestion from './services/timeLimitPerQuestion';

function SurveyComponent(props) {
   const { eventId, idSurvey, surveyLabel, operation, showListSurvey, currentUser } = props;

   const cEvent = UseEventContext();
   const eventStyles = cEvent.value.styles;

   const [surveyData, setSurveyData] = useState({});
   const [rankingList, setRankingList] = useState([]); // Este estado se usa para gamification
   const [feedbackMessage, setFeedbackMessage] = useState({});
   const [eventUsers, setEventUsers] = useState([]);
   const [voteWeight, setVoteWeight] = useState(0);
   const [freezeGame, setFreezeGame] = useState(false);
   const [showMessageOnComplete, setShowMessageOnComplete] = useState(false);
   const [timerPausa, setTimerPausa] = useState(null);
   const [survey, setSurvey] = useState(null);
   const [rankingPoints, setRankingPoints] = useState(0);
   const [fiftyfitfyused, setFiftyfitfyused] = useState(false);
   const [realTimeSurvey, setRealTimeSurvey] = useState(null);
   let [totalPoints, setTotalPoints] = useState(0);

   useEffect(() => {
      // asigna los colores del evento para la UI de la encuesta
      InternarlSurveyStyles(eventStyles);

      //listener que nos permite saber los cambios de la encuesta en tiempo real
      RealTimeSurveyListening(idSurvey, currentUser, setFreezeGame, setRealTimeSurvey);
   }, [idSurvey]);

   useEffect(() => {
      if (realTimeSurvey) {
         startingSurveyComponent();
      }
   }, [realTimeSurvey]);

   useEffect(() => {
      /**
       * Timers para controlar el tiempo por pregunta, estos se deben detener o el quiz seguira avanzando errando la logica ya que cambia la pregunta que se esta respondiendo
       */
      if (survey) {
         survey.stopTimer();
      }
      if (timerPausa) {
         clearInterval(timerPausa);
      }
   }, [survey, idSurvey]);

   async function startingSurveyComponent() {
      let loadSurveyData = await LoadSelectedSurvey(eventId, idSurvey, surveyData);

      loadSurveyData.open = realTimeSurvey.isOpened;
      loadSurveyData.publish = realTimeSurvey.isPublished;
      loadSurveyData.freezeGame = realTimeSurvey.freezeGame;

      const surveyModelData = new Survey.Model(loadSurveyData);

      setSurveyData(loadSurveyData);
      setSurvey(surveyModelData);

      // Esto permite obtener datos para la grafica de gamificacion
      UserGamification.getListPoints(eventId, setRankingList);

      //Se obtiene el EventUser para los casos que se necesite saber el peso voto
      await getCurrentEvenUser(eventId, setEventUsers, setVoteWeight);
   }

   // Funcion para enviar la informacion de las respuestas
   async function sendData(surveyModel) {
      setRankingPoints(0);

      // let pointsEarnedPerQuestion;
      await Promise.all(
         surveyModel.currentPage.questions.map(async (question) => {
            let { pointsForCorrectAnswer } = await RegisterVote(
               surveyData,
               question,
               currentUser,
               eventUsers,
               voteWeight
            );
            if (pointsForCorrectAnswer) {
               // pointsEarnedPerQuestion = pointsForCorrectAnswer;
               setRankingPoints(pointsForCorrectAnswer);
            }
            registerRankingPoints(pointsForCorrectAnswer, surveyModel, surveyData, currentUser.value, eventId);
            return pointsForCorrectAnswer;
         })
      );

      if (!(Object.keys(currentUser).length === 0)) {
         //Actualizamos la página actúal, sobretodo por si se cae la conexión regresar a la última pregunta
         SurveyPage.setCurrentPage(surveyData._id, currentUser.value._id, surveyModel.currentPageNo);
      }

      let isLastPage = surveyModel.isLastPage;

      if (surveyData.allow_gradable_survey === 'true') {
         if (isLastPage) {
            setShowMessageOnComplete(false);
         }
      }
   }

   function registerRankingPoints(rankingPoints, surveyModel, surveyData, currentUser, eventId) {
      if (rankingPoints == undefined || rankingPoints == 0) return;
      if (surveyData.allow_gradable_survey !== 'true') return;

      //para guardar el score en el ranking
      totalPoints += rankingPoints;
      setTotalPoints(totalPoints);

      // Ejecuta serivicio para registrar puntos
      UserGamification.registerPoints(eventId, {
         user_id: currentUser._id,
         user_name: currentUser.names,
         user_email: currentUser.email,
         points: rankingPoints,
      });

      Trivia.setTriviaRanking(surveyData._id, currentUser, totalPoints, surveyModel.getAllQuestions().length - 1);
      // message.success({ content: responseMessage });
   }

   /* handler cuando la encuesta inicia, este sirve para retomar la encuesta donde vayan todos los demas usuarios */
   function onStartedSurvey(survey) {
      //
      if (surveyData.allow_gradable_survey === 'true') {
         if (freezeGame === 'true') {
            survey.stopTimer();
            TimerAndMessageForTheNextQuestion(
               survey,
               0,
               setTimerPausa,
               setFeedbackMessage,
               setShowMessageOnComplete,
               rankingPoints,
               freezeGame,
               'info'
            );
         }
      }
   }

   /* handler cuando la encuesta cambio de pregunta */
   function onCurrentPageChanged(sender, options) {
      if (!options.oldCurrentPage) return;
      let secondsToGo = sender.maxTimeToFinishPage - options.oldCurrentPage.timeSpent;

      if (surveyData.allow_gradable_survey === 'true') {
         sender.stopTimer();
         TimerAndMessageForTheNextQuestion(
            sender,
            secondsToGo,
            setTimerPausa,
            setFeedbackMessage,
            setShowMessageOnComplete,
            rankingPoints,
            freezeGame
         );
      }
   }

   if (!surveyData) return 'Cargando...';
   return (
      <div>
         {survey && survey.state === 'completed' && (
            <>
               {surveyData && surveyData.allow_gradable_survey !== 'true' && (
                  <Graphics
                     idSurvey={idSurvey}
                     eventId={eventId}
                     surveyLabel={surveyLabel}
                     showListSurvey={showListSurvey}
                     operation={operation}
                  />
               )}
            </>
         )}
         {feedbackMessage && feedbackMessage.title && (
            <Result className='animate__animated animate__rubberBand' {...feedbackMessage} extra={null} />
         )}

         {//Se realiza la validacion si la variable allow_anonymous_answers es verdadera para responder la encuesta
         surveyData &&
            (surveyData.allow_anonymous_answers === 'true' ||
               surveyData.allow_anonymous_answers === true ||
               surveyData.publish === 'true' ||
               surveyData.publish === true) && (
               <div style={{ display: feedbackMessage.title || showMessageOnComplete ? 'none' : 'block' }}>
                  {survey && (
                     <div className='animate__animated animate__bounceInDown'>
                        {surveyData.allow_gradable_survey === 'true' && !fiftyfitfyused && (
                           <div className='survy-comodin' onClick={() => HelpFiftyFifty(setFiftyfitfyused, survey)}>
                              <Button>
                                 {' '}
                                 50 / 50 <BulbOutlined />
                              </Button>
                           </div>
                        )}
                        <Survey.Survey
                           model={survey}
                           onComplete={(surveyModel) => sendData(surveyModel, 'completed')}
                           onPartialSend={(surveyModel) => sendData(surveyModel, 'partial')}
                           onCompleting={(surveyModel) =>
                              MessageWhenCompletingSurvey(surveyModel, surveyData, totalPoints)
                           }
                           onTimerPanelInfoText={TimeLimitPerQuestion}
                           onStarted={onStartedSurvey}
                           onCurrentPageChanged={onCurrentPageChanged}
                        />
                     </div>
                  )}
               </div>
            )}
      </div>
   );
}

export default SurveyComponent;
