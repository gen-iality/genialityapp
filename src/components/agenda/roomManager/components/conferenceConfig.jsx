import { getLiveStreamStatus } from '../../../../adaptors/wowzaStreamingAPI';
import { Select, Button, Space, Row, Col, Card, Badge } from 'antd';
import AgendaContext from '../../../../context/AgendaContext';
import { CurrentEventContext } from '../../../../context/eventContext';
import { useState, useContext } from 'react';
import { useEffect } from 'react';
import ModalListRequestsParticipate from './ModalListRequestsParticipate';
const { Option } = Select;

export default function ConferenceConfig({ roomStatus, deleteRoom, setRoomStatus, meeting_id }) {
  const eventContext = useContext(CurrentEventContext);
  const { activityEdit, getRequestByActivity, request, transmition } = useContext(AgendaContext);
  const [viewModal, setViewModal] = useState(false);
  const refActivity = `request/${eventContext.value?._id}/activities/${activityEdit}`;

  const [status, setStatus] = useState();

  useEffect(() => {
    if (!eventContext.value || !activityEdit) return;

    getRequestByActivity(refActivity);
  }, [eventContext.value, activityEdit]);

  useEffect(() => {
    let timerID = null;
    if (meeting_id) {
      obtenerStatusTransmision();
      async function obtenerStatusTransmision() {
        const live_stream_status = await getLiveStreamStatus(meeting_id);
        live_stream_status.state && setStatus(live_stream_status.state);
        timerID = setTimeout(obtenerStatusTransmision, 5000);
      }
    } else {
      timerID && clearTimeout(timerID);
    }
  }, [meeting_id]);
  return (
    <>
      <Card bordered style={{ borderRadius: '10px' }}>
        <Row gutter={[16, 16]} justify='space-between' align='middle'>
          <Col>
            <Space>
              <label className='label'>Estado de la transmisión para tus asistentes: </label>
              <Select
                value={roomStatus}
                onChange={(value) => {
                  setRoomStatus(value);
                }}
                style={{ width: '180px' }}>
                <Option value=''>Actividad creada</Option>
                <Option value='closed_meeting_room'>Iniciará pronto</Option>
                <Option value='open_meeting_room'>En vivo</Option>
                <Option value='ended_meeting_room'>Finalizada</Option>
              </Select>
            </Space>
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
            {console.log('status==>', status)}
            {status !== 'starting' && (
              <Button onClick={deleteRoom} danger>
                Eliminar transmisión
              </Button>
            )}
          </Col>
        </Row>
      </Card>
      <ModalListRequestsParticipate refActivity={refActivity} visible={viewModal} handleModal={setViewModal} />
    </>
  );
}
