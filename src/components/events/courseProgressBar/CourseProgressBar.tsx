import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Spin, Tooltip } from 'antd'

import { activityContentValues } from '@context/activityType/constants/ui'

import lessonTypeToString from '../lessonTypeToString'

import Step from './Step'
import Line from './Line'

import './CourseProgressBar.css'

import { FB } from '@helpers/firestore-request'
import { ExtendedAgendaType } from '@Utilities/types/AgendaType'
import { useEventProgress } from '@context/eventProgressContext'
import orderActivities from '@components/admin/ActivityListPage/utils/order-activities'

interface Activity extends ExtendedAgendaType {
  _id: string
  type?: { name: string }
  name: string
  activity_id: string
}

export interface CourseProgressBarProps {
  event: any
  eventId: string
  eventUser: any
  activities: ExtendedAgendaType[]
}

function CourseProgressBar(props: CourseProgressBarProps) {
  const { activities: incomingActivities, eventUser, eventId, event } = props

  /**
   * @todo use viewedActivities instead the attendee directly because:
   * - the deprecated way we have to do many requesting
   * - it is the easy way
   * - less requesting, did I say this already?
   */
  const [attendees, setAttendees] = useState<(Activity & { checked_in?: boolean })[]>([])
  const [watchedActivityId, setWatchedActivityId] = useState<undefined | string>()
  const [isLoading, setIsLoading] = useState(false)

  const [activities, setActivities] = useState<ExtendedAgendaType[]>([])
  const [nonPublishedActivities, setNonPublishedActivities] = useState<string[]>([])

  const location = useLocation()

  const cEventProgress = useEventProgress()

  const isThisActivityBlockedByRequirement = (activity: ExtendedAgendaType): boolean => {
    if (cEventProgress.progressFilteredActivities === undefined) return false
    if (activity.require_completion === undefined) return false
    if (activity.require_completion === null) return false

    if (activity.require_completion >= cEventProgress.progressFilteredActivities)
      return true
    return false
  }

  const isSurveyLike = (activity: ExtendedAgendaType) =>
    [activityContentValues.quizing, activityContentValues.survey].includes(
      activity.type?.name as any,
    )

  const requestAttendees = async () => {
    console.debug('will request the attendee for', activities.length, 'activities')
    const existentActivities = activities.map(async (activity) => {
      // TODO: this can be imported from Landing
      const newAttendee = await FB.Attendees.get(activity._id!, eventUser._id)
      if (newAttendee) {
        const oneActivity = {
          ...newAttendee,
          activity_id: activity._id!,
          require_completion: activity.require_completion,
        } as Activity
        return oneActivity
      }
      return
    })

    // Filter existent activities and set the state
    const calcedActivities = await Promise.all(existentActivities)
    const filteredActivities: Activity[] = calcedActivities.filter(
      (item) => !!item && item.checked_in,
    ) as Activity[]
    setAttendees(orderActivities<Activity>(filteredActivities))
  }

  useEffect(() => {
    incomingActivities.forEach((activity) => {
      FB.Activities.ref(eventId, activity._id!).onSnapshot((snapshot) => {
        const data = snapshot.data()
        if (!data) return
        // Update the state of publishing of this activity ID
        const flag = !!data.isPublished

        if (!flag) {
          setNonPublishedActivities((previous) => [...previous, activity._id!])
        } else {
          setNonPublishedActivities((previous) =>
            previous.filter((id) => id !== activity._id!),
          )
        }
      })
    })
  }, [incomingActivities])

  useEffect(() => {
    setActivities(
      incomingActivities.filter(
        (activity) => !nonPublishedActivities.includes(activity._id!),
      ),
    )
  }, [nonPublishedActivities, incomingActivities])

  useEffect(() => {
    setIsLoading(true)
    cEventProgress.updateRawAttendees()
    requestAttendees()
      .then()
      .finally(() => setIsLoading(false))
  }, [activities, location])

  // We don't have access to the param activity_id using useMatch because this
  // component is upside of the EventSectionRoutes, then the activity_id will be
  // taken from the url by parsing
  useEffect(() => {
    const urlCompleta = location.pathname
    const urlSplited = urlCompleta.split('activity/')
    const currentActivityId = urlSplited[1]
    setWatchedActivityId(currentActivityId)
  }, [location])

  const activityAndAttendeeList = useMemo(
    () =>
      cEventProgress.filteredActivities.map((activity) => {
        const attendee = cEventProgress.checkedInFilteredActivities.find(
          (attende) =>
            attende.activity_id == activity._id || attende.activityId == activity._id,
        )
        let isViewed = false
        console.log('xxa attendee', attendee)
        if (attendee) {
          const humanViewProgress = (attendee.viewProgress ?? 0) * 100
          if (attendee.checked_in) {
            isViewed = true
          } else if (
            humanViewProgress >=
            (event?.progress_settings?.lesson_percent_to_completed ?? 0)
          ) {
            isViewed = true
          } else if (isSurveyLike(activity)) {
            isViewed = true
          } else {
            console.log(
              'xxa',
              humanViewProgress,
              event?.progress_settings?.lesson_percent_to_completed,
            )
            isViewed = false
          }
        } else {
          console.log('xxa no', activity)
        }

        return {
          ...activity,
          isViewed,
        }
      }),
    [
      cEventProgress.filteredActivities,
      cEventProgress.checkedInFilteredActivities,
      event,
    ],
  )

  if (activities.length == 0) return null

  return (
    <div>
      <div className="CourseProgressBar-container">
        <div className="CourseProgressBar-innerContainer">
          {activityAndAttendeeList.map((activity, index) => (
            <div key={index} className="CourseProgressBar-stepContainer">
              <Line isActive={activity.isViewed} />
              <Link
                to={
                  isThisActivityBlockedByRequirement(activity)
                    ? '#'
                    : `/landing/${eventId}/activity/${activity._id}`
                }
                replace
                key={`key_${index}`}
              >
                <Step
                  onClick={() => {
                    // Fake assignation of attendee
                    if (
                      !attendees.some((attendee) => attendee.activity_id === activity._id)
                    ) {
                      console.debug('mark as viewed this activity:', activity._id)
                      setAttendees((previous) => [
                        ...previous,
                        {
                          activity_id: activity._id,
                        } as Activity,
                      ])
                    }
                  }}
                  isFocus={activity._id === watchedActivityId}
                  key={activity._id}
                  isActive={activity.isViewed}
                  isBlocked={isThisActivityBlockedByRequirement(activity)}
                  isSurvey={[
                    activityContentValues.quizing,
                    activityContentValues.survey,
                  ].includes(activity.type?.name as any)}
                >
                  <Tooltip
                    placement="right"
                    title={
                      isThisActivityBlockedByRequirement(activity)
                        ? `Sección "${activity.name}" bloqueada por requerimientos`
                        : `Ir ${
                            isSurveyLike(activity) ? 'al cuestionario' : 'a la actividad'
                          } "${activity.name}", tipo ${(activity.type?.name
                            ? lessonTypeToString(activity.type?.name)
                            : 'sin contenido'
                          ).toLowerCase()}`
                    }
                  >
                    <Spin spinning={isLoading && activity._id === watchedActivityId}>
                      {index + 1}
                    </Spin>
                  </Tooltip>
                </Step>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CourseProgressBar
