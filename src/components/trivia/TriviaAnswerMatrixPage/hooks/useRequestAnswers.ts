import { FB } from '@helpers/firestore-request'
import { useEffect, useState } from 'react'
import { QuestionAndResponsesType, UserAnswersPair } from '../types'

export default function useRequestAnswers(surveyId: string, questions: any[]) {
  const [userAnswersPairs, setUserAnswersPairs] = useState<UserAnswersPair[]>([])

  useEffect(() => {
    const promises = questions.map(async (question) => {
      const responseRef = FB.Surveys.Answers.Responses.collection(surveyId, question.id)
      const responseSnapshot = await responseRef.get()
      const questionAndResponses: QuestionAndResponsesType = {
        question,
        responses: [],
      }
      responseSnapshot.forEach((doc) => {
        const response = doc.data()
        questionAndResponses.responses.push(response)
        console.log(response)
      })
      return questionAndResponses
    })
    // Process that
    Promise.all(promises).then((questionAndResponseList) => {
      const promises = questionAndResponseList.map(async (questionAndResponses) => {
        const promises = questionAndResponses.responses.map(async (response) => {
          const status = await FB.VotingStatus.SurveyStatus.get(
            response.id_user,
            response.id_survey,
          )
          return {
            userId: response.id_user,
            username: response.user_name,
            answer: response.response,
            questionId: questionAndResponses.question.id,
            right: status?.right ?? 0,
            tried: status?.tried ?? 0,
          } as UserAnswersPair
        })

        return await Promise.all(promises)
      })

      Promise.all(promises).then((manyList) => {
        const flatList = manyList.flat()
        setUserAnswersPairs(flatList)
      })
    })
  }, [surveyId, questions])

  return userAnswersPairs
}
