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
import { useIntl } from 'react-intl';

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
  const intl = useIntl();

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
      {/* {pendingAgendas.length > 0 &&  */}<Divider><Typography.Text strong>{intl.formatMessage({id: 'networking_appointment_requests_received', defaultMessage: 'Solicitudes de citas recibidas'})}</Typography.Text></Divider>
      {loading && (
        <Row justify='center' align='middle'>
          <Col>
            <Spin size='large' tip={<Typography.Text strong>{intl.formatMessage({id: 'loading', defaultMessage: 'Cargando...'})}</Typography.Text>}/>
          </Col>
        </Row>
      )}
        {!loading &&
          (pendingAgendas.length > 0 ? (
            <Row gutter={[8, 8]}>
              {pendingAgendas.map((pendingAgenda) => (
                <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={8}>
                  <RequestCardTs
                    setSendRespuesta={setSendRespuesta}
                    notificacion={notificacion}
                    key={`pending-${pendingAgenda.id}`}
                    data={pendingAgenda}
                    received={true}
                  />
                </Col>
              ))}
            </Row>
          ) : (
            <Row justify='center' align='middle'>
              <Col >
                <Result
                  title={intl.formatMessage({id: 'networking_no_pending_received_request', defaultMessage: '¡No tienes solicitudes recibidas pendientes!'})}
                />
              </Col>
            </Row>
          ))}
      
      
      {/* {pendingAgendasSent.length > 0 &&  */}<Divider><Typography.Text strong>{intl.formatMessage({id: 'networking_appointment_requests_sent', defaultMessage: 'Solicitudes de citas enviadas'})}</Typography.Text></Divider>
      {loading1 && (
        <Row justify='center' align='middle'>
          <Col>
            <Spin size='large' tip={<Typography.Text strong>{intl.formatMessage({id: 'loading', defaultMessage: 'Cargando...'})}</Typography.Text>}/>
          </Col>
        </Row>
      )}
      {showpendingsend !== false && (
        !loading1 &&
          (pendingAgendasSent.length > 0 ? (
            <Row gutter={[8, 8]}>
              {pendingAgendasSent.map((pendingAgenda) => (
                <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={8}>
                  <RequestCardTs
                    notificacion={notificacion}
                    key={`pending-${pendingAgenda.id}`}
                    data={pendingAgenda}
                    fetching={fetching}
                    setFetching={setFetching}
                    received={false}
                  />
                </Col>
              ))}
            </Row>
          ) : (
            <Row justify='center' align='middle'>
              <Col>
                <Result 
                  title={intl.formatMessage({id: 'networking_no_pending_requests_sent', defaultMessage: '¡No tienes solicitudes pendientes enviadas!'})}
                />
              </Col>
            </Row>
          ))
      )}
    </>
  );
}

export default AppointmentRequests;
