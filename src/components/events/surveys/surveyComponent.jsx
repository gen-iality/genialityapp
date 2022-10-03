import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Result, Spin } from 'antd';
import { ConsoleSqlOutlined, LoadingOutlined } from '@ant-design/icons';
import { SurveyPage } from './services/services';
import UserGamification from './services/userGamificationService';
import setUserPointsPerSurvey from './services/setUserPointsPerSurveyService';
import Graphics from './graphics';
import { UseEventContext } from '../../../context/eventContext';
import * as Survey from 'survey-react';
import assignStylesToSurveyFromEvent from './components/assignStylesToSurveyFromEvent';
import RegisterVote from './functions/registerVote';
import TimerAndMessageForTheNextQuestion from './functions/timerAndMessageForTheNextQuestion';
import HelpFiftyFifty from './functions/helpFiftyFifty';
import MessageWhenCompletingSurvey from './functions/messageWhenCompletingSurvey';

import TimeLimitPerQuestion from './functions/timeLimitPerQuestion';
import SetCurrentUserSurveyStatus from './functions/setCurrentUserSurveyStatus';
import { saveAcumulativePoints } from './functions/saveAcumulativePoints';
import useSurveyQuery from './hooks/useSurveyQuery';
import { Button } from 'antd';
import { useHistory } from 'react-router-dom';
import { SurveysApi } from '@/helpers/request';
import useAsyncPrepareQuizStats from '@components/quiz/useAsyncPrepareQuizStats';

/**
 * @deprecated Use SurveyComponentV2 instead.
 */
