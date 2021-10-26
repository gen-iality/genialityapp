import React, { useContext, useEffect, useState } from 'react';
import WithEviusContext from '../../../Context/withContext';
import ImageComponentwithContext from './ImageComponent';
import { HelperContext } from '../../../Context/HelperContext';
import { DolbyCard } from './DolbyCard';
import ZoomIframe from '../ZoomIframe';
import { VideoActivity } from './VideoActivity';
import { Row, Spin } from 'antd';
import { Ripple } from 'react-preloaders';

const RenderComponent = (props) => {
  let { currentActivity, chatAttendeChats } = useContext(HelperContext);
  let tabsdefault = {
    attendees: false,
    chat: true,
    games: true,
    surveys: false,
  };
  const [tabsGeneral, settabsGeneral] = useState(tabsdefault);

  useEffect(() => {
    if (currentActivity) {
      settabsGeneral(currentActivity.tabs);
    }
  }, [currentActivity]);

  let ComponentRender = <Ripple />;

  switch (currentActivity?.platform) {
    case 'dolby':
      switch (currentActivity?.habilitar_ingreso) {
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
      }
      break;

    case 'zoomExterno':
      switch (currentActivity?.habilitar_ingreso) {
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
      }

      break;

    case 'zoom':
      switch (currentActivity?.habilitar_ingreso) {
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
      }

      break;

    case 'vimeo':
      switch (currentActivity?.habilitar_ingreso) {
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
      }

      break;

    // default: {
    //     component = <Row
    //         style={{ fontSize: "25px", margin: 10 }}
    //         justify="center"
    //     >
    //         FALTA ASIGNAR EL ESPACIO EN VIVO
    //     </Row>
    // }
  }

  return ComponentRender;
};

export default WithEviusContext(RenderComponent);
