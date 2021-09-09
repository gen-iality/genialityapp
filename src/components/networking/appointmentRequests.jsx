import { Avatar, Button, Card, Col, Divider, notification, Row, Spin } from 'antd';
import moment from 'moment';
import { find, map, pathOr, propEq, props } from 'ramda';
import { isNonEmptyArray } from 'ramda-adjunct';
import React, { useEffect, useState } from 'react';
//context
import { UseUserEvent } from '../../Context/eventUserContext';
import { UseEventContext } from '../../Context/eventContext';
import { UseCurrentUser } from '../../Context/userContext';

import { acceptOrRejectAgenda, getPendingAgendasFromEventUser, getPendingAgendasSent } from './services';
import { addNotification } from '../../helpers/netWorkingFunctions';

const { Meta } = Card;

const requestStatusText = {
  rejected: 'rechazada',
  accepted: 'aceptada'
};

function AppointmentRequests({ eventUsers, notificacion,showpendingsend }) {
  console.log("EVENT USERS==>",eventUsers)
  const [loading, setLoading] = useState(true);
  const [loading1, setLoading1] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [pendingAgendas, setPendingAgendas] = useState([]);
  const [pendingAgendasSent, setPendingAgendasSent] = useState([]);

  //contextos
  let userEventContext = UseUserEvent();
  let eventContext = UseEventContext();

  useEffect(() => {
    if(eventContext.value!=null && userEventContext.value!==null){
    if (eventContext.value._id && userEventContext.value._id) {
      setLoading(true);
      setPendingAgendas([]);

      getPendingAgendasFromEventUser(eventContext.value._id, userEventContext.value._id)
        .then((agendas) => {
          console.log("USER EVENT ID==>",userEventContext.value._id)
          console.log("AGENDAS==>",agendas)
        
          if (isNonEmptyArray(agendas) && isNonEmptyArray(eventUsers)) {
            const pendingAgendas = map((agenda) => {
              const ownerEventUser = find(propEq('_id', agenda.owner_id), eventUsers);
              return { ...agenda, ownerEventUser };
            }, agendas);

            setPendingAgendas(pendingAgendas);
            setLoading1(false)
          }
        })
        .catch((error) => {
          console.error(error);
          notification.error({
            message: 'Error',
            description: 'Obteniendo las citas pendientes'
          });
        })
        .finally(() => setLoading(false));
    }
  }
   
  }, [eventContext.value, userEventContext.value, eventUsers]);

  useEffect(() => {
    if(eventContext && userEventContext){
    if (eventContext.value?._id && userEventContext.value?._id) {
      setLoading1(true);
      //setPendingAgendasSent([]);

      getPendingAgendasSent(eventContext.value._id, userEventContext.value._id)
        .then((agendas) => {
          console.log("AGENDAS 2==>",agendas)
          if (isNonEmptyArray(agendas) && isNonEmptyArray(eventUsers)) {
            
            const pendingAgendas = map((agenda) => {
              const ownerEventUser = find(propEq('_id', agenda.attendees[0]), eventUsers);
              return { ...agenda, ownerEventUser };
            }, agendas);

            setPendingAgendasSent(pendingAgendas);
            setLoading(false)
          } 
        })
        .catch((error) => {
          console.error(error);
          notification.error({
            message: 'Error',
            description: 'Obteniendo las citas pendientes'
          });
        })
        .finally(() => setLoading1(false));
    }
  }
  }, [eventContext.value, userEventContext.value, eventUsers]);

  return (
    <>
      <div>     
        {!loading &&
          (pendingAgendas.length > 0 ? (
            pendingAgendas.map((pendingAgenda) => (
              <RequestCard
                notificacion={notificacion}
                key={`pending-${pendingAgenda.id}`}
                data={pendingAgenda}
                fetching={fetching}
                setFetching={setFetching}                
              />
            ))
          ) : (
            <Card style={{textAlign:'center'}}>{'No tienes solicitudes recibidas pendientes'}</Card>
          ))}

        {loading && (
          <Row align='middle' justify='center' style={{ height: 100 }}>
            <Spin />
          </Row>
        )}
      </div>
     

     { showpendingsend!==false && (
      <div >
        {!loading1 &&
          (pendingAgendasSent.length > 0 ? (
            pendingAgendasSent.map((pendingAgenda) => (
              <RequestCard
                notificacion={notificacion}
                key={`pending-${pendingAgenda.id}`}
                data={pendingAgenda}
                fetching={fetching}
                setFetching={setFetching}
                meSended={true}              
              />
            ))
          ) : (
            <Card style={{textAlign:'center'}}>{'No tienes solicitudes pendientes enviadas'}</Card>
          ))}

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

function RequestCard({ data, fetching, setFetching, meSended, notificacion }) {
  const [requestResponse, setRequestResponse] = useState(''); 
  const userName = data.name ;
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
            state: '1'
          };
         addNotification(notificationr,eventContext.value,userCurrentContext.value)
        })
        .catch((error) => {
          if (!error) {
            notification.error({
              message: 'Solicitud no encontrada',
              description: 'La solicitud no existe o no esta en estado pendiente'
            });
          } else if (error === 'HOURS_NOT_AVAILABLE') {
            notification.error({
              message: 'Horario agendado',
              description: 'Ya tienes agendada esta hora'
            });
          } else {
            // notification.error({
            //   message: 'Error',
            //   description: 'Error al actualizar la solicitud'
            // });

            let notificationr = {
              idReceive: userCurrentContext.value._id,
              idEmited: data && data.id,
              state: '1'
            };

            addNotification(notificationr,eventContext.value, userCurrentContext.value)
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
