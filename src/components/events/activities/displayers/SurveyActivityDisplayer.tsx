import { FunctionComponent, useEffect, useState } from 'react'
import SurveyDetailPage from '../../surveys/SurveyDetailPage'
import HeaderColumnswithContext from '../HeaderColumns'

import WithEviusContext from '@context/withContext'

import { Spin } from 'antd'

import { IBasicActivityProps } from './basicTypes'
import { getActivityFirestoreData } from './getActivityFirestoreData'

// TODO: fix props definition, for example: cEvent
const SurveyActivityDisplayer: FunctionComponent<IBasicActivityProps> = (props) => {
  const { activity } = props

  const [activityState, setActivityState] = useState()

  useEffect(() => {
    if (!activity || !props.cEvent) return

    let unsubscribe: any
    if (activity != null) {
      unsubscribe = getActivityFirestoreData(
        props.cEvent.value._id,
        activity._id,
        (data) => {
          console.log('realtime', data)
          setActivityState(data)
        },
      )
    }

    return () => {
      unsubscribe && unsubscribe()
    }
  }, [activity, props.cEvent])

  return (
    <>
      <HeaderColumnswithContext isVisible activityState={activityState} />
      {activityState?.meeting_id ? (
        <SurveyDetailPage surveyId={activityState.meeting_id} />
      ) : (
        <Spin />
      )}
    </>
  )
}

export default WithEviusContext(SurveyActivityDisplayer)
