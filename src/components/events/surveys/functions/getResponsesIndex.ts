import SingleAnswerType from './singleAnswerType';
import MultipleAnswerType from './multipleAnswerType';

function GetResponsesIndex(question: any) {
  return new Promise((resolve, reject) => {
    console.log('question',question);
    
    if (typeof question.value === 'object') {
      // Busca el index de la opcion escogida
      MultipleAnswerType(question).then((response) => {
        resolve(response);
      });
    }else if(question.inputType === 'text') {
      resolve(0);
    }
    else {
      SingleAnswerType(question).then((response) => {
        resolve(response);
      })
    }
  });
}

export default GetResponsesIndex;
