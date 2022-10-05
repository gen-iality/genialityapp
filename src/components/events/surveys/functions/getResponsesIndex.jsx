import singleAnswerType from './singleAnswerType';
import multipleAnswerType from './multipleAnswerType';

async function getResponsesIndex(question) {
  if (typeof question.value === 'object') {
    // Busca el index de la opcion escogida
    return await multipleAnswerType(question)
  } else {
    return await singleAnswerType(question)
  }
}

export default getResponsesIndex;
