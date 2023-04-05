import { Avatar, Button, Card, Col, Divider, notification, Row, Spin } from 'antd';
import moment from 'moment';
import { find, map, pathOr, propEq, props } from 'ramda';
import { isNonEmptyArray } from 'ramda-adjunct';
import { useEffect, useState } from 'react';
//context
import { UseUserEvent } from '../../context/eventUserContext';
import { UseEventContext } from '../../context/eventContext';
import { UseCurrentUser } from '../../context/userContext';

import { acceptOrRejectAgenda, } from './services';
import { addNotification } from '../../helpers/netWorkingFunctions';
import { RequestMeetingState } from './utils/utils';
import RequestCardTs from './components/Landing/RequestCard';
import { getMeetingRequest } from './services/landing.service';

const { Meta } = Card;

const requestStatusText = {
  rejected: 'rechazada',
  accepted: 'aceptada',
};

function AppointmentRequests({ eventUsers, notificacion, showpendingsend }) {
  const [loading, setLoading] = useState(true);
  const [loading1, setLoading1] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [pendingAgendas, setPendingAgendas] = useState([]);
  const [pendingAgendasSent, setPendingAgendasSent] = useState([]);
  const [sendRespuesta, setSendRespuesta] = useState(false);

  //contextos
  let userEventContext = UseUserEvent();
  let eventContext = UseEventContext();

  useEffect(async () => {
   const request = await getMeetingRequest('user_to.id',eventContext.value._id,userEventContext.value._id,[RequestMeetingState.pending])
   const requestSend = await getMeetingRequest('user_from.id',eventContext.value._id,userEventContext.value._id,[RequestMeetingState.pending,RequestMeetingState.rejected])
   console.log('veamos esto',request)
   setPendingAgendas(request)
   setPendingAgendasSent(requestSend)

   setLoading(false);
   setLoading1(false);

  }, [eventContext.value, userEventContext.value, eventUsers, sendRespuesta]);

 
  return (
    <>
      <Divider>Solicitudes de citas recibidas</Divider>
      <div style={{ marginBottom: 15 }}>
        <Row justify='center'>
          {!loading &&
            (pendingAgendas.length > 0 ? (
              pendingAgendas.map((pendingAgenda) => (
                <Col xxl={10}>
                  <RequestCardTs
                    setSendRespuesta={setSendRespuesta}
                    notificacion={notificacion}
                    key={`pending-${pendingAgenda.id}`}
                    data={pendingAgenda}
                    received={true}
                  />
                </Col>
              ))
            ) : (
              <Col xs={24} sm={22} md={18} lg={18} xl={18} style={{ margin: '0 auto' }}>
                <Card style={{ textAlign: 'center' }}>{'No tienes solicitudes recibidas pendientes'}</Card>
              </Col>
            ))}
        </Row>
        {loading && (
          <Row align='middle' justify='center' style={{ height: 100 }}>
            <Spin />
          </Row>
        )}
      </div>
      <Divider>Solicitudes de citas enviadas</Divider>
      {showpendingsend !== false && (
        <div>
          <Row justify='center'>
            {!loading1 &&
              (pendingAgendasSent.length > 0 ? (
                pendingAgendasSent.map((pendingAgenda) => (
                  <Col xxl={10}>
                    <RequestCardTs
                      notificacion={notificacion}
                      key={`pending-${pendingAgenda.id}`}
                      data={pendingAgenda}
                      fetching={fetching}
                      setFetching={setFetching}
                      received={false}
                    />
                  </Col>
                ))
              ) : (
                <Col xs={24} sm={22} md={18} lg={18} xl={18} style={{ margin: '0 auto' }}>
                  <Card style={{ textAlign: 'center' }}>{'No tienes solicitudes pendientes enviadas'}</Card>
                </Col>
              ))}
          </Row>

          {loading1 && (
            <Row align='middle' justify='center' style={{ height: 100 }}>
              <Spin />
            </Row>
          )}
        </div>
      )}
    </>
  );
}

function RequestCard({ data, fetching, setFetching, meSended, notificacion, setSendRespuesta }) {
  const [requestResponse, setRequestResponse] = useState('');
  const userName = data.name;
  const userEmail = data.email;
  //contextos
  let userEventContext = UseUserEvent();
  let eventContext = UseEventContext();
  let userCurrentContext = UseCurrentUser();

  const changeAgendaStatus = (newStatus) => {
    if (!fetching) {
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
        .catch((error) => {
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
    }
  };

  return (
    <Row justify='center' style={{ marginBottom: '20px' }}>
      <Card style={{ width: 600, textAlign: 'left' }} bordered={true}>
        <div style={{ marginBottom: '10px' }}>{meSended ? 'Solicitud de cita a: ' : 'Solicitud de cita por: '}</div>
        <Meta
          avatar={<Avatar>{data.name ? data.name.charAt(0).toUpperCase() : '-'}</Avatar>}
          title={meSended ? data.name || userName || 'No registra nombre' : data.name_requesting || '-'}
          description={
            <div>
              <Row>
                <Col xs={24} sm={24} md={24} lg={16} xl={16} xxl={16}>
                  <p>{meSended ? data.email || userEmail || 'No registra correo' : data.email_requesting || '-'}</p>
                  {!!data.message && (
                    <p style={{ paddingRight: '20px' }}>
                      {'Mensaje: '}
                      {data.message}
                    </p>
                  )}
                </Col>
                <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
                  <div style={{ textTransform: 'capitalize' }}>{moment(data.timestamp_start).format('MMMM DD')}</div>
                  <div>{moment(data.timestamp_start).format('hh:mm a')}</div>
                  <div>{moment(data.timestamp_end).format('hh:mm a')}</div>
                </Col>
              </Row>
              {!requestResponse ? (
                !meSended && (
                  <Row>
                    <Button
                      style={{ marginRight: '10px' }}
                      disabled={fetching}
                      loading={fetching}
                      onClick={() => changeAgendaStatus('rejected')}>
                      {'Rechazar'}
                    </Button>
                    <Button
                      type='primary'
                      disabled={fetching}
                      loading={fetching}
                      onClick={() => changeAgendaStatus('accepted')}>
                      {'Aceptar'}
                    </Button>
                  </Row>
                )
              ) : (
                <Row>{`Solicitud ${requestStatusText[requestResponse]}.`}</Row>
              )}
            </div>
          }
        />
      </Card>
    </Row>
  );
}

export default AppointmentRequests;