function SurveyComponent(props) {
  const { eventId, idSurvey, surveyLabel, operation, showListSurvey, currentUser } = props;
  console.log('updateSurveyStatusx0', eventId, idSurvey);
  const cEvent = UseEventContext();
  //query.data tiene la definición de la encuesta/examen
  let query = useSurveyQuery(eventId, idSurvey);
  console.log('pruebashook', query);

  const history = useHistory();
  const handleGoToCertificate = () => {
    history.push(`/landing/${eventId}/certificate`);
  }
  const [enableGoToCertificate, setEnableGoToCertificate] = useState(false);

  //SurveyModel es usado por el modulo de SurveyJS
  const [initialSurveyModel, setInitialSurveyModel] = useState(null);

  const eventStyles = cEvent.value.styles;
  const loaderIcon = <LoadingOutlined style={{ color: '#2bf4d5' }} />;
  const [rankingList, setRankingList] = useState([]); // Este estado se usa para gamification
  const [feedbackMessage, setFeedbackMessage] = useState();
  const [eventUsers, setEventUsers] = useState([]);
  const [voteWeight, setVoteWeight] = useState(0);
  const [freezeGame, setFreezeGame] = useState(false);
  const [showMessageOnComplete, setShowMessageOnComplete] = useState(false);
  const [timerPausa, setTimerPausa] = useState(null);

  const [rankingPoints, setRankingPoints] = useState();
  const [fiftyfitfyused, setFiftyfitfyused] = useState(false);
  let [totalPoints, setTotalPoints] = useState(0);
  let [onCurrentPageChanged, setOnCurrentPageChanged] = useState(0);
  let [showOrHideSurvey, setShowOrHideSurvey] = useState(true); // nos permite ocultar la siguiente pregunta antes de que pueda ser mostrada

  useEffect(() => {
    //asigna los colores configurables a  la UI de la encuesta
    assignStylesToSurveyFromEvent(eventStyles);
    //Configuración para poder relacionar el id de la pregunta en la base de datos
    //con la encuesta visible. para poder almacenar las respuestas
    Survey.JsonObject.metaData.addProperty('question', 'id');
    Survey.JsonObject.metaData.addProperty('question', 'points');
  }, []);

  //Effect to load the syrvey  when prop.idSurvey gets a value
  useEffect(() => {
    if (!query.data) return;
    setInitialSurveyModel(createSurveyModel(query.data));
    (async () => {
      //
      return true;
      //--> Esto esta pendiente por refactorizar 24 Agosto
      // Esto permite obtener datos para la grafica de gamificacion
      //UserGamification.getListPoints(eventId, setRankingList);
      //Se obtiene el EventUser para los casos que se necesite saber el peso voto
      //await getCurrentEvenUser(eventId, setEventUsers, setVoteWeight);
    })();
    return () => {};
  }, [query.data]);

  useEffect(() => {
    /**
     * Timers para controlar el tiempo por pregunta,
     * estos se deben detener o el quiz seguira avanzando errando la logica
     * ya que cambia la pregunta que se esta respondiendo
     */
    if (initialSurveyModel) {
      initialSurveyModel.stopTimer();
    }
    if (!timerPausa) {
      clearInterval(timerPausa);
    }
  }, [initialSurveyModel, idSurvey, timerPausa]);

  function createSurveyModel(survey) {
    //setFreezeGame(surveyRealTime.freezeGame);
    /* Survey.StylesManager.applyTheme("darkblue"); */
    let surveyModelData = new Survey.Model(survey);
    surveyModelData.currentPageNo = survey.currentPage;
    surveyModelData.locale = 'es';
    //Este se esta implementando para no usar el titulo de la encuesta y se muestre dos veces
    //uno en el header y otro encima del botón de inicio de encuesta
    delete surveyModelData.localizableStrings.title.values.default;
    return surveyModelData;
  }

  async function getUserCurrentSurveyPage(idSurvey, user_id) {
    let currentPageNo = 0;
    if (idSurvey && user_id) {
      currentPageNo = await SurveyPage.getCurrentPage(idSurvey, user_id);
    }
    return currentPageNo;
  }

  // Funcion para enviar la informacion de las respuestas
  async function sendData(surveyModel) {
    console.log('200.Aqui entró en SendData');
    console.log('200.sendData rankingPoints', rankingPoints);

    setRankingPoints(null);
    console.log('200.sendData rankingPoints despues de setRankingPoints', rankingPoints);

    const status = surveyModel.state;
    console.log('200.sendData status', status);

    await SetCurrentUserSurveyStatus(query.data, currentUser, status);

    if (status === 'completed') {
      props.setShowSurveyTemporarily(true);
    }
    let question;
    let surveyQuestions = surveyModel.currentPage.questions;
    console.log('200.sendData surveyModel', surveyModel);
    console.log('200.sendData surveyQuestions', surveyQuestions);
    if (surveyQuestions.length === 1) {
      question = surveyModel.currentPage.questions[0];
    } else {
      question = surveyModel.currentPage.questions[1];
    }

    console.log('200.sendData question', question);
    await saveAcumulativePoints(query.data._id, currentUser.value._id, parseInt(question.points) || 0);
    const pointsForCorrectAnswer = RegisterVote(query.data, question, currentUser, eventUsers, voteWeight);

    setRankingPoints(pointsForCorrectAnswer);

    await registerRankingPoints(pointsForCorrectAnswer, surveyModel, query.data, currentUser.value, eventId);
    if (!(Object.keys(currentUser).length === 0)) {
      //Actualizamos la página actúal, sobretodo por si se cae la conexión regresar a la última pregunta
      SurveyPage.setCurrentPage(query.data._id, currentUser.value._id, surveyModel.currentPageNo);
    }

    let isLastPage = surveyModel.isLastPage;

    if (query.data.allow_gradable_survey === 'true') {
      if (isLastPage) {
        setShowMessageOnComplete(false);
      }
    }
  }

  async function registerRankingPoints(points, surveyModel, survey, currentUser, eventId) {
    console.log('200.Entró a la función registerRankingPoints');
    console.log('200.registerRankingPoints points', points);

    if (points === undefined) return;
    if (survey.allow_gradable_survey !== 'true') return;

    console.log('200.Despues de validación en función registerRankingPoints');

    if (survey.allow_gradable_survey === 'true' || survey.allow_gradable_survey === true) {
      console.log('200.Entró al if? registerRankingPoints');

      let secondsToGo = surveyModel.maxTimeToFinishPage;

      setShowOrHideSurvey(false);
      setFeedbackMessage({ icon: loaderIcon });

      TimerAndMessageForTheNextQuestion(
        surveyModel,
        secondsToGo,
        setTimerPausa,
        setFeedbackMessage,
        setShowMessageOnComplete,
        points,
        freezeGame,
        setShowOrHideSurvey
      );
    }

    //para guardar el score en el ranking
    totalPoints += points;
    setTotalPoints(totalPoints);

    console.log('200.registerRankingPoints ¿Esto se ejecuta?');

    // Ejecuta serivicio para registrar puntos
    await UserGamification.registerPoints(eventId, {
      user_id: currentUser._id,
      user_name: currentUser.names,
      user_email: currentUser.email,
      points: points,
    });

    console.log('200.registerRankingPoints - Despues de función de UserGamification');

    setUserPointsPerSurvey(
      query.data._id,
      currentUser,
      points,
      surveyModel.getAllQuestions().length - 1,
      surveyModel?.timeSpent
    );

    console.log('200.registerRankingPoints - Despues de función setUserPointsPerSurvey');
    console.log('200.registerRankingPoints points', points);

    // message.success({ content: responseMessage });
  }

  /* handler cuando la encuesta inicia, este sirve para retomar la encuesta donde vayan todos los demas usuarios */
  function onStartedSurvey(sender) {
    console.log('200.Aqui entró en OnStarted');
    console.log('200.onStartedSurvey sender', sender);

    if (query.data.allow_gradable_survey === 'true') {
      console.log('200.onStartedSurvey Primer If');
      if (freezeGame === 'true') {
        console.log('200.Segundo If');
        // sender.stopTimer();
        TimerAndMessageForTheNextQuestion(
          sender,
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
  function onCurrentSurveyPageChanged(sender, options) {
    console.log('200.Aqui entró en OnCurrent');
    console.log('200.onCurrentSurveyPageChanged rankingPoints', rankingPoints);

    if (!options?.oldCurrentPage) return;
    let secondsToGo = sender.maxTimeToFinishPage - options.oldCurrentPage.timeSpent;
    const status = sender.state; ///
    console.log('200.onCurrentSurveyPageChanged query.data', query.data);

    /* if (query.data.allow_gradable_survey === "true" || query.data.allow_gradable_survey === true) {
      setShowOrHideSurvey(false);
      setFeedbackMessage({ icon: loaderIcon });
      if (status === "running") {
        //sender.stopTimer();
        TimerAndMessageForTheNextQuestion(
          sender,
          secondsToGo,
          setTimerPausa,
          setFeedbackMessage,
          setShowMessageOnComplete,
          rankingPoints,
          freezeGame,
          setShowOrHideSurvey
        );
      } else if (status === "completed") {
        setShowOrHideSurvey(true);
      }
    } */
    return true;
  }

  useEffect(() => {
    if (!eventId) return;
    if (!currentUser?.value?._id) return;

    (async () => {
      const surveys = await SurveysApi.byEvent(eventId);

      let passed = 0;
      let notPassed = 0;

      for (let i = 0; i < surveys.length; i++) {
        const survey = surveys[i];
        const stats = await useAsyncPrepareQuizStats(
          eventId,
          survey._id,
          currentUser?.value?._id,
          survey,
        );

        console.debug('stats', stats)
        if (stats.minimum > 0) {
          if (stats.right >= stats.minimum) {
            passed = passed + 1;
          } else {
            notPassed = notPassed + 1;
          }
        }
      }

      if (passed === surveys.length) {
        setEnableGoToCertificate(true);
      } else {
        setEnableGoToCertificate(false);
      }
    })();
  }, [currentUser?.value?._id, eventId]);

  /**
   * Render del componente
   **/

  if (!initialSurveyModel || !query.data || query.loading) return <Spin tip={'Cargando..x.'} />;
  return (
    <div>
      {console.log('11.USUARIOid', currentUser.value._id)}
      {!showOrHideSurvey && query.data.allow_gradable_survey === 'true' && (
        <Result className='animate__animated animate__fadeIn' {...feedbackMessage} extra={null} />
      )}
      <div>LA</div>
      {(enableGoToCertificate) && <Button
        type='primary'
        onClick={handleGoToCertificate}
      >Descargar certificado</Button>}
      {console.log('query.data', query.data)}
      {query.data.isPublished && <div>published</div>}

      {query.data.currentPage && <div>{query.data.currentPage}</div>}
      {query.data.allow_anonymous_answers && <div>allow_anonymous_answers</div>}

      {//Se realiza la validacion si la variable allow_anonymous_answers es verdadera para responder la encuesta
      query.data &&
      (query.data.allow_anonymous_answers === 'true' ||
        query.data.allow_anonymous_answers === true ||
        query.data.isPublished === 'true' ||
        query.data.isPublished === true) ? (
        <div style={{ display: showOrHideSurvey ? 'block' : 'none' }}>
          {console.log('initialSurveyModel', initialSurveyModel)}
          {initialSurveyModel && (
            <div className='animate__animated animate__backInUp notranslate'>
              {/* animate__bounceInDown */}
              {/* {query.data.allow_gradable_survey === 'true' && !fiftyfitfyused && (
                           <div
                              className='survy-comodin'
                              onClick={() => HelpFiftyFifty(setFiftyfitfyused, initialSurveyModel)}>
                              <Button>
                                 {' '}
                                 50 / 50 <BulbOutlined />
                              </Button>
                           </div>
                        )} */}
              {console.log('initialSurveyModel2', query.data, initialSurveyModel)}
              <Survey.Survey
                className='notranslate'
                model={initialSurveyModel}
                onComplete={(surveyModel) => sendData(surveyModel, 'completed')}
                onPartialSend={(surveyModel) => sendData(surveyModel, 'partial')}
                onCompleting={(surveyModel) => MessageWhenCompletingSurvey(surveyModel, query.data, totalPoints)}
                onTimerPanelInfoText={TimeLimitPerQuestion}
                //onStarted={onStartedSurvey}
                onStarted={(sender) => onStartedSurvey(sender)}
                onCurrentPageChanged={(sender, options) => onCurrentSurveyPageChanged(sender, options)}
              />
            </div>
          )}
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <Result title='No hay nada publicado...' />
        </div>
      )}
    </div>
  );
}
const mapDispatchToProps = {};

const mapStateToProps = (state) => ({
  currentSurveyStatus: state.survey.data.currentSurveyStatus,
});

export default connect(mapStateToProps, mapDispatchToProps)(SurveyComponent);
