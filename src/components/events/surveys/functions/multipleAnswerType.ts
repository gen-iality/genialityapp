function MultipleAnswerType(question: any) {
   let optionIndex: any[] = [];
   return new Promise((resolve, reject) => {
      question.value.forEach((value: any) => {
         optionIndex = [
            ...optionIndex,
            question.choices.findIndex((item: any) => item.propertyHash.value === value || item.itemValue === value),
         ];
      });
      resolve(optionIndex);
   });
}

export default MultipleAnswerType;
