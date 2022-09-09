import { useState, useEffect } from 'react';
import { Result, Spin, Button, Col } from 'antd';
import { ConsoleSqlOutlined, LoadingOutlined } from '@ant-design/icons';
import { UseEventContext } from '../../../context/eventContext';
import useSurveyQuery from './hooks/useSurveyQuery';
import * as Survey from 'survey-react';
import { SurveyPage } from './services/services';
//Funciones externas
import StateMessages from './functions/stateMessagesV2';
import SetCurrentUserSurveyStatus from './functions/setCurrentUserSurveyStatus';
import MessageWhenCompletingSurvey from './functions/messageWhenCompletingSurvey';
import GetResponsesIndex from './functions/getResponsesIndex';
import SavingResponseByUserId from './functions/savingResponseByUserId';
// Componentes
import assignStylesToSurveyFromEvent from './components/assignStylesToSurveyFromEvent';
import ResultsPanel from './resultsPanel';
import { UseCurrentUser } from '@context/userContext';
import { saveAcumulativePoints } from './functions/saveAcumulativePoints';

function SurveyComponent(props) {
  const {
    eventId, // The event id
    idSurvey, // The survey ID
  } = props;
  const cEvent = UseEventContext();
  //query.data tiene la definición de la encuesta/examen
  const query = useSurveyQuery(eventId, idSurvey);
  console.log('200.SurveyComponent eventId', eventId);
  console.log('200.SurveyComponent idSurvey', idSurvey);
  console.log('200.SurveyComponent query.data', query.data);

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
    if (!(query.data?.questions.length > 0)) return;
    assignStylesToSurveyFromEvent(eventStyles);
    setSurveyModel(createSurveyModel(query.data));
    // survey.onCurrentPageChanging.add(displayFeedbackafterQuestionAnswered);
  }, [query.data]);

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
    questions.map((question) => {
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
              onClick={() => {
                saveGainedSurveyPoints(surveyModel.currentPage.questions)
                  .then(() => console.debug('puntos enviados para este quiz'))
                  .catch((err) => console.error('saveGainedSurveyPoints error:', err));
                setShowingFeedback(false);
                surveyModel.nextPage();
                if (surveyModel.state === 'completed') {
                  setIsSaveButtonShown(true);
                }
              }}
              type='primary'
              key='console'
            >
              Save & Next
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
    await SetCurrentUserSurveyStatus(query.data, currentUser, status);
  }

  async function saveSurveyCurrentPage() {
    if (!(Object.keys(currentUser).length === 0)) {
      // Actualizamos la página actúal, sobretodo por si se cae la conexión regresar a la última pregunta
      await SurveyPage.setCurrentPage(query.data._id, currentUser.value._id, surveyModel.currentPageNo);
    }
  }

  async function saveGainedSurveyPoints(surveyQuestions) {
    let question;
    if (surveyQuestions.length === 1) {
      question = surveyModel.currentPage.questions[0];
    } else {
      question = surveyModel.currentPage.questions[1];
    }

    setIsSavingPoints(true);
    try {
      await saveAcumulativePoints(query.data._id, currentUser.value._id, parseInt(question.points) || 0)
      setIsSavingPoints(false);
    } catch (err) {
      console.error(err);
      setIsSavingPoints(false);
    };
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
      query.data.allow_gradable_survey === 'true'
        ? { optionQuantity, optionIndex, correctAnswer }
        : { optionQuantity, optionIndex };

    // Se envia al servicio el id de la encuesta, de la pregunta y los datos
    // El ultimo parametro es para ejecutar el servicio de conteo de respuestas
    if (!(Object.keys(currentUser).length === 0)) {
      SavingResponseByUserId(query.data, question, currentUser, eventUsers, voteWeight, infoOptionQuestion);
      console.log('200.saveSurveyAnswers SavingResponseByUserId');
    }
  }

  async function saveSurveyData(sender) {
    console.log('200.saveSurveyData');

    // saveSurveyStatus(); -- temporally ignored
    await saveSurveyCurrentPage();
    await saveSurveyAnswers(sender.currentPage.questions);
  }

  async function onSurveyCompleted(sender) {
    await saveSurveyCurrentPage();
    //await saveGainedSurveyPoints(sender.currentPage.questions);
    await saveSurveyAnswers(sender.currentPage.questions);
    MessageWhenCompletingSurvey(surveyModel, query.data, totalPoints);
    //setResultsSurvey([surveyModel, query.data]);
  }

  return (
    <>
      {/* {&& query.data.allow_gradable_survey === 'true' } */}
      {surveyModel && (
        <>
          {isSavingPoints && (<>Guardando puntos <Spin/></>)}
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
              <Button
                onClick={() => {
                  saveSurveyStatus();
                }}
                type='primary'
                key='console'
              >
                Save survey
                {' '}
                {isSavingPoints && <Spin/>}
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default SurveyComponent;
