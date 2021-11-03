import React, { useContext, useEffect, useState } from 'react';
import WithEviusContext from '../../../Context/withContext';
import ImageComponentwithContext from './ImageComponent';
import { HelperContext } from '../../../Context/HelperContext';
import { DolbyCard } from './DolbyCard';
import ZoomIframe from '../ZoomIframe';
import { VideoActivity } from './VideoActivity';
import { Space } from 'antd';
import Game from '../game';
import { LoadingOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router-dom';
import { firestore } from '../../../helpers/firebase';
import HeaderColumnswithContext from './HeaderColumns';

const RenderComponent = (props) => {
  let {
    currentActivity,
    chatAttendeChats,
    handleChangeTabs,
    handleChangeCurrentActivity,
    HandleChatOrAttende,
  } = useContext(HelperContext);
  let tabsdefault = {
    attendees: false,
    chat: true,
    games: true,
    surveys: false,
  };
  const [tabsGeneral, settabsGeneral] = useState(tabsdefault);
  const [activityState, setactivityState] = useState('');
  const [platform, setplatform] = useState('');
  const [meetingId, setmeetingId] = useState('');

  const Preloader = () => (
    <Space
      direction='horizontal'
      style={{
        background: '#F7F7F7',
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        width: '100%',
        height: '80vh',
      }}>
      <LoadingOutlined style={{ fontSize: '100px', color: 'black' }} spin />
    </Space>
  );

  async function listeningStateMeetingRoom(event_id, activity_id) {
    firestore
      .collection('events')
      .doc(event_id)
      .collection('activities')
      .doc(activity_id)
      .onSnapshot((infoActivity) => {
        if (!infoActivity.exists) return;
        const data = infoActivity.data();
        const { habilitar_ingreso, meeting_id, platform, tabs } = data;
        setplatform(platform);
        setactivityState(habilitar_ingreso);
        setmeetingId(meeting_id);
        settabsGeneral(tabs);
        console.log('como viene game', tabs);
        handleChangeTabs(tabs);
        let tempactivty = currentActivity;
        tempactivty.habilitar_ingreso = habilitar_ingreso;
        handleChangeCurrentActivity(tempactivty);

        // console.log('aca voy a manejar todo', platform, habilitar_ingreso);
      });
  }

  useEffect(() => {
    async function GetStateMeetingRoom() {
      await listeningStateMeetingRoom(props.cEvent.value._id, currentActivity._id);
    }

    if (currentActivity) {
      GetStateMeetingRoom();
    }
  }, [currentActivity]);

  useEffect(() => {
    if (chatAttendeChats === '4') {
      setactivityState('game');
    } else {
      setactivityState('open_meeting_room');
      HandleChatOrAttende('1');
      HandlePublicPrivate('public')
    }

    console.log('entra aqui', platform, activityState, chatAttendeChats);
  }, [chatAttendeChats]);

  function RenderizarComponente(plataforma, actividad_estado) {
    // console.log('si los recibe', plataforma, actividad_estado);
    switch (plataforma) {
      case 'vimeo':
        switch (actividad_estado) {
          case 'open_meeting_room':
            return <ZoomIframe platform={platform} meeting_id={meetingId} generalTabs={tabsGeneral} />;

          case 'closed_meeting_room':
            return <ImageComponentwithContext />;

          case 'ended_meeting_room':
            return <VideoActivity />;

          case 'game':
            return <Game />;
        }

      case 'zoom':
        switch (actividad_estado) {
          case 'open_meeting_room':
            return <ZoomIframe platform={platform} meeting_id={meetingId} generalTabs={tabsGeneral} />;

          case 'closed_meeting_room':
            return <ImageComponentwithContext />;

          case 'ended_meeting_room':
            return <VideoActivity />;

          case 'game':
            return <Game />;
        }

      case 'dolby':
        switch (actividad_estado) {
          case 'open_meeting_room':
            return <DolbyCard />;

          case 'closed_meeting_room':
            return <ImageComponentwithContext />;

          case 'ended_meeting_room':
            return <VideoActivity />;

          case 'game':
            return <Game />;
        }
    }
  }

  return (
    <>
      {' '}
      <HeaderColumnswithContext isVisible={true} activityState={activityState} />
      {RenderizarComponente(platform, activityState)}
    </>
  );
};

export default withRouter(WithEviusContext(RenderComponent));
