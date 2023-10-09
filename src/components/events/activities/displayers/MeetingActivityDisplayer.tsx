import { FunctionComponent, useEffect } from 'react'
import HeaderColumnswithContext from '../HeaderColumns'
import MeetingPlayer from '../MeetingPlayer'

import { IBasicActivityProps } from './basicTypes'

const MeetingActivityDisplayer: FunctionComponent<IBasicActivityProps> = (props) => {
  const { activity, onActivityProgress } = props

  useEffect(() => {
    if (typeof onActivityProgress === 'function') onActivityProgress(100)
  }, [])

  return (
    <>
      <HeaderColumnswithContext isVisible activityState={activity} />
      <MeetingPlayer activity={activity} />
    </>
  )
}

export default MeetingActivityDisplayer
