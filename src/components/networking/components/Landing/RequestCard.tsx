import { Avatar, Button, Card, Col, Row, notification, Modal } from 'antd';
import { useState } from 'react';
import * as services from '../../services/landing.service';
import * as servicesMeenting from '../../services/meenting.service';
//context
import { UseUserEvent } from '../../../../context/eventUserContext';
import { UseEventContext } from '../../../../context/eventContext';
import { UseCurrentUser } from '../../../..//context/userContext';
import { addNotification } from '../../../../helpers/netWorkingFunctions';
import React from 'react';
import { IRequestCard } from '../../interfaces/Landing.interfaces';
import moment from 'moment';
import { RequestMeetingState } from '../../utils/utils';
import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
const { Meta } = Card;
const { confirm } = Modal

export default function RequestCardTs({ data, setSendRespuesta, received }: IRequestCard) {
  const statusRequestText = {
    [RequestMeetingState.confirmed]: 'confirmada',
    [RequestMeetingState.pending]: 'pendiente',
    [RequestMeetingState.rejected]: 'rechazada',
  };
  const [loader, setloader] = useState(false);
  const [className, setClassName] = useState<string>('');
  const userName = received ? data.user_from.name : data.user_to.name;
  const userEmail = received ? data.user_from.email : data.user_to.email;
  //contextos
  let userEventContext = UseUserEvent();
  let eventContext = UseEventContext();
  let userCurrentContext = UseCurrentUser();
  const eventId = eventContext.value._id;

  const acceptRequest = async () => {
    const response = await servicesMeenting.createMeeting(eventId, data.meeting);
    if (response) {
      await services.updateRequestMeeting(eventId, data.id, { ...data, status: RequestMeetingState.confirmed });
      const resSpaceAgended = await services.createSpacesAgendedMeetings(eventId,data.meeting.start, data.meeting.end, data.user_to.id)
      console.log('resSpaceAgended',resSpaceAgended)
      notificationUser();
      setClassName('animate__animated animate__backOutRight animate__slow');
      notification.success({
        message: 'Se agendó la reunión correctamente',
        icon: <CheckCircleOutlined />,
      });
    } else {
      notification.warning({
        message: 'No se logró agendar la reunión ',
        icon: <ExclamationCircleOutlined />,
      });
    }
  };
  const rejectRequest = async () => {
    const response = await services.updateRequestMeeting(eventId, data.id, {
      ...data,
      status: RequestMeetingState.rejected,
    });
    if (response) {
      setClassName('animate__animated animate__backOutLeft animate__slow');
      notificationUser();
    } else {
      notification.warning({
        icon: <ExclamationCircleOutlined />,
        message : 'Algo salio mal!',
        description: 'No se logró rechazar la reunión, comuníquese con el administrador'
      });
    }

    setloader(false);
  };
  const notificationUser = () => {
    let notificationr = {
      idReceive: userCurrentContext.value._id,
      idEmited: data.id,
      state: '1',
    };
    addNotification(notificationr, eventContext.value, userCurrentContext.value);
    setloader(false);
    setSendRespuesta((status)=> !status);
  };

  const changeAgendaStatus = async (newStatus: string) => {
    setloader(true);
    if (newStatus === RequestMeetingState.confirmed) {
      await acceptRequest()
      setloader(false);
    } else {
      confirm({
        title: `¿Estás seguro de que deseas rechazar la reunión?`,
        icon: <ExclamationCircleOutlined />,
        content: 'Una vez Rechazado, no lo podrá volver a aceptar',
        okText: 'Rechazar',
        okType: 'danger',
        cancelText: 'Cancelar',
        onOk() {
          rejectRequest()
        },
        onCancel() {
          setloader(false);
        }
      });
    }
  };

  return (
    <Row justify='center' style={{ marginBottom: '20px' }} className={className}>
      <Card style={{ width: 600, textAlign: 'left' }} bordered={true}>
        <div style={{ marginBottom: '10px' }}>{received ? 'Solicitud de cita por: ' : 'Solicitud de cita a: '}</div>
        <Meta
          avatar={<Avatar>{`${userName}`.charAt(0).toUpperCase()}</Avatar>}
          title={userName || 'No registra nombre'}
          description={
            <div>
              <Row>
                <Col xs={24} sm={24} md={24} lg={16} xl={16} xxl={16}>
                  <p>{userEmail || 'No registra correo'}</p>
                  <p style={{ paddingRight: '20px' }}>
                    {'Mensaje: '}
                    {data.message || 'sin mensaje'}
                  </p>
                </Col>
                <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
                  <div style={{ textTransform: 'capitalize' }}>{moment(data.date).format('DD/MM/YYYY')}</div>
                  <div>{moment(data.date).format('hh:mm a')}</div>
                </Col>
              </Row>
              {
                received ? (
                  <Row>
                    <Button
                      style={{ marginRight: '10px' }}
                      disabled={loader}
                      loading={loader}
                      onClick={() => changeAgendaStatus(RequestMeetingState.rejected)}>
                      {'Rechazar'}
                    </Button>
                    <Button
                      type='primary'
                      disabled={loader}
                      loading={loader}
                      onClick={() => changeAgendaStatus(RequestMeetingState.confirmed)}>
                      {'Aceptar'}
                    </Button>
                  </Row>
                ) : (<Row>{`Solicitud ${statusRequestText[data.status]}.`}</Row>)
            }
            </div>
          }
        />
      </Card>
    </Row>
  );
}
