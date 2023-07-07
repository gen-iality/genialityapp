/**
 * Calculates the number of right and wrong answers for a given array of questions.
 * @param questions An array of questions to evaluate.
 * @returns An object containing the results of the evaluation.
 */
export default function calcRightAnswers(
  questions: any[],
  _bannedQuestionTypes?: string[],
) {
  const answersStatus: boolean[] = []
  let rightCount = 0
  let badCount = 0

  const bannedQuestionTypes: string[] =
    typeof _bannedQuestionTypes === 'undefined' ? [] : _bannedQuestionTypes

  questions.forEach((question) => {
    const {
      questionValue,
      correctAnswer,
    }: { questionValue?: string | string[]; correctAnswer?: string | string[] } = question
    const questionType = question.classMetaData?.name

    const restrictMode = bannedQuestionTypes.includes(questionType)

    let status = false
    // First case, there are no data
    if (
      typeof questionValue === 'undefined' ||
      typeof correctAnswer === 'undefined' ||
      questionValue === null ||
      correctAnswer === null
    ) {
      console.debug(
        `invalid value of questionValue=${questionValue} or correctAnswer=${correctAnswer}`,
      )
      badCount++
      status = false
    }
    // Second case, both are strings
    else if (typeof questionValue === 'string' && typeof correctAnswer === 'string') {
      if (questionValue == correctAnswer) {
        rightCount++
        status = true
      } else {
        badCount++
        status = false
      }
    }
    // Thrid & fourth case, but here we simply to unique case
    else {
      // Convert the non-array ones to array ones
      const _questionValue = Array.isArray(questionValue)
        ? questionValue
        : [questionValue]
      const _correctAnswer = Array.isArray(correctAnswer)
        ? correctAnswer
        : [correctAnswer]

      // Compare as array
      if (_questionValue.length !== _correctAnswer.length) {
        badCount++
        status = false
      } else {
        // If the restrict mode is on
        if (!restrictMode) {
          // First sort the array
          _questionValue.sort()
          _correctAnswer.sort()
        }

        // Now compare each-by-each elements
        if (_questionValue.every((element, index) => element === _correctAnswer[index])) {
          rightCount++
          status = true
        } else {
          badCount++
          status = false
        }
      }
    }

    // Append the status of the comparison
    answersStatus.push(status)
  })

  // For choosing, returns the results
  return { answersStatus, rightCount, badCount }
}
