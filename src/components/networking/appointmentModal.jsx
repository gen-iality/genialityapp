import { Button, Col, DatePicker, Input, List, Modal, notification, Row, Select, Spin, TimePicker } from 'antd';
import moment from 'moment';
import { find, filter, keys, pathOr, propEq, whereEq } from 'ramda';
import { isNonEmptyArray } from 'ramda-adjunct';
import { useEffect, useState } from 'react';
import { SmileOutlined } from '@ant-design/icons';
import withContext from '../../context/withContext';

import { getDatesRange } from '../../helpers/utils';
import { createAgendaToEventUser, getAgendasFromEventUser, getUsersId } from './services';
import { addNotification } from '../../helpers/netWorkingFunctions';

const { Option } = Select;

// TODO: -> eliminar fakeEventTimetable
const fakeEventTimetable = {
  '2020-09-24': [
    {
      timestamp_start: '2020-09-24T21:00:00Z',
      timestamp_end: '2020-09-24T21:15:00Z',
    },
    {
      timestamp_start: '2020-09-24T21:15:00Z',
      timestamp_end: '2020-09-24T21:30:00Z',
    },
    {
      timestamp_start: '2020-09-24T21:30:00Z',
      timestamp_end: '2020-09-24T21:45:00Z',
    },
    {
      timestamp_start: '2020-09-24T21:45:00Z',
      timestamp_end: '2020-09-24T22:00:00Z',
    },
    {
      timestamp_start: '2020-09-24T22:00:00Z',
      timestamp_end: '2020-09-24T22:15:00Z',
    },
    {
      timestamp_start: '2020-09-24T22:15:00Z',
      timestamp_end: '2020-09-24T22:30:00Z',
    },
    {
      timestamp_start: '2020-09-24T22:30:00Z',
      timestamp_end: '2020-09-24T22:45:00Z',
    },
    {
      timestamp_start: '2020-09-24T22:45:00Z',
      timestamp_end: '2020-09-24T23:00:00Z',
    },
  ],
};

const { TextArea } = Input;
const buttonStatusText = {
  free: 'Reservar',
  pending: 'Pendiente',
  rejected: 'Rechazada',
};
const MESSAGE_MAX_LENGTH = 200;

