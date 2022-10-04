function singleAnswerType(question) {
  const optionIndex = question.choices.findIndex(
    (item) => item.propertyHash.value === question.value || item.itemValue === question.value
  );
  return optionIndex;
}

export default singleAnswerType;
