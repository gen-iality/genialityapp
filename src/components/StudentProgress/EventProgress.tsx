import { FunctionComponent, useEffect, useMemo, useState } from 'react'
import { Progress, Tooltip } from 'antd'
import { useEventProgress } from '@context/eventProgressContext'
import { activityContentValues } from '@context/activityType/constants/ui'

interface IEventProgressProps {
  event: any
}

const EventProgress: FunctionComponent<IEventProgressProps> = () => {
  // const { event } = props

  const [title, setTitle] = useState('')

  const cEventProgress = useEventProgress()

  const statsString = useMemo(
    () => `${cEventProgress.progressFilteredActivities}%`,
    [cEventProgress.progressFilteredActivities],
  )

  useEffect(() => {
    let report = ''

    const nonQuizingActivities = cEventProgress.activities.filter(
      (activity) => ![activityContentValues.quizing].includes(activity.type?.name as any),
    )

    const nonQuizingAttendees = cEventProgress.getAttendeesForActivities(
      nonQuizingActivities.map((activity) => activity._id! as string),
    )

    report = report.concat(
      `Vistas ${nonQuizingAttendees.length} de ${nonQuizingActivities.length}`,
    )

    const quizingActivities = cEventProgress.activities.filter((activity) =>
      [activityContentValues.quizing].includes(activity.type?.name as any),
    )

    const quizingAttendees = cEventProgress.getAttendeesForActivities(
      quizingActivities.map((activity) => activity._id! as string),
    )

    if (quizingActivities.length > 0) {
      report = report.concat(
        ` — Vistos ${quizingAttendees.length} quices de ${quizingActivities.length}`,
      )
    }

    setTitle(report)
  }, [cEventProgress])

  return (
    <Tooltip
      title={`Curso en ${cEventProgress.progressFilteredActivities}%, quices en ${cEventProgress.progressOfQuices}%`}
    >
      <p style={{ color: 'black', fontWeight: 'bold', lineHeight: 0 }}>{title}</p>
      <Progress
        strokeColor={{
          from: '#f7981d', //'#108ee9',
          to: '#FFB453', //'#87d068',
        }}
        trailColor="#E6E6E6"
        success={{
          percent: cEventProgress.progressOfQuices,
          strokeColor: '#f000002A',
        }}
        percent={cEventProgress.progressFilteredActivities}
        status="active"
        format={() => statsString}
      />
    </Tooltip>
  )
}

export default EventProgress
