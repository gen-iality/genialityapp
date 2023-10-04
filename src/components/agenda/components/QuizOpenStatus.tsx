import useSurveyQuery from '@components/events/surveys/hooks/useSurveyQuery'
import { FB } from '@helpers/firestore-request'
import { Badge } from 'antd'
import { FunctionComponent, useEffect, useState } from 'react'

type IQuizOpenStatusProps = {
  activityId: string
  eventId: string
}

const QuizOpenStatus: FunctionComponent<IQuizOpenStatusProps> = (props) => {
  const { activityId, eventId } = props
  const [surveyId, setSurveyId] = useState<string | null>(null)

  const { data = {} as any } = useSurveyQuery(eventId, surveyId, false)

  useEffect(() => {
    if (!eventId || !activityId) return
    ;(async () => {
      const activityData = await FB.Activities.get(eventId, activityId)
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
  }, [eventId, activityId])

  if (!data.isOpened || !data.isPublished) return null

  return (
    <Badge count="ABIERTO!!" style={{ backgroundColor: '#fffb00', color: 'black' }} />
  )
}

export default QuizOpenStatus
