import * as Survey from'survey-react';
import { SurveyPreModel } from './types';

Survey.JsonObject.metaData.addProperty('question', 'id');
Survey.JsonObject.metaData.addProperty('question', 'points');

export default (surveyData: SurveyPreModel) => {
  const jsonObj = surveyData as (SurveyPreModel & Survey.SurveyModel);
  
  // Posición del botón next
  jsonObj.showNavigationButtons = 'bottom';
  // Texto del botón next
  jsonObj.pageNextText = 'Responder';
  // Texto del botón complete
  jsonObj.completeText = 'Finalizar';

  // Automáticamente se envia la respuesta y el formulario al contestar
  // la ultima
  jsonObj.goNextPageAutomatic = false;
  jsonObj.allowCompleteSurveyAutomatic = true;

  // Se crea una propiedad para paginar las preguntas
  // @ts-expect-error
  jsonObj.pages = [];
  // Se igual title al valor de survey
  jsonObj.title = jsonObj.survey;
  // Se muestra una barra de progreso en la parte inferior
  jsonObj.showProgressBar = 'top';
  // Esto permite que se envie los datos al pasar cada pagina con el curso onPartialSend
  jsonObj.sendResultOnPageNext = true;
  // Esto permite ocultar el boton de devolver en la encuesta
  jsonObj.showPrevButton = false;
  // Asigna textos al completar encuesta y al ver la encuesta vacia
  jsonObj.completedHtml = 'Gracias por contestar!';
  //jsonObj.questionsOnPageMode = 'singlePage';
  if (jsonObj.allow_gradable_survey === 'true' && jsonObj.initialMessage) {
    // Permite mostrar el contador y asigna el tiempo limite de la encuesta y por pagina
    jsonObj.showTimerPanel = 'top';

    // Temporalmente quemado el tiempo por pregunta. El valor es en segundos
    if (jsonObj.time_limit > 0) {
      jsonObj.maxTimeToFinishPage = jsonObj.time_limit && jsonObj.time_limit;
    }

    // Permite usar la primera pagina como introduccion
    jsonObj.firstPageIsStarted = true;
    jsonObj.startSurveyText = 'Iniciar cuestionario';
    const textMessage = jsonObj.initialMessage;
    jsonObj.questions.unshift({
      type: 'html',
      html: `<div style='width: 90%; margin: 0 auto;'>${textMessage}</div>`,
    } as any);
  }

  if (jsonObj.questions === undefined) {
    console.warn('survey data with no questions:', jsonObj);
    return jsonObj;
  };

  jsonObj['questions'].forEach((page: any, index: number) => {
    let newPage = page;
    newPage['isRequired'] = jsonObj.allow_gradable_survey === 'true' ? false : true;
    // Se agrega la imagen a la pregunta
    if (newPage?.image) {
      const newPanel = {
        type: 'panel',
        elements: [
          newPage.image[0], // First the imagen
          newPage, // Then the question
        ]
      }
      jsonObj.pages[index] = {
        name: `page${index + 1}`,
        key: `page${index + 1}`,
        questions: [newPanel],
      };
    } else {
      jsonObj.pages[index] = {
        name: `page${index + 1}`,
        key: `page${index + 1}`,
        questions: [newPage],
      };
    }
  });

  // Se excluyen las propiedades
  const exclude = ({ survey, id, ...rest }: any): typeof jsonObj => rest;
  return exclude(jsonObj);
}