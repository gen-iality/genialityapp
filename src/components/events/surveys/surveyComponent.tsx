import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Result, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { SurveyPage } from './services/services';
import UserGamification from './services/userGamificationService';
import getCurrentEvenUser from './services/getCurrentEventUserService';
import setUserPointsPerSurvey from './services/setUserPointsPerSurveyService';
import Graphics from './graphics';
import { UseEventContext } from '../../../context/eventContext';
import * as Survey from 'survey-react';
import InternarlSurveyStyles from './components/internarlSurveyStyles';
import LoadSelectedSurvey from './functions/loadSelectedSurvey';
import RegisterVote from './functions/registerVote';
import TimerAndMessageForTheNextQuestion from './functions/timerAndMessageForTheNextQuestion';
import HelpFiftyFifty from './functions/helpFiftyFifty';
import MessageWhenCompletingSurvey from './functions/messageWhenCompletingSurvey';
import RealTimeSurveyListening from './functions/realTimeSurveyListening';
import TimeLimitPerQuestion from './functions/timeLimitPerQuestion';
import SetCurrentUserSurveyStatus from './functions/setCurrentUserSurveyStatus';
import { sendCommunicationUser } from '@/components/agenda/surveyManager/services';
import { parseStringBoolean } from '@/Utilities/parseStringBoolean';
import { UseUserEvent } from '@/context/eventUserContext';
// import { firestore, fireRealtime } from '../../../helpers/firebase';

interface Props {
  eventId: any;
  idSurvey: any;
  currentUser: any;
  cEventUser: any;
  setShowSurveyTemporarily: any;
  surveyLabel?: any;
  operation?: any;
  showListSurvey?: any;
}

