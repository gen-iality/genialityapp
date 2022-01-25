import { Button, Col, message, Modal, Row, Spin } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HelperContext from '../../../Context/HelperContext';
import { useIntl } from 'react-intl';
import {
  ArrowLeftOutlined,
  CaretRightOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import WithEviusContext from '../../../Context/withContext';
import EnVivo from '../../../EnVivo.svg';
import Moment from 'moment-timezone';
import { UseEventContext } from 'Context/eventContext';
import HumanGreetingIcon from '@2fd/ant-design-icons/lib/HumanGreeting';
import CancelIcon from '@2fd/ant-design-icons/lib/Cancel';
import AgendaContext from 'Context/AgendaContext';
import { CurrentEventUserContext } from 'Context/eventUserContext';

const HeaderColumns = (props) => {
  let { currentActivity } = useContext(HelperContext);
  let cEvent = UseEventContext();
  let cEventUSer = useContext(CurrentEventUserContext);
  let [loading, setLoading] = useState(false);
  let {
    request,
    transmition,
    getRequestByActivity,
    addRequest,
    setRefActivity,
    refActivity,
    removeRequest,
    setActivityEdit,
  } = useContext(AgendaContext);

  function showPropsConfirm() {
    Modal.confirm({
      centered: true,
      title: 'Seguro que desea cambiar a la transmisión en vivo',
      icon: <ExclamationCircleOutlined />,
      content: '',
      okText: 'Aceptar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk() {
        setLoading(true);
        removeRequestTransmision();
        async function removeRequestTransmision() {
          await removeRequest(refActivity, cEventUSer.value?._id);
          setLoading(false);
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  //SE EJECUTA CUANDO TIENE UNA ACTIVIDAD PARA ESTABLECER LA REFERENCIA Y OBTENER LOS REQUEST
  useEffect(() => {
    if (currentActivity) {
      //SE SETEA EL CURRENTACTIVITY PARA DETECTAR SI LA TRANSMISION ES POR EVIUSMEET U OTRO
      setActivityEdit(currentActivity._id);
    }
    if (!currentActivity || transmition !== 'EviusMeet') return;
    const refActivity = `request/${cEvent.value?._id}/activities/${currentActivity?._id}`;
    setRefActivity(refActivity);
    getRequestByActivity(refActivity);
    return () => {
      setActivityEdit(null);
    };
  }, [currentActivity, transmition]);

  const haveRequest = () => {
    if ((request && !request[cEventUSer.value?._id]) || !request) {
      return false;
    }
    return true;
  };

  const sendOrCancelRequest = async () => {
    setLoading(true);
    if (!haveRequest() && cEventUSer.value?._id) {
      await addRequest(refActivity + '/' + cEventUSer.value?._id, {
        id: cEventUSer.value?._id,
        name: cEventUSer.value?.user?.names,
        date: new Date().getTime(),
      });
    } else if (haveRequest() && cEventUSer.value?._id) {
      //REMOVER O CANCELAR REQUEST
      await removeRequest(refActivity, cEventUSer.value?._id);
    } else {
      message.error('Error al enviar solicitud');
    }
    setLoading(false);
  };

  const intl = useIntl();
  return (
    <Row align='middle'>
      <Col
        xs={{ order: 2, span: 8 }}
        sm={{ order: 2, span: 8 }}
        md={{ order: 1, span: 4 }}
        lg={{ order: 1, span: 4 }}
        xl={{ order: 1, span: 4 }}
        style={{ padding: '4px' }}>
        <Link
          to={
            cEvent && !cEvent?.isByname
              ? `/landing/${props.cEvent.value._id}/agenda`
              : `/event/${cEvent?.nameEvent}/agenda`
          }>
          <Row style={{ paddingLeft: '10px' }}>
            <Button type='primary' shape='round' icon={<ArrowLeftOutlined />} size='small'>
              {intl.formatMessage({ id: 'button.back.agenda' })}
            </Button>
          </Row>
        </Link>
      </Col>

      <Col
        xs={{ order: 2, span: 4 }}
        sm={{ order: 2, span: 4 }}
        md={{ order: 1, span: 2 }}
        lg={{ order: 1, span: 2 }}
        xl={{ order: 1, span: 2 }}
        style={{ padding: '4px' }}>
        <Row style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Col>
            {props.activityState === 'open_meeting_room' || props.activityState === 'game' ? (
              <img style={{ height: '4vh', width: '4vh' }} src={EnVivo} alt='React Logo' />
            ) : props.activityState === 'ended_meeting_room' && currentActivity !== null && currentActivity.video ? (
              <CaretRightOutlined style={{ fontSize: '30px' }} />
            ) : props.activityState === 'ended_meeting_room' && currentActivity !== null ? (
              <CheckCircleOutlined style={{ fontSize: '30px' }} />
            ) : props.activityState === '' || props.activityState == null ? (
              <ClockCircleOutlined style={{ fontSize: '30px' }} />
            ) : props.activityState === 'closed_meeting_room' ? (
              <LoadingOutlined style={{ fontSize: '30px' }} />
            ) : (
              ''
            )}
          </Col>
        </Row>
        <Row
          style={{
            // height: '2vh',
            fontSize: 11,
            fontWeight: 'normal',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {props.activityState === 'open_meeting_room' || props.activityState === 'game'
            ? 'En vivo'
            : props.activityState === 'ended_meeting_room' && currentActivity !== null && currentActivity.video
            ? 'Grabado'
            : props.activityState === 'ended_meeting_room' && currentActivity !== null
            ? 'Terminada'
            : props.activityState === 'closed_meeting_room'
            ? 'Por iniciar'
            : ''}
        </Row>
      </Col>

      <Col
        xs={{ order: 3, span: 20 }}
        sm={{ order: 3, span: 20 }}
        md={{ order: 2, span: 18 }}
        lg={{ order: 2, span: 16 }}
        xl={{ order: 2, span: 18 }}
        style={{ display: 'flex' }}>
        <div style={{ padding: '8px' }}>
          <Row style={{ textAlign: 'left', fontWeight: 'bolder' }}>
            {currentActivity && currentActivity?.name}
            {/* {configfast && configfast.enableCount && (
                            <>
                                ( &nbsp;
                                {configfast && configfast.totalAttendees
                                    ? configfast.totalAttendees
                                    : totalAttendees}
                                {"/"} {totalAttendeesCheckedin}{" "}
                                {"(" +
                                    Math.round(
                                        (totalAttendeesCheckedin /
                                            (configfast.totalAttendees
                                                ? configfast.totalAttendees
                                                : totalAttendees)) *
                                        100 *
                                        100
                                    ) /
                                    100 +
                                    "%)"}
                                )
                            </>
                        )} */}
          </Row>
          <Row
            style={{
              height: '2.5vh',
              fontSize: 10,
              fontWeight: 'normal',
            }}>
            <div
              xs={{ order: 1, span: 24 }}
              sm={{ order: 1, span: 24 }}
              md={{ order: 1, span: 24 }}
              lg={{ order: 3, span: 6 }}
              xl={{ order: 3, span: 4 }}>
              {props.isVisible && (
                <div>
                  {Moment.tz(
                    currentActivity !== null && currentActivity?.datetime_start,
                    'YYYY-MM-DD h:mm',
                    'America/Bogota'
                  )
                    .tz(Moment.tz.guess())
                    .format('DD MMM YYYY')}{' '}
                  {Moment.tz(
                    currentActivity !== null && currentActivity?.datetime_start,
                    'YYYY-MM-DD h:mm',
                    'America/Bogota'
                  )
                    .tz(Moment.tz.guess())
                    .format('h:mm a z')}{' '}
                  -{' '}
                  {Moment.tz(
                    currentActivity !== null && currentActivity?.datetime_end,
                    'YYYY-MM-DD h:mm',
                    'America/Bogota'
                  )
                    .tz(Moment.tz.guess())
                    .format('h:mm a z')}
                </div>
              )}
            </div>

            {currentActivity !== null && currentActivity?.space && currentActivity?.space?.name}
          </Row>
          <Col>
            {transmition == 'EviusMeet' &&
              !request[cEventUSer.value?._id]?.active &&
              props.activityState === 'open_meeting_room' && (
                <Button
                  style={{ transition: 'all 1s' }}
                  onClick={() => (!loading ? sendOrCancelRequest() : null)}
                  icon={
                    !haveRequest() && !loading ? (
                      <HumanGreetingIcon style={{ fontSize: '16px' }} />
                    ) : haveRequest() && !loading ? (
                      <CancelIcon style={{ fontSize: '16px' }} />
                    ) : (
                      <Spin />
                    )
                  }
                  disabled={request && request[cEventUSer.value?._id]?.active}
                  type={!haveRequest() ? 'primary' : 'danger'}>
                  {!haveRequest() && !loading
                    ? 'Solicitar participar en la transmisión'
                    : !loading
                    ? 'Cancelar solicitud'
                    : 'Espere...'}
                </Button>
              )}
            {transmition == 'EviusMeet' &&
              request[cEventUSer.value?._id]?.active &&
              props.activityState === 'open_meeting_room' && (
                <Button
                  style={{ transition: 'all 1s' }}
                  onClick={() => showPropsConfirm()}
                  icon={
                    !haveRequest() ? (
                      <HumanGreetingIcon style={{ fontSize: '16px' }} />
                    ) : (
                      <CancelIcon style={{ fontSize: '16px' }} />
                    )
                  }
                  type={!haveRequest() ? 'primary' : 'danger'}>
                  Cambiar a modo transmisión en vivo
                </Button>
              )}
          </Col>
        </div>
      </Col>
    </Row>
  );
};

let HeaderColumnswithContext = WithEviusContext(HeaderColumns);

export default HeaderColumnswithContext;
