import Moment from 'moment';

//Componente que cambia el mensaje por defecto para el contador
function TimeLimitPerQuestion(survey, options) {
  if (survey.maxTimeToFinishPage > 0) {
    // Aqui se obtiene el tiempo limite por pregunta
    let countDown = Moment.utc((survey.maxTimeToFinishPage - survey.currentPage.timeSpent) * 1000).format('mm:ss');
    let timeTotal = Moment.utc(survey.maxTimeToFinishPage * 1000).format('mm:ss');
    options.text = `Tienes ${timeTotal} para responder la pregunta. Quedan ${countDown}`;
  } else {
    options.text = ``;
  }
}

export default TimeLimitPerQuestion;
