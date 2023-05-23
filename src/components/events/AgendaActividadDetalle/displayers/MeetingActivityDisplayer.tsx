import { FunctionComponent } from 'react'
import HeaderColumnswithContext from '../HeaderColumns'
import MeetingPlayer from '../MeetingPlayer'

import { IBasicActivityProps } from './basicTypes'

const MeetingActivityDisplayer: FunctionComponent<IBasicActivityProps> = (props) => {
  const { activity } = props

  return (
    <>
      <HeaderColumnswithContext isVisible activityState={activity} />
      <MeetingPlayer activity={activity} />
    </>
  )
}

export default MeetingActivityDisplayer
