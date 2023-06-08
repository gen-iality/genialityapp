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

interface Activity extends ExtendedAgendaType {
  _id: string
  type?: { name: string }
  name: string
  activity_id: string
}

export interface CourseProgressBarProps {
  eventId: string
  eventUser: any
  activities: ExtendedAgendaType[]
}

function CourseProgressBar(props: CourseProgressBarProps) {
  const { activities, eventUser, eventId } = props

  const [attendees, setAttendees] = useState<Activity[]>([])
  const [watchedActivityId, setWatchedActivityId] = useState<undefined | string>()
  const [isLoading, setIsLoading] = useState(false)

  const location = useLocation()

  const cEventProgress = useEventProgress()

  const isThisActivityBlockedByRequirement = (activity: ExtendedAgendaType): boolean => {
    if (cEventProgress.progressWithoutAnySurveys === undefined) return false
    if (activity.require_completion === undefined) return false

    if (activity.require_completion >= cEventProgress.progressWithoutAnySurveys)
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
      (item) => !!item,
    ) as Activity[]
    setAttendees(filteredActivities)
  }

  useEffect(() => {
    setIsLoading(true)
    cEventProgress.updateAttendees()
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
      activities.map((activity) => ({
        ...activity,
        isViewed: attendees.some((attende) => attende.activity_id == activity._id),
      })),
    [activities, attendees],
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
