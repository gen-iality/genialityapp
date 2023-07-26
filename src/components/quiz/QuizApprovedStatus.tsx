import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import { Badge, Button } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { AgendaApi, SurveysApi } from '@helpers/request'
import { SurveyData } from '@components/events/surveys/types'

import { useCurrentUser } from '@context/userContext'
import useAsyncPrepareQuizStats from './useAsyncPrepareQuizStats'
import { ExtendedAgendaType } from '@Utilities/types/AgendaType'
import { activityContentValues } from '@context/activityType/constants/ui'
import { useEventProgress } from '@context/eventProgressContext'

export interface QuizApprovedStatusProps {
  eventId: string
  approvedLink?: string
  thereAreExam: (a: boolean) => void
}

function QuizApprovedStatus(props: QuizApprovedStatusProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [status, setStatus] = useState('estimando...')
  const [backgroundColor, setBackgroundColor] = useState('#9C835F')
  const [isApproved, setIsApproved] = useState(false)

  const [passedOnes, setPassedOnes] = useState(0)
  const [totalOnes, setTotalOnes] = useState(0)

  const cUser = useCurrentUser()
  const cEventProgress = useEventProgress()

  // NOTE: if you want to add colors, create a state and check the logic that says if the quiz was passed or not completed.

  useEffect(() => {
    if (!cUser?.value?._id) return
    ;(async () => {
      const _surveys: SurveyData[] = await SurveysApi.byEvent(props.eventId)

      const { data: activities }: { data: ExtendedAgendaType[] } =
        await AgendaApi.byEvent(props.eventId)

      const quizingActivities = activities
        .filter((activity) =>
          [activityContentValues.quizing].includes(activity.type?.name as any),
        )
        .filter(
          (activity) => !cEventProgress.nonPublishedActivityIDs.includes(activity._id!),
        )

      const surveys = _surveys.filter((survey) => {
        const matchedActivity = quizingActivities.find(
          (activity) => survey.activity_id && survey.activity_id === activity._id,
        )

        if (!matchedActivity) return false

        return (
          !cEventProgress.nonPublishedActivityIDs.includes(matchedActivity._id!) &&
          [activityContentValues.quizing].includes(matchedActivity.type?.name as any)
        )
      })

      let passed = 0
      let notPassed = 0

      for (let i = 0; i < surveys.length; i++) {
        const survey: SurveyData = surveys[i] as never
        const stats = await useAsyncPrepareQuizStats(
          props.eventId,
          survey._id!,
          cUser?.value?._id,
          survey,
        )

        if (stats.minimum > 0) {
          if (stats.right >= stats.minimum) {
            passed = passed + 1
          } else {
            notPassed = notPassed + 1
          }
        }
      }

      setPassedOnes(passed)
      setTotalOnes(surveys.length)

      if (surveys.length > 0) {
        props.thereAreExam && props.thereAreExam(true)
        if (passed === surveys.length) {
          setStatus('Aprobado')
          setIsApproved(true)
          setBackgroundColor('#5EB841')
        } else {
          setStatus('No aprobado')
          setBackgroundColor('#E86710')
        }
      } else {
        setStatus('Curso sin exámenes')
        props.thereAreExam && props.thereAreExam(false)
        setBackgroundColor('#2C3647')
      }

      setIsLoaded(true)
    })()
  }, [cUser?.value])

  return (
    <>
      {isLoaded && (
        <Badge
          count={status}
          style={{ backgroundColor }}
          title={`${passedOnes} de ${totalOnes}`}
        />
      )}
      {isLoaded && isApproved && props.approvedLink && (
        <Link to={props.approvedLink}>
          <Button
            style={{
              background: '#356785',
              color: '#fff',
              border: 'none',
              fontSize: '12px',
              height: '20px',
              lineHeight: '20px',
              borderRadius: '10px',
              marginLeft: '2px',
            }}
            size="small"
            icon={<DownloadOutlined />}
          >
            Certificado
          </Button>
        </Link>
      )}
    </>
  )
}

export default QuizApprovedStatus