function SurveyComponent(props: Props) {
  const { eventId, idSurvey, surveyLabel, operation, showListSurvey, currentUser, cEventUser } = props;
  const cEvent = UseEventContext();
  const cUser = UseUserEvent();
  const eventStyles = cEvent.value.styles;
  const loaderIcon = <LoadingOutlined style={{ color: '#2bf4d5' }} />;
  const [surveyData, setSurveyData] = useState<any>({});
  const [rankingList, setRankingList] = useState<any>([]); // Este estado se usa para gamification
  const [feedbackMessage, setFeedbackMessage] = useState<any>();
  const [eventUsers, setEventUsers] = useState<any>([]);
  const [voteWeight, setVoteWeight] = useState<any>(0);
  const [freezeGame, setFreezeGame] = useState<any>(false);
  const [showMessageOnComplete, setShowMessageOnComplete] = useState<boolean>(false);
  const [timerPausa, setTimerPausa] = useState<any>(null);
  const [initialSurveyModel, setInitialSurveyModel] = useState<any>(null);
  const [rankingPoints, setRankingPoints] = useState<any>(null);
  const [fiftyfitfyused, setFiftyfitfyused] = useState<boolean>(false);
  let [totalPoints, setTotalPoints] = useState<any>(0);
  let [onCurrentPageChanged, setOnCurrentPageChanged] = useState<any>(0);
  let [showOrHideSurvey, setShowOrHideSurvey] = useState<boolean>(true); // nos permite ocultar la siguiente pregunta antes de que pueda ser mostrada
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
    // if (initialSurveyModel) {
    //    initialSurveyModel.stopTimer();
    // }

    if (!timerPausa) {
      clearInterval(timerPausa);
    }
  }, [initialSurveyModel, idSurvey, timerPausa]);

  async function startingSurveyComponent(surveyRealTime: any) {
    setFreezeGame(surveyRealTime.freezeGame);

    let loadSurveyData = await LoadSelectedSurvey(eventId, idSurvey, surveyRealTime);
    if (loadSurveyData) {
      loadSurveyData.open = surveyRealTime.isOpened;
      loadSurveyData.publish = surveyRealTime.isPublished;
      loadSurveyData.freezeGame = surveyRealTime.freezeGame;
    }

    let surveyModelData = new Survey.Model(loadSurveyData);
    /* console.log(surveyModelData) */
    surveyModelData.currentPageNo = surveyRealTime.currentPage;
    surveyModelData.locale = 'es';
    //Este se esta implementando para no usar el titulo de la encuesta y se muestre dos veces
    //uno en el header y otro encima del botón de inicio de encuesta
    delete surveyModelData.localizableStrings.title.values.default;
    /* console.log(surveyModelData, '-------------', loadSurveyData) */

    setSurveyData(loadSurveyData);
    setInitialSurveyModel(surveyModelData);

    // Esto permite obtener datos para la grafica de gamificacion
    UserGamification.getListPoints(eventId, setRankingList);

    //Se obtiene el EventUser para los casos que se necesite saber el peso voto
    await getCurrentEvenUser(eventId, setEventUsers, setVoteWeight, cUser, cEvent);
  }

  // Funcion para enviar la informacion de las respuestas
  async function sendData(surveyModel: any) {
    setRankingPoints(null);
    const status = surveyModel.state;

    SetCurrentUserSurveyStatus(surveyData, currentUser, status);
    if (status === 'completed') {
      props.setShowSurveyTemporarily(true);
      let canSendComunications = cEvent?.value?.sms_notification;
      let eventUserId = cEventUser?.value?._id;
      if (canSendComunications && canSendComunications === true) {
        await sendCommunicationUser(idSurvey, eventUserId);
      }
    }
    let question;
    let surveyQuestions = surveyModel.currentPage.questions;
    if (surveyQuestions.length === 1) {
      question = surveyModel.currentPage.questions[0];
    } else {
      question = surveyModel.currentPage.questions[1];
    }
    const pointsForCorrectAnswer = await RegisterVote(surveyData, question, currentUser, eventUsers, voteWeight);

    setRankingPoints(pointsForCorrectAnswer);
    await registerRankingPoints(pointsForCorrectAnswer, surveyModel, surveyData, currentUser.value, eventId);
    if (Object.keys(currentUser).length !== 0) {
      //Actualizamos la página actúal, sobretodo por si se cae la conexión regresar a la última pregunta
      await SurveyPage.setCurrentPage(surveyData._id, currentUser.value._id, surveyModel.currentPageNo);
    }
    let isLastPage = surveyModel.isLastPage;

    if (parseStringBoolean(surveyData.allow_gradable_survey)) {
      if (isLastPage) {
        setShowMessageOnComplete(false);
      }
    }
  }

  async function registerRankingPoints(
    rankingPoints: any,
    surveyModel: any,
    surveyData: any,
    currentUser: any,
    eventId: any
  ) {
    if (rankingPoints === undefined || rankingPoints === 0) return;
    if (!parseStringBoolean(surveyData.allow_gradable_survey)) return;

    //para guardar el score en el ranking
    totalPoints += rankingPoints;
    setTotalPoints(totalPoints);

    // Ejecuta serivicio para registrar puntos
    await UserGamification.registerPoints(eventId, {
      user_id: currentUser._id,
      user_name: currentUser.names,
      user_email: currentUser.email,
      points: rankingPoints,
    });

    await setUserPointsPerSurvey(
      surveyData._id,
      currentUser,
      rankingPoints,
      surveyModel.getAllQuestions().length - 1,
      surveyModel?.timeSpent
    );
    // message.success({ content: responseMessage });
  }

  /* handler cuando la encuesta inicia, este sirve para retomar la encuesta donde vayan todos los demas usuarios */
  function onStartedSurvey(initialSurveyModel: any) {
    if (parseStringBoolean(surveyData.allow_gradable_survey)) {
      if (parseStringBoolean(freezeGame)) {
        initialSurveyModel.stopTimer();
        TimerAndMessageForTheNextQuestion(
          initialSurveyModel,
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

    if (parseStringBoolean(surveyData.allow_gradable_survey)) {
      setShowOrHideSurvey(false);
      setFeedbackMessage({ icon: loaderIcon });
      if (status === 'running') {
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
  }, [onCurrentPageChanged]);

  if (!surveyData)
    return (
      <div style={{ textAlign: 'center' }}>
        <Spin tip={'Cargando...'} />
      </div>
    );
  return (
    <div>
      {!showOrHideSurvey && parseStringBoolean(surveyData.allow_gradable_survey) && (
        <Result className='animate__animated animate__fadeIn' {...feedbackMessage} extra={null} />
      )}

      {//Se realiza la validacion si la variable allow_anonymous_answers es verdadera para responder la encuesta
      surveyData &&
      (parseStringBoolean(surveyData.allow_anonymous_answers) || parseStringBoolean(surveyData.publish)) ? (
        <div style={{ display: showOrHideSurvey ? 'block' : 'none' }}>
          {initialSurveyModel && (
            <div className='animate__animated animate__backInUp notranslate'>
              {/* animate__bounceInDown */}
              {/* {surveyData.allow_gradable_survey === 'true' && !fiftyfitfyused && (
                           <div
                              className='survy-comodin'
                              onClick={() => HelpFiftyFifty(setFiftyfitfyused, initialSurveyModel)}>
                              <Button>
                                 {' '}
                                 50 / 50 <BulbOutlined />
                              </Button>
                           </div>
                        )} */}

              <Survey.Survey
                className='notranslate'
                model={initialSurveyModel}
                // onComplete={(surveyModel: any) => sendData(surveyModel, 'completed')}
                // onPartialSend={(surveyModel: any) => sendData(surveyModel, 'partial')}
                onComplete={(surveyModel: any) => sendData(surveyModel)}
                onPartialSend={(surveyModel: any) => sendData(surveyModel)}
                onCompleting={(surveyModel: any) => MessageWhenCompletingSurvey(surveyModel, surveyData, totalPoints)}
                onTimerPanelInfoText={TimeLimitPerQuestion}
                onStarted={onStartedSurvey}
                onCurrentPageChanged={(surveyModel: any, options: any) => {
                  // setOnCurrentPageChanged({ surveyModel, options }, setShowOrHideSurvey(true))
                  setOnCurrentPageChanged({ surveyModel, options });
                }}
              />
            </div>
          )}
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <Spin tip={'Cargando...'} />
        </div>
      )}
    </div>
  );
}
const mapDispatchToProps = {};

const mapStateToProps = (state: any) => ({
  currentSurveyStatus: state.survey.data.currentSurveyStatus,
});

export default connect(mapStateToProps, mapDispatchToProps)(SurveyComponent);
