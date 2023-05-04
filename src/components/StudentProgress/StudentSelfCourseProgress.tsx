/** React's libraries */
import { useEffect, useState, useMemo, memo, ReactNode } from 'react'

/** Antd imports */
import { Spin, Typography, Badge } from 'antd'

/** Helpers and utils */
import { firestore } from '@helpers/firebase'
import { AgendaApi } from '@helpers/request'
import type AgendaType from '@Utilities/types/AgendaType'
import type { ExtendedAgendaType } from '@Utilities/types/AgendaType'

/** Context */
import { useEventContext } from '@context/eventContext'
import { useUserEvent } from '@context/eventUserContext'

/** Components */
import CourseProgress from './CourseProgress'

type CurrentEventAttendees = any // TODO: define this type and move to @Utilities/types/

export interface StudentSelfCourseProgressProps {
  progressType?: 'circle' | 'block'
  hasProgressLabel?: boolean
  activityFilter?: (a: ExtendedAgendaType) => boolean
  customTitle?: string
  nodeIfCompleted?: ReactNode
}

function StudentSelfCourseProgress(props: StudentSelfCourseProgressProps) {
  const {
    progressType = 'block',
    hasProgressLabel = false,
    activityFilter = (a: ExtendedAgendaType) => true,
    customTitle,
    nodeIfCompleted,
  } = props

  const cEventContext = useEventContext()
  const cEventUser = useUserEvent()

  const [activitiesAttendee, setActivitiesAttendee] = useState<CurrentEventAttendees[]>(
    [],
  )
  const [allActivities, setAllActivities] = useState<AgendaType[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Take data
  useEffect(() => {
    if (!cEventContext || !cEventContext.value) return
    if (!cEventUser || !cEventUser.value) return

    setActivitiesAttendee([])
    const loadData = async () => {
      const { data }: { data: ExtendedAgendaType[] } = await AgendaApi.byEvent(
        cEventContext.value._id,
      )
      const filteredData = data
        .filter(activityFilter)
        .filter((activity) => !activity.is_info_only)
      setAllActivities(filteredData)
      const existentActivities = filteredData.map(async (activity) => {
        const activityAttendee = await firestore
          .collection(`${activity._id}_event_attendees`)
          .doc(cEventUser.value._id)
          .get() //checkedin_at
        if (activityAttendee.exists)
          return activityAttendee.data() as CurrentEventAttendees
        return null
      })
      // Filter existent activities and set the state
      setActivitiesAttendee(
        // Promises don't bite :)
        (await Promise.all(existentActivities)).filter((item) => !!item),
      )
    }
    loadData().then(() => setIsLoading(false))
  }, [cEventContext.value, cEventUser.value])

  const progressPercentValue: number = useMemo(
    () =>
      Math.round(((activitiesAttendee.length || 0) / (allActivities.length || 0)) * 100),
    [activitiesAttendee, allActivities],
  )

  const progressStats = useMemo(
    () =>
      isLoading ? (
        <Spin />
      ) : (
        `${activitiesAttendee.length || 0}/${allActivities.length || 0}`
      ),
    [isLoading, activitiesAttendee, allActivities],
  )

  if (allActivities.length === 0) {
    return null
  }

  const render = () => (
    <CourseProgress
      title={customTitle}
      hasLabel={hasProgressLabel}
      stats={progressStats || <Spin />}
      percentValue={progressPercentValue}
      type={progressType}
    />
  )

  if (progressPercentValue === 100 && nodeIfCompleted) {
    return (
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
        {render()}
      </Badge.Ribbon>
    )
  }

  return render()
}

export default memo(StudentSelfCourseProgress)
