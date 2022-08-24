import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Result, Spin } from "antd";
import { ConsoleSqlOutlined, LoadingOutlined } from "@ant-design/icons";
import { SurveyPage } from "./services/services";
import UserGamification from "./services/userGamificationService";
import getCurrentEvenUser from "./services/getCurrentEventUserService";
import setUserPointsPerSurvey from "./services/setUserPointsPerSurveyService";
import Graphics from "./graphics";
import { UseEventContext } from "../../../context/eventContext";
import * as Survey from "survey-react";
import assignStylesToSurveyFromEvent from "./components/assignStylesToSurveyFromEvent";
import LoadSelectedSurvey from "./functions/loadSelectedSurvey";
import RegisterVote from "./functions/registerVote";
import TimerAndMessageForTheNextQuestion from "./functions/timerAndMessageForTheNextQuestion";
import HelpFiftyFifty from "./functions/helpFiftyFifty";
import MessageWhenCompletingSurvey from "./functions/messageWhenCompletingSurvey";
import initRealTimeSurveyListening from "./functions/initRealTimeSurveyListening";
import TimeLimitPerQuestion from "./functions/timeLimitPerQuestion";
import SetCurrentUserSurveyStatus from "./functions/setCurrentUserSurveyStatus";
import { async } from "ramda-adjunct";

