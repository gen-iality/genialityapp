import GetResponsesIndex from './getResponsesIndex';
import SavingResponseByUserId from './savingResponseByUserId';

// Componente que ejecuta el servicio para registar votos
function RegisterVote(surveyData, question, infoUser, eventUsers, voteWeight) {
   // Se obtiene el index de la opcion escogida, y la cantidad de opciones de la pregunta
   let optionQuantity = 0;
   let correctAnswer = false;

   // Asigna puntos si la encuesta tiene
   let surveyPoints = question.points ? parseInt(question.points) : 1;
   console.log('200.RegisterVote question.points', question.points);
   console.log('200.RegisterVote surveyPoints', surveyPoints);
   let pointsForCorrectAnswer = 0;

   //Validacion para permitir preguntas tipo texto (abiertas)
   // eslint-disable-next-line no-empty
   if (question.inputType === 'text') {
   } else {
      // Funcion que retorna si la opcion escogida es la respuesta correcta
      console.log('200.RegisterVote question ', question, question.correctAnswer, question.value, '¿Es_correcta?', question.isAnswerCorrect())
      correctAnswer = question.correctAnswer !== undefined ? question.isAnswerCorrect() : undefined;
      console.log('200.RegisterVote correctAnswer', correctAnswer);

      /** Si la respuesta es correcta se asignan los puntos */
      if (correctAnswer) pointsForCorrectAnswer += surveyPoints;
      /** funcion para validar tipo de respuesta multiple o unica */
      GetResponsesIndex(question).then((responseIndex) => {
         optionQuantity = question.choices.length;
         let optionIndex = responseIndex;

         let infoOptionQuestion =
            surveyData.allow_gradable_survey === 'true'
               ? { optionQuantity, optionIndex, correctAnswer }
               : { optionQuantity, optionIndex };

         // Se envia al servicio el id de la encuesta, de la pregunta y los datos
         // El ultimo parametro es para ejecutar el servicio de conteo de respuestas
         if (!(Object.keys(infoUser).length === 0)) {
            SavingResponseByUserId(surveyData, question, infoUser, eventUsers, voteWeight, infoOptionQuestion);
         }
      });
   }
   return pointsForCorrectAnswer
}

export default RegisterVote;
