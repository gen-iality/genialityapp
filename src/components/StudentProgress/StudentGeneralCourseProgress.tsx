import { useEffect, useState, useMemo, memo } from 'react'

import CourseProgress from './CourseProgress'

// Do handly if they cannot get data from URI params
import { useCurrentUser } from '@context/userContext'

import { Spin } from 'antd'
import { ActivityProgressesData, FB } from '@helpers/firestore-request'

export interface StudentGeneralCourseProgressProps {
  progressType: 'circle' | 'block'
  hasProgressLabel?: boolean
  eventId: string
}

function StudentGeneralCourseProgress(props: StudentGeneralCourseProgressProps) {
  const { progressType, hasProgressLabel = false, eventId } = props

  const [isLoading, setIsLoading] = useState(true)
  const [activityProgress, setActivityProgress] = useState<ActivityProgressesData>({
    activities: [],
    filtered_activities: [],
    viewed_activities: [],
  })

  const cUser = useCurrentUser()
  if (!cUser.value) return null

  useEffect(() => {
    if (!cUser.value) return

    const { _id: accountId } = cUser.value
    FB.ActivityProgresses.get(eventId, accountId)
      .then((data) => {
        if (data) {
          setActivityProgress(data)
        }
      })
      .finally(() => setIsLoading(false))
  }, [cUser.value])

  // News
  const progressPercentValue = useMemo(
    () =>
      Math.round(
        ((activityProgress.viewed_activities.length || 0) /
          (activityProgress.filtered_activities.length || 1)) *
          100,
      ),
    [activityProgress],
  )

  const progressStats = useMemo(
    () =>
      isLoading ? (
        <Spin />
      ) : (
        `${activityProgress.viewed_activities.length || 0}/${
          activityProgress.filtered_activities.length || 0
        }`
      ),
    [isLoading, activityProgress],
  )

  return (
    <CourseProgress
      hasLabel={hasProgressLabel}
      stats={progressStats}
      percentValue={progressPercentValue}
      type={progressType}
    />
  )
}

export default memo(StudentGeneralCourseProgress)
