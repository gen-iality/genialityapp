import { Avatar, Button, Card, Col, Divider, notification, Result, Row, Spin, Typography } from 'antd';
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
      {pendingAgendas.length > 0 && <Divider><Typography.Text strong>Solicitudes de citas recibidas</Typography.Text></Divider>}
      {loading && (
        <Row justify='center' align='middle'>
          <Col>
            <Spin size='large' tip={<Typography.Text strong>Cargando...</Typography.Text>}/>
          </Col>
        </Row>
      )}
      <Row justify='center' gutter={[8, 8]}>
        {!loading &&
          (pendingAgendas.length > 0 ? (
            pendingAgendas.map((pendingAgenda) => (
              <Col xs={24} sm={22} md={18} lg={18} xl={18} xxl={10}>
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
            <Col >
              <Result 
                /* style={{padding: 0}} */
                title={'¡No tienes solicitudes recibidas pendientes!'}
              />
            </Col>
          ))}
      </Row>
      
      {pendingAgendasSent.length > 0 && <Divider><Typography.Text strong>Solicitudes de citas enviadas</Typography.Text></Divider>}
      {loading1 && (
        <Row justify='center' align='middle'>
          <Col>
            <Spin size='large' tip={<Typography.Text strong>Cargando...</Typography.Text>}/>
          </Col>
        </Row>
      )}
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
                <Col >
                  <Result 
                    /* style={{padding: 0}} */
                    title={'¡No tienes solicitudes pendientes enviadas!'}
                  />
                </Col>
              ))}
          </Row>

          
        </div>
      )}
    </>
  );
}

export default AppointmentRequests;
