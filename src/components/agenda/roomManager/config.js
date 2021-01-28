import React from 'react';
import { Card, Row, Col } from 'antd';

export default function RoomConfig(props) {
  const { platform, handleChange, host_id } = props;
  return (
    <Card>
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
      <Row style={{ marginBottom: 24 }}>
        <Col span={24}>
          <div className='control'>
            <label className='label'>Ingrese id de videoconferencia</label>
            <input type='number' name='meeting_id' onChange={handleChange} />
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
        <Col>
          <button
            onClick={() => {
              console.log('start');
            }}
            className='button is-primary'>
            Guardar
          </button>
        </Col>
      </Row>
    </Card>
  );
}
