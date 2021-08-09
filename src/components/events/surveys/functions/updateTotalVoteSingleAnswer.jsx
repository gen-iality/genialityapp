function updateTotalVoteSingleAnswer(updateTotalVoteParameters, questionAnswerCount) {
   const { optionIndex, vote } = updateTotalVoteParameters;

   try {
      if (optionIndex >= 0) {
         questionAnswerCount[optionIndex] += vote;
      }
   } catch (error) {
      console.log(error);
   }
}

export default updateTotalVoteSingleAnswer;
