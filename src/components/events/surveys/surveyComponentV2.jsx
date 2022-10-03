/** Hooks, CustomHooks  and react libraries*/
import { useState, useEffect } from 'react';
import * as Survey from 'survey-react';
import { Link } from 'react-router-dom';

/** Helpers and services */
import { SurveyPage } from './services/services';

/** Antd services */
import { ConsoleSqlOutlined, LoadingOutlined } from '@ant-design/icons';
import { Result, Spin, Button, Col } from 'antd';

/** Funciones externas */
import StateMessages from './functions/stateMessagesV2';
import { SetCurrentUserSurveyStatus } from './functions/setCurrentUserSurveyStatus';
import MessageWhenCompletingSurvey from './functions/messageWhenCompletingSurvey';
import GetResponsesIndex from './functions/getResponsesIndex';
import SavingResponseByUserId from './functions/savingResponseByUserId';
import { saveAcumulativePoints } from './functions/saveAcumulativePoints';

/** Context´s */
import { UseEventContext } from '../../../context/eventContext';
import { UseCurrentUser } from '@context/userContext';

/** Componentes */
import assignStylesToSurveyFromEvent from './components/assignStylesToSurveyFromEvent';

function SurveyComponent(props) {
  const {
    eventId, // The event id
    idSurvey, // The survey ID
    survey_just_finished,
    queryData, // The survey data
  } = props;

  const cEvent = UseEventContext();
  const currentUser = UseCurrentUser();

  const eventStyles = cEvent.value.styles;
  const loaderIcon = <LoadingOutlined style={{ color: '#2bf4d5' }} />;

  const [surveyModel, setSurveyModel] = useState(null);
  const [showingFeedback, setShowingFeedback] = useState(false);
  const [questionFeedback, setQuestionFeedback] = useState(false);

  const [isSaveButtonShown, setIsSaveButtonShown] = useState(false);
  const [isSavingPoints, setIsSavingPoints] = useState(false);

  const [eventUsers, setEventUsers] = useState([]);
  const [voteWeight, setVoteWeight] = useState(0); // Inquietud: Es util?

  let [totalPoints, setTotalPoints] = useState(null);
  var survey;

  useEffect(() => {
    // Configuración para poder relacionar el id de la pregunta en la base de datos
    // con la encuesta visible para poder almacenar las respuestas
    Survey.JsonObject.metaData.addProperty('question', 'id');
    Survey.JsonObject.metaData.addProperty('question', 'points');
  }, []);

  // Asigna los colores configurables a  la UI de la encuesta
  useEffect(() => {
    if (!(queryData?.questions.length > 0)) return;
    assignStylesToSurveyFromEvent(eventStyles);
    setSurveyModel(createSurveyModel(queryData));
    // survey.onCurrentPageChanging.add(displayFeedbackafterQuestionAnswered);
  }, [queryData]);

  function createSurveyModel(survey) {
    let surveyModelData = new Survey.Model(survey);
    surveyModelData.currentPageNo = survey.currentPage;
    surveyModelData.locale = 'es';
    // Este se esta implementando para no usar el titulo de la encuesta y se muestre dos veces
    // uno en el header y otro encima del botón de inicio de encuesta
    delete surveyModelData.localizableStrings.title.values.default;
    return surveyModelData;
  }

  const displayFeedbackAfterEachQuestion = (sender, options) => {
    if (shouldDisplayFeedback()) {
      stopChangeToNextQuestion(options);
      hideTimerPanel();
      displayFeedback(Survey, sender.currentPage);
      setQuestionFeedback(createQuestionsFeedback(sender.currentPage));
      setReadOnlyTheQuestions(sender.currentPage.questions);
    } else {
      showTimerPanel();
    }
  };

  function shouldDisplayFeedback() {
    return showingFeedback !== true;
  }

  function stopChangeToNextQuestion(options) {
    options.allowChanging = false;
  }

  function hideTimerPanel() {
    surveyModel.showTimerPanel = 'none';
    surveyModel.stopTimer();
  }

  function displayFeedback(Survey, page) {
    setShowingFeedback(true);
  }

  function calculateScoredPoints(questions) {
    let pointsScored = 0;
    questions.map(question => {
      console.log('200.Is value empty', question.isValueEmpty());
      pointsScored += question.correctAnswerCount ? question.correctAnswerCount : 0;
    });
    console.log('200.pointsScored', pointsScored);
    totalPoints += pointsScored;
    setTotalPoints(totalPoints);
    return pointsScored;
  }

  function createQuestionsFeedback(page) {
    let pointsScored = calculateScoredPoints(page.questions);
    console.log('200.createQuestionsFeedback page.questions', page.questions[0].value);
    console.log('200.createQuestionsFeedback surveyModel.data', surveyModel.data);

    let mensaje = StateMessages(pointsScored ? 'success' : 'error');
    return (
      <>
        <Result
          className='animate__animated animate__fadeIn'
          {...mensaje}
          extra={[
            <Button
              onClick={async () => {
                setShowingFeedback(false);
                surveyModel.nextPage();
                if (surveyModel.state === 'completed') {
                  setIsSaveButtonShown(true);
                }
              }}
              type='primary'
              key='console'
            >
              Next
            </Button>,
          ]}
        />
      </>
    );
  }

  function setReadOnlyTheQuestions(questions) {
    //Volvemos de solo lectura las respuestas
    questions.map((question, index) => {
      if (index === 0) return;
      question.readOnly = true;
    });
  }

  function showTimerPanel() {
    surveyModel.showTimerPanel = 'top';
    surveyModel.startTimer();
  }

  function temporizador(sender, options) {
    options.text = `Tienes ${sender.maxTimeToFinishPage} para responder. Tu tiempo es ${sender.currentPage.timeSpent}`;
  }

  async function saveSurveyStatus() {
    const status = surveyModel.state;
    console.log('200.status', status);
    await SetCurrentUserSurveyStatus(queryData, currentUser, status);
  }

  async function saveSurveyCurrentPage() {
    if (!(Object.keys(currentUser).length === 0)) {
      // Actualizamos la página actúal, sobretodo por si se cae la conexión regresar a la última pregunta
      await SurveyPage.setCurrentPage(queryData._id, currentUser.value._id, surveyModel.currentPageNo);
    }
  }

  async function saveGainedSurveyPoints(surveyQuestions) {
    let question;
    if (surveyQuestions.length === 1) {
      question = surveyModel.currentPage.questions[0];
    } else {
      question = surveyModel.currentPage.questions[1];
    }

    const correctAnswer = question.correctAnswer !== undefined ? question.isAnswerCorrect() : undefined;

    setIsSavingPoints(true);
    try {
      const value = parseInt(question.points) || 0;
      console.log('200.saveGainedSurveyPoints survey correct?', correctAnswer);
      await saveAcumulativePoints(queryData._id, currentUser.value._id, correctAnswer ? value : 0);
      console.log('600 savedGainedSurveyPoints value', value);
      setIsSavingPoints(false);
    } catch (err) {
      console.error(err);
      setIsSavingPoints(false);
    }
  }

  async function saveSurveyAnswers(surveyQuestions) {
    let question;
    let optionQuantity = 0;
    let correctAnswer = false;

    console.log('200.saveSurveyAnswers surveyModel', surveyModel);
    console.log('200.saveSurveyAnswers surveyQuestions', surveyQuestions);
    if (surveyQuestions.length === 1) {
      question = surveyModel.currentPage.questions[0];
    } else {
      question = surveyModel.currentPage.questions[1];
    }

    console.log('200.saveSurveyAnswers question', question);

    // Funcion que retorna si la opcion escogida es la respuesta correcta
    correctAnswer = question.correctAnswer !== undefined ? question.isAnswerCorrect() : undefined;
    console.log('200.saveSurveyAnswers correctAnswer', correctAnswer);

    /** funcion para validar tipo de respuesta multiple o unica */
    const responseIndex = await GetResponsesIndex(question);
    optionQuantity = question.choices.length;
    let optionIndex = responseIndex;

    let infoOptionQuestion =
      queryData.allow_gradable_survey === 'true'
        ? { optionQuantity, optionIndex, correctAnswer }
        : { optionQuantity, optionIndex };

    // Se envia al servicio el id de la encuesta, de la pregunta y los datos
    // El ultimo parametro es para ejecutar el servicio de conteo de respuestas
    if (!(Object.keys(currentUser).length === 0)) {
      SavingResponseByUserId(queryData, question, currentUser, eventUsers, voteWeight, infoOptionQuestion);
      console.log('200.saveSurveyAnswers SavingResponseByUserId');
    }
  }

  async function saveSurveyData(sender) {
    console.log('200.saveSurveyData');

    // saveSurveyStatus(); -- temporally ignored
    await saveSurveyCurrentPage();
    await saveSurveyAnswers(sender.currentPage.questions);
    await saveGainedSurveyPoints(sender.currentPage.questions)
      .then(() => console.log('600 saveSurveyData puntos enviados para este quiz'))
      .catch(err => console.error('600 saveSurveyData saveGainedSurveyPoints error:', err));
  }

  async function onSurveyCompleted(sender) {
    console.log('200.onSurveyCompleted');
    await saveSurveyData(sender);
    //survey_just_finished();
    await MessageWhenCompletingSurvey(surveyModel, queryData, currentUser.value._id);
  }

  return (
    <>
      {/* {&& queryData.allow_gradable_survey === 'true' } */}
      {surveyModel && (
        <>
          {isSavingPoints && (
            <>
              Guardando puntos <Spin />
            </>
          )}
          {showingFeedback && questionFeedback}
          <div style={{ display: showingFeedback ? 'none' : 'block' }}>
            <Survey.Survey
              model={surveyModel}
              onCurrentPageChanging={displayFeedbackAfterEachQuestion}
              onPartialSend={saveSurveyData}
              onCompleting={displayFeedbackAfterEachQuestion}
              onComplete={onSurveyCompleted}
            />
          </div>
          {isSaveButtonShown && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Link to={`/landing/${eventId}/evento`} replace>
                <Button
                  onClick={() => {
                    saveSurveyStatus();
                  }}
                  type='primary'
                  key='console'
                >
                  Volver al curso {isSavingPoints && <Spin />}
                </Button>
              </Link>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default SurveyComponent;
