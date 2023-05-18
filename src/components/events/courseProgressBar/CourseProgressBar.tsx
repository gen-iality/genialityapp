import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Tooltip } from 'antd'

import { activityContentValues } from '@context/activityType/constants/ui'

import lessonTypeToString from '../lessonTypeToString'

import Step from './Step'
import Line from './Line'

import './CourseProgressBar.css'

type Activity = {
  _id: string
  type?: { name: string }
  name: string
  activity_id: string
}

export interface CourseProgressBarProps {
  count: number
  eventId: string
  activities: Activity[]
  activitiesAttendee: Activity[]
  onChange?: () => void
}

function CourseProgressBar(props: CourseProgressBarProps) {
  const { activities, activitiesAttendee, eventId } = props

  console.log('activities', activities)

  return (
    <div>
      <div className="CourseProgressBar-container">
        <div className="CourseProgressBar-innerContainer">
          {activities.map((activity, index) => (
            <div key={index} className="CourseProgressBar-stepContainer">
              <Line
                isActive={
                  activitiesAttendee.filter(
                    (attende) => attende.activity_id == activity._id,
                  ).length
                }
              />
              <Link
                to={`/landing/${eventId}/activity/${activity._id}`}
                key={`key_${index}`}
              >
                <Step
                  /* onChangeFunction={onChange} */
                  onClick={props.onChange}
                  id={activity._id}
                  key={activity._id}
                  isActive={
                    activitiesAttendee.filter(
                      (attende) => attende.activity_id == activity._id,
                    ).length
                  }
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
