/**
 * The component defined here is a wrapper of QuizProgress, but it takes
 * the event and the *activity* and get the data (like surveyId)
 * to use QuizProgress.
 */

import QuizProgress from '@components/quiz/QuizProgress'
import { firestore } from '@helpers/firebase'
import { FunctionComponent, useState, useEffect } from 'react'

interface IQuizProgressFromActivityProps {
  eventId: string
  activityId: string
  userId: string
  isAnswersDeleted?: boolean
}

const QuizProgressFromActivity: FunctionComponent<IQuizProgressFromActivityProps> = (
  props,
) => {
  const { activityId, eventId, userId, isAnswersDeleted } = props

  const [surveyId, setSurveyId] = useState<string | undefined>()

  useEffect(() => {
    ;(async () => {
      const document: any = await firestore
        .collection('events')
        .doc(eventId)
        .collection('activities')
        .doc(activityId)
        .get()
      const activityData = document.data()
      console.log('This activity is', activityData)
      if (!activityData) return
      const meetingId = activityData?.meeting_id
      if (!meetingId) {
        console.warn(
          'without meetingId eventId',
          eventId,
          ', activity',
          activityData,
          ', meetingId',
          meetingId,
        )
        return
      }
      setSurveyId(meetingId)
    })()
  }, [isAnswersDeleted])

  if (!surveyId) return <></>

  return (
    <QuizProgress
      short
      eventId={eventId}
      userId={userId}
      surveyId={surveyId}
      isAnswersDeleted={isAnswersDeleted}
    />
  )
}

export default QuizProgressFromActivity
