import SingleAnswerType from './singleAnswerType';
import MultipleAnswerType from './multipleAnswerType';

function GetResponsesIndex(question) {
  return new Promise((resolve, reject) => {
    if (typeof question.value === 'object') {
      // Busca el index de la opcion escogida
      MultipleAnswerType(question).then((response) => {
        resolve(response);
      });
    } else {
      SingleAnswerType(question).then((response) => {
        resolve(response);
      });
    }
  });
}

export default GetResponsesIndex;
