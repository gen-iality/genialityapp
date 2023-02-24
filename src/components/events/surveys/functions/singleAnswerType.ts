function SingleAnswerType(question: any) {
  return new Promise((resolve, reject) => {
    const optionIndex = question.choices.findIndex(
      (item: any) => item.propertyHash.value === question.value || item.itemValue === question.value
    );
    resolve(optionIndex);
  });
}

export default SingleAnswerType;
