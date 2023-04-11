import { Button, Col, DatePicker, Input, List, Modal, notification, Row, Select, Spin, TimePicker } from 'antd';
import moment from 'moment';
import { find, filter, keys, pathOr, propEq, whereEq } from 'ramda';
import { isNonEmptyArray } from 'ramda-adjunct';
import { useEffect, useState } from 'react';
import { SmileOutlined } from '@ant-design/icons';
import withContext from '../../context/withContext';
import * as services from './services/meenting.service';
import { getDatesRange } from '../../helpers/utils';
import { createMeetingRequest, getAgendasFromEventUser, getUsersId } from './services';
import { addNotification } from '../../helpers/netWorkingFunctions';
import { typeAttendace } from './interfaces/Meetings.interfaces';
import { DispatchMessageService } from '@/context/MessageService';

const { TextArea } = Input;
const MESSAGE_MAX_LENGTH = 200;

function AppointmentModal({ cEventUser, targetEventUserId, targetEventUser, closeModal, cEvent }) {
  const [agendaMessage, setAgendaMessage] = useState('');
  const [date, setDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reloadFlag, setReloadFlag] = useState(false);
  const initialDate = cEvent?.value?.datetime_from.split(' ');

  useEffect(() => {
    if (targetEventUserId === null || cEvent.value === null || cEventUser.value === null) return;
      setAgendaMessage('');
  }, [targetEventUserId, reloadFlag]);

  async function reloadData(resp) {
    if (!resp) return console.log('[ ERROR ] - reloadData => El id de requestMeeting es undefined');
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
    closeModal();
    setLoading(false);
    setAgendaMessage('');

  };

  const onSubmit = async () => {
    try {

    if (!date) return notification.warning({ message: 'Debes seleccionar una fecha' });
    setLoading(true)
    const startDate = date.toString();
    const endDate = date.add(20, 'minutes').toString();
    const eventId = cEvent?.value?._id;

      const idRequestMeeting = await createMeetingRequest({
        eventId: eventId,
        targetUser:targetEventUser,
        message: agendaMessage,
        creatorUser:cEventUser,
        typeAttendace,
        startDate,
        endDate,
      });
      await reloadData(idRequestMeeting, targetEventUserId);
      setDate(null);
      setLoading(false)
      closeModal();
    } catch (error) {
      DispatchMessageService({
        action: 'show',
        type: 'error',
        msj: 'No se pudo programar la reunion, intentelo mas tarde',
      });
      setLoading(false)
      closeModal();
    }
  };
  const disabledDate = (current) => {
    const initial = moment(moment(cEvent?.value?.datetime_from).format('YYYY-MM-DD'));
    const finish = moment(moment(cEvent?.value?.datetime_to).format('YYYY-MM-DD')) ;
    const date_to_evaluate = moment(moment(current).format('YYYY-MM-DD'))
    
    return !((date_to_evaluate.isSameOrAfter(initial)) && (date_to_evaluate.isSameOrBefore(finish)))
  };
  
  return (
    <Modal
      visible={!!targetEventUserId}
      title={'Agendar cita'}
      footer={null}
      onCancel={resetModal}
      style={{ zIndex: 1031 }}>
        <div>
          <div>
            <Row justify='space-between' style={{ margin: 5 }}>
              <DatePicker
                style={{ marginBottom: 10 }}
                format={'DD-MM-YYYY hh:mm:ss'}
                showTime={{ defaultValue: moment(initialDate[1] || '00:00:00', 'HH:mm:ss') }}
                disabledDate={disabledDate}
                onOk={(value) => setDate(value)}
              />
              <Button type='primary' onClick={onSubmit} loading={loading}>
                Agendar cita
              </Button>
              <TextArea
                rows={3}
                placeholder={`Puedes agregar un mensaje corto en la solicitud. Máximo ${MESSAGE_MAX_LENGTH} caracteres.`}
                value={agendaMessage}
                onChange={(e) => {
                  const newAgendaMessage = e.target.value;
                  if (newAgendaMessage.length <= MESSAGE_MAX_LENGTH) {
                    setAgendaMessage(newAgendaMessage);
                  }
                }}
              />
            </Row>
          </div>
        </div>
    </Modal>
  );
}

export default withContext(AppointmentModal);
