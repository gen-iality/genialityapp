import { useCallback, useContext, useEffect, useState } from 'react';
import { Result } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import HeaderColumnswithContext from '../HeaderColumns';
import WithEviusContext from '@context/withContext';
import ImageComponentwithContext from '../ImageComponent';
import { useHelper } from '@context/helperContext/hooks/useHelper';
import { withRouter } from 'react-router-dom';
import { firestore } from '@helpers/firebase';
import GcoreStreamingPlayer from '../GcoreStreamingPlayer';
import AgendaContext from '@context/AgendaContext';
import ReactPlayer from 'react-player';

const StreamingActivity = (props) => {

  const [activityState, setactivityState] = useState('');
  const [meetingId, setmeetingId] = useState('');
  const [fnCiclo, setFnCiclo] = useState(false);

  //ESTADO PARA CONTROLAR ORIGEN DE TRANSMISION

  let { transmition, setTransmition } = useContext(AgendaContext);
  let { currentActivity } = useHelper();

  async function listeningStateStreamingRoom(event_id, activity_id) {
    if (!fnCiclo) {
      let tempActivity = currentActivity;
      firestore
        .collection('events')
        .doc(event_id)
        .collection('activities')
        .doc(activity_id)
        .onSnapshot((infoActivity) => {
          if (!infoActivity.exists) return;
          const data = infoActivity.data();
          const { habilitar_ingreso, meeting_id } = data;
          setactivityState(habilitar_ingreso);
          setmeetingId(meeting_id);
          setTransmition(data.transmition);
          setFnCiclo(true);
          console.log('tempActivity', tempActivity);
        });
    }
  }

  useEffect(() => {
    async function GetStateStreamingRoom() {
      await listeningStateStreamingRoom(props.cEvent.value._id, currentActivity._id);
    }

    if (currentActivity != null) {
      GetStateStreamingRoom();
    }
  }, [currentActivity, props.cEvent]);

  const ViewTypeStreaming = useCallback((actividad_estado) => {
    switch (actividad_estado) {
      case 'open_meeting_room':
        return (
          <>
            <GcoreStreamingPlayer activity={currentActivity} transmition={transmition} meeting_id={meetingId} />
          </>
        );

      case 'closed_meeting_room':
        return (
          <>
            <Result icon={<SmileOutlined />} title='La transmisión iniciará pronto!' />
          </>
        );

      case 'ended_meeting_room':
        return currentActivity?.video ? (
          <>
            <div className='mediaplayer' style={{ aspectRatio: '16/9' }}>
              <ReactPlayer
                style={{ objectFit: 'cover' }}
                width='100%'
                height='100%'
                url={currentActivity && currentActivity?.video}
                controls
              />
            </div>
          </>
        ) : (
          <>
            <Result icon={<SmileOutlined />} title='La transmisión ha terminado!' />
          </>
        );
      case 'created_meeting_room':
        return (
          <>
            <ImageComponentwithContext />
          </>
        );
      case 'no_visibe':
        return (
          <>
            <ImageComponentwithContext />
          </>
        );
      case null:
        return (
          <>
            <GcoreStreamingPlayer activity={currentActivity} transmition={transmition} meeting_id={meetingId} />
          </>
        );
    }
  });

  return (
    <>
      <HeaderColumnswithContext isVisible={true} activityState={activityState} />
      {ViewTypeStreaming(activityState)}
    </>
  )
}

export default withRouter(WithEviusContext(StreamingActivity));