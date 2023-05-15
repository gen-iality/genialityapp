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
import { useIntl } from 'react-intl';

const { Meta } = Card;
const { confirm } = Modal;

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
  const intl = useIntl();
  //contextos

  let eventContext = UseEventContext();
  let userCurrentContext = UseCurrentUser();
  const eventId = eventContext.value._id;

  const acceptRequest = async () => {
    const meetingsForTowUsers = await services.getMeetingForUsersAtDateStart(
      eventId,
      [data.user_from.id, data.user_to.id],
      data.dateStartTimestamp
    );
    if (meetingsForTowUsers && meetingsForTowUsers.length > 0) {
      let notAvalibleUsers = false;
      let message = ''
      meetingsForTowUsers.forEach((meetings) => {
        if (meetings.participantsIds.includes(data.user_from.id)) {
          message = intl.formatMessage({id: 'networking_participant_not_available', defaultMessage: '¡El otro participante no se encuentra disponible!'})
          notAvalibleUsers = true;
        } else if (meetings.participantsIds.includes(data.user_to.id)) {
          message = intl.formatMessage({id: 'networking_busy_space', defaultMessage: '¡Usted se encuentra ocupado en este espacio!'})          
          notAvalibleUsers = true;
        }
      });
      if (notAvalibleUsers) {
        notification.warning({ message: `${intl.formatMessage({id: 'networking_couldnt_accept_meeting', defaultMessage: 'No se pudo aceptar la reunión'})}, ${message}`});
        await services.updateRequestMeeting(eventId, data.id, {
          ...data,
          status: RequestMeetingState.rejected,
        });
      }
      notificationUser();
      return;
    }
    const response = await servicesMeenting.createMeeting(eventId, { ...data.meeting, id_request_meetings: data.id });
    if (response) {
      await services.updateRequestMeeting(eventId, data.id, { ...data, status: RequestMeetingState.confirmed });
      notificationUser();
      setClassName('animate__animated animate__backOutRight animate__slow');
      notification.success({
        message: intl.formatMessage({id: 'networking_meeting_successfully_scheduled', defaultMessage: '¡Se agendó la reunión correctamente!'}),
        icon: <CheckCircleOutlined />,
      });
    } else {
      notification.warning({
        message: intl.formatMessage({id: 'networking_failed_scheduled_meeting', defaultMessage: '¡No se logró agendar la reunión!'}),
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
        message: intl.formatMessage({id: 'something_went_wrong', defaultMessage: '¡Algo salió mal!'}),
        description: intl.formatMessage({id: 'networking_failed_declined_contact_administrator', defaultMessage: 'No se logró rechazar la reunión, comuníquese con el administrador'}),
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
    setSendRespuesta((status) => !status);
  };

  const changeAgendaStatus = async (newStatus: string) => {
    setloader(true);
    if (newStatus === RequestMeetingState.confirmed) {
      await acceptRequest();
      setloader(false);
    } else {
      confirm({
        title: intl.formatMessage({id: 'networking_want_to_decline_meeting', defaultMessage: '¿Estás seguro de que deseas rechazar la reunión?'}),
        icon: <ExclamationCircleOutlined />,
        content: intl.formatMessage({id: 'networking_warning_rejected_meeting', defaultMessage: 'Una vez rechazado, no lo podrá volver a aceptar'}),
        okText: intl.formatMessage({id: 'decline', defaultMessage: 'Rechazar'}),
        okType: 'danger',
        cancelText: intl.formatMessage({id: 'global.cancel', defaultMessage: 'Cancelar'}),
        onOk() {
          rejectRequest();
        },
        onCancel() {
          setloader(false);
        },
      });
    }
  };

  return (
    <Row justify='center' style={{ marginBottom: '20px' }} className={className}>
      <Card style={{ width: 600, textAlign: 'left' }} bordered={true}>
        <div style={{ marginBottom: '10px' }}>{received ? 
        intl.formatMessage({id: 'networking_appointment_request_by', defaultMessage: 'Solicitud de cita por: '}) : 
        intl.formatMessage({id: 'networking_appointment_request_to', defaultMessage: 'Solicitud de cita a: '})}</div>
        <Meta
          avatar={<Avatar>{`${userName}`.charAt(0).toUpperCase()}</Avatar>}
          title={userName || intl.formatMessage({id: 'not_registered_name', defaultMessage: 'No registra nombre'})}
          description={
            <div>
              <Row>
                <Col xs={24} sm={24} md={24} lg={16} xl={16} xxl={16}>
                  <p>{userEmail || intl.formatMessage({id: 'not_registered_name', defaultMessage: 'No registra correo'})}</p>
                  <p style={{ paddingRight: '20px' }}>
                    {intl.formatMessage({id: 'networking_message', defaultMessage: 'Mensaje: '})}
                    {data.message || intl.formatMessage({id: 'networking_without_message', defaultMessage: 'sin mensaje'})}
                  </p>
                </Col>
                <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
                  <div style={{ textTransform: 'capitalize' }}>{moment(data.date).format('DD/MM/YYYY')}</div>
                  <div>{moment(data.date).format('hh:mm a')}</div>
                </Col>
              </Row>
              {received ? (
                <Row>
                  <Button
                    style={{ marginRight: '10px' }}
                    disabled={loader}
                    loading={loader}
                    onClick={() => changeAgendaStatus(RequestMeetingState.rejected)}>
                    {intl.formatMessage({id: 'decline', defaultMessage: 'Rechazar'})}
                  </Button>
                  <Button
                    type='primary'
                    disabled={loader}
                    loading={loader}
                    onClick={() => changeAgendaStatus(RequestMeetingState.confirmed)}>
                    {intl.formatMessage({id: 'accept', defaultMessage: 'Aceptar'})}
                  </Button>
                </Row>
              ) : (
                <Row>{intl.formatMessage({id: 'networking_application', defaultMessage: 'Solicitud'})} {statusRequestText[data.status]}.</Row>
              )}
            </div>
          }
        />
      </Card>
    </Row>
  );
}
