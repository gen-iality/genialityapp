import React from 'react';
import { Card, Row, Col, Switch } from 'antd';

export default function RoomController(props) {
  const { handleRoomState, handleTabsController, roomStatus, surveys, games } = props;
  return (
    <>
      <Card>
        <Row style={{ padding: '8px 0px' }}>
          <Col span={24}>
            <label className='label'>Estado de videoconferencia</label>
            <div className='select is-primary'>
              <select defaultValue={roomStatus} onChange={handleRoomState}>
                <option value=''>Sin Estado</option>
                <option value='open_meeting_room'>Conferencia Abierta</option>
                <option value='closed_meeting_room'>Conferencia no Iniciada</option>
                <option value='ended_meeting_room'>Conferencia Terminada</option>
              </select>
            </div>
          </Col>
        </Row>

        {/* <Row style={{ padding: '8px 0px' }}>
          <Col xs={12} lg={8}>
            Habilitar Chat
          </Col>
          <Col xs={4} lg={2}>
            <Switch checked={chat} onChange={(checked) => handleTabsController(checked, 'chat')} />
          </Col>
        </Row> */}
        {/* <Row style={{ padding: '8px 0px' }}>
          <Col xs={12} lg={8}>
            Habilitar Encuestas
          </Col>
          <Col xs={4} lg={2}>
            <Switch checked={surveys} onChange={(checked) => handleTabsController(checked, 'surveys')} />
          </Col>
        </Row> */}
        <Row style={{ padding: '8px 0px' }}>
          <Col xs={12} lg={8}>
            Habilitar Juegos
          </Col>
          <Col xs={4} lg={2}>
            <Switch checked={games} onChange={(checked) => handleTabsController(checked, 'games')} />
          </Col>
        </Row>
      </Card>
    </>
  );
}
