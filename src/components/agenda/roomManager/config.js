import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Alert, Form, Select, Input, Button } from 'antd';

const { Option } = Select;

export default function RoomConfig(props) {
  const [requiresCreateRoom, setRequiresCreateRoom] = useState(false);
  const {
    platform,
    handleChange,
    host_name,
    handleClick,
    meeting_id,
    isPublished,
    createZoomRoom,
    select_host_manual,
    host_list,
    host_id,
    hasVideoconference,
    deleteZoomRoom,
    roomStatus,
    handleRoomState,
  } = props;

  useEffect(() => {
    setRequiresCreateRoom(platform === 'zoom' || platform === 'zoomExterno');
  }, [platform]);

  return (
    <Card>
      {/* Este es el que se va a trabajar */}
      <Row style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Form.Item label={'Estado de videoconferencia'}>
            <Select defaultValue={roomStatus} value={roomStatus} onChange={handleRoomState}>
              <Option value=''>Sin Estado</Option>
              <Option value='open_meeting_room'>Conferencia Abierta</Option>
              <Option value='closed_meeting_room'>Conferencia no Iniciada</Option>
              <Option value='ended_meeting_room'>Conferencia Terminada</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      {/* <Row style={{ marginBottom: 24 }}>
        <Col span={24}> */}
          {/* <Form.Item label={'Publicar Actividad'}>
            <Select defaultValue={isPublished} value={isPublished} name='isPublished' onChange={(e) => handleChange(e, 'isPublished')}>
              <Option value={true}>Si</Option>
              <Option value={false}>No</Option>
            </Select>
          </Form.Item> */}
          {/* <label className='label'>Publicar Actividad</label>
          <div className='select is-primary'>
            <select defaultValue={isPublished} value={isPublished} name='isPublished' onChange={handleChange}>
              <option value={true}>Si</option>
              <option value={false}>No</option>
            </select>
          </div> */}
        {/* </Col>
      </Row> */}
      <Row style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Form.Item label={'Plataforma Streaming del evento'}>
            {platform === null || platform === '' ? (
              <Select defaultValue={platform} value={platform} name='platform' onChange={(e) => handleChange(e, 'platform')}>
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
          {/* <label className='label'>Plataforma Streaming del evento</label>
          {platform === null || platform === '' ? (
            <div className='select is-primary'>
              <select defaultValue={platform} value={platform} name='platform' onChange={handleChange}>
                <option value=''>Seleccionar...</option>
                <option value='zoom'>Zoom</option>
                <option value='zoomExterno'>ZoomExterno</option>
                <option value='vimeo'>Vimeo</option>
                <option value='dolby'>Dolby</option>
                <option value='bigmarker'>BigMaker</option>
              </select>
            </div>
          ) : (
            <>{platform}</>
          )} */}
        </Col>
      </Row>

      {requiresCreateRoom && !hasVideoconference && (
        <>
          <Alert
            message='Si ya tiene creada una  transmisión ingrese los datos solicitados y haga click en Guardar, en caso que no haga click sobre el boton Crear transmisión'
            type='info'
            showIcon
            style={{ marginBottom: 24 }}
            closable
          />
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
                {/* <label className='label'>Desea seleccionar manualmente el host?</label>
                <div className='select is-primary'>
                  <select
                    defaultValue={false}
                    value={select_host_manual}
                    name='select_host_manual'
                    onChange={handleChange}>
                    <option value={true}>Si</option>
                    <option value={false}>No</option>
                  </select>
                </div> */}
              </Col>
            </Row>
          )}
        </>
      )}

      {requiresCreateRoom && select_host_manual && !hasVideoconference && (
        <Row style={{ marginBottom: 24 }}>
          <Col span={24}>
            <Form.Item label={'Seleccione un host'}>
              <Select defaultValue={host_id} value={host_id} name='host_id' onChange={(e) => handleChange(e, 'host_id')}>
                <Option value=''>Seleccione</Option>
                {host_list.length > 0 &&
                  host_list.map((host) => (
                    <Option key={host.host_id} value={host.host_id}>
                      {host.host_name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
            {/* <label className='label'>Seleccione un host</label>
            <div className='select is-primary'>
              <select defaultValue={false} value={host_id} name='host_id' onChange={handleChange}>
                <option value=''>Seleccione</option>
                {host_list.length > 0 &&
                  host_list.map((host) => (
                    <option key={host.host_id} value={host.host_id}>
                      {host.host_name}
                    </option>
                  ))}
              </select>
            </div> */}
          </Col>
        </Row>
      )}

      <Row style={{ marginBottom: 24 }}>
        <Col span={24}>
          {!hasVideoconference ? (
            <Form.Item label={'Ingrese id de videoconferencia'}>
              <Input type='number' name='meeting_id' onChange={(e) => handleChange(e)} value={meeting_id} />
            </Form.Item>
            /*<div className='control'>
              <label className='label'>Ingrese id de videoconferencia</label>
              <input type='number' name='meeting_id' onChange={handleChange} value={meeting_id} />
            </div>*/
          ) : (
            <div className='control'>
              <Form.Item label={'Id de videoconferencia'}>
                {meeting_id}
              </Form.Item>
              {/* <label className='label'>Id de videoconferencia</label>
              <>{meeting_id}</> */}
            </div>
          )}
        </Col>
      </Row>

      {requiresCreateRoom && host_name !== null && (
        <Row style={{ marginBottom: 24 }}>
          <Col span={24}>
            <Form.Item label={'Host'}>
              <p>{host_name}</p>
            </Form.Item>
            {/* <div className='control'>
              <label className='label'>Host</label>
              <p>{host_name}</p>
            </div> */}
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
               {/*  <button onClick={createZoomRoom} className='button is-primary'>
                  Crear transmisión
                </button> */}
              </Col>
            )}
            <Col span={8}>
              <Button onClick={handleClick} type='primary'>
                Guardar Configuración
              </Button>
              {/* <button onClick={handleClick} className='button is-primary'>
                Guardar
              </button> */}
            </Col>
          </>
        ) : (
          <Col span={16}>
            <Button onClick={deleteZoomRoom} danger>
              Eliminar transmisión
            </Button>
            {/* <button onClick={deleteZoomRoom} className='button is-danger'>
              Eliminar transmisión
            </button> */}
          </Col>
        )}
      </Row>
    </Card>
  );
}