function AppointmentModal({ cEventUser, targetEventUserId, targetEventUser, closeModal, cEvent }) {
  const [openAgenda, setOpenAgenda] = useState('');
  const [agendaMessage, setAgendaMessage] = useState('');
  const [timetable, setTimetable] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reloadFlag, setReloadFlag] = useState(false);
  const [eventDatesRange, setEventDatesRange] = useState(false);
  const initialDate = cEvent?.value?.datetime_from.split(' ')   


  useEffect(() => {
    if (targetEventUserId === null || cEvent.value === null || cEventUser.value === null) return;
    const loadData = async () => {
      setLoading(true);
      setTimetable({});
      setAgendaMessage('');
      setOpenAgenda('');

      try {
        const agendas = await getAgendasFromEventUser(cEvent.value._id, targetEventUserId);
        const newTimetable = {};
        const eventTimetable = pathOr(fakeEventTimetable, ['timetable'], cEvent.value); // TODO: -> cambiar fakeEventTimetable por {}
        const dates = keys(eventTimetable);

        dates.forEach((date) => {
          if (isNonEmptyArray(eventTimetable[date])) {
            eventTimetable[date].forEach((timetableItem) => {
              const occupiedAgendas = filter(
                whereEq({
                  timestamp_start: timetableItem.timestamp_start,
                  timestamp_end: timetableItem.timestamp_end,
                }),
                agendas
              );

              const occupiedAgendaFromMe = find(propEq('owner_id', cEventUser.value._id), occupiedAgendas);
              const occupiedAcceptedAgenda = find(propEq('request_status', 'accepted'), occupiedAgendas);
              const occupiedAgenda = occupiedAgendaFromMe || occupiedAcceptedAgenda;

              const newTimetableItem = {
                ...timetableItem,
                id: occupiedAgenda ? occupiedAgenda.id : null,
                status:
                  !!occupiedAgenda &&
                  (occupiedAgenda.request_status === 'accepted' || occupiedAgenda.owner_id === cEventUser.value._id)
                    ? occupiedAgenda.request_status
                    : 'free',
              };

              if (isNonEmptyArray(newTimetable[date])) {
                newTimetable[date].push(newTimetableItem);
              } else {
                newTimetable[date] = [newTimetableItem];
              }
            });
          }
        });

        setTimetable(newTimetable);

        const eventDatesRange = cEvent.value && getDatesRange(cEvent.value.datetime_from, cEvent.value.datetime_to);
        if (eventDatesRange) {
          setEventDatesRange(eventDatesRange);
          setSelectedDate(eventDatesRange[0]);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [targetEventUserId, reloadFlag]);

  async function reloadData(resp) {
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
    setSelectedDate(eventDatesRange[0]);
    setLoading(true);
    setTimetable({});
    setAgendaMessage('');
    setOpenAgenda('');
  };
  const onChange = (value,dateString) => {
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
  };

  const onOk = (value) => {
    console.log('onOk: ', value);
  };
  const disabledDate = (current) => {
    const initial  = cEvent?.value?.datetime_from
    const finish  = cEvent?.value?.datetime_to
    return current && (current < moment(initial)  || current > moment(finish));
  };
  return (
    <Modal
      visible={!!targetEventUserId}
      title={'Agendar cita'}
      footer={null}
      onCancel={resetModal}
      style={{ zIndex: 1031 }}>
      {loading ? (
        <Row align='middle' justify='center' style={{ height: 300 }}>
          <Spin />
        </Row>
      ) : (
        <div>
          <div>
            <Row justify='space-between' style={{margin: 5}}>
            <DatePicker format={'DD-MM-YYYY hh:mm:ss'}  showTime={{ defaultValue: moment(initialDate[1] || '00:00:00', 'HH:mm:ss') }} disabledDate={disabledDate} onChange={onChange} onOk={onOk}  />
            <Button type='primary' >Agendar cita</Button>
            </Row>
            <List
              bordered
              itemLayout='vertical'
              dataSource={timetable[selectedDate]}
              renderItem={(timetableItem) => {
                if (timetableItem.status === 'accepted') {
                  return null;
                }

                const agendaId = `${timetableItem.timestamp_start}${timetableItem.timestamp_end}`;

                return (
                  <List.Item>
                    <Row align='middle'>
                      <Col xs={16}>
                        <Row justify='center'>
                          {`${moment(timetableItem.timestamp_start).format('hh:mm a')} - ${moment(
                            timetableItem.timestamp_end
                          ).format('hh:mm a')}`}
                        </Row>
                      </Col>
                      <Col xs={8}>
                        <Row justify='center'>
                          <Button
                            type='primary'
                            shape='round'
                            disabled={timetableItem.status !== 'free' || openAgenda === agendaId}
                            onClick={() => {
                              if (timetableItem.status === 'free') {
                                setAgendaMessage('');
                                setOpenAgenda(agendaId);
                              }
                            }}>
                            {buttonStatusText[timetableItem.status]}
                          </Button>
                        </Row>
                      </Col>
                    </Row>

                    {openAgenda === agendaId && (
                      <div>
                        <div style={{ padding: '10px 0' }}>
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
                        </div>
                        <Row justify='end' style={{ paddingBottom: '20px' }}>
                          <Button
                            shape='round'
                            onClick={() => {
                              setOpenAgenda('');
                              setAgendaMessage('');
                            }}
                            style={{ marginRight: '10px' }}>
                            {'Cancelar'}
                          </Button>
                          <Button
                            type='primary'
                            shape='round'
                            onClick={() => {
                              if (timetableItem.status === 'free') {
                                setLoading(true);
                                createAgendaToEventUser({
                                  eventId: cEvent.value._id,
                                  eventUser: cEventUser.value,
                                  currentEventUserId: cEventUser.value._id,
                                  targetEventUserId,
                                  targetEventUser,
                                  timetableItem,
                                  message: agendaMessage,
                                })
                                  .then((resp) => {
                                    reloadData(resp, targetEventUserId);
                                  })
                                  .catch((error) => {
                                    console.error(error);
                                    if (!error) {
                                      notification.warning({
                                        message: 'Espacio reservado',
                                        description: 'Este espacio de tiempo ya fué reservado',
                                      });
                                    } else {
                                      notification.error({
                                        message: 'Error',
                                        description: 'Error creando la reserva',
                                      });
                                    }
                                    resetModal();
                                  });
                              }
                            }}>
                            {'Enviar solicitud'}
                          </Button>
                        </Row>
                      </div>
                    )}
                  </List.Item>
                );
              }}
            />
          </div>
        </div>
      )}
    </Modal>
  );
}

export default withContext(AppointmentModal);
