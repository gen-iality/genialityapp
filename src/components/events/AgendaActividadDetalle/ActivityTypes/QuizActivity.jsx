import { useEffect, useState } from 'react';
import SurveyDetailPage from "../../surveys/SurveyDetailPage";
import HeaderColumnswithContext from '../HeaderColumns';
import { useHelper } from '@/context/helperContext/hooks/useHelper';
import WithEviusContext from '@/context/withContext';
import { withRouter } from 'react-router-dom';
import { firestore } from '@/helpers/firebase';
import Service from '@/components/agenda/roomManager/service';
function QuizActivity(props) {

  const [activityState, setactivityState] = useState('');
  let { currentActivity } = useHelper();
  console.log('propsSurveyActivity', props);


  async function listeningStateStreamingRoom(event_id, activity_id) {

    console.log('100.listeningStateStreamingRoom - event_id - activity_id', event_id, activity_id);

    firestore
      .collection('events')
      .doc(event_id)
      .collection('activities')
      .doc(activity_id)
      .onSnapshot((infoActivity) => {

        if (!infoActivity.exists) return;
        const data = infoActivity.data();
        //const { habilitar_ingreso, meeting_id } = data;
        console.log('realtime', data);
        setactivityState(data);
        //setmeetingId(meeting_id);
        //setTransmition(data.transmition);

      });

  }
  useEffect(() => {
    console.log('100.currentActivity', currentActivity);
    console.log('100.props.cEvent', props.cEvent);
    if (!currentActivity || !props.cEvent) return;

    async function GetStateStreamingRoom() {

      const service = new Service(firestore);
      await listeningStateStreamingRoom(props.cEvent.value._id, currentActivity._id);
    }

    if (currentActivity != null) {

      GetStateStreamingRoom();
    }
  }, [currentActivity, props.cEvent]);
  return (
    <>

      {currentActivity && (<div>{currentActivity._id}{console.log('currentActivityx', currentActivity)}</div>)}
      <HeaderColumnswithContext isVisible={true} activityState={activityState} />
      {console.log('100.activityState', activityState)}
      <SurveyDetailPage surveyId={activityState?.meeting_id} />
    </>
  )
}

export default withRouter(WithEviusContext(QuizActivity));