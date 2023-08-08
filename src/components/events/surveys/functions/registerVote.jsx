import getResponsesIndex from './getResponsesIndex'
import saveResponseByUserId from './saveResponseByUserId'

// Componente que ejecuta el servicio para registar votos
function RegisterVote(surveyData, question, infoUser, eventUsers, voteWeight) {
  // Se obtiene el index de la opcion escogida, y la cantidad de opciones de la pregunta
  let optionQuantity = 0
  let correctAnswer = false

  // Asigna puntos si la encuesta tiene
  const surveyPoints = question.points ? parseInt(question.points) : 1
  let pointsForCorrectAnswer = 0

  //Validacion para permitir preguntas tipo texto (abiertas)
  // eslint-disable-next-line no-empty
  if (question.inputType === 'text') {
  } else {
    // Funcion que retorna si la opcion escogida es la respuesta correcta
    correctAnswer =
      question.correctAnswer !== undefined ? question.isAnswerCorrect() : undefined
    /** Si la respuesta es correcta se asignan los puntos */
    if (correctAnswer) pointsForCorrectAnswer += surveyPoints
    /** funcion para validar tipo de respuesta multiple o unica */
    const responseIndex = getResponsesIndex(question)
    optionQuantity = question.choices.length
    const optionIndex = responseIndex

    const infoOptionQuestion =
      surveyData.allow_gradable_survey === 'true'
        ? { optionQuantity, optionIndex, correctAnswer }
        : { optionQuantity, optionIndex }

    // Se envia al servicio el id de la encuesta, de la pregunta y los datos
    // El ultimo parametro es para ejecutar el servicio de conteo de respuestas
    if (!(Object.keys(infoUser).length === 0)) {
      saveResponseByUserId(
        surveyData,
        question,
        infoUser,
        eventUsers,
        voteWeight,
        infoOptionQuestion,
      )
    }
  }
  return pointsForCorrectAnswer
}

export default RegisterVote
