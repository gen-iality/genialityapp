import { useState } from 'react';
import moment from 'moment';
import { Avatar, Button, Card, Col, Divider, Popconfirm, Row, Space, Typography, notification } from 'antd';
import Meta from 'antd/lib/card/Meta';
import { IMeeting } from '../../interfaces/Meetings.interfaces';
import { DispatchMessageService } from '@/context/MessageService';
import * as service from '../../services/meenting.service';
import { deleteRequestMeeting } from '../../services/landing.service';

interface AcceptedCardProps {
  data: IMeeting;
  eventId: string;
  eventUser: any;
  enableMeetings: any;
  setCurrentRoom: any;
}

const AcceptedCard = ({ data, eventId, eventUser, enableMeetings, setCurrentRoom }: AcceptedCardProps) => {
  const [loading, setLoading] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const userName = 'Reunion';
  const userImage = '';

  /** Entramos a la sala 1 a 1 de la reunión
   *
   */
  const accessMeetRoom = (data: IMeeting, eventUser: any) => {
    if (!eventUser) {
      alert('Tenemos problemas con tu usuario, itenta recargar la página');
      return;
    }
    let roomName = data.id;

    setCurrentRoom(roomName);
  };

  const deleteThisAgenda = async () => {
    if (!loading) {
      setLoading(true);
      const response = await service.deleteMeeting(eventId, data.id);

      if (response) {
        setDeleted(true);
        await deleteRequestMeeting(eventId, data.id_request_meetings ?? '');
      }

      DispatchMessageService({
        type: response ? 'success' : 'warning',
        msj: response ? '¡Información guardada correctamente!' : 'No ha sido posible eliminar el campo',
        action: 'show',
      });
      setLoading(false);
    }
  };

  const validDateRoom = (room: any) => {
    let dateFrom = moment(room.startTimestap).format('YYYY-MM-DD');
    if (moment().format('YYYY-MM-DD') == dateFrom) {
      return true;
    }
    return false;
  };

  return (
    <Row justify='center' style={{ marginBottom: '20px' }}>
      <Card
        headStyle={{ border: 'none' }}
        style={{ width: 600, textAlign: 'left', borderRadius: '10px' }}
        bodyStyle={{ paddingTop: '0px' }}
        bordered={true}
        extra={
          <Popconfirm
            title='¿Desea cancelar/eliminar esta cita?'
            onConfirm={deleteThisAgenda}
            okText='Si'
            cancelText='No'
            onCancel={() => setLoading(false)}>
            <Button type='text' danger disabled={loading} loading={loading}>
              {'Cancelar Cita'}
            </Button>
          </Popconfirm>
        }
        title={
          <Space wrap>
            {/* <div style={{ textTransform: 'capitalize' }}>{moment(data.timestamp_start).format('MMMM DD')}</div> */}
            <Typography.Text style={{ fontSize: '12px' }} type='secondary'>
              {moment(data.start).format('hh:mm a')}
            </Typography.Text>
            <Typography.Text style={{ fontSize: '12px' }} type='secondary'>
              {moment(data.end).format('hh:mm a')}
            </Typography.Text>
          </Space>
        }>
        {/* <div style={{ marginBottom: '10px' }}>{'Cita con: '}</div> */}
        <Meta
          avatar={
            userImage ? (
              <Avatar size={50} src={userImage}></Avatar>
            ) : (
              <Avatar size={50}>{userName ? userName.charAt(0).toUpperCase() : userName}</Avatar>
            )
          }
          title={<Typography.Title level={5}>{userName || 'No registra nombre'}</Typography.Title>}
          description={
            <Typography.Paragraph style={{ marginTop: '-15px' }}>
              <Typography.Text type='secondary' style={{ paddingRight: '20px' }}>
                Integrantes
              </Typography.Text>

              {data.participants.map((participant) => (
                <Typography.Paragraph type='secondary'>{participant.name}</Typography.Paragraph>
              ))}
            </Typography.Paragraph>
          }
        />
        {!deleted ? (
          <Row justify='center'>
            <Col xs={24} sm={24} md={12} xl={12}>
              <Button
                block
                type='primary'
                disabled={loading || (!enableMeetings && !validDateRoom(data))}
                loading={loading}
                onClick={() => {
                  accessMeetRoom(data, eventUser);
                }}>
                {validDateRoom(data) && !enableMeetings
                  ? 'Ingresar a reunión'
                  : !validDateRoom(data) && !enableMeetings
                  ? 'Reunión no iniciada'
                  : 'Reunión Cerrada'}
              </Button>
            </Col>
          </Row>
        ) : (
          <Row>{`Cita cancelada.`}</Row>
        )}
      </Card>
    </Row>
  );
};

export default AcceptedCard;
