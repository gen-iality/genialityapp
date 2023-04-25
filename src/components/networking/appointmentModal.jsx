import { Button, DatePicker, Modal, notification, Row, Typography } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { SmileOutlined } from '@ant-design/icons';
import withContext from '../../context/withContext';
import { createMeetingRequest, getAgendasFromEventUser, getUsersId } from './services';
import { addNotification } from '../../helpers/netWorkingFunctions';
import { typeAttendace } from './interfaces/Meetings.interfaces';
import { DispatchMessageService } from '@/context/MessageService';
import SpacesAvalibleList from './components/spaces-requestings/SpacesAvalibleList';
import firebase from 'firebase/compat';

function AppointmentModal({ cEventUser, targetEventUserId, targetEventUser, closeModal, cEvent }) {
  const [agendaMessage, setAgendaMessage] = useState('');
  const [date, setDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reloadFlag, setReloadFlag] = useState(false);

  useEffect(() => {
    if (targetEventUserId === null || cEvent.value === null || cEventUser.value === null) return;
    setAgendaMessage('');
  }, [targetEventUserId, reloadFlag]);

  async function reloadData(resp) {
    if (!resp) return;
    setReloadFlag(!reloadFlag);
    notification.open({
      message: 'Solicitud enviada',
      description:
        'Le llegará un correo a la persona notificandole la solicitud, quien la aceptara o recharaza  y le llegará un correo de vuelta confirmando la respuesta',
      icon: <SmileOutlined style={{ color: '#108ee9' }} />,
      duration: 30,
    });
    var usId = await getUsersId(targetEventUserId, cEvent.value._id);

    let notificationA = {
      idReceive: usId.account_id,
      idEmited: resp,
      emailEmited: 'email@gmail.com',
      message: `${cEventUser.value.names ||
        cEventUser.value.user.names ||
        cEventUser.value.user.name} te ha enviado cita`,
      name: 'notification.name',
      type: 'agenda',
      state: '0',
    };
    await addNotification(notificationA, cEvent.value, cEventUser.value);
  }
  const resetModal = () => {
    setDate(null);
    closeModal();
    setLoading(false);
    setAgendaMessage('');
  };

  const onSubmit = async (message,startDate, endDate) => {
    try {
      if (!date) return notification.warning({ message: 'Debes seleccionar una fecha' });
      setLoading(true);
      const eventId = cEvent?.value?._id;

      const idRequestMeeting = await createMeetingRequest({
        eventId: eventId,
        targetUser: targetEventUser,
        message: message,
        creatorUser: cEventUser,
        typeAttendace,
        startDate,
        endDate,
      });
      await reloadData(idRequestMeeting, targetEventUserId);
      setDate(null);
      setLoading(false);
      closeModal();
    } catch (error) {
      DispatchMessageService({
        action: 'show',
        type: 'error',
        msj: 'No se pudo programar la reunión, intentelo más tarde',
      });
      setLoading(false);
      closeModal();
    }
  };
  const disabledDate = (current) => {
    const initial = moment(moment(cEvent?.value?.datetime_from).format('YYYY-MM-DD'));
    const finish = moment(moment(cEvent?.value?.datetime_to).format('YYYY-MM-DD'));
    const date_to_evaluate = moment(moment(current).format('YYYY-MM-DD'));

    return !(date_to_evaluate.isSameOrAfter(initial) && date_to_evaluate.isSameOrBefore(finish));
  };

  return (
    <Modal
      visible={!!targetEventUserId}
      title={<Typography.Text ellipsis style={{width: 450}}>Agendar cita con <strong>{targetEventUser?.user?.names}</strong></Typography.Text>}
      footer={null}
      onCancel={resetModal}
      style={{ zIndex: 1031 }}
      bodyStyle={{ maxHeight: '60vh', overflowY: 'auto' }}
    >
      <Row justify='space-between' style={{ margin: 5 }}>
        <DatePicker
          value={date}
          style={{ marginBottom: 10 }}
          format={'DD-MM-YYYY'}
          disabledDate={disabledDate}
          onChange={setDate}
        />
      </Row>
      {date && (
        <SpacesAvalibleList
          date={date}
          targetEventUserId={targetEventUserId}
          targetUserName={targetEventUser?.user?.names}
          onSubmit={onSubmit}
          creatorEventUserId={cEventUser.value._id}
          loadingButton={loading}
        />
      )}
    </Modal>
  );
}

export default withContext(AppointmentModal);
