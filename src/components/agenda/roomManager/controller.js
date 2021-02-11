import React from 'react';
import { Card, Row, Col } from 'antd';

export default function RoomController(props) {
  const {
    handleRoomState,
    handleTabsController,
    roomStatus,
    chat,
    surveys,
    games,
    attendees,
    isPublished,
    handleChange,
  } = props;
  return (
    <>
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
            <label className='label'>Estado de videoconferencia</label>
            <div className='select is-primary'>
              <select defaultValue={roomStatus} onChange={handleRoomState}>
                <option value=''>Seleccionar...</option>
                <option value='open_meeting_room'>Conferencia Abierta</option>
                <option value='closed_meeting_room'>Conferencia no Iniciada</option>
                <option value='ended_meeting_room'>Conferencia Terminada</option>
              </select>
            </div>
          </Col>
        </Row>

        <Row style={{ marginBottom: 24 }}>
          <Col span={12}>
            <label className='label'>Habilitar Chat</label>
            <div className='select is-primary'>
              <select defaultValue={chat} onChange={(e) => handleTabsController(e, 'chat')}>
                <option value='true'>Si</option>
                <option value='false'>No</option>
              </select>
            </div>
          </Col>
          <Col span={12}>
            <label className='label'>Habilitar Encuestas</label>
            <div className='select is-primary'>
              <select defaultValue={surveys} onChange={(e) => handleTabsController(e, 'surveys')}>
                <option value='true'>Si</option>
                <option value='false'>No</option>
              </select>
            </div>
          </Col>
        </Row>
        <Row style={{ marginBottom: 24 }}>
          <Col span={12}>
            <label className='label'>Habilitar Juegos</label>
            <div className='select is-primary'>
              <select defaultValue={games} onChange={(e) => handleTabsController(e, 'games')}>
                <option value='true'>Si</option>
                <option value='false'>No</option>
              </select>
            </div>
          </Col>
          <Col span={12}>
            <label className='label'>Habilitar Asistentes</label>
            <div className='select is-primary'>
              <select defaultValue={attendees} onChange={(e) => handleTabsController(e, 'attendees')}>
                <option value='true'>Si</option>
                <option value='false'>No</option>
              </select>
            </div>
          </Col>
        </Row>
      </Card>
    </>
  );
}
