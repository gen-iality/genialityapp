import React, { useState, useEffect, useContext } from 'react';
import { Card, Row, Col, Alert, Form, Select, Input, Button, Radio, Space, List, Typography } from 'antd';
import AgendaContext from 'Context/AgendaContext';
import WowzaStreamingPanel from './components/wowzaStreamingPanel';

import ConferenceConfig from './components/conferenceConfig';
import PlatformZoomCreate from './components/platformZoomCreate';
import StoreAlreadyCreatedMeeting from './components/storeAlreadyCreatedMeeting';
const { Option } = Select;

export default function RoomConfig(props) {
  const [requiresCreateRoom, setRequiresCreateRoom] = useState(false);

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
    activityEdit,
    setTransmition,
    transmition,
    useAlreadyCreated,
    setUseAlreadyCreated,
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
  }, [roomStatus, meeting_id]);

  const onChange = (e) => {
    setUseAlreadyCreated(e.target.value);
  };

  if (meeting_id)
    return (
      <>
        <ConferenceConfig
          {...{ deleteRoom, setRoomStatus, platform, meeting_id, requiresCreateRoom, host_name, roomStatus }}
        />
        {
          {
            wowza: (
              <WowzaStreamingPanel
                meeting_id={meeting_id}
                activityDispatch={activityDispatch}
                activityEdit={activityEdit}
              />
            ),
          }[platform]
        }
      </>
    );

  /**
   * Creación de una conferencia
   */

  /* console.log('GENERAL DATA =>>', {
    platform: platform,
    host_name: host_name,
    meeting_id: meeting_id,
    hasVideoconference: hasVideoconference,
  }); */
  return (
    <>
      <Form onFinish={handleClick} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
        {!meeting_id && (
          <Row gutter={24}>
            <Col span={8}>
              {/**Selección plataforma de la conferencia */}
              <Form.Item label={'Proveedor de transmisión'} tooltip={'Proveedor de transmisión'}>
                <Select defaultValue={platform} value={platform} name='platform' onChange={(e) => setPlatform(e)}>
                  <Option value={''}>Seleccionar...</Option>
                  <Option value='wowza'>
                    Evius streaming <Typography.Text type='secondary'>(recomendado)</Typography.Text>
                  </Option>
                  <Option value='vimeo'>Vimeo</Option>
                  <Option value='youtube'>Youtube</Option>
                  {/* <Option value='zoom'>Zoom</Option>
                      <Option value='zoomExterno'>ZoomExterno</Option> */}

                  {/* <Option value='dolby'>Dolby</Option> */}
                </Select>
              </Form.Item>

              <Form.Item label={'Plataforma de streaming'} tooltip={'Plataforma de streaming'}>
                <List itemLayout='horizontal' bordered={true}>
                  <List.Item
                    actions={[
                      <Radio checked={transmition === 'EviusMeet'} onChange={(e) => setTransmition('EviusMeet')} />,
                    ]}>
                    <List.Item.Meta title={'Evius streaming'} />
                  </List.Item>
                  <List.Item
                    actions={[
                      <Radio checked={transmition === 'StreamYard'} onChange={(e) => setTransmition('StreamYard')} />,
                    ]}>
                    <List.Item.Meta title={'StreamYard'} />
                  </List.Item>
                  <List.Item
                    actions={[<Radio checked={transmition === 'RTMP'} onChange={(e) => setTransmition('RTMP')} />]}>
                    <List.Item.Meta title={'RTMP'} />
                  </List.Item>
                </List>
              </Form.Item>
            </Col>
            <Col span={16}>
              <Card style={{ borderRadius: '10px' }} bordered>
                <Row justify='center' align='middle' gutter={24}>
                  <Col span={20}>
                    <Typography.Title level={3}>{'Crea una transmisión con todo el poder de EVIUS'}</Typography.Title>
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
                          {
                            {
                              wowza: (
                                <WowzaStreamingPanel
                                  meeting_id={meeting_id}
                                  activityDispatch={activityDispatch}
                                  activityEdit={activityEdit}
                                />
                              ),
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
                  </Col>
                  {/* <Col span={12}>

                    </Col> */}
                </Row>
              </Card>
            </Col>
          </Row>
        )}
      </Form>
    </>
  );
}
