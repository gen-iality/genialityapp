import { FunctionComponent, useEffect, useState } from 'react'
import SurveyDetailPage from '../../surveys/SurveyDetailPage'
import HeaderColumnswithContext from '../HeaderColumns'

import WithEviusContext from '@context/withContext'
import { withRouter } from 'react-router-dom'
import { firestore } from '@helpers/firebase'
import { Spin } from 'antd'

import { IBasicActivityProps } from './basicTypes'

const QuizDisplayer: FunctionComponent<IBasicActivityProps> = (props) => {
  const { activity } = props

  const [activityState, setActivityState] = useState('')

  function listeningStateStreamingRoom(event_id, activity_id) {
    return firestore
      .collection('events')
      .doc(event_id)
      .collection('activities')
      .doc(activity_id)
      .onSnapshot((infoActivity) => {
        if (!infoActivity.exists) return
        const data = infoActivity.data()
        console.log('realtime', data)
        setActivityState(data)
      })
  }

  useEffect(() => {
    if (!activity || !props.cEvent) return

    let unsubscribe
    if (activity != null) {
      unsubscribe = listeningStateStreamingRoom(props.cEvent.value._id, activity._id)
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

export default withRouter(WithEviusContext(QuizDisplayer))
