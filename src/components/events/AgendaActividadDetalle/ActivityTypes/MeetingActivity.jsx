import { useState } from 'react';
import WithEviusContext from '@context/withContext';
import HeaderColumnswithContext from '../HeaderColumns';
import { useHelper } from '@context/helperContext/hooks/useHelper';
import { withRouter } from 'react-router-dom';
import MeetingPlayer from '../MeetingPlayer';

const MeetingActivity = (props) => {

  const [activityState, setactivityState] = useState('');

  const { currentActivity } = useHelper();

  return (
    <>
      <HeaderColumnswithContext isVisible={true} activityState={activityState} />
      <MeetingPlayer activity={currentActivity} />
    </>
  )
}

export default withRouter(WithEviusContext(MeetingActivity));