import React, { useState, useEffect } from 'react';
import { Result, Button } from 'antd';
import { BulbOutlined, LoadingOutlined } from '@ant-design/icons';
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
import SetCurrentUserSurveyStatus from './services/SetCurrentUserSurveyStatus';

function SurveyComponent(props) {
   const { eventId, idSurvey, surveyLabel, operation, showListSurvey, currentUser } = props;

   const cEvent = UseEventContext();
   const eventStyles = cEvent.value.styles;
   const loaderIcon = <LoadingOutlined style={{ color: '#2bf4d5' }} />;
   const [surveyData, setSurveyData] = useState({});
   const [rankingList, setRankingList] = useState([]); // Este estado se usa para gamification
   const [feedbackMessage, setFeedbackMessage] = useState({ icon: loaderIcon });
   const [eventUsers, setEventUsers] = useState([]);
   const [voteWeight, setVoteWeight] = useState(0);
   const [freezeGame, setFreezeGame] = useState(false);
   const [showMessageOnComplete, setShowMessageOnComplete] = useState(false);
   const [timerPausa, setTimerPausa] = useState(null);
   const [surveyJsModel, setSurveyJsModel] = useState(null);
   const [rankingPoints, setRankingPoints] = useState(null);
   const [fiftyfitfyused, setFiftyfitfyused] = useState(false);
   let [totalPoints, setTotalPoints] = useState(0);
   let [onCurrentPageChanged, setOnCurrentPageChanged] = useState(0);
   let [showOrHideSurvey, setShowOrHideSurvey] = useState(true); // nos permite ocultar la siguiente pregunta antes de que pueda ser mostrada

   useEffect(() => {
      // asigna los colores del evento para la UI de la encuesta
      InternarlSurveyStyles(eventStyles);

      //listener que nos permite saber los cambios de la encuesta en tiempo real
      RealTimeSurveyListening(idSurvey, currentUser, startingSurveyComponent);
   }, [idSurvey]);

   useEffect(() => {
      /**
       * Timers para controlar el tiempo por pregunta, estos se deben detener o el quiz seguira avanzando errando la logica ya que cambia la pregunta que se esta respondiendo
       */
      if (surveyJsModel) {
         surveyJsModel.stopTimer();
      }
      if (timerPausa) {
         clearInterval(timerPausa);
      }
   }, [surveyJsModel, idSurvey]);

   async function startingSurveyComponent(surveyRealTime) {
      setFreezeGame(surveyRealTime.freezeGame);
      let loadSurveyData = await LoadSelectedSurvey(eventId, idSurvey, surveyRealTime);

      loadSurveyData.open = surveyRealTime.isOpened;
      loadSurveyData.publish = surveyRealTime.isPublished;
      loadSurveyData.freezeGame = surveyRealTime.freezeGame;

      const surveyModelData = new Survey.Model(loadSurveyData);

      setSurveyData(loadSurveyData);
      setSurveyJsModel(surveyModelData);

      // Esto permite obtener datos para la grafica de gamificacion
      UserGamification.getListPoints(eventId, setRankingList);

      //Se obtiene el EventUser para los casos que se necesite saber el peso voto
      await getCurrentEvenUser(eventId, setEventUsers, setVoteWeight);
   }
   // Funcion para enviar la informacion de las respuestas
   async function sendData(surveyModel) {
      setRankingPoints(null);
      const status = surveyModel.state;

      SetCurrentUserSurveyStatus(surveyData, currentUser, status);

      const question = surveyModel.currentPage.questions[0];
      /** for para pruebas de rendimiento envio de respuestas masivas */
      // for (let insertions = 0; insertions < 100; insertions++) {
      //    console.log("10. insertions ", insertions)
      //    let currentUsers = { ...currentUser.value, _id: 'EdwinVilla1990#' + insertions };
      //    let userData = { ...currentUser, value: currentUsers };
      //    await RegisterVote(surveyData, question, userData, eventUsers, voteWeight);
      // }

      const pointsForCorrectAnswer = await RegisterVote(surveyData, question, currentUser, eventUsers, voteWeight);

      setRankingPoints(pointsForCorrectAnswer);
      registerRankingPoints(pointsForCorrectAnswer, surveyModel, surveyData, currentUser.value, eventId);
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
      if (rankingPoints === undefined || rankingPoints === 0) return;
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
   function onStartedSurvey(surveyJsModel) {
      if (surveyData.allow_gradable_survey === 'true') {
         if (freezeGame === 'true') {
            surveyJsModel.stopTimer();
            TimerAndMessageForTheNextQuestion(
               surveyJsModel,
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
   function onCurrentSurveyPageChanged() {
      if (!onCurrentPageChanged?.options?.oldCurrentPage) return;
      let secondsToGo =
         onCurrentPageChanged.surveyModel.maxTimeToFinishPage - onCurrentPageChanged.options.oldCurrentPage.timeSpent;
      const status = onCurrentPageChanged.surveyModel.state;

      if (surveyData.allow_gradable_survey === 'true') {
         setShowOrHideSurvey(false);
         if (rankingPoints !== null && status === 'running') {
            onCurrentPageChanged.surveyModel.stopTimer();
            TimerAndMessageForTheNextQuestion(
               onCurrentPageChanged.surveyModel,
               secondsToGo,
               setTimerPausa,
               setFeedbackMessage,
               setShowMessageOnComplete,
               rankingPoints,
               freezeGame,
               setShowOrHideSurvey
            );
         } else if (status === 'completed') {
            setShowOrHideSurvey(true);
         }
      }
   }

   useEffect(() => {
      onCurrentSurveyPageChanged();
   }, [onCurrentPageChanged, rankingPoints]);

   if (!surveyData) return 'Cargando...';
   return (
      <div>
         {surveyJsModel && surveyJsModel.state === 'completed' && (
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

         {!showOrHideSurvey && surveyData.allow_gradable_survey === 'true' && (
            <Result className='animate__animated animate__fadeIn' {...feedbackMessage} extra={null} />
         )}

         {//Se realiza la validacion si la variable allow_anonymous_answers es verdadera para responder la encuesta
         surveyData &&
            (surveyData.allow_anonymous_answers === 'true' ||
               surveyData.allow_anonymous_answers === true ||
               surveyData.publish === 'true' ||
               surveyData.publish === true) && (
               <div style={{ display: showOrHideSurvey ? 'block' : 'none' }}>
                  {surveyJsModel && (
                     <div className='animate__animated animate__bounceInDown'>
                        {surveyData.allow_gradable_survey === 'true' && !fiftyfitfyused && (
                           <div
                              className='survy-comodin'
                              onClick={() => HelpFiftyFifty(setFiftyfitfyused, surveyJsModel)}>
                              <Button>
                                 {' '}
                                 50 / 50 <BulbOutlined />
                              </Button>
                           </div>
                        )}
                        <Survey.Survey
                           model={surveyJsModel}
                           onComplete={(surveyModel) => sendData(surveyModel, 'completed')}
                           onPartialSend={(surveyModel) => sendData(surveyModel, 'partial')}
                           onCompleting={(surveyModel) =>
                              MessageWhenCompletingSurvey(surveyModel, surveyData, totalPoints)
                           }
                           onTimerPanelInfoText={TimeLimitPerQuestion}
                           onStarted={onStartedSurvey}
                           onCurrentPageChanged={(surveyModel, options) =>
                              setOnCurrentPageChanged({ surveyModel, options }, setShowOrHideSurvey(true))
                           }
                        />
                     </div>
                  )}
               </div>
            )}
      </div>
   );
}

export default SurveyComponent;
