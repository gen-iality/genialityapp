function singleAnswerType(question) {
  const optionIndex = (question.choices ?? []).findIndex(
    (item) =>
      item.propertyHash.value === question.value || item.itemValue === question.value,
  )
  return optionIndex
}

function multipleAnswerType(question) {
  let optionIndex = []
  question.value.forEach((value) => {
    optionIndex = [
      ...optionIndex,
      (question.choices ?? []).findIndex(
        (item) => item.propertyHash.value === value || item.itemValue === value,
      ),
    ]
  })
  return optionIndex
}

function getResponsesIndex(question) {
  if (typeof question.value === 'object') {
    // Busca el index de la opcion escogida
    return multipleAnswerType(question)
  }

  return singleAnswerType(question)
}

export default getResponsesIndex
