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

const RenderComponent = (props) => {
  let { currentActivity, chatAttendeChats } = useContext(HelperContext);
  let tabsdefault = {
    attendees: false,
    chat: true,
    games: true,
    surveys: false,
  };
  const [tabsGeneral, settabsGeneral] = useState(tabsdefault);
  const [activityState, setactivityState] = useState();

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

  useEffect(() => {
    if (currentActivity) {
      setactivityState(currentActivity.habilitar_ingreso ? currentActivity.habilitar_ingreso : 'nothing_state');
      settabsGeneral(currentActivity.tabs ? currentActivity.tabs : tabsdefault);
    }
  },[currentActivity]);

  let ComponentRender = <Preloader />;

  // console.log('activityState', activityState);
  switch (currentActivity?.platform) {
    case 'dolby':
      switch (activityState) {
        case 'open_meeting_room':
          if ((props.cUser.value.name || props.cUser.value.email) == null || undefined || '') {
            ComponentRender = <DolbyCard />;
          }
          break;

        case 'closed_meeting_room':
          if (chatAttendeChats !== '4') {
            ComponentRender = <ImageComponentwithContext />;
          }
          break;

        case 'ended_meeting_room':
          if (currentActivity?.video) {
            ComponentRender = <VideoActivity />;
          } else {
            ComponentRender = <ImageComponentwithContext />;
          }
          break;

        case 'nothing_state':
          ComponentRender = '';
          break;
      }
      break;

    case 'zoomExterno':
      switch (activityState) {
        case 'open_meeting_room':
          if (chatAttendeChats !== '4') {
            ComponentRender = zoomExternoHandleOpen(currentActivity, props.cEventUser.value);
          } else if (chatAttendeChats == '4') {
            ComponentRender = <Game />;
          }

        case 'closed_meeting_room':
          if (chatAttendeChats !== '4') {
            ComponentRender = <ImageComponentwithContext />;
          }
          break;

        case 'ended_meeting_room':
          if (currentActivity?.video) {
            ComponentRender = <VideoActivity />;
          } else {
            ComponentRender = <ImageComponentwithContext />;
          }
          break;

        case 'nothing_state':
          ComponentRender = '';
          break;
      }

      break;

    case 'zoom':
      switch (activityState) {
        case 'open_meeting_room':
          if (chatAttendeChats !== '4') {
            if (
              props.cEventUser?.value &&
              (currentActivity?.requires_registration || !currentActivity?.requires_registration)
            ) {
              ComponentRender = (
                <ZoomIframe
                  platform={currentActivity?.platform}
                  meeting_id={currentActivity?.meeting_id}
                  generalTabs={tabsGeneral}
                />
              );
            } else if (!props.cEventUser?.value && currentActivity?.requires_registration) {
              ComponentRender = (
                <Alert
                  message='Advertencia'
                  description='Debes estar previamente registrado al evento para acceder al espacio en vivo, si estas registrado en el evento ingresa al sistema con tu usuario para poder acceder al evento'
                  type='warning'
                  showIcon
                />
              );
            }
          } else if (chatAttendeChats == '4') {
            ComponentRender = <Game />;
          }

          break;

        case 'closed_meeting_room':
          if (chatAttendeChats !== '4') {
            ComponentRender = <ImageComponentwithContext />;
          }
          break;

        case 'ended_meeting_room':
          if (currentActivity?.video) {
            ComponentRender = <VideoActivity />;
          } else {
            ComponentRender = <ImageComponentwithContext />;
          }
          break;

        case 'nothing_state':
          ComponentRender = '';
          break;
      }

      break;

    case 'vimeo':
      switch (activityState) {
        case 'open_meeting_room':
          if (chatAttendeChats !== '4') {
            if (
              props.cEventUser?.value &&
              (currentActivity?.requires_registration || !currentActivity?.requires_registration)
            ) {
              ComponentRender = (
                <ZoomIframe
                  platform={currentActivity?.platform}
                  meeting_id={currentActivity?.meeting_id}
                  generalTabs={tabsGeneral}
                />
              );
            } else if (!props.cEventUser?.value && currentActivity?.requires_registration) {
              ComponentRender = (
                <Alert
                  message='Advertencia'
                  description='Debes estar previamente registrado al evento para acceder al espacio en vivo, si estas registrado en el evento ingresa al sistema con tu usuario para poder acceder al evento'
                  type='warning'
                  showIcon
                />
              );
            }
          } else if (chatAttendeChats == '4') {
            ComponentRender = <Game />;
          }

          break;

        case 'closed_meeting_room':
          if (chatAttendeChats !== '4') {
            ComponentRender = <ImageComponentwithContext />;
          }
          break;

        case 'ended_meeting_room':
          if (currentActivity?.video) {
            ComponentRender = <VideoActivity />;
          } else {
            ComponentRender = <ImageComponentwithContext />;
          }
          break;

        case 'nothing_state':
          ComponentRender = '';
          break;
      }

      break;
  }

  return ComponentRender;
};

export default withRouter(WithEviusContext(RenderComponent));
