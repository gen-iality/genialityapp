import dayjs from 'dayjs';
import dayjsPluginUTC from 'dayjs-plugin-utc'
dayjs.extend(dayjsPluginUTC);

//Componente que cambia el mensaje por defecto para el contador
function TimeLimitPerQuestion(survey, options) {
  if (survey.maxTimeToFinishPage > 0) {
    // Aqui se obtiene el tiempo limite por pregunta
    let countDown = dayjs.utc((survey.maxTimeToFinishPage - survey.currentPage.timeSpent) * 1000).format('mm:ss');
    let timeTotal = dayjs.utc(survey.maxTimeToFinishPage * 1000).format('mm:ss');
    options.text = `Tienes ${timeTotal} para responder la pregunta. Quedan ${countDown}`;
  } else {
    options.text = ``;
  }
}

export default TimeLimitPerQuestion;
