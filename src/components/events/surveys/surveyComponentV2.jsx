import { useState, useEffect } from 'react';
import { Result, Spin, Button } from 'antd';
import { ConsoleSqlOutlined, LoadingOutlined } from '@ant-design/icons';
import { UseEventContext } from '../../../context/eventContext';
import useSurveyQuery from './hooks/useSurveyQuery';
import * as Survey from 'survey-react';
//Funciones externas
import assignStylesToSurveyFromEvent from './components/assignStylesToSurveyFromEvent';
import StateMessages from './functions/stateMessagesV2';

function SurveyComponent(props) {
  const { eventId, idSurvey, surveyLabel, operation, showListSurvey, currentUser } = props;
  const cEvent = UseEventContext();
  //query.data tiene la definición de la encuesta/examen
  let query = useSurveyQuery(eventId, idSurvey);
  console.log('200.updateSurveyStatusx0', eventId, idSurvey);
  console.log('200.pruebashook', query.data);

  const eventStyles = cEvent.value.styles;
  const loaderIcon = <LoadingOutlined style={{ color: '#2bf4d5' }} />;

  const [surveyModel, setSurveyModel] = useState(null);
  const [showingFeedback, setShowingFeedback] = useState(false);
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
    if (shouldDisplayFeedback(sender.currentPage)) {
      stopChangeToNextQuestion(sender.currentPage);
      hideTimerPanel();
      displayFeedback(Survey, sender.currentPage);
      console.log('senderi', sender.currentPage);
      setReadOnlyTheQuestions(sender.currentPage.questions);
    } else {
      showTimerPanel();
    }
  };

  function shouldDisplayFeedback(page) {
    return page.feedbackVisible !== true;
  }

  function stopChangeToNextQuestion(options) {
    options.allowChanging = false;
  }

  function hideTimerPanel() {
    surveyModel.showTimerPanel = 'none';
  }

  function displayFeedback(Survey, page) {
    console.log('200.Se ejecuta la función displayFeedback');
    console.log('200.displayFeedback page', page);
    page.feedbackVisible = true;
    setShowingFeedback(true);
    {
      console.log('currentpage displayFeedback', page);
    }
    //let feedback = createQuestionsFeedback(Survey, page);
    //page.addQuestion(feedback, 0);
    console.log('200.displayFeedback page despues de addQuestion', page);
  }

  function calculateScoredPoints(questions) {
    let pointsScored = 0;
    questions.map((question) => {
      pointsScored += question.correctAnswerCount ? question.correctAnswerCount : 0;
    });

    return pointsScored;
  }

  function createQuestionsFeedback(page) {
    let pointsScored = calculateScoredPoints(page.questions);

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

    function createQuestionsFeedbackAsSurveJSObject(Survey, page) {
      let pointsScored = calculateScoredPoints(page.questions);
      var feedback = Survey.Serializer.createClass('html');
      feedback.fromJSON({
        type: 'html',
        name: 'info',
        html: '<div><p>Pregunta contestada</p><p>' + titulo + '</p><p>Has ganado ' + pointsScored + ' puntos</p></div>',
      });
      return feedback;
    }
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
  }

  function temporizador(sender, options) {
    options.text = `Tienes ${sender.maxTimeToFinishPage} para responder. Tu tiempo es ${sender.currentPage.timeSpent}`;
  }

  /* survey.onTimerPanelInfoText.add((sender, options) => {
    if (sender.currentPage.isReadOnly) {
      options.text = '';
    } else {
      //console.log("Esto sucede en onTimerPanelInfoText");
      options.text = `Tienes ${survey.maxTimeToFinishPage} para responder. Tu tiempo es ${survey.currentPage.timeSpent}`;
    }
  }); */

  /*  survey.onComplete.add(function(sender) {
    document.querySelector('#surveyResult').textContent = 'Result JSON:\n' + JSON.stringify(sender.data, null, 3);
  }); */

  return (
    <>
      {/* {&& query.data.allow_gradable_survey === 'true' } */}
      {surveyModel && (
        <>
          {showingFeedback && createQuestionsFeedback(surveyModel.currentPage)}
          <div style={{ display: showingFeedback ? 'none' : 'block' }}>
            <Survey.Survey model={surveyModel} onCurrentPageChanging={displayFeedbackAfterQuestionAnswered} />
          </div>
        </>
      )}
    </>
  );
}

export default SurveyComponent;
