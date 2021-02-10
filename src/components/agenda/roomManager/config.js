import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Alert } from 'antd';

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
  } = props;

  useEffect(() => {
    setRequiresCreateRoom(platform === 'zoom' || platform === 'zoomExterno');
  }, [platform]);

  return (
    <Card>
      <Row style={{ marginBottom: 24 }}>
        <Col span={24}>
          <label className='label'>Publicar Actividad</label>
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
        <>
          <Alert
            message='Si ya tiene creada una  transmisión ingrese los datos solicitados y haga click en Guardar, en caso que no haga click sobre el boton Crear transmisión'
            type='info'
            showIcon
            style={{ marginBottom: 24 }}
            closable
          />
          <Row style={{ marginBottom: 24 }}>
            <Col span={24}>
              <label className='label'>Desea seleccionar manualmente el host?</label>
              <div className='select is-primary'>
                <select
                  defaultValue={false}
                  value={select_host_manual}
                  name='select_host_manual'
                  onChange={handleChange}>
                  <option value={true}>Si</option>
                  <option value={false}>No</option>
                </select>
              </div>
            </Col>
          </Row>
        </>
      )}

      {requiresCreateRoom && select_host_manual && (
        <Row style={{ marginBottom: 24 }}>
          <Col span={24}>
            <label className='label'>Seleccione un host</label>
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
            </div>
          </Col>
        </Row>
      )}

      <Row style={{ marginBottom: 24 }}>
        <Col span={24}>
          <div className='control'>
            <label className='label'>Ingrese id de videoconferencia</label>
            <input type='number' name='meeting_id' onChange={handleChange} value={meeting_id} />
          </div>
        </Col>
      </Row>
      {requiresCreateRoom && host_name !== null && (
        <Row style={{ marginBottom: 24 }}>
          <Col span={24}>
            <div className='control'>
              <label className='label'>Host</label>
              <p>{host_name}</p>
            </div>
          </Col>
        </Row>
      )}

      <Row>
        {!hasVideoconference ? (
          <>
            {requiresCreateRoom && (
              <Col span={16}>
                <button onClick={createZoomRoom} className='button is-primary'>
                  Crear transmisión
                </button>
              </Col>
            )}
            <Col span={8}>
              <button onClick={() => handleClick(true)} className='button is-primary'>
                Guardar
              </button>
            </Col>
          </>
        ) : (
          <Col span={16}>
            <button onClick={deleteZoomRoom} className='button is-danger'>
              Eliminar transmisión
            </button>
          </Col>
        )}
      </Row>
    </Card>
  );
}
