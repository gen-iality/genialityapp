function singleAnswerType(question: any) {
  const optionIndex = (question.choices ?? []).findIndex(
    (item: any) =>
      item.propertyHash.value === question.value || item.itemValue === question.value,
  )
  return optionIndex
}

function multipleAnswerType(question: any) {
  let optionIndex: any[] = []
  question.value.forEach((value: any) => {
    optionIndex = [
      ...optionIndex,
      (question.choices ?? []).findIndex(
        (item: any) => item.propertyHash.value === value || item.itemValue === value,
      ),
    ]
  })
  return optionIndex
}

function getResponsesIndex(question: any) {
  if (typeof question.value === 'object') {
    // Busca el index de la opcion escogida
    return multipleAnswerType(question)
  }

  return singleAnswerType(question)
}

export default getResponsesIndex
