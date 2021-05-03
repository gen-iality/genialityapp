import { Avatar, Button, Card, Col, Divider, notification, Row, Spin } from 'antd';
import moment from 'moment';
import { find, map, pathOr, propEq, props } from 'ramda';
import { isNonEmptyArray } from 'ramda-adjunct';
import React, { useEffect, useState } from 'react';

import { acceptOrRejectAgenda, getPendingAgendasFromEventUser, getPendingAgendasSent } from './services';

const { Meta } = Card;

const requestStatusText = {
  rejected: 'rechazada',
  accepted: 'aceptada',
};

function AppointmentRequests({ eventId, currentEventUserId, eventUsers, notificacion, currentUser }) {
  const [loading, setLoading] = useState(true);
  const [loading1, setLoading1] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [pendingAgendas, setPendingAgendas] = useState([]);
  const [pendingAgendasSent, setPendingAgendasSent] = useState([]);

  useEffect(() => {
    console.log('Mi agenda appointment');
  }, []);

  useEffect(() => {
    if (eventId && currentEventUserId) {
      setLoading(true);
      setPendingAgendas([]);

      getPendingAgendasFromEventUser(eventId, currentEventUserId)
        .then((agendas) => {
          console.log('pendingAgendas', agendas);
          if (isNonEmptyArray(agendas) && isNonEmptyArray(eventUsers)) {
            const pendingAgendas = map((agenda) => {
              const ownerEventUser = find(propEq('_id', agenda.owner_id), eventUsers);
              return { ...agenda, ownerEventUser };
            }, agendas);

            setPendingAgendas(pendingAgendas);
          }
        })
        .catch((error) => {
          console.error(error);
          notification.error({
            message: 'Error',
            description: 'Obteniendo las citas pendientes',
          });
        })
        .finally(() => setLoading(false));
    }
  }, [eventId, currentEventUserId, eventUsers]);

  useEffect(() => {
    if (eventId && currentEventUserId) {
      setLoading1(true);
      setPendingAgendasSent([]);

      getPendingAgendasSent(eventId, currentEventUserId)
        .then((agendas) => {
          console.log('AGENDAS--', eventId, currentEventUserId, agendas, eventUsers);
          if (isNonEmptyArray(agendas) && isNonEmptyArray(eventUsers)) {
            const pendingAgendas = map((agenda) => {
              const ownerEventUser = find(propEq('_id', agenda.attendees[1]), eventUsers);
              return { ...agenda, ownerEventUser };
            }, agendas);

            setPendingAgendasSent(pendingAgendas);
            console.log(pendingAgendas);
          }
        })
        .catch((error) => {
          console.error(error);
          notification.error({
            message: 'Error',
            description: 'Obteniendo las citas pendientes',
          });
        })
        .finally(() => setLoading1(false));
    }
  }, [eventId, currentEventUserId, eventUsers]);

  return (
    <>
      <div>
        <Divider>{'Solicitudes de citas recibidas pendientes'}</Divider>

        {!loading &&
          (pendingAgendas.length > 0 ? (
            pendingAgendas.map((pendingAgenda) => (
              <RequestCard
                notificacion={notificacion}
                currentUser={currentUser}
                key={`pending-${pendingAgenda.id}`}
                eventId={eventId}
                currentEventUserId={currentEventUserId}
                data={pendingAgenda}
                fetching={fetching}
                setFetching={setFetching}
              />
            ))
          ) : (
            <Card>{'No tienes solicitudes actualmente'}</Card>
          ))}

        {loading && (
          <Row align='middle' justify='center' style={{ height: 100 }}>
            <Spin />
          </Row>
        )}
      </div>

      <div>
        <Divider>{'Solicitudes de citas pendientes enviadas'}</Divider>

        {!loading1 &&
          (pendingAgendasSent.length > 0 ? (
            pendingAgendasSent.map((pendingAgenda) => (
              <RequestCard
                notificacion={notificacion}
                key={`pending-${pendingAgenda.id}`}
                eventId={eventId}
                currentEventUserId={currentEventUserId}
                data={pendingAgenda}
                fetching={fetching}
                setFetching={setFetching}
                meSended={true}
              />
            ))
          ) : (
            <Card>{'No tienes solicitudes actualmente'}</Card>
          ))}

        {loading1 && (
          <Row align='middle' justify='center' style={{ height: 100 }}>
            <Spin />
          </Row>
        )}
      </div>
    </>
  );
}

function RequestCard({
  data,
  eventId,
  currentEventUserId,
  fetching,
  setFetching,
  meSended,
  notificacion,
  currentUser,
}) {
  const [requestResponse, setRequestResponse] = useState('');
  const { ownerEventUser } = data;
  const userName = pathOr('', ['properties', 'names'], ownerEventUser);
  const userEmail = pathOr('', ['properties', 'email'], ownerEventUser);

  const changeAgendaStatus = (newStatus) => {
    if (!fetching) {
      setFetching(true);
      acceptOrRejectAgenda(eventId, currentEventUserId, data, newStatus)
        .then(() => {
          setRequestResponse(newStatus);
          let notificationr = {
            idReceive: currentUser._id,
            idEmited: data && data.id,
            state: '1',
          };
          console.log(notificationr);
          notification(notificationr, props.currentUser._id);
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
            // notification.error({
            //   message: 'Error',
            //   description: 'Error al actualizar la solicitud'
            // });

            let notificationr = {
              idReceive: currentUser._id,
              idEmited: data && data.id,
              state: '1',
            };
            console.log(notificationr);
            notificacion(notificationr, currentUser._id);
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
                <Col xs={18}>
                  <p>{meSended ? data.email || userEmail || 'No registra correo' : data.email_requesting || '-'}</p>
                  {!!data.message && (
                    <p style={{ paddingRight: '20px' }}>
                      {'Mensaje: '}
                      {data.message}
                    </p>
                  )}
                </Col>
                <Col xs={6}>
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
