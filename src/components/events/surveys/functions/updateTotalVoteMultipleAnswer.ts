function updateTotalVoteMultipleAnswer(updateTotalVoteParameters: any, questionAnswerCount: any) {
  const { optionIndex, vote } = updateTotalVoteParameters;

  try {
    optionIndex.forEach((element: any) => {
      if (element >= 0) {
        questionAnswerCount[element] += vote;
      }
    });
  } catch (error) {
    console.log(error);
  }
}

export default updateTotalVoteMultipleAnswer;
