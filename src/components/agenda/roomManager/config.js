import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Alert } from 'antd';

export default function RoomConfig(props) {
  const [requiresCreateRoom, setRequiresCreateRoom] = useState(false);
  const { platform, handleChange, host_id, handleSaveConfig, meeting_id, isPublished } = props;
  useEffect(() => {
    setRequiresCreateRoom(platform === 'zoom' || platform === 'zoomExterno');
  }, [platform]);

  return (
    <Card>
      <Row style={{ marginBottom: 24 }}>
        <Col span={24}>
          <label className='label'>Habilitar Actividad</label>
          <div className='select is-primary'>
            <select defaultValue={isPublished} value={isPublished} name='isPublished' onChange={handleChange}>
              <option value={true}>Si</option>
              <option value={false}>No</option>
            </select>
          </div>
        </Col>
      </Row>

      <Row style={{ marginBottom: 24 }}>
        <Col span={24}>
          <label className='label'>Plataforma Streaming del evento</label>
          <div className='select is-primary'>
            <select defaultValue={platform} value={platform} name='platform' onChange={handleChange}>
              <option value=''>Seleccionar...</option>
              <option value='zoom'>Zoom</option>
              <option value='zoomExterno'>ZoomExterno</option>
              <option value='vimeo'>Vimeo</option>
              <option value='bigmarker'>BigMaker</option>
            </select>
          </div>
        </Col>
      </Row>

      {requiresCreateRoom && (
        <Alert
          message='Si ya tiene creada una  transmisión ingrese los datos solicitados y haga click en Guardar, en caso que no haga click sobre el boton Crear transmisión'
          type='info'
          showIcon
          style={{ marginBottom: 24 }}
          closable
        />
      )}

      <Row style={{ marginBottom: 24 }}>
        <Col span={24}>
          <div className='control'>
            <label className='label'>Ingrese id de videoconferencia</label>
            <input type='number' name='meeting_id' onChange={handleChange} value={meeting_id} />
          </div>
        </Col>
      </Row>

      {(platform === 'zoom' || platform === 'zoomExterno') && (
        <Row style={{ marginBottom: 24 }}>
          <Col span={24}>
            <label className='label'>Seleccione un host</label>

            <div className='select is-primary'>
              <select name={'host_id'} value={host_id} onChange={handleChange}>
                <option>Seleccione host</option>
                {[{ id: 1, email: 'host1@evius.co', state: 'available' }].map((host) => {
                  return (
                    host.state &&
                    host.state === 'available' && (
                      <option value={host.id} key={host.id}>
                        {host.email}
                      </option>
                    )
                  );
                })}
              </select>
            </div>
          </Col>
        </Row>
      )}
      <Row>
        {requiresCreateRoom && (
          <Col span={16}>
            <button
              onClick={() => {
                // eslint-disable-next-line no-console
                console.log('create virtual room');
              }}
              className='button is-primary'>
              Crear transmisión
            </button>
          </Col>
        )}
        <Col span={8}>
          <button onClick={handleSaveConfig} className='button is-primary'>
            Guardar
          </button>
        </Col>
      </Row>
    </Card>
  );
}
