import { SurveysApi } from '../../../../helpers/request';

async function LoadSelectedSurvey(eventId, idSurvey) {
  /** Este componente nos permite cargar datos de la encuesta seleccionada */


  let dataSurvey = await SurveysApi.getOne(eventId, idSurvey);

  /** Posición del botón next*/
  dataSurvey.showNavigationButtons = 'bottom';
  /** Texto del botón next */
  dataSurvey.pageNextText = 'Responder';
  /** Texto del botón complete */
  dataSurvey.completeText = 'Finalizar';

  /** logo - posicion y medidas */
  // dataSurvey.logo = 'https://portal.evius.co/wp-content/uploads/2021/03/logo_3.png';
  // dataSurvey.logoPosition = 'top';
  // dataSurvey.logoWidth = 180;
  // dataSurvey.logoHeight = 180;
  // dataSurvey.logoFit = 'contain';

  // Automáticamente se envia la respuesta y el formulario al contestar la ultima
  dataSurvey.goNextPageAutomatic = false;
  dataSurvey.allowCompleteSurveyAutomatic = true;

  // Se crea una propiedad para paginar las preguntas
  dataSurvey.pages = [];
  // Se igual title al valor de survey
  dataSurvey.title = dataSurvey.survey;
  // Se muestra una barra de progreso en la parte inferior
  dataSurvey.showProgressBar = 'top';
  // Esto permite que se envie los datos al pasar cada pagina con el curso onPartialSend
  dataSurvey.sendResultOnPageNext = true;
  // Esto permite ocultar el boton de devolver en la encuesta
  dataSurvey.showPrevButton = false;
  // Asigna textos al completar encuesta y al ver la encuesta vacia
  dataSurvey.completedHtml = 'Gracias por contestar!';
  //dataSurvey.questionsOnPageMode = 'singlePage';
  if (dataSurvey.allow_gradable_survey === 'true' && dataSurvey.initialMessage) {
    // Permite mostrar el contador y asigna el tiempo limite de la encuesta y por pagina
    dataSurvey.showTimerPanel = 'top';

    // Temporalmente quemado el tiempo por pregunta. El valor es en segundos
    if (dataSurvey.time_limit > 0) {
      dataSurvey.maxTimeToFinishPage = dataSurvey.time_limit && dataSurvey.time_limit;
    }

    // Permite usar la primera pagina como introduccion
    dataSurvey.firstPageIsStarted = true;
    dataSurvey.startSurveyText = 'Iniciar cuestionario';
    let textMessage = dataSurvey.initialMessage;
    dataSurvey['questions'].unshift({
      type: 'html',
      html: `<div style='width: 90%; margin: 0 auto;'>${textMessage}</div>`,
    });
  }

  if (dataSurvey['questions'] === undefined) return;

  dataSurvey['questions'].forEach((page, index) => {
    let newPage = page;
    newPage['isRequired'] = dataSurvey.allow_gradable_survey === 'true' ? false : true;
    /** Se agrega la imagen a la pregunta */
    if (newPage?.image) {
      // newPage.imageLink = newPage.image[0].imageLink;
      const newPanel = {
        type: 'panel',
        elements: [
          newPage.image[0], // First the imagen
          newPage, // Then the question
        ]
      }
      dataSurvey.pages[index] = {
        name: `page${index + 1}`,
        key: `page${index + 1}`,
        // questions: [newPage?.image[0], newPage],
        questions: [newPanel],
      };
    } else {
      dataSurvey.pages[index] = {
        name: `page${index + 1}`,
        key: `page${index + 1}`,
        questions: [newPage],
      };
    }
  });

  // Se excluyen las propiedades
  const exclude = ({ survey, id, ...rest }) => rest;

  return exclude(dataSurvey);
}

export default LoadSelectedSurvey;
