import { SurveyAnswers } from './services';

// Componente que ejecuta el servicio para registar votos
function RegisterVote(surveyData, question, infoUser, eventUsers, voteWeight) {

   return new Promise((resolve, reject) => {
      // Se obtiene el index de la opcion escogida, y la cantidad de opciones de la pregunta
      let optionIndex = [];
      let optionQuantity = 0;
      let correctAnswer = false;

      // Asigna puntos si la encuesta tiene
      let surveyPoints = question.points ? parseInt(question.points) : 1;
      let pointsForCorrectAnswer = 0;

      //Hack rÃƒÆ’Ã‚Â¡pido para permitir preguntas tipo texto (abiertas)
      // eslint-disable-next-line no-empty
      if (question.inputType === 'text') {
      } else {
         // se valida si question value posee un arreglo 'Respuesta de opcion multiple' o un texto 'Respuesta de opcion unica'
         if (typeof question.value === 'object') {
            correctAnswer = question.correctAnswer !== undefined ? question.isAnswerCorrect() : undefined;

            if (correctAnswer) pointsForCorrectAnswer += surveyPoints;
            question.value.forEach((value) => {
               optionIndex = [...optionIndex, question.choices.findIndex((item) => item.propertyHash.value === value)];
            });
            console.log("10. ===> optionIndex if <==", optionIndex)
         } else {
            // Funcion que retorna si la opcion escogida es la respuesta correcta
            correctAnswer = question.correctAnswer !== undefined ? question.isAnswerCorrect() : undefined;

            if (correctAnswer) pointsForCorrectAnswer += surveyPoints;
            // Busca el index de la opcion escogida
            optionIndex = question.choices.findIndex((item) => item.propertyHash.value === question.value);
         }
         optionQuantity = question.choices.length;
      }
console.log("10. ===> optionIndex else <==", optionIndex)
// console.log("10. ===> question.value <==", question.value)
// console.log("10. ===> question.choices <==", question.choices)
      let infoOptionQuestion =
         surveyData.allow_gradable_survey === 'true'
            ? { optionQuantity, optionIndex, correctAnswer }
            : { optionQuantity, optionIndex };

      // Se envia al servicio el id de la encuesta, de la pregunta y los datos
      // El ultimo parametro es para ejecutar el servicio de conteo de respuestas
      if (!(Object.keys(infoUser).length === 0)) {
         SurveyAnswers.registerWithUID(
            surveyData._id,
            question.id,
            {
               responseData: question.value,
               date: new Date(),
               uid: infoUser.value._id,
               email: infoUser.value.email,
               names: infoUser.value.names || infoUser.value.displayName,
               voteValue: surveyData.allow_vote_value_per_user === 'true' && eventUsers.length > 0 && voteWeight,
            },
            infoOptionQuestion
         )
            .then((result) => {
               resolve({ responseMessage: result, pointsForCorrectAnswer });

            })
            .catch((err) => {
               reject({ responseMessage: err });
            });
      } else {
         // Sirve para controlar si un usuario anonimo ha votado
         localStorage.setItem(`userHasVoted_${surveyData._id}`, true);

         SurveyAnswers.registerLikeGuest(
            surveyData._id,
            question.id,
            {
               responseData: question.value || '',
               date: new Date(),
               uid: 'guest',
            },
            infoOptionQuestion
         )
            .then((result) => {
               resolve({ responseMessage: result, pointsForCorrectAnswer });
            })
            .catch((err) => {
               reject({ responseMessage: err });
            });
      }
   });
}

export default RegisterVote;
