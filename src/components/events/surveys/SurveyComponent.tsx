/** Hooks, CustomHooks  and react libraries*/
import { useState, useEffect, FunctionComponent } from 'react';
import * as Survey from 'survey-react';
import { Link, useHistory } from 'react-router-dom';

/** Helpers and services */
import { setCurrentPage } from './services/surveys';

/** Antd services */
import { Result, Spin, Button, Col } from 'antd';

/** Funciones externas */
import stateMessages from './functions/stateMessagesV2';
import messageWhenCompletingSurvey from './functions/messageWhenCompletingSurvey';
import getResponsesIndex from './functions/getResponsesIndex';
import savingResponseByUserId from './functions/savingResponseByUserId';
import shuffleSurveyQuestion from './models/shuffleSurveyQuestion';

/** Contexts */
import { UseEventContext } from '@context/eventContext';
import { useCurrentUser } from '@context/userContext';

/** Componentes */
import assignStylesToSurveyFromEvent from './components/assignStylesToSurveyFromEvent';
import { addTriesNumber, addRightPoints  } from './services/surveyStatus';
import { useSurveyContext } from './surveyContext';
import SurveyQuestionsFeedback from './SurveyQuestionsFeedback';
import { SurveyPreModel } from './models/types';

// Configuración para poder relacionar el id de la pregunta en la base de datos
// con la encuesta visible para poder almacenar las respuestas
Survey.JsonObject.metaData.addProperty('question', 'id');
Survey.JsonObject.metaData.addProperty('question', 'points');

/**
 * Create a Survey Modal from a survey data.
 * @param {SurveyPreModel} survey The survey from MongoDB.
 * @returns A Survey Modal object.
 */
function createSurveyModel(survey: SurveyPreModel) {
  const surveyModelData = new Survey.Model(survey);
  surveyModelData.currentPageNo = survey.currentPage;
  surveyModelData.locale = 'es';
  // Este se esta implementando para no usar el titulo de la encuesta y se muestre dos veces
  // uno en el header y otro encima del botón de inicio de encuesta
  delete surveyModelData.localizableStrings.title.values.default;
  return surveyModelData;
}

export interface SurveyComponentProps {
  eventId: string,
  queryData: any,
};

