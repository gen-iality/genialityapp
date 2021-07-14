import React, { useState, useEffect } from 'react';
import Moment from 'moment';
import { Result, Button } from 'antd';
import { BulbOutlined } from '@ant-design/icons';
import { firestore } from '../../../helpers/firebase';
import { SurveyPage, UserGamification, Trivia, getCurrentEvenUser } from './services/services';
import { getSurveyConfiguration } from '../../trivia/services';
import Graphics from './graphics';
import { UseEventContext } from '../../../Context/eventContext';
import * as Survey from 'survey-react';
import InternarlSurveyStyles from './components/internarlSurveyStyles';
import LoadSelectedSurvey from './services/loadSelectedSurvey';
import RegisterVote from './services/registerVote';
import TimerForTheNextQuestion from './services/timerForTheNextQuestion';
import HelpFiftyFifty from './services/helpFiftyFifty';
import MessageWhenCompletingSurvey from './services/messageWhenCompletingSurvey';

function SurveyComponent(props) {
   const { eventId, idSurvey, surveyLabel, operation, showListSurvey, currentUser } = props;

   const cEvent = UseEventContext();
   const eventStyles = cEvent.value.styles;

   let [surveyData, setSurveyData] = useState({});
   const [rankingList, setRankingList] = useState([]); // Este estado se usa para gamification
   const [feedbackMessage, setFeedbackMessage] = useState({});
   let [totalPoints, setTotalPoints] = useState(0);
   const [eventUsers, setEventUsers] = useState([]);
   const [voteWeight, setVoteWeight] = useState(0);
   const [freezeGame, setFreezeGame] = useState(false);
   const [showMessageOnComplete, setShowMessageOnComplete] = useState(false);
   const [currentPage, setCurrentPage] = useState(null);
   const [surveyRealTime, setSurveyRealTime] = useState(null);
   const [timerPausa, setTimerPausa] = useState(null);
   const [survey, setSurvey] = useState(null);
   let [rankingPoints, setRankingPoints] = useState(0);
   const [fiftyfitfyused, setFiftyfitfyused] = useState(false);


   async function listenAndUpdateStateSurveyRealTime(idSurvey) {
      let currentPageNo = 0;

      const promiseA = new Promise((resolve, reject) => {
         try {
            firestore
               .collection('surveys')
               .doc(idSurvey)
               .onSnapshot(async (doc) => {
                  let surveyRealTime = doc.data();

                  //revisando si estamos retomando la encuesta en alguna página particular
                  if (currentUser && currentUser.value._id) {
                     currentPageNo = await SurveyPage.getCurrentPage(idSurvey, currentUser.value._id);
                     surveyRealTime.currentPage = currentPageNo ? currentPageNo : 0;
                  }

                  setSurveyRealTime(surveyRealTime);
                  setCurrentPage(surveyRealTime.currentPage);
                  setFreezeGame(surveyRealTime.freezeGame);
                  resolve(surveyRealTime);
               });
         } catch (e) {
            reject(e);
         }
      });

      return promiseA;
   }

   async function startingSurveyComponent() {
      let loadSurveyData = await LoadSelectedSurvey(eventId, idSurvey, surveyData);
      const firebaseSurvey = await getSurveyConfiguration(idSurvey);

      loadSurveyData.open = firebaseSurvey.isOpened;
      loadSurveyData.publish = firebaseSurvey.isPublished;
      loadSurveyData.freezeGame = firebaseSurvey.freezeGame;

      const surveyModelData = new Survey.Model(loadSurveyData);

      await listenAndUpdateStateSurveyRealTime(idSurvey);

      setSurveyData(loadSurveyData);
      setSurvey(surveyModelData);

      // Esto permite obtener datos para la grafica de gamificacion
      UserGamification.getListPoints(eventId, setRankingList);

      await getCurrentEvenUser(eventId, setEventUsers, setVoteWeight);
   }

   useEffect(() => {
      // asigna los colores del evento para la UI de la encuesta
      InternarlSurveyStyles(eventStyles);

      startingSurveyComponent();
   }, []);

   useEffect(() => {
      /**
       * Timers para controlar el tiempo por pregunta, estos se deben detener o el quiz siguira avanzando y errando la logica ya que cambia la pregunta que se esta respondiendo
       */
      if (survey) {
         survey.stopTimer();
      }
      if (timerPausa) {
         clearInterval(timerPausa);
      }
   }, [survey]);



   // Funcion para enviar la informacion de las respuestas ------------------------------------------------------------------
   async function sendData(surveyModel) {
      setRankingPoints(0);

      let rankingPointsThisPage;
      await Promise.all(
         surveyModel.currentPage.questions.map(async (question) => {
            let { rankingPoints } = await RegisterVote(surveyData, question, currentUser, eventUsers, voteWeight);
            if (rankingPoints)
               rankingPointsThisPage = rankingPointsThisPage ? rankingPointsThisPage + rankingPoints : rankingPoints;
            registerRankingPoints(rankingPoints, surveyModel, surveyData, currentUser.value, eventId);
            return rankingPoints;
         })
      );
      setRankingPoints(rankingPointsThisPage);

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

   // Funcion que cambia el mensaje por defecto para el contador
   function setCounterMessage(survey, options) {
      // Aqui se obtiene el tiempo limite de la encuesta
      // let countDown = Moment.utc((survey.maxTimeToFinish - survey.timeSpent) * 1000).format("mm:ss");
      // let timeTotal = Moment.utc(survey.maxTimeToFinish * 1000).format("mm:ss");

      // Aqui se obtiene el tiempo limite por pregunta
      let countDown = Moment.utc((survey.maxTimeToFinishPage - survey.currentPage.timeSpent) * 1000).format('mm:ss');
      let timeTotal = Moment.utc(survey.maxTimeToFinishPage * 1000).format('mm:ss');

      options.text = `Tienes ${timeTotal} para responder la pregunta. Quedan ${countDown}`;
   }

   function onStartedSurvey(survey) {
      // Este condicional sirve para retomar la encuesta donde vayan todos los demas usuarios
      if (surveyData.allow_gradable_survey === 'true') {
         if (freezeGame) {
            survey.stopTimer();
            TimerForTheNextQuestion(
               survey,
               0,
               'info',
               setTimerPausa,
               setFeedbackMessage,
               setShowMessageOnComplete,
               rankingPoints,
               freezeGame
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
         TimerForTheNextQuestion(
            sender,
            secondsToGo,
            '',
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
                           onTimerPanelInfoText={setCounterMessage}
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
