import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Moment from 'moment';
import { Result, Button } from 'antd';
import { FrownOutlined, SmileOutlined, MehOutlined, ArrowLeftOutlined, BulbOutlined } from '@ant-design/icons';
import * as Cookie from 'js-cookie';
import {  TicketsApi } from '../../../helpers/request';
import { firestore } from '../../../helpers/firebase';
import { SurveyAnswers, SurveyPage, UserGamification, Trivia } from './services';
import { getSurveyConfiguration } from '../../trivia/services';
import Graphics from './graphics';
import * as SurveyActions from '../../../redux/survey/actions';
import { UseEventContext } from '../../../Context/eventContext';
import * as Survey from 'survey-react';
import InternarlSurveyStyles from './components/internarlSurveyStyles';
import LoadSelectedSurvey from './services/loadSelectedSurvey';

const { setCurrentSurvey, setSurveyVisible } = SurveyActions;

const MIN_ANSWER_FEEDBACK_TIME = 5;
const surveyStyle = {
   overFlowX: 'hidden',
   overFlowY: 'scroll',
   minHeight: 'calc(100vh - 100px)',
};

function SurveyComponent(props) {
   const { eventId, idSurvey, surveyLabel, operation, showListSurvey } = props;
   const cEvent = UseEventContext();
   const eventStyles = cEvent.value.styles;

   let [surveyData, setSurveyData] = useState({});
   const [rankingList, setRankingList] = useState([]); // Este estado se usa para gamification
   const [sentSurveyAnswers, setSentSurveyAnswers] = useState(false);
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

   async function startingSurveyComponent() {
      let loadSurveyData = await LoadSelectedSurvey(eventId, idSurvey, surveyData);
      const firebaseSurvey = await getSurveyConfiguration(idSurvey);
      loadSurveyData.open = firebaseSurvey.isOpened;
      loadSurveyData.publish = firebaseSurvey.isPublished;
      loadSurveyData.freezeGame = firebaseSurvey.freezeGame;

      let survey = new Survey.Model(loadSurveyData);

      await listenAndUpdateStateSurveyRealTime(idSurvey);

      /* El render se produce antes que se cargue toda la info para que funcione bien tenemos q
    que renderizar condicionalmente el compontente de la encuesta solo cuando  surveyRealTime y survey esten cargados 
    sino se presentar comportamientos raros.
    */
      setSurveyData(loadSurveyData);
      setSurvey(survey);

      // Esto permite obtener datos para la grafica de gamificacion
      UserGamification.getListPoints(eventId, setRankingList);

      await getCurrentEvenUser();
   }

   useEffect(() => {
      // asigna los colores del evento para la UI de la encuesta
      InternarlSurveyStyles(eventStyles);

      startingSurveyComponent();
   }, []);

   /**
    * El quiztiene unos timers para controlar el tiempo por pregunta
    * aqui detenemos los timers o el quiz sigue avanzando y dana la lÃƒÆ’Ã‚Â³gica cambiando
    * la pregunta en la que deberian ir todos
    */

   useEffect(() => {
      if (survey) {
         survey.stopTimer();
      }

      if (timerPausa) {
         clearInterval(timerPausa);
      }
   }, [survey]);

   async function getCurrentEvenUser() {
      let evius_token = Cookie.get('evius_token');
      let eventsUsers = [];
      let vote = 1;
      if (evius_token) {
         let response = await TicketsApi.getByEvent(props.eventId, evius_token);

         if (response.data.length > 0) {
            vote = 0;
            eventsUsers = response.data;
            response.data.forEach((item) => {
               if (item.properties.pesovoto) vote += parseFloat(item.properties.pesovoto);
            });
         }
      }
      setEventUsers(eventsUsers);
      setVoteWeight(vote);
   }

   async function listenAndUpdateStateSurveyRealTime(idSurvey) {
      const { currentUser } = props;
      let currentPageNo = 0;

      const promiseA = new Promise((resolve, reject) => {
         try {
            firestore
               .collection('surveys')
               .doc(idSurvey)
               .onSnapshot(async (doc) => {
                  let surveyRealTime = doc.data();

                  //revisando si estamos retomando la encuesta en alguna página particular
                  if (currentUser && currentUser._id) {
                     currentPageNo = await SurveyPage.getCurrentPage(idSurvey, currentUser._id);
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

   // Funcion que ejecuta el servicio para registar votos ------------------------------------------------------------------
   function executePartialService(surveyData, question, infoUser) {
      return new Promise((resolve, reject) => {
         // Se obtiene el index de la opcion escogida, y la cantidad de opciones de la pregunta
         let optionIndex = [];
         let optionQuantity = 0;
         let correctAnswer = false;

         // Asigna puntos si la encuesta tiene
         let surveyPoints = question.points ? parseInt(question.points) : 1;
         let rankingPoints = 0;

         //Hack rÃƒÆ’Ã‚Â¡pido para permitir preguntas tipo texto (abiertas)
         // eslint-disable-next-line no-empty
         if (question.inputType === 'text') {
         } else {
            // se valida si question value posee un arreglo 'Respuesta de opcion multiple' o un texto 'Respuesta de opcion unica'
            if (typeof question.value === 'object') {
               correctAnswer = question.correctAnswer !== undefined ? question.isAnswerCorrect() : undefined;

               if (correctAnswer) rankingPoints += surveyPoints;
               question.value.forEach((value) => {
                  optionIndex = [...optionIndex, question.choices.findIndex((item) => item.itemValue === value)];
               });
            } else {
               // Funcion que retorna si la opcion escogida es la respuesta correcta
               correctAnswer = question.correctAnswer !== undefined ? question.isAnswerCorrect() : undefined;

               if (correctAnswer) rankingPoints += surveyPoints;
               // Busca el index de la opcion escogida
               optionIndex = question.choices.findIndex((item) => item.itemValue === question.value);
            }
            optionQuantity = question.choices.length;
         }

         let infoOptionQuestion =
            surveyData.allow_gradable_survey === 'true'
               ? { optionQuantity, optionIndex, correctAnswer }
               : { optionQuantity, optionIndex };

         // Se envia al servicio el id de la encuesta, de la pregunta y los datos
         // El ultimo parametro es para ejecutar el servicio de conteo de respuestas
         if (!(Object.keys(infoUser).length === 0)) {
            SurveyAnswers.registerWithUID(
               surveyData._id,
               question.id,
               {
                  responseData: question.value,
                  date: new Date(),
                  uid: infoUser._id,
                  email: infoUser.email,
                  names: infoUser.names || infoUser.displayName,
                  voteValue: surveyData.allow_vote_value_per_user === 'true' && eventUsers.length > 0 && voteWeight,
               },
               infoOptionQuestion
            )
               .then((result) => {
                  resolve({ responseMessage: result, rankingPoints });
               })
               .catch((err) => {
                  reject({ responseMessage: err });
               });
         } else {
            // Sirve para controlar si un usuario anonimo ha votado
            localStorage.setItem(`userHasVoted_${surveyData._id}`, true);

            SurveyAnswers.registerLikeGuest(
               surveyData._id,
               question.id,
               {
                  responseData: question.value || '',
                  date: new Date(),
                  uid: 'guest',
               },
               infoOptionQuestion
            )
               .then((result) => {
                  resolve({ responseMessage: result, rankingPoints });
               })
               .catch((err) => {
                  reject({ responseMessage: err });
               });
         }
      });
   }

   // Funcion que muestra el feedback dependiendo del estado
   function showStateMessage(state, questionPoints) {
      const objMessage = {
         title: '',
         subTitle: '',
         status: state,
      };

      switch (state) {
         case 'success':
            return {
               ...objMessage,
               title: (
                  <div>
                     Has ganado <span style={{ fontWeight: 'bold', fontSize: '130%' }}>{questionPoints} punto(s)</span>,
                     respondiendo correctamente la pregunta.
                  </div>
               ),
               subTitle: '',
               icon: <SmileOutlined />,
            };

         case 'error':
            return {
               ...objMessage,
               title: <div>Debido a que no respondiste correctamente no has ganado puntos.</div>,
               subTitle: '',
               icon: <FrownOutlined />,
            };

         case 'warning':
            return {
               ...objMessage,
               title: 'No has escogido ninguna opción',
               subTitle: `No has ganado ningun punto debido a que no marcaste ninguna opción.`,
               icon: <MehOutlined />,
            };

         case 'info':
            return {
               ...objMessage,
               title: 'Estamos en una pausa',
               subTitle: `El juego se encuentra en pausa. Espera hasta el moderador reanude el juego`,
               icon: <MehOutlined />,
            };

         default:
            return { type: state };
      }
   }

   function onSurveyCompleted(values) {
      sendData(values);
   }

   /*
    surveyData: (Object) Informacio general de la encuesta
    retornamos null para para detener el hilo de ejecución del método
    */
   // Funcion para enviar la informacion de las respuestas ------------------------------------------------------------------
   async function sendData(surveyModel) {
      const { eventId, currentUser } = props;

      setRankingPoints(0);

      let rankingPointsThisPage;
      await Promise.all(
         surveyModel.currentPage.questions.map(async (question) => {
            let { rankingPoints } = await executePartialService(surveyData, question, currentUser);
            if (rankingPoints)
               rankingPointsThisPage = rankingPointsThisPage ? rankingPointsThisPage + rankingPoints : rankingPoints;
            registerRankingPoints(rankingPoints, surveyModel, surveyData, currentUser, eventId);
            return rankingPoints;
         })
      );
      setRankingPoints(rankingPointsThisPage);

      if (!(Object.keys(currentUser).length === 0)) {
         //Actualizamos la página actúal, sobretodo por si se cae la conexión regresar a la última pregunta
         SurveyPage.setCurrentPage(surveyData._id, currentUser._id, surveyModel.currentPageNo);
      }

      let isLastPage = surveyModel.isLastPage;

      if (surveyData.allow_gradable_survey === 'true') {
         if (isLastPage) {
            setShowMessageOnComplete(false);
         }
      }

      // Permite asignar un estado para que actualice la lista de las encuestas si el usuario respondio la encuesta
      if (props.showListSurvey) {
         setSentSurveyAnswers(true);
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

   function setIntervalToWaitBeforeNextPage(survey, secondsToGo, messageType) {
      secondsToGo = secondsToGo ? secondsToGo : 0;
      secondsToGo += MIN_ANSWER_FEEDBACK_TIME;

      const timer = setInterval(() => {
         secondsToGo -= 1;

         rankingPoints = !rankingPoints ? 0 : rankingPoints;

         if (!messageType) {
            messageType = rankingPoints > 0 ? 'success' : 'error';
         }

         let mensaje = showStateMessage(messageType, rankingPoints);
         let mensaje_espera = `${mensaje.subTitle} Espera el tiempo indicado para seguir con el cuestionario.`;
         let mensaje_congelado = `El juego se encuentra en pausa. Espera hasta que el moderador  reanude el juego`;
         mensaje.subTitle = secondsToGo > 0 ? mensaje_espera + ' ' + secondsToGo : mensaje_congelado;
         setFeedbackMessage(mensaje);

         if (secondsToGo <= 0 && !freezeGame) {
            clearInterval(timer);
            setShowMessageOnComplete(false);
            setFeedbackMessage({});
            survey.startTimer();
         }
      }, 1000);

      setTimerPausa(timer);
   }
   /* handler cuando la encuesta cambio de pregunta */
   function onCurrentPageChanged(sender, options) {
      if (!options.oldCurrentPage) return;
      let secondsToGo = sender.maxTimeToFinishPage - options.oldCurrentPage.timeSpent;

      //if (secondsToGo > 0) sender.stopTimer();
      if (surveyData.allow_gradable_survey === 'true') {
         sender.stopTimer();
         setIntervalToWaitBeforeNextPage(sender, secondsToGo);
      }
   }

   function useFiftyFifty() {
      let question = survey.currentPage.questions[0];

      if (!(question.correctAnswer && question.choices && question.choices.length > 2)) {
         alert('Menos de dos opciones no podemos borrar alguna');
         return;
      }
      let choices = question.choices;
      //Determinamos la cantidad de opciones a borrar (la mitad de las opciones)
      let cuantasParaBorrar = Math.floor(choices.length / 2);

      choices = choices.filter((choice) => {
         let noBorrar = question.correctAnswer === choice.value || cuantasParaBorrar-- <= 0;
         return noBorrar;
      });
      question.choices = choices;
      setFiftyfitfyused(true);
      alert('has usado la ayuda  del 50/50');
   }

   // Funcion que se ejecuta antes del evento onComplete y que muestra un texto con los puntos conseguidos
   // eslint-disable-next-line no-unused-vars
   function setFinalMessage(survey, options) {
      let totalQuestions = 0;

      let questions = surveyData.pages;

      questions.forEach((item) => {
         if (item.questions[0].points) {
            totalQuestions += parseInt(item.questions[0].points);
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

   function checkCurrentPage(survey) {
      // Este condicional sirve para retomar la encuesta donde vayan todos los demas usuarios
      if (surveyData.allow_gradable_survey === 'true') {
         //if (currentPage !== 0) survey.currentPageNo = currentPage;

         if (freezeGame) {
            survey.stopTimer();
            setIntervalToWaitBeforeNextPage(survey, 0, 'info');
         }
      }
   }

   if (!surveyData) return 'Cargando...';
   return (
      <div style={surveyStyle}>
         {survey && props.currentActivity === null && (
            <Button
               type='ghost primary'
               shape='round'
               onClick={() => {
                  props.setCurrentSurvey(null);
                  props.setSurveyVisible(false);
               }}>
               <ArrowLeftOutlined /> Volver a {surveyLabel ? surveyLabel.name : 'encuestas'}
            </Button>
         )}

         {survey && survey.state === 'completed' && (
            <>
               {surveyData && surveyData.allow_gradable_survey !== 'true' ? (
                  <Graphics
                     idSurvey={props.idSurvey}
                     eventId={eventId}
                     surveyLabel={surveyLabel}
                     showListSurvey={showListSurvey}
                     operation={operation}
                  />
               ) : (
                  <></>
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
            surveyData.publish === true) ? (
            <div style={{ display: feedbackMessage.title || showMessageOnComplete ? 'none' : 'block' }}>
               {survey && (
                  <div className='animate__animated animate__bounceInDown'>
                     {surveyData.allow_gradable_survey === 'true' && !fiftyfitfyused && (
                        <div className='survy-comodin' onClick={useFiftyFifty}>
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
                        onCompleting={setFinalMessage}
                        onTimerPanelInfoText={setCounterMessage}
                        onStarted={checkCurrentPage}
                        onCurrentPageChanged={onCurrentPageChanged}
                     />
                  </div>
               )}
            </div>
         ) : (
            //Si no es verdadera la variable anterior,
            //entonces validarÃ¡ si el ticket del usuario existe para despues validar la variable allowed_to_vote en verdadero
            //para poder responder la encuesta
            eventUsers.map((eventUser) => {
               return (
                  eventUser.ticket &&
                  eventUser.ticket.allowed_to_vote === 'true' && (
                     <div
                        style={{
                           display: feedbackMessage.title || showMessageOnComplete ? 'none' : 'block',
                        }}>
                        {survey && (
                           <Survey.Survey
                              model={survey}
                              onComplete={onSurveyCompleted}
                              onPartialSend={sendData}
                              onCompleting={setFinalMessage}
                              onTimerPanelInfoText={setCounterMessage}
                              onStarted={checkCurrentPage}
                              onCurrentPageChanged={onCurrentPageChanged}
                              // goNextPageAutomatic={true}
                              // allowCompleteSurveyAutomatic={true}
                           />
                        )}
                     </div>
                  )
               );
            })
         )}
      </div>
   );
}

const mapDispatchToProps = { setCurrentSurvey, setSurveyVisible };

const mapStateToProps = (state) => ({
   currentSurvey: state.survey.data.currentSurvey,
   currentActivity: state.stage.data.currentActivity,
});

export default connect(mapStateToProps, mapDispatchToProps)(SurveyComponent);
