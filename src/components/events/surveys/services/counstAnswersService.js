import { firestore, fireRealtime } from '../../../../helpers/firebase';
import updateTotalVoteMultipleAnswer from '../functions/updateTotalVoteMultipleAnswer';
import updateTotalVoteSingleAnswer from '../functions/updateTotalVoteSingleAnswer';

// Funcion para realizar conteo de las opciones por pregunta
function countAnswers(surveyId, questionId, optionQuantity, optionIndex, voteValue) {
  // Se valida si el voto tiene valor de lo contrario sumara 1
  let vote = typeof voteValue == 'number' ? parseFloat(voteValue) : 1;

  const updateTotalVoteParameters = {
    optionIndex,
    vote,
  };

  const realTimeRef = fireRealtime.ref(`surveys/${surveyId}/answer_count/${questionId}`);
  /** Cifra aleatoria que se agrega como tolerancia para el setTimeOut que envuelve las transacciones */
  const randomNumber = Math.random() * (0.8 - 0.3) + 0.3;
  const toleranceTime = Math.round(randomNumber * 100) / 100;

  /** setTimeOut que nos permite crear delay entre insersiones ya que si no se pone firebase RealTime espera el bloque completo de transacciones para actualizarlas y se incrementan los tiempos de respuesta */
  setTimeout(() => {
    realTimeRef.transaction((questionAnswerCount) => {
      if (questionAnswerCount) {
        if (optionIndex && optionIndex.length && optionIndex.length > 0) {
          updateTotalVoteMultipleAnswer(updateTotalVoteParameters, questionAnswerCount);
        } else {
          updateTotalVoteSingleAnswer(updateTotalVoteParameters, questionAnswerCount);
        }
      } else {
        // Se crea un objeto que se asociara a las opciones de las preguntas
        // Y se inicializan con valores en 0, para luego realizar el conteo
        let firstData = {};
        for (var i = 0; i < optionQuantity; i++) {
          let idResponse = i.toString();

          // Se valida si se escogio mas de una opcion en la pregunta o no
          if (optionIndex && optionIndex.length && optionIndex.length > 0) {
            firstData[idResponse] = optionIndex.includes(i) ? vote : 0;
          } else {
            firstData[idResponse] = optionIndex == idResponse ? vote : 0;
          }
        }

        // Valida si la colleccion existe, si no, se asigna el arreglo con valores iniciales
        questionAnswerCount = firstData;
      }
      return questionAnswerCount;
    });
  }, toleranceTime);
}
export default countAnswers;
