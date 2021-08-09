function MultipleAnswerType(question) {
   let optionIndex = [];
   return new Promise((resolve, reject) => {
      question.value.forEach((value) => {
         optionIndex = [
            ...optionIndex,
            question.choices.findIndex((item) => item.propertyHash.value === value || item.itemValue === value),
         ];
      });
      resolve(optionIndex);
   });
}

export default MultipleAnswerType;
