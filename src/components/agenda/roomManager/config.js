import React, { useState, useEffect, useContext } from 'react';
import { Card, Row, Col, Alert, Form, Select, Input, Button } from 'antd';
import AgendaContext from '../../../Context/AgendaContext';

const { Option } = Select;

export default function RoomConfig(props) {
  const [requiresCreateRoom, setRequiresCreateRoom] = useState(false);
  const {
    platform,
    host_name,
    meeting_id,
    host_id,
    isPublished,
    roomStatus,
    setRoomStatus,
    setPlatform,
    setMeetingId,
    select_host_manual
  } = useContext(AgendaContext);
  const {
    handleClick,
    createZoomRoom,
    /* select_host_manual,
    host_id, */
    host_list,
    hasVideoconference,
    deleteZoomRoom,
    handleChange,
    saveConfig,
  } = props;

  useEffect(() => {
    setRequiresCreateRoom(platform === 'zoom' || platform === 'zoomExterno');
  }, [platform]);

  useEffect(() => {
    saveConfiguration();
    async function saveConfiguration() {
      await saveConfig();
    }
  }, [roomStatus]);

  return (
    <Card>
      { meeting_id && (
        <Row style={{ marginBottom: 24 }}>
          <Col span={24}>
            <Form.Item label={'Estado de videoconferencia'}>
              <Select
                value={roomStatus}
                onChange={(value) => {
                  setRoomStatus(value);
                }}>
                <Option value=''>Sin Estado</Option>
                <Option value='open_meeting_room'>Conferencia Abierta</Option>
                <Option value='closed_meeting_room'>Conferencia no Iniciada</Option>
                <Option value='ended_meeting_room'>Conferencia Terminada</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      )}
      <Row style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Form.Item label={'Plataforma Streaming del evento'} 
            tooltip={(
              <>
                {'Si desea volver a elegir otra plataforma seleccione el siguiente botón'}
                <Button type='primary' onClick={deleteZoomRoom}>
                  {'Reiniciar selección'}
                </Button>
              </>
            )}>
            {(platform === null || platform === '') && !meeting_id ? (
              <Select defaultValue={platform} value={platform} name='platform' onChange={(e) => setPlatform(e)}>
                <Option value={null}>Seleccionar...</Option>
                <Option value='zoom'>Zoom</Option>
                <Option value='zoomExterno'>ZoomExterno</Option>
                <Option value='vimeo'>Vimeo</Option>
                <Option value='dolby'>Dolby</Option>
                <Option value='bigmarker'>BigMaker</Option>
              </Select>
            ) : (
              <>{platform}</>
            )}
          </Form.Item>
        </Col>
      </Row>

      {requiresCreateRoom && !hasVideoconference && (
        <>
          {/* <Alert
            message='Si ya tiene creada una  transmisión ingrese los datos solicitados y haga click en Guardar, en caso que no haga click sobre el boton Crear transmisión'
            type='info'
            showIcon
            style={{ marginBottom: 24 }}
            closable
          /> */}
          {!hasVideoconference && (
            <Row style={{ marginBottom: 24 }}>
              <Col span={24}>
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
              </Col>
            </Row>
          )}
        </>
      )}
      {/* {select_host_manual ? 'hola' : 'adios'} */}
      {requiresCreateRoom && select_host_manual && !hasVideoconference && (
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

      {platform && <Alert
        message={'Si ya tiene creada una transmisión ingrese los datos solicitados '}
        type='warning'
        showIcon
        style={{ marginBottom: 24 }}
      />}

      <Row style={{ marginBottom: 24 }}>
        <Col span={24}>
          {!hasVideoconference && platform ? (
            <Form.Item label={'Ingrese id de videoconferencia'}>
              <Input
                type='number'
                name='meeting_id'
                onChange={(e) => setMeetingId(e.target.value)}
                value={meeting_id}
              />
            </Form.Item>
          ) : (
            <>
              {meeting_id && <Form.Item label={'Id de videoconferencia'}>{meeting_id}</Form.Item>}
            </>
          )}
        </Col>
      </Row>

      {requiresCreateRoom && host_name !== null && (
        <Row style={{ marginBottom: 24 }}>
          <Col span={24}>
            <Form.Item label={'Host'}>
              <p>{host_name}</p>
            </Form.Item>
          </Col>
        </Row>
      )}

      <Row>
        {!hasVideoconference ? (
          <>
            {requiresCreateRoom && (
              <Col span={16}>
                <Button onClick={createZoomRoom} type='primary'>
                  Crear transmisión
                </Button>
              </Col>
            )}
            {!requiresCreateRoom && (
              <Col span={8}>
                <Button onClick={handleClick} type='primary'>
                  {meeting_id ? 'Guardar Configuración' : 'Crear transmisión'}
                </Button>
              </Col>
            )}
          </>
        ) : (
          <Col span={16}>
            <Button onClick={deleteZoomRoom} danger>
              Eliminar transmisión
            </Button>
          </Col>
        )}
      </Row>
    </Card>
  );
}