function SurveyComponent(props) {
  const { eventId, idSurvey, surveyLabel, operation, showListSurvey, currentUser } = props;

  const cEvent = UseEventContext();


  //surveyData tiene la definición de la encuesta/examen
  const [surveyData, setSurveyData] = useState(null);
  //SurveyModel es usado por el modulo de SurveyJS
  const [initialSurveyModel, setInitialSurveyModel] = useState(null);
  //Estado de la encuesta/examen por ejemplo si esta abierta
  const [surveyStatus, setSurveyStatus] = useState(null);


  const eventStyles = cEvent.value.styles;
  const loaderIcon = <LoadingOutlined style={{ color: "#2bf4d5" }} />;
  const [rankingList, setRankingList] = useState([]); // Este estado se usa para gamification
  const [feedbackMessage, setFeedbackMessage] = useState();
  const [eventUsers, setEventUsers] = useState([]);
  const [voteWeight, setVoteWeight] = useState(0);
  const [freezeGame, setFreezeGame] = useState(false);
  const [showMessageOnComplete, setShowMessageOnComplete] = useState(false);
  const [timerPausa, setTimerPausa] = useState(null);

  const [rankingPoints, setRankingPoints] = useState(null);
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
  }, [])

  //Effect to load the syrvey  when prop.idSurvey gets a value 
  useEffect(() => {

    if (!idSurvey) return;

    let unsubscribe;
    (async () => {
      let loadedSurvey = await LoadSelectedSurvey(eventId, idSurvey);
      loadedSurvey.currentPage = 0;// await getUserCurrentSurveyPage(idSurvey, currentUser.value._id)
      console.log('survey_variables', idSurvey, currentUser, loadedSurvey);
      setSurveyData(loadedSurvey);
      setInitialSurveyModel(createSurveyModel(loadedSurvey));

      //listener que nos permite saber los cambios de la encuesta en tiempo real
      unsubscribe = initRealTimeSurveyListening(idSurvey, updateSurveyStatus);


      //--> Esto esta pendiente por refactorizar 24 Agosto
      // Esto permite obtener datos para la grafica de gamificacion
      //UserGamification.getListPoints(eventId, setRankingList);
      //Se obtiene el EventUser para los casos que se necesite saber el peso voto
      //await getCurrentEvenUser(eventId, setEventUsers, setVoteWeight);
    })();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [idSurvey]);


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


  //open, publish, freezeGame
  function updateSurveyStatus(surveyStatus) {
    if (!surveyStatus) return;
    setSurveyStatus((previusSurveyStatus) => {
      return { ...previusSurveyStatus, ...surveyStatus };
    });
  }

  function createSurveyModel(survey) {
    //setFreezeGame(surveyRealTime.freezeGame);
    /* Survey.StylesManager.applyTheme("darkblue"); */
    let surveyModelData = new Survey.Model(survey);
    surveyModelData.currentPageNo = survey.currentPage;
    surveyModelData.locale = "es";
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
    setRankingPoints(null);
    const status = surveyModel.state;

    SetCurrentUserSurveyStatus(surveyData, currentUser, status);
    if (status === "completed") {
      props.setShowSurveyTemporarily(true);
    }
    let question;
    let surveyQuestions = surveyModel.currentPage.questions;
    console.log("surveyQuestions", surveyQuestions);
    if (surveyQuestions.length === 1) {
      question = surveyModel.currentPage.questions[0];
    } else {
      question = surveyModel.currentPage.questions[1];
    }

    console.log('sendData question', question)
    const pointsForCorrectAnswer = RegisterVote(surveyData, question, currentUser, eventUsers, voteWeight);

    setRankingPoints(pointsForCorrectAnswer);
    await registerRankingPoints(pointsForCorrectAnswer, surveyModel, surveyData, currentUser.value, eventId);
    if (!(Object.keys(currentUser).length === 0)) {
      //Actualizamos la página actúal, sobretodo por si se cae la conexión regresar a la última pregunta
      SurveyPage.setCurrentPage(surveyData._id, currentUser.value._id, surveyModel.currentPageNo);
    }

    let isLastPage = surveyModel.isLastPage;

    if (surveyData.allow_gradable_survey === "true") {
      if (isLastPage) {
        setShowMessageOnComplete(false);
      }
    }
  }

  async function registerRankingPoints(rankingPoints, surveyModel, surveyData, currentUser, eventId) {
    if (rankingPoints === undefined || rankingPoints === 0) return;
    if (surveyData.allow_gradable_survey !== "true") return;

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

    setUserPointsPerSurvey(
      surveyData._id,
      currentUser,
      rankingPoints,
      surveyModel.getAllQuestions().length - 1,
      surveyModel?.timeSpent
    );
    // message.success({ content: responseMessage });
  }

  /* handler cuando la encuesta inicia, este sirve para retomar la encuesta donde vayan todos los demas usuarios */
  function onStartedSurvey(initialSurveyModel) {
    if (surveyData.allow_gradable_survey === "true") {
      if (freezeGame === "true") {
        // initialSurveyModel.stopTimer();
        TimerAndMessageForTheNextQuestion(
          initialSurveyModel,
          0,
          setTimerPausa,
          setFeedbackMessage,
          setShowMessageOnComplete,
          rankingPoints,
          freezeGame,
          "info"
        );
      }
    }
  }

  /* handler cuando la encuesta cambio de pregunta */
  function onCurrentSurveyPageChanged(sender, options) {
    if (!options?.oldCurrentPage) return;
    let secondsToGo =
      sender.maxTimeToFinishPage - options.oldCurrentPage.timeSpent;
    const status = sender.state;///
    console.log('onCurrentSurveyPageChanged surveyData', surveyData);

    if (surveyData.allow_gradable_survey === "true" || surveyData.allow_gradable_survey === true) {
      setShowOrHideSurvey(false);
      setFeedbackMessage({ icon: loaderIcon });
      if (status === "running") {
        sender.stopTimer();
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
    }
    return true;
  }

  /**
   * Render del componente
   **/

  if (!initialSurveyModel || !surveyData || !surveyStatus) return <Spin tip={"Cargando..."} />;
  return (
    <div>
      {console.log('11.USUARIOid', currentUser.value._id)}
      {!showOrHideSurvey && surveyData.allow_gradable_survey === "true" && (
        <Result className="animate__animated animate__fadeIn" {...feedbackMessage} extra={null} />
      )}
      <div>LA</div>
      {console.log("surveyData", surveyData)}
      {surveyStatus.isPublished && <div>published</div>}

      {surveyData.currentPage && <div>{surveyData.currentPage}</div>}
      {surveyData.allow_anonymous_answers && <div>allow_anonymous_answers</div>}

      {//Se realiza la validacion si la variable allow_anonymous_answers es verdadera para responder la encuesta
        surveyData &&
          (surveyData.allow_anonymous_answers === "true" ||
            surveyData.allow_anonymous_answers === true ||
            surveyStatus.isPublished === "true" ||
            surveyStatus.isPublished === true) ? (
          <div style={{ display: showOrHideSurvey ? "block" : "none" }}>
            {console.log("initialSurveyModel", initialSurveyModel)}
            {initialSurveyModel && (
              <div className="animate__animated animate__backInUp notranslate">
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
                {console.log("initialSurveyModel2", surveyData, initialSurveyModel)}
                <Survey.Survey
                  className="notranslate"
                  model={initialSurveyModel}
                  onComplete={(surveyModel) => sendData(surveyModel, "completed")}
                  onPartialSend={(surveyModel) => sendData(surveyModel, "partial")}
                  onCompleting={(surveyModel) => MessageWhenCompletingSurvey(surveyModel, surveyData, totalPoints)}
                  onTimerPanelInfoText={TimeLimitPerQuestion}
                  onStarted={onStartedSurvey}
                  onCurrentPageChanged={(sender, options) => onCurrentSurveyPageChanged(sender, options)}
                />
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: "center" }}>
            <Result title="No hay nada publicado..." />
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
