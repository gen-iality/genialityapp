import { Form, Select, Button, Space, Typography, Row, Col, Card, Badge } from 'antd';
import AgendaContext from 'Context/AgendaContext';
import { CurrentEventContext } from 'Context/eventContext';
import { fireRealtime } from 'helpers/firebase';
import React, { useState, useContext } from 'react';
import { useEffect } from 'react';
import ModalListRequestsParticipate from './ModalListRequestsParticipate';
const { Text, Link } = Typography;
const { Option } = Select;

export default function ConferenceConfig({
  roomStatus,
  deleteRoom,
  setRoomStatus,
  platform,
  meeting_id,
  requiresCreateRoom,
  host_name, //g3bcjcjf
}) {
  const eventContext = useContext(CurrentEventContext);
  const { activityEdit, getRequestByActivity, request, transmition } = useContext(AgendaContext);
  const [viewModal, setViewModal] = useState(false);
  const refActivity = `request/${eventContext.value?._id}/activities/${activityEdit}`;
  useEffect(() => {
    if (!eventContext.value || !activityEdit) return;
    getRequestByActivity(refActivity);
  }, [eventContext.value, activityEdit]);

  return (
    <>
      <Card bordered style={{ borderRadius: '10px' }}>
        <Row gutter={[16, 16]} justify='space-between' align='middle'>
          <Col>
            {/* <Space direction='horizontal'> */}
            {/* <Form.Item
                label={'Estado de la transmisión para tus asistentes'}
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
                  <Option value=''>Actividad creada</Option>
                  <Option value='closed_meeting_room'>Iniciará pronto</Option>
                  <Option value='open_meeting_room'>En vivo</Option>
                  <Option value='ended_meeting_room'>Finalizada</Option>
                </Select>
              </Form.Item> */}
            <Space>
              <label className='label'>Estado de la transmisión para tus asistentes: </label>
              <Select
                value={roomStatus}
                onChange={(value) => {
                  setRoomStatus(value);
                }}>
                <Option value=''>Actividad creada</Option>
                <Option value='closed_meeting_room'>Iniciará pronto</Option>
                <Option value='open_meeting_room'>En vivo</Option>
                <Option value='ended_meeting_room'>Finalizada</Option>
              </Select>
            </Space>
            {/*  <Text>
                <Text strong>Platforma: </Text>
                {platform}
              </Text>
              <Text>
                <Text strong>Conference Id: </Text>
                {meeting_id}
              </Text>
              {requiresCreateRoom && host_name !== null && <Form.Item label={'Host'}>{host_name}</Form.Item>} */}
            {/* <Button onClick={deleteRoom} danger>
                Eliminar transmisión
              </Button> */}
            {/* </Space> */}
          </Col>
          {transmition == 'EviusMeet' && (
            <Col>
              <Badge
                onClick={() => setViewModal(true)}
                count={request && Object.keys(request).length > 0 ? Object.keys(request).length : 0}>
                <Button type='primary'>Solicitudes de participación</Button>
              </Badge>
            </Col>
          )}
          <Col>
            <Button onClick={deleteRoom} danger>
              Eliminar transmisión
            </Button>
          </Col>
        </Row>
      </Card>
      <ModalListRequestsParticipate refActivity={refActivity} visible={viewModal} handleModal={setViewModal} />
    </>
  );
}
