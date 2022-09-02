import { useState, useEffect } from 'react';
import { Result, Spin, Button, Col } from 'antd';
import { ConsoleSqlOutlined, LoadingOutlined } from '@ant-design/icons';
import { UseEventContext } from '../../../context/eventContext';
import useSurveyQuery from './hooks/useSurveyQuery';
import * as Survey from 'survey-react';
import { SurveyPage } from './services/services';
//Funciones externas
import assignStylesToSurveyFromEvent from './components/assignStylesToSurveyFromEvent';
import StateMessages from './functions/stateMessagesV2';
import SetCurrentUserSurveyStatus from './functions/setCurrentUserSurveyStatus';
import MessageWhenCompletingSurvey from './functions/messageWhenCompletingSurvey';

function SurveyComponent(props) {
  const { eventId, idSurvey, surveyLabel, operation, showListSurvey, currentUser } = props;
  const cEvent = UseEventContext();
  //query.data tiene la definición de la encuesta/examen
  let query = useSurveyQuery(eventId, idSurvey);
  console.log('200.updateSurveyStatusx0', eventId, idSurvey);
  console.log('200.pruebashook', query.data);
  console.log('200.CurrentUserID', currentUser.value._id);

  const eventStyles = cEvent.value.styles;
  const loaderIcon = <LoadingOutlined style={{ color: '#2bf4d5' }} />;

  const [surveyModel, setSurveyModel] = useState(null);
  const [showingFeedback, setShowingFeedback] = useState(false);
  const [questionFeedback, setQuestionFeedback] = useState(false);
  const [showingExitButton, setShowingExitButton] = useState(false);
  let [totalPoints, setTotalPoints] = useState(null);
  var survey;

  //Asigna los colores configurables a  la UI de la encuesta
  useEffect(() => {
    if (!query.data) return;
    assignStylesToSurveyFromEvent(eventStyles);
    survey = createSurveyModel(query.data);
    setSurveyModel(survey);
    //survey.onCurrentPageChanging.add(displayFeedbackafterQuestionAnswered);
  }, [query.data]);

  function createSurveyModel(survey) {
    let surveyModelData = new Survey.Model(survey);
    surveyModelData.currentPageNo = survey.currentPage;
    surveyModelData.locale = 'es';
    //Este se esta implementando para no usar el titulo de la encuesta y se muestre dos veces
    //uno en el header y otro encima del botón de inicio de encuesta
    delete surveyModelData.localizableStrings.title.values.default;
    return surveyModelData;
  }

  const displayFeedbackAfterQuestionAnswered = (sender, options) => {
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
                setShowingFeedback(false);
                surveyModel.nextPage();
                if (surveyModel.state === 'completed') {
                  setShowingExitButton(true);
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
    await SetCurrentUserSurveyStatus(query.data, currentUser, status);
  }

  async function saveSurveyCurrentPage() {
    if (!(Object.keys(currentUser).length === 0)) {
      //Actualizamos la página actúal, sobretodo por si se cae la conexión regresar a la última pregunta
      SurveyPage.setCurrentPage(query.data._id, currentUser.value._id, surveyModel.currentPageNo);
    }
  }

  function saveSurveyData() {
    saveSurveyStatus();
    saveSurveyCurrentPage();
  }

  async function surveyCompleted() {
    saveSurveyCurrentPage();
    MessageWhenCompletingSurvey(surveyModel, query.data, totalPoints);
  }

  return (
    <>
      {/* {&& query.data.allow_gradable_survey === 'true' } */}
      {surveyModel && (
        <>
          {showingFeedback && questionFeedback}
          <div style={{ display: showingFeedback ? 'none' : 'block' }}>
            <Survey.Survey
              model={surveyModel}
              onCurrentPageChanging={displayFeedbackAfterQuestionAnswered}
              onPartialSend={saveSurveyData}
              onCompleting={displayFeedbackAfterQuestionAnswered}
              onComplete={surveyCompleted}
            />
          </div>
          {showingExitButton && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                onClick={() => {
                  saveSurveyStatus();
                }}
                type='primary'
                key='console'
              >
                Exit
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default SurveyComponent;
