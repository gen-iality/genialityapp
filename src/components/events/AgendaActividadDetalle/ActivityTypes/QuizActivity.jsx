import { useEffect, useState } from 'react';
import SurveyDetailPage from '../../surveys/SurveyDetailPage';
import HeaderColumnswithContext from '../HeaderColumns';
import { useHelper } from '@context/helperContext/hooks/useHelper';
import WithEviusContext from '@context/withContext';
import { withRouter } from 'react-router-dom';
import { firestore } from '@helpers/firebase';
import Service from '@components/agenda/roomManager/service';
import { Spin } from 'antd';

function QuizActivity(props) {
  let { currentActivity } = useHelper();
  console.log('100.propsSurveyActivity', props);

  const [activityState, setActivityState] = useState('');

  function listeningStateStreamingRoom(event_id, activity_id) {
    console.log('100.listeningStateStreamingRoom - event_id - activity_id', event_id, activity_id);

    return firestore
      .collection('events')
      .doc(event_id)
      .collection('activities')
      .doc(activity_id)
      .onSnapshot(infoActivity => {
        if (!infoActivity.exists) return;
        const data = infoActivity.data();
        console.log('realtime', data);
        setActivityState(data);
      });
  }

  useEffect(() => {
    console.log('100.currentActivity', currentActivity);
    console.log('100.props.cEvent', props.cEvent);
    if (!currentActivity || !props.cEvent) return;
    
    let unsubscribe;
    if (currentActivity != null) {
      unsubscribe = listeningStateStreamingRoom(props.cEvent.value._id, currentActivity._id);
    }

    return () => { unsubscribe && unsubscribe() }
  }, [currentActivity, props.cEvent]);

  return (
    <>
      <HeaderColumnswithContext isVisible={true} activityState={activityState} />
      {console.log('100.activityState', activityState)}
      {activityState?.meeting_id ? (
        <SurveyDetailPage surveyId={activityState.meeting_id} />
      ) : (
        <Spin/>
      )}
    </>
  );
}

export default withRouter(WithEviusContext(QuizActivity));
