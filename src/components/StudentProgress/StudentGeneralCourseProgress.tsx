import { useEffect, useState, useMemo, memo } from 'react'

import { AgendaApi } from '@helpers/request'

import CourseProgress from './CourseProgress'

// Do handly if they cannot get data from URI params
import { useCurrentUser } from '@context/userContext'
import { EventsApi } from '@helpers/request'

import type AgendaType from '@Utilities/types/AgendaType'
import { Spin } from 'antd'
import { FB } from '@helpers/firestore-request'
import filterActivitiesByProgressSettings from '@Utilities/filterActivitiesByProgressSettings'

type CurrentEventAttendees = any // TODO: define this type and move to @Utilities/types/

export interface StudentGeneralCourseProgressProps {
  progressType: 'circle' | 'block'
  hasProgressLabel?: boolean
  eventId: string
}

function StudentGeneralCourseProgress(props: StudentGeneralCourseProgressProps) {
  const { progressType, hasProgressLabel = false, eventId } = props

  const cUser = useCurrentUser()

  if (!cUser.value) return null

  const [eventData, setEventData] = useState<any | null>(null)

  const [eventUserId, setEventUserId] = useState<string | null>(null)
  const [activitiesAttendee, setActivitiesAttendee] = useState<CurrentEventAttendees[]>(
    [],
  )
  const [publishedActivities, setPublishedActivities] = useState<AgendaType[]>([])
  const [rawActivities, setRawActivities] = useState<AgendaType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [nonPublishedActivityIDs, setNonPublishedActivityIDs] = useState<string[]>([])

  // Set cEventUser
  useEffect(() => {
    if (!eventId) return
    if (!cUser.value) return

    async function asyncdata() {
      try {
        const data = await EventsApi.getOne(eventId)
        setEventData(data)
      } catch (err) {
        console.error('Cannot get the event data for', eventId, err)
      }

      try {
        const responseStatus = await EventsApi.getStatusRegister(
          eventId,
          cUser.value.email,
        )
        if (responseStatus.data.length > 0) {
          console.debug('responseStatus.data', responseStatus.data)
          setEventUserId(responseStatus.data[0]._id as string)
        }
      } catch (err) {
        console.error('Tried to load from EventsApi.getStatusRegister', err)
      }
    }

    asyncdata()
  }, [eventId, cUser.value])

  // Take data
  useEffect(() => {
    if (!eventId || !eventUserId || !eventData) return

    setActivitiesAttendee([])
    const loadData = async () => {
      const { data: rawActivities }: { data: AgendaType[] } = await AgendaApi.byEvent(
        eventId,
      )

      const withoutInfoActivities = (
        eventData.progress_settings
          ? filterActivitiesByProgressSettings(rawActivities, eventData.progress_settings)
          : rawActivities
      ).filter((activity) => !activity.is_info_only)

      setRawActivities(withoutInfoActivities)

      withoutInfoActivities.forEach((activity) => {
        FB.Activities.ref(eventId, activity._id!).onSnapshot((snapshot) => {
          const data = snapshot.data()
          if (!data) return
          const flag = !!data.isPublished

          if (!flag) {
            setNonPublishedActivityIDs((previous) => [...previous, activity._id!])
          } else {
            setNonPublishedActivityIDs((previous) =>
              previous.filter((id) => id !== activity._id!),
            )
          }
        })
      })
    }
    loadData()
      .then(() => setIsLoading(false))
      .catch((err) => console.error(err))
  }, [eventId, eventUserId])

  useEffect(() => {
    if (!eventUserId) return
    ;(async () => {
      // filter by non-published activities
      const newPublishedActivities = rawActivities.filter(
        (activity) => !nonPublishedActivityIDs.includes(activity._id!),
      )
      const allAttendees = await FB.Attendees.getEventUserActivities(
        newPublishedActivities.map((activity) => activity._id as string),
        eventUserId,
      )

      setPublishedActivities(newPublishedActivities)

      // Filter existent activities and set the state
      setActivitiesAttendee(
        allAttendees
          .filter((attendee) => attendee !== undefined)
          .filter((attendee) => attendee?.checked_in),
      )
    })()
  }, [eventUserId, rawActivities, nonPublishedActivityIDs])

  const progressPercentValue = useMemo(
    () =>
      Math.round(
        ((activitiesAttendee.length || 0) / (publishedActivities.length || 0)) * 100,
      ),
    [activitiesAttendee, publishedActivities],
  )

  const progressStats = useMemo(
    () =>
      isLoading ? (
        <Spin />
      ) : (
        `${activitiesAttendee.length || 0}/${publishedActivities.length || 0}`
      ),
    [isLoading, activitiesAttendee, publishedActivities],
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
