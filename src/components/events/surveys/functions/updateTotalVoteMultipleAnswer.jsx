function updateTotalVoteMultipleAnswer(updateTotalVoteParameters, questionAnswerCount) {
   const { optionIndex, vote } = updateTotalVoteParameters;

   try {
      optionIndex.forEach((element) => {
         if (element >= 0) {
            questionAnswerCount[element] += vote;
         }
      });
   } catch (error) {
      console.log(error);
   }
}

export default updateTotalVoteMultipleAnswer;