const SurveyComponent: FunctionComponent<SurveyComponentProps> = (props) => {
  const {
    eventId, // The event id
    queryData, // The survey data
  } = props;

  const cEvent = UseEventContext();
  const currentUser = useCurrentUser();
  const history = useHistory();
  const cSurvey = useSurveyContext();

  const [surveyModel, setSurveyModel] = useState<Survey.SurveyModel | undefined>();
  const [showingFeedback, setShowingFeedback] = useState(false);
  const [currentQuestionsForFeedback, setCurrentQuestionsForFeedback] = useState([]); /** @type any[] */

  const [isSaveButtonShown, setIsSaveButtonShown] = useState(false);
  const [isSavingPoints, setIsSavingPoints] = useState(false);

  const [eventUsers, setEventUsers] = useState([]);
  const [voteWeight, setVoteWeight] = useState(0); // Inquietud: Es util?

  useEffect(() => {
    // Asigna los colores configurables a  la UI de la encuesta
    const eventStyles = cEvent.value.styles;
    assignStylesToSurveyFromEvent(eventStyles);
  }, []);

  /**
   * Take questions and create the model for the Survey component. If the settings
   * says that it must be getting randomly, then only some questions will be taken.
   */
  useEffect(() => {
    if (!(queryData?.questions.length > 0)) return;
    setSurveyModel(createSurveyModel(shuffleSurveyQuestion(queryData as any) as SurveyPreModel));
  }, [queryData]);

  const displayFeedbackAfterEachQuestion = (sender: Survey.SurveyModel, options: any) => {
    if (showingFeedback !== true) {
      stopChangeToNextQuestion(options);
      hideTimerPanel();
      displayFeedback();
      setCurrentQuestionsForFeedback(sender.currentPage.questions);
      setReadOnlyTheQuestions(sender.currentPage.questions);
    } else {
      showTimerPanel();
    }
  };

  function stopChangeToNextQuestion(options: any) {
    options.allowChanging = false;
  }

  function hideTimerPanel() {
    if (surveyModel === undefined) return;
    surveyModel.showTimerPanel = 'none';
    surveyModel.stopTimer();
  }

  function displayFeedback() {
    setShowingFeedback(true);
  }

  function setReadOnlyTheQuestions(questions: any[]) {
    // Volvemos de solo lectura las respuestas
    questions.forEach((question, index) => {
      if (index === 0) return;
      question.readOnly = true;
    });
  }

  function showTimerPanel() {
    if (surveyModel === undefined) return;
    surveyModel.showTimerPanel = 'top';
    surveyModel.startTimer();
  }

  async function saveSurveyStatus() {
    if (surveyModel === undefined) return;

    const status = surveyModel.state;
    console.debug('200.status', status);
    // await SetCurrentUserSurveyStatus(queryData, currentUser, status);
    await addTriesNumber(
      queryData._id, // Survey ID
      currentUser.value._id, // User Id
      cSurvey.surveyStatus?.tried || 0, // Tried amount
      cSurvey.survey.tries || 1, // Max tries
      status,
    );
  }

  async function saveSurveyCurrentPage() {
    if (surveyModel === undefined) return;
    if (!(Object.keys(currentUser).length === 0)) {
      // Actualizamos la página actúal, sobretodo por si se cae la conexión regresar a la última pregunta
      await setCurrentPage(queryData._id, currentUser.value._id, surveyModel.currentPageNo);
    }
  }

  async function saveGainedSurveyPoints(surveyQuestions: Survey.SurveyQuestion[]) {
    if (surveyModel === undefined) return;
  
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
      await addRightPoints(queryData._id, currentUser.value._id, correctAnswer ? value : 0);
      console.log('600 savedGainedSurveyPoints value', value);
      setIsSavingPoints(false);
    } catch (err) {
      console.error(err);
      setIsSavingPoints(false);
    }
  }

  async function saveSurveyAnswers(surveyQuestions: Survey.SurveyQuestion[]) {
    if (surveyModel === undefined) return;

    let question;
    let optionQuantity = 0;
    let correctAnswer = false;

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
    const responseIndex = await getResponsesIndex(question);
    const optionIndex = responseIndex;

    optionQuantity = question.choices.length;

    const infoOptionQuestion =
      queryData.allow_gradable_survey === 'true'
        ? { optionQuantity, optionIndex, correctAnswer }
        : { optionQuantity, optionIndex };

    // Se envia al servicio el id de la encuesta, de la pregunta y los datos
    // El ultimo parametro es para ejecutar el servicio de conteo de respuestas
    if (!(Object.keys(currentUser).length === 0)) {
      savingResponseByUserId(queryData, question, currentUser, eventUsers, voteWeight, infoOptionQuestion);
      console.log('200.saveSurveyAnswers savingResponseByUserId');
    }
  }

  async function saveSurveyData(sender: Survey.SurveyModel) {
    console.log('200.saveSurveyData');

    await saveSurveyCurrentPage();
    await saveSurveyAnswers(sender.currentPage.questions);
    await saveGainedSurveyPoints(sender.currentPage.questions)
      .then(() => console.log('600 saveSurveyData puntos enviados para este quiz'))
      .catch(err => console.error('600 saveSurveyData saveGainedSurveyPoints error:', err));
  }

  async function onSurveyCompleted(sender: Survey.SurveyModel) {
    console.log('200.onSurveyCompleted');
    await saveSurveyData(sender);
    await messageWhenCompletingSurvey(surveyModel, queryData, currentUser.value._id);
  }

  return (
    <>
      {surveyModel && (
        <>
          {isSavingPoints && <p>Guardando puntos <Spin /></p>}
          {showingFeedback && (
            <SurveyQuestionsFeedback
              questions={currentQuestionsForFeedback}
              onNextClick={() => {
                setShowingFeedback(false);
                surveyModel.nextPage();
                if (surveyModel.state === 'completed') {
                  setIsSaveButtonShown(true);
                  setCurrentPage(queryData._id, currentUser.value._id, 0);
                }
              }}
            />
          )}
          <div style={{ display: showingFeedback ? 'none' : 'block' }}>
            <Survey.Survey
              style={{ display: isSavingPoints ? 'none':'' }}
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
                type='primary'
                onClick={() => {
                  saveSurveyStatus().then(() => history.push(`/landing/${eventId}/evento`))
                }}
              >
                Volver al curso {isSavingPoints && <Spin />}
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default SurveyComponent;
