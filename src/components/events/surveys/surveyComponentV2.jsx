import { useState, useEffect } from 'react';
import { Result, Spin } from 'antd';
import { ConsoleSqlOutlined, LoadingOutlined } from '@ant-design/icons';
import { UseEventContext } from '../../../context/eventContext';
import useSurveyQuery from './hooks/useSurveyQuery';
import * as Survey from 'survey-react';
//Funciones externas
import assignStylesToSurveyFromEvent from './components/assignStylesToSurveyFromEvent';

function SurveyComponent(props) {
  const { eventId, idSurvey, surveyLabel, operation, showListSurvey, currentUser } = props;
  const cEvent = UseEventContext();
  //query.data tiene la definición de la encuesta/examen
  let query = useSurveyQuery(eventId, idSurvey);
  console.log('200.updateSurveyStatusx0', eventId, idSurvey);
  console.log('200.pruebashook', query);

  const eventStyles = cEvent.value.styles;
  const loaderIcon = <LoadingOutlined style={{ color: '#2bf4d5' }} />;

  const [surveyModel, setSurveyModel] = useState(null);

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
    //En el primer intento de cambio de pagina esta variable es indefinida y por tanto  activamos el feedback y  marcamos answered cómo true. para que al siguiente intento de cambio de pagina ya podamos pasar la la siguiente pregunta.
    console.log('200.displayFeedbackafterQuestionAnswered sender', sender);
    console.log('200.displayFeedbackafterQuestionAnswered options', options);

    console.log(
      '200.displayFeedbackafterQuestionAnswered shouldDisplayFeedback(options.oldCurrentPage)',
      shouldDisplayFeedback(options.oldCurrentPage)
    );

    if (shouldDisplayFeedback(options.oldCurrentPage)) {
      console.log('200.Ejecución del If');
      stopChangeToNextQuestion(options);
      hideTimerPanel();
      displayFeedback(Survey, options.oldCurrentPage);
      setReadOnlyTheQuestions(options.oldCurrentPage.questions);
    } else {
      console.log('200.Ejecución del else');
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
    let feedback = createQuestionsFeedback(Survey, page);
    page.addQuestion(feedback, 0);
    console.log('200.displayFeedback page despues de addQuestion', page);
  }

  function createQuestionsFeedback(Survey, page) {
    //feedback de la pregunta
    console.log('200.page.questions', page.questions);
    var feedback = Survey.Serializer.createClass('html');
    let cantidadCorrectas = 0;
    page.questions.map((question) => {
      cantidadCorrectas += question.correctAnswerCount ? question.correctAnswerCount : 0;
    });
    let mensaje = cantidadCorrectas ? 'Bien contestado' : 'Te jodiste.';

    feedback.fromJSON({
      type: 'html',
      name: 'info',
      html: '<div><h1>Pregunta respondida</h1><p>' + mensaje + '</p></div>',
    });
    return feedback;
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
      {surveyModel && (
        <Survey.Survey model={surveyModel} onCurrentPageChanging={displayFeedbackAfterQuestionAnswered} />
      )}
    </>
  );
}

export default SurveyComponent;
