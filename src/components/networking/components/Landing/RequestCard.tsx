import { Avatar, Button, Card, Col, Row, notification } from 'antd';
import { useState } from 'react';
//context
import { UseUserEvent } from '../../../../context/eventUserContext';
import { UseEventContext } from '../../../../context/eventContext';
import { UseCurrentUser } from '../../../..//context/userContext';

import { acceptOrRejectAgenda } from '../.././services';
import { addNotification } from '../../../../helpers/netWorkingFunctions';
import React from 'react';
import { IRequestCard } from '../../interfaces/Landing.interfaces';
import moment from 'moment';
import { RequestMeetingState } from '../../utils/utils';
const { Meta } = Card;

export default function RequestCardTs({
  data,
  notificacion,
  setFetching,
  setSendRespuesta,
  received,
}: IRequestCard) {

const statusRequestText = {
    [RequestMeetingState.confirmed] : 'confirmada',
    [RequestMeetingState.pending] : 'pendiente',
    [RequestMeetingState.rejected] : 'rechazada',
}
  const [loader, setloader] = useState(false)
  const [requestResponse, setRequestResponse] = useState<string>(RequestMeetingState.pending);
  const userName = received ?  data.user_from.name  : data.user_to.name 
  const userEmail = received ?  data.user_from.email : data.user_to.email 
  //contextos
  let userEventContext = UseUserEvent();
  let eventContext = UseEventContext();
  let userCurrentContext = UseCurrentUser();

  const changeAgendaStatus = (newStatus: string) => {
    //setloader(true)
    let notificationr = {
        idReceive: userCurrentContext.value._id,
        idEmited:  data.id,
        state: '1',
      };

      addNotification(notificationr, eventContext.value, userCurrentContext.value);
      setloader(false)
      /*    if (!fetching) {
      setFetching(true);
      acceptOrRejectAgenda(eventContext.value._id, userEventContext.value._id, data, newStatus)
        .then(() => {
          setRequestResponse(newStatus);
          let notificationr = {
            idReceive: userCurrentContext.value._id,
            idEmited: data && data.id,
            state: '1',
          };
          addNotification(notificationr, eventContext.value, userCurrentContext.value);
          setSendRespuesta(true);
          setFetching(false);
        })
        .catch((error: any) => {
          if (!error) {
            notification.error({
              message: 'Solicitud no encontrada',
              description: 'La solicitud no existe o no esta en estado pendiente',
            });
          } else if (error === 'HOURS_NOT_AVAILABLE') {
            notification.error({
              message: 'Horario agendado',
              description: 'Ya tienes agendada esta hora',
            });
          } else {
            let notificationr = {
              idReceive: userCurrentContext.value._id,
              idEmited: data && data.id,
              state: '1',
            };

            addNotification(notificationr, eventContext.value, userCurrentContext.value);
          }
        })
        .finally(() => setFetching(false));
    } */
  };

  return (
    <Row justify='center' style={{ marginBottom: '20px' }}>
      <Card style={{ width: 600, textAlign: 'left' }} bordered={true}>
        <div style={{ marginBottom: '10px' }}>{received ? 'Solicitud de cita por: ' : 'Solicitud de cita a: '}</div>
        <Meta
          avatar={<Avatar>{`${userName}`.charAt(0).toUpperCase() }</Avatar>}
          title={  userName || 'No registra nombre'}
          description={
            <div>
              <Row>
                <Col xs={24} sm={24} md={24} lg={16} xl={16} xxl={16}>
                  <p>{ userEmail || 'No registra correo'}</p>
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
              {requestResponse ? (
                received && (
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
                )
              ) : (
                <Row>{`Solicitud ${statusRequestText[requestResponse]}.`}</Row>
              )}
            </div>
          }
        />
      </Card>
    </Row>
  );
}
