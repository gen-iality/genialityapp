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
      const data: UserAnswersPair[] = []
      questionAndResponseList.map((questionAndResponses) => {
        questionAndResponses.responses.forEach((response) => {
          data.push({
            userId: response.id_user,
            username: response.user_name,
            answer: response.response,
            questionId: questionAndResponses.question.id,
          })
        })
      })

      setUserAnswersPairs(data)
    })
  }, [surveyId, questions])

  return userAnswersPairs
}
