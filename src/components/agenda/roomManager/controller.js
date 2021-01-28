import React, { Component } from 'react';
import { Card, Row, Col } from 'antd';

export default class RoomController extends Component {
  componentDidMount = () => {
    console.log('room controller', this.props);
  };
  render() {
    const { handleRoomState, handleTabsController } = this.props;
    return (
      <>
        <Card>
          <Row style={{ marginBottom: 24 }}>
            <Col span={24}>
              <label className='label'>Estado de videoconferencia</label>
              <div className='select'>
                <select
                  //defaultValue={} styles={}
                  onChange={handleRoomState}>
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
              <select>
                <option value='true'>Si</option>
                <option value='false'>No</option>
              </select>
            </Col>
            <Col span={12}>
              <label className='label'>Habilitar Encuestas</label>
              <select>
                <option value='true'>Si</option>
                <option value='false'>No</option>
              </select>
            </Col>
          </Row>
          <Row style={{ marginBottom: 24 }}>
            <Col span={12}>
              <label className='label'>Habilitar Juegos</label>
              <select>
                <option value='true'>Si</option>
                <option value='false'>No</option>
              </select>
            </Col>
            <Col span={12}>
              <label className='label'>Habilitar Asistentes</label>
              <select>
                <option value='true'>Si</option>
                <option value='false'>No</option>
              </select>
            </Col>
          </Row>
        </Card>
      </>
    );
  }
}
