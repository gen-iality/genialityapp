import React, { useState, useEffect, useContext } from 'react';
import { Card, Row, Col, Alert, Form, Select, Input, Button, Radio, Space } from 'antd';
import AgendaContext from '../../../Context/AgendaContext';

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
  } = useContext(AgendaContext);
  const { handleClick, createZoomRoom, host_list, hasVideoconference, deleteRoom, handleChange, saveConfig } = props;

  useEffect(() => {
    setRequiresCreateRoom(platform === 'zoom' || platform === 'zoomExterno');
    if (platform === 'zoom' || platform === 'zoomExterno') {
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
        <Space direction='vertical'>
          <Form.Item
            label={'Estado de videoconferencia'}
            tooltip={
              <>
                {'Si desea volver a elegir otra plataforma seleccione el siguiente botón'}
                <Button type='primary' onClick={deleteRoom}>
                  {'Reiniciar selección'}
                </Button>
              </>
            }>
            <Select
              value={roomStatus}
              onChange={(value) => {
                setRoomStatus(value);
              }}>
              <Option value=''>Conferencia creada</Option>
              <Option value='open_meeting_room'>Conferencia Abierta</Option>
              <Option value='closed_meeting_room'>Conferencia en Preparación</Option>
              <Option value='ended_meeting_room'>Conferencia Terminada</Option>
            </Select>
          </Form.Item>

          <Form.Item label={'Platform'}>{platform}</Form.Item>

          <Form.Item label={'Conference Id'}>{meeting_id}</Form.Item>

          {requiresCreateRoom && host_name !== null && <Form.Item label={'Host'}>{host_name}</Form.Item>}

          <Button onClick={deleteRoom} danger>
            Eliminar transmisión
          </Button>
        </Space>
      </Card>
    );

  /**
   * Creación de una conferencia
   */
  return (
    <Card>
      {/**Selección plataforma de la conferencia */}
      <Form onFinish={handleClick} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
        <Form.Item label={'Plataforma Streaming del evento'}>
          <Select defaultValue={platform} value={platform} name='platform' onChange={(e) => setPlatform(e)}>
            <Option value={null}>Seleccionar...</Option>
            <Option value='vimeo'>Vimeo</Option>
            <Option value='zoom'>Zoom</Option>
            <Option value='zoomExterno'>ZoomExterno</Option>

            {/* <Option value='dolby'>Dolby</Option> */}
          </Select>
        </Form.Item>

        {requiresCreateRoom && (
          <>
            {!hasVideoconference && (
              <Form.Item label={'Desea seleccionar manualmente el host?'}>
                <Select
                  defaultValue={select_host_manual}
                  value={select_host_manual}
                  name='select_host_manual'
                  onChange={(e) => handleChange(e, 'select_host_manual')}>
                  <Option value={true}>Si</Option>
                  <Option value={false}>No</Option>
                </Select>
              </Form.Item>
            )}

            {select_host_manual && (
              <Row style={{ marginBottom: 24 }}>
                <Col span={24}>
                  <Form.Item label={'Seleccione un host'}>
                    <Select
                      defaultValue={host_id}
                      value={host_id}
                      name='host_id'
                      onChange={(e) => handleChange(e, 'host_id')}>
                      <Option value={null}>Seleccione...</Option>
                      {host_list.length > 0 &&
                        host_list.map((host) => (
                          <Option key={host.host_id} value={host.host_id}>
                            {host.host_name}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            )}
          </>
        )}

        {platform && (
          <Space direction='vertical'>
            <Radio.Group onChange={onChange} value={useAlreadyCreated}>
              {(platform == 'zoom' || platform == 'zoomExterno') && (
                <Radio value={false}>Crear nueva transmisión</Radio>
              )}
              <Radio value={true}>Tengo ya una transmisión que quiero usar</Radio>
            </Radio.Group>

            {useAlreadyCreated && (
              <>
                <Form.Item name='meeting_id' label={'Ingrese id de videoconferencia'} rules={[{ required: true }]}>
                  <Input
                    type='text'
                    name='meeting_id'
                    onChange={(e) => setMeetingId(e.target.value)}
                    value={meeting_id}
                  />
                </Form.Item>

                <Form.Item>
                  <Button type='primary' htmlType='submit'>
                    Guardar
                  </Button>
                </Form.Item>
              </>
            )}

            {!useAlreadyCreated && requiresCreateRoom && (
              <Button onClick={createZoomRoom} type='primary'>
                Crear nueva transmisión
              </Button>
            )}
          </Space>
        )}
      </Form>
    </Card>
  );
}
