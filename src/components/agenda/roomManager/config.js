import React, { useState, useEffect, useContext } from 'react';
import { Card, Row, Col, Alert, Form, Select, Input, Button, Radio, Space } from 'antd';
import AgendaContext from '../../../Context/AgendaContext';
import WowzaStreamingPanel from './components/wowzaStreamingPanel';
import ConferenceConfig from './components/conferenceConfig';
import PlatformZoomCreate from './components/platformZoomCreate';
import StoreAlreadyCreatedMeeting from './components/storeAlreadyCreatedMeeting';
const { Option } = Select;

export default function RoomConfig(props) {
  const [requiresCreateRoom, setRequiresCreateRoom] = useState(false);
  const [useAlreadyCreated, setUseAlreadyCreated] = useState(false);
  const {
    platform,
    host_name,
    meeting_id,
    host_id,
    roomStatus,
    setRoomStatus,
    setPlatform,
    setMeetingId,
    select_host_manual,
    activityDispatch,
  } = useContext(AgendaContext);
  const { handleClick, createZoomRoom, host_list, hasVideoconference, deleteRoom, handleChange, saveConfig } = props;

  useEffect(() => {
    setRequiresCreateRoom(platform === 'zoom' || platform === 'zoomExterno');
    if (platform === 'zoom' || platform === 'zoomExterno' || platform == 'wowza') {
      setUseAlreadyCreated(false);
    } else {
      setUseAlreadyCreated(true);
    }
  }, [platform]);

  useEffect(() => {
    saveConfiguration();
    async function saveConfiguration() {
      await saveConfig();
    }
  }, [roomStatus]);

  const onChange = (e) => {
    setUseAlreadyCreated(e.target.value);
  };

  if (hasVideoconference)
    return (
      <Card>
        <ConferenceConfig
          {...{ deleteRoom, setRoomStatus, platform, meeting_id, requiresCreateRoom, host_name, roomStatus }}
        />
        {
          {
            wowza: <WowzaStreamingPanel meeting_id={meeting_id} activityDispatch={activityDispatch} />,
          }[platform]
        }
      </Card>
    );

  /**
   * Creación de una conferencia
   */
  return (
    <Card>
      {/**Selección plataforma de la conferencia */}
      <Form onFinish={handleClick} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
        <Form.Item label={'Plataforma'}>
          <Select defaultValue={platform} value={platform} name='platform' onChange={(e) => setPlatform(e)}>
            <Option value={null}>Seleccionar...</Option>
            <Option value='wowza'>Wowza</Option>
            <Option value='vimeo'>Vimeo</Option>
            <Option value='zoom'>Zoom</Option>
            <Option value='zoomExterno'>ZoomExterno</Option>

            {/* <Option value='dolby'>Dolby</Option> */}
          </Select>
        </Form.Item>
        {platform && (
          <Space direction='vertical'>
            {/** create a meeting or reuse and old one */}
            <Radio.Group onChange={onChange} value={useAlreadyCreated}>
              {(platform == 'zoom' || platform == 'zoomExterno' || platform == 'wowza') && (
                <Radio value={false}>Crear nueva transmisión</Radio>
              )}
              <Radio value={true}>Tengo ya una transmisión que quiero usar</Radio>
            </Radio.Group>

            {/** StoreAlreadyCreatedMeeting */}
            {useAlreadyCreated ? (
              <StoreAlreadyCreatedMeeting {...{ setMeetingId, meeting_id }} />
            ) : (
              <>
                <p>Crear una nueva</p>
                {
                  {
                    wowza: <WowzaStreamingPanel meeting_id={meeting_id} activityDispatch={activityDispatch} />,
                    zoom: (
                      <PlatformZoomCreate
                        {...{
                          createZoomRoom,
                          useAlreadyCreated,
                          requiresCreateRoom,
                          hasVideoconference,
                          select_host_manual,
                          handleChange,
                          host_id,
                          host_list,
                        }}
                      />
                    ),
                    zoomExterno: (
                      <PlatformZoomCreate
                        {...{
                          createZoomRoom,
                          useAlreadyCreated,
                          requiresCreateRoom,
                          hasVideoconference,
                          select_host_manual,
                          handleChange,
                          host_id,
                          host_list,
                        }}
                      />
                    ),
                  }[platform]
                }
              </>
            )}
          </Space>
        )}
      </Form>
    </Card>
  );
}
