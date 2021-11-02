import React, { useContext, useEffect, useState } from 'react';
import WithEviusContext from '../../../Context/withContext';
import ImageComponentwithContext from './ImageComponent';
import { HelperContext } from '../../../Context/HelperContext';
import { DolbyCard } from './DolbyCard';
import ZoomIframe from '../ZoomIframe';
import { VideoActivity } from './VideoActivity';
import { Row, Space, Spin } from 'antd';
import Game from '../game';
import { LoadingOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router-dom';
import { firestore } from '../../../helpers/firebase';

const RenderComponent = (props) => {
  let { currentActivity, chatAttendeChats } = useContext(HelperContext);
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
        console.log('aca voy a manejar todo', platform, habilitar_ingreso);
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
    }
  }, [chatAttendeChats]);

  // useEffect(() => {
  //   switch (platform) {
  //     case 'dolby':
  //       switch (activityState) {
  //         case 'open_meeting_room':
  //           if ((props.cUser.value.name || props.cUser.value.email) == null || undefined || '') {
  //             ComponentRender = <DolbyCard />;
  //           }
  //           break;

  //         case 'closed_meeting_room':
  //           if (chatAttendeChats !== '4') {
  //             ComponentRender = <ImageComponentwithContext />;
  //           }
  //           break;

  //         case 'ended_meeting_room':
  //           if (currentActivity?.video) {
  //             ComponentRender = <VideoActivity />;
  //           } else {
  //             ComponentRender = <ImageComponentwithContext />;
  //           }
  //           break;

  //         case 'nothing_state':
  //           ComponentRender = '';
  //           break;
  //       }
  //       break;

  //     case 'zoomExterno':
  //       switch (activityState) {
  //         case 'open_meeting_room':
  //           if (chatAttendeChats !== '4') {
  //             ComponentRender = zoomExternoHandleOpen(currentActivity, props.cEventUser.value);
  //           } else if (chatAttendeChats == '4') {
  //             ComponentRender = <Game />;
  //           }

  //         case 'closed_meeting_room':
  //           if (chatAttendeChats !== '4') {
  //             ComponentRender = <ImageComponentwithContext />;
  //           }
  //           break;

  //         case 'ended_meeting_room':
  //           if (currentActivity?.video) {
  //             ComponentRender = <VideoActivity />;
  //           } else {
  //             ComponentRender = <ImageComponentwithContext />;
  //           }
  //           break;

  //         case 'nothing_state':
  //           ComponentRender = '';
  //           break;
  //       }

  //       break;

  //     case 'zoom':
  //       switch (activityState) {
  //         case 'open_meeting_room':
  //           if (chatAttendeChats !== '4') {
  //             if (
  //               props.cEventUser?.value &&
  //               (currentActivity?.requires_registration || !currentActivity?.requires_registration)
  //             ) {
  //               ComponentRender = (
  //                 <ZoomIframe
  //                   platform={platform}
  //                   meeting_id={currentActivity?.meeting_id}
  //                   generalTabs={tabsGeneral}
  //                 />
  //               );
  //             } else if (!props.cEventUser?.value && currentActivity?.requires_registration) {
  //               ComponentRender = (
  //                 <Alert
  //                   message='Advertencia'
  //                   description='Debes estar previamente registrado al evento para acceder al espacio en vivo, si estas registrado en el evento ingresa al sistema con tu usuario para poder acceder al evento'
  //                   type='warning'
  //                   showIcon
  //                 />
  //               );
  //             }
  //           } else if (chatAttendeChats == '4') {
  //             ComponentRender = <Game />;
  //           }

  //           break;

  //         case 'closed_meeting_room':
  //           if (chatAttendeChats !== '4') {
  //             ComponentRender = <ImageComponentwithContext />;
  //           }
  //           break;

  //         case 'ended_meeting_room':
  //           if (currentActivity?.video) {
  //             ComponentRender = <VideoActivity />;
  //           } else {
  //             ComponentRender = <ImageComponentwithContext />;
  //           }
  //           break;

  //         case 'nothing_state':
  //           ComponentRender = '';
  //           break;
  //       }

  //       break;

  //     case 'vimeo':
  //       switch (activityState) {
  //         case 'open_meeting_room':
  //           if (chatAttendeChats !== '4') {
  //             if (
  //               props.cEventUser?.value &&
  //               (currentActivity?.requires_registration || !currentActivity?.requires_registration)
  //             ) {
  //               ComponentRender = (
  //                 <ZoomIframe
  //                   platform={platform}
  //                   meeting_id={currentActivity?.meeting_id}
  //                   generalTabs={tabsGeneral}
  //                 />
  //               );
  //             } else if (!props.cEventUser?.value && currentActivity?.requires_registration) {
  //               ComponentRender = (
  //                 <Alert
  //                   message='Advertencia'
  //                   description='Debes estar previamente registrado al evento para acceder al espacio en vivo, si estas registrado en el evento ingresa al sistema con tu usuario para poder acceder al evento'
  //                   type='warning'
  //                   showIcon
  //                 />
  //               );
  //             }
  //           } else if (chatAttendeChats == '4') {
  //             ComponentRender = <Game />;
  //           }

  //           break;

  //         case 'closed_meeting_room':
  //           if (chatAttendeChats !== '4') {
  //             ComponentRender = <ImageComponentwithContext />;
  //           }
  //           break;

  //         case 'ended_meeting_room':
  //           if (currentActivity?.video) {
  //             ComponentRender = <VideoActivity />;
  //           } else {
  //             ComponentRender = <ImageComponentwithContext />;
  //           }
  //           break;

  //         case 'nothing_state':
  //           ComponentRender = '';
  //           break;
  //       }

  //       break;
  //   }

  //   setcomponentToRender(ComponentRender);
  // }, [activityState,platform]);

  function RenderizarComponente(plataforma, actividad_estado) {
    console.log('si los recibe', plataforma, actividad_estado);
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
    }
  }

  return <>{RenderizarComponente(platform, activityState)}</>;
};

export default withRouter(WithEviusContext(RenderComponent));
