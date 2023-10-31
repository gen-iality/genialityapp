import { FunctionComponent, useContext, useEffect, useState } from 'react'
import SurveyDetailPage from '../../surveys/SurveyDetailPage'
import HeaderColumnswithContext from '../HeaderColumns'

import { Alert } from 'antd'

import { IBasicActivityProps } from './basicTypes'
import { getActivityFirestoreData } from './getActivityFirestoreData'
import { CurrentEventContext } from '@context/eventContext'
import useIsDevOrStage from '@/hooks/useIsDevOrStage'

const QuizActivityDisplayer: FunctionComponent<IBasicActivityProps> = (props) => {
  const { activity, onActivityProgress } = props

  const [realtimeActivityState, setRealtimeActivityState] = useState<any>()

  const cEvent = useContext(CurrentEventContext)
  const { isNotProd } = useIsDevOrStage()

  useEffect(() => {
    if (typeof onActivityProgress === 'function') onActivityProgress(100)
  }, [])

  useEffect(() => {
    if (!activity || !cEvent.value) return

    let unsubscribe: any = null

    if (activity?._id) {
      unsubscribe = getActivityFirestoreData(cEvent.value._id, activity._id, (data) => {
        console.debug('realtime', data)
        setRealtimeActivityState(data)
      })
    }

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [activity, cEvent.value])

  return (
    <>
      {isNotProd && JSON.stringify(realtimeActivityState)}
      <HeaderColumnswithContext isVisible activityState={realtimeActivityState} />
      {activity.content && activity.content.reference ? (
        <>
          <SurveyDetailPage surveyId={activity.content.reference} />
          {activity.content.type != 'survey_id' && (
            <Alert
              type="info"
              message={`El tipo de contenido ${activity.content.type} es desconocido o nuevo`}
            />
          )}
        </>
      ) : (
        <Alert type="error" message="Sin contenido" />
      )}
    </>
  )
}

export default QuizActivityDisplayer
