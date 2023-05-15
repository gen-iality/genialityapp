import { useState } from 'react';
import moment from 'moment';
import { Avatar, Button, Card, Col, Divider, Popconfirm, Row, Space, Typography, notification } from 'antd';
import Meta from 'antd/lib/card/Meta';
import { IMeeting } from '../../interfaces/Meetings.interfaces';
import { DispatchMessageService } from '@/context/MessageService';
import * as service from '../../services/meenting.service';
import { deleteRequestMeeting } from '../../services/landing.service';
import { useIntl } from 'react-intl';

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
  const intl = useIntl();
  const userName = intl.formatMessage({id: 'networking_meeting', defaultMessage: 'Reunión'});
  const userImage = '';

  /** Entramos a la sala 1 a 1 de la reunión
   *
   */
  const accessMeetRoom = (data: IMeeting, eventUser: any) => {
    if (!eventUser) {
      alert(intl.formatMessage({id: 'networking_problems_user_refresh_page', defaultMessage: 'Tenemos problemas con tu usuario, itenta recargar la página'}));
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
        msj: response ? intl.formatMessage({id: 'information_saved_successfully', defaultMessage: '¡Información guardada correctamente!'}) : intl.formatMessage({id: 'could_not_delete_field', defaultMessage: 'No ha sido posible eliminar el campo'}),
        action: 'show',
      });
      setLoading(false);
    }
  };

  const validDateRoom = (room: IMeeting) => {
   const start = moment(room.start)
   const end = moment(room.end)
   if(start.isSameOrBefore(moment()) &&  end.isSameOrAfter(moment())){
    return true
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
            title={intl.formatMessage({id: 'do_you_want_to_cancel_or_delete_appointment', defaultMessage: '¿Desea cancelar/eliminar esta cita?'})}
            onConfirm={deleteThisAgenda}
            okText={intl.formatMessage({id: 'yes', defaultMessage: 'Sí'})}
            cancelText={intl.formatMessage({id: 'no', defaultMessage: 'No'})}
            onCancel={() => setLoading(false)}>
            <Button type='text' danger disabled={loading} loading={loading}>
              {intl.formatMessage({id: 'networking_cancel_appointment', defaultMessage: 'Cancelar cita'})}
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
                {intl.formatMessage({id: 'members', defaultMessage: 'Integrantes'})}
              </Typography.Text>

              {data.participants.map((participant) => (
                <Typography.Paragraph key={`name-${participant.id}`} type='secondary'>{participant.name}</Typography.Paragraph>
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
                  ? intl.formatMessage({id: 'networking_enter_meetings', defaultMessage: 'Ingresar a reunión'})
                  : !validDateRoom(data) && !enableMeetings
                  ? intl.formatMessage({id: 'networking_meeting_not_started', defaultMessage: 'Reunión no iniciada'})
                  : intl.formatMessage({id: 'networking_closed_meeting', defaultMessage: 'Reunión Cerrada'})}
              </Button>
            </Col>
          </Row>
        ) : (
          <Row>{intl.formatMessage({id: 'networking_appointment_cancelled', defaultMessage: 'Cita cancelada.'})}</Row>
        )}
      </Card>
    </Row>
  );
};

export default AcceptedCard;
