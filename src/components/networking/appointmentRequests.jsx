import { Avatar, Button, Card, Col, Divider, notification, Row, Spin } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
//context
import { UseUserEvent } from '../../context/eventUserContext';
import { UseEventContext } from '../../context/eventContext';
import { UseCurrentUser } from '../../context/userContext';

import { acceptOrRejectAgenda, } from './services';
import { addNotification } from '../../helpers/netWorkingFunctions';
import { RequestMeetingState } from './utils/utils';
import RequestCardTs from './components/Landing/RequestCard';
import { getMeetingRequest, listenMeetingsRequest } from './services/landing.service';

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

  useEffect(async() => {
   const unSuscribeListenMeetingsRequest =  listenMeetingsRequest(eventContext.value._id,userEventContext.value._id,setPendingAgendas)
   const requestSend = await getMeetingRequest('user_from.id',eventContext.value._id,userEventContext.value._id,[RequestMeetingState.pending,RequestMeetingState.rejected,RequestMeetingState.confirmed])
   setPendingAgendasSent(requestSend.sort((a, b) =>  b.timestamp - a.timestamp))

   setLoading(false);
   setLoading1(false);
    return () => {
      unSuscribeListenMeetingsRequest()
    }
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

export default AppointmentRequests;
