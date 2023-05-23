import { FunctionComponent } from 'react'
import WithEviusContext from '@context/withContext'
import HeaderColumnswithContext from '../HeaderColumns'
import { withRouter } from 'react-router-dom'
import MeetingPlayer from '../MeetingPlayer'

import { IBasicActivityProps } from './basicTypes'

const MeetingDisplayer: FunctionComponent<IBasicActivityProps> = (props) => {
  const { activity } = props

  return (
    <>
      <HeaderColumnswithContext isVisible activityState={activity} />
      <MeetingPlayer activity={activity} />
    </>
  )
}

export default withRouter(WithEviusContext(MeetingDisplayer))
