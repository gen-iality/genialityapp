import { FunctionComponent, useContext, useEffect, useState } from 'react'
import SurveyDetailPage from '../../surveys/SurveyDetailPage'
import HeaderColumnswithContext from '../HeaderColumns'

import { Spin } from 'antd'

import { IBasicActivityProps } from './basicTypes'
import { getActivityFirestoreData } from './getActivityFirestoreData'
import { CurrentEventContext } from '@context/eventContext'

const SurveyActivityDisplayer: FunctionComponent<IBasicActivityProps> = (props) => {
  const { activity, onActivityProgress } = props

  const [activityState, setActivityState] = useState<any>()

  const cEvent = useContext(CurrentEventContext)

  useEffect(() => {
    if (typeof onActivityProgress === 'function') onActivityProgress(100)
  }, [])

  useEffect(() => {
    if (!activity || !cEvent.value) return

    let unsubscribe: any
    if (activity != null) {
      unsubscribe = getActivityFirestoreData(cEvent.value._id, activity._id, (data) => {
        console.log('realtime', data)
        setActivityState(data)
      })
    }

    return () => {
      unsubscribe && unsubscribe()
    }
  }, [activity, cEvent.value])

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

export default SurveyActivityDisplayer
