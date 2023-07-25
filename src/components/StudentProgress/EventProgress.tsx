import { FunctionComponent, ReactNode, useEffect, useMemo, useState } from 'react'
import { Badge, Progress, Tooltip } from 'antd'
import { useEventProgress } from '@context/eventProgressContext'
import { activityContentValues } from '@context/activityType/constants/ui'

interface IEventProgressProps {
  event: any
  nodeIfCompleted?: ReactNode
}

const EventProgress: FunctionComponent<IEventProgressProps> = (props) => {
  const { nodeIfCompleted } = props

  const [title, setTitle] = useState('')

  const cEventProgress = useEventProgress()

  const statsString = useMemo(
    () => `${cEventProgress.progressFilteredActivities}%`,
    [cEventProgress.progressFilteredActivities],
  )

  useEffect(() => {
    let report = ''

    const nonQuizingActivities = cEventProgress.rawActivities.filter(
      (activity) => ![activityContentValues.quizing].includes(activity.type?.name as any),
    )

    const nonQuizingAttendees = cEventProgress.getAttendeesForActivities(
      nonQuizingActivities.map((activity) => activity._id! as string),
    )

    report = report.concat(
      `Vistas ${nonQuizingAttendees.length} de ${nonQuizingActivities.length}`,
    )

    const quizingActivities = cEventProgress.rawActivities.filter((activity) =>
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

  const ProgressRender = () => (
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

  return nodeIfCompleted && cEventProgress.progressFilteredActivities > 99.99 ? (
    <Badge.Ribbon
      style={{
        width: '15rem',
        height: '2.5rem',
        fontSize: '2rem',
        paddingTop: '0.5rem',
      }}
      text={nodeIfCompleted}
      color="#fb8500"
    >
      <ProgressRender />
    </Badge.Ribbon>
  ) : (
    <ProgressRender />
  )
}

export default EventProgress
