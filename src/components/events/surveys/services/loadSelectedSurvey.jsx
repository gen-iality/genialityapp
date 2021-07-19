import { SurveysApi } from '../../../../helpers/request';
import * as Survey from 'survey-react';
import { data } from 'jquery';

async function LoadSelectedSurvey(eventId, idSurvey, surveyData) {
   /** Este componente nos permite cargar datos de la encuesta seleccionada */

   // Esto permite que el json pueda asignar el id a cada pregunta
   Survey.JsonObject.metaData.addProperty('question', 'id');
   Survey.JsonObject.metaData.addProperty('question', 'points');

   let dataSurvey = await SurveysApi.getOne(eventId, idSurvey);

   /** Posición del botón next*/
   dataSurvey.showNavigationButtons = 'top';
   /** Texto del botón next */
   dataSurvey.pageNextText = 'Responder';
   /** Texto del botón complete */
   dataSurvey.completeText = 'Finalizar';

   /** logo - posicion y medidas */
   dataSurvey.logo = 'https://portal.evius.co/wp-content/uploads/2021/03/logo_3.png';
   dataSurvey.logoPosition = 'top';
   dataSurvey.logoWidth = 180;
   dataSurvey.logoHeight = 180;
   dataSurvey.logoFit = 'contain';

   // Automáticamente se envia la respuesta y el formulario al contestar la ultima
   dataSurvey.goNextPageAutomatic = false;
   dataSurvey.allowCompleteSurveyAutomatic = true;

   // Se crea una propiedad para paginar las preguntas
   dataSurvey.pages = [];
   // Se igual title al valor de survey
   dataSurvey.title = dataSurvey.survey;
   // Se muestra una barra de progreso en la parte inferior
   dataSurvey.showProgressBar = 'bottom';
   // Esto permite que se envie los datos al pasar cada pagina con el evento onPartialSend
   dataSurvey.sendResultOnPageNext = true;
   // Esto permite ocultar el boton de devolver en la encuesta
   dataSurvey.showPrevButton = false;
   // Asigna textos al completar encuesta y al ver la encuesta vacia
   dataSurvey.completedHtml = 'Gracias por completar la encuesta!';
   //dataSurvey.questionsOnPageMode = 'singlePage';
   if (dataSurvey.allow_gradable_survey === 'true' && dataSurvey.initialMessage) {
      // Permite mostrar el contador y asigna el tiempo limite de la encuesta y por pagina
      dataSurvey.showTimerPanel = 'top';

      // Temporalmente quemado el tiempo por pregunta. El valor es en segundos
      dataSurvey.maxTimeToFinishPage = dataSurvey.time_limit ? dataSurvey.time_limit : 10;

      // Permite usar la primera pagina como introduccion
      dataSurvey.firstPageIsStarted = true;
      dataSurvey.startSurveyText = 'Iniciar Cuestionario';
      let textMessage = dataSurvey.initialMessage;
      dataSurvey['questions'].unshift({
         type: 'html',
         html: `<div style='width: 90%; margin: 0 auto;'>${textMessage}</div>`,
      });
   }

   if (dataSurvey['questions'] === undefined) return;

   // El {page, ...rest} es temporal
   // Debido a que se puede setear la pagina de la pregunta si la pregunta tiene la propiedad 'page'

   // Aqui se itera cada pregunta y se asigna a una pagina

   dataSurvey['questions'].forEach(({ page, ...rest }, index) => {
      dataSurvey.pages[index] = {
         name: `page${index + 1}`,
         key: `page${index + 1}`,
         questions: [{ ...rest, isRequired: dataSurvey.allow_gradable_survey === 'true' ? false : true }],
      };
   });

   // Se excluyen las propiedades
   const exclude = ({ survey, id, questions, ...rest }) => rest;

   surveyData = exclude(dataSurvey);
   return surveyData;
}

export default LoadSelectedSurvey;
