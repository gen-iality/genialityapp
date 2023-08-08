import surveyAnswers from '../services/surveyAnswersService'

function saveResponseByUserId(
  surveyData: any,
  question: any,
  infoUser: any,
  eventUsers: any[],
  voteWeight: number,
  infoOptionQuestion: any,
) {
  const answerData = {
    responseData: question.value,
    date: new Date(),
    uid: infoUser.value._id,
    email: infoUser.value.email,
    names: infoUser.value.names || infoUser.value.displayName,
    voteValue:
      surveyData.allow_vote_value_per_user === 'true' &&
      eventUsers.length > 0 &&
      voteWeight,
  }

  surveyAnswers.registerWithUID(
    surveyData._id,
    question.id,
    answerData,
    infoOptionQuestion,
  )
}

export default saveResponseByUserId
