import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Tooltip } from 'antd'

import { activityContentValues } from '@context/activityType/constants/ui'

import lessonTypeToString from '../lessonTypeToString'

import Step from './Step'
import Line from './Line'

import './CourseProgressBar.css'
import { firestore } from '@helpers/firebase'

type Activity = {
  _id: string
  type?: { name: string }
  name: string
  activity_id: string
}

export interface CourseProgressBarProps {
  eventId: string
  eventUser: any
  activities: Activity[]
}

function CourseProgressBar(props: CourseProgressBarProps) {
  const { activities, eventUser, eventId } = props

  const [attendees, setAttendees] = useState<any[]>([])

  const location = useLocation()

  const requestAttendees = async () => {
    console.debug('will request the attendee for', activities.length, 'activities')
    const existentActivities = activities.map(async (activity) => {
      const activity_attendee = await firestore
        .collection(`${activity._id}_event_attendees`)
        .doc(eventUser._id)
        .get() //checkedin_at
      if (activity_attendee.exists) {
        const newAttendee = activity_attendee.data()
        return { ...newAttendee, activity_id: activity._id }
      }
      return null
    })

    // Filter existent activities and set the state
    setAttendees((await Promise.all(existentActivities)).filter((item) => !!item))
  }

  useEffect(() => {
    requestAttendees().then().finally()
  }, [activities, location.pathname])

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
                to={`/landing/${eventId}/activity/${activity._id}`}
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
                        },
                      ])
                    }
                  }}
                  id={activity._id}
                  key={activity._id}
                  isActive={activity.isViewed}
                  isSurvey={[
                    activityContentValues.quizing,
                    activityContentValues.survey,
                  ].includes(activity.type?.name as any)}
                >
                  <Tooltip
                    placement="right"
                    title={`Ir ${
                      [
                        activityContentValues.quizing,
                        activityContentValues.survey,
                      ].includes(activity.type?.name as any)
                        ? 'al cuestionario'
                        : 'a la actividad'
                    } "${activity.name}", tipo ${(activity.type?.name
                      ? lessonTypeToString(activity.type?.name)
                      : 'sin contenido'
                    ).toLowerCase()}`}
                  >
                    {index + 1}
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
