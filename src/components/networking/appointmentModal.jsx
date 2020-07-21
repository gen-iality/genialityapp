import { Button, Col, List, Modal, notification, Row, Select, Spin } from "antd";
import moment from "moment";
import { find, keys, pathOr, whereEq } from "ramda";
import { isNonEmptyArray } from "ramda-adjunct";
import React, { useEffect, useMemo, useState } from "react";

import { getDatesRange } from "../../helpers/utils";
import { createAgendaToEventUser, getAgendasFromEventUser } from "./services";

const { Option } = Select;

const fakeEventTimetable = {
  '2020-07-06': [
    {
      timestamp_start: '2020-07-06T15:00:00Z',
      timestamp_end: '2020-07-06T15:30:00Z',
    },
    {
      timestamp_start: '2020-07-06T15:30:00Z',
      timestamp_end: '2020-07-06T16:00:00Z',
    },
    {
      timestamp_start: '2020-07-06T16:00:00Z',
      timestamp_end: '2020-07-06T16:30:00Z',
    },
    {
      timestamp_start: '2020-07-06T16:30:00Z',
      timestamp_end: '2020-07-06T17:00:00Z',
    },
    {
      timestamp_start: '2020-07-06T17:00:00Z',
      timestamp_end: '2020-07-06T17:30:00Z',
    },
    {
      timestamp_start: '2020-07-06T17:30:00Z',
      timestamp_end: '2020-07-06T18:00:00Z',
    },
    {
      timestamp_start: '2020-07-06T18:00:00Z',
      timestamp_end: '2020-07-06T18:30:00Z',
    },
    {
      timestamp_start: '2020-07-06T18:30:00Z',
      timestamp_end: '2020-07-06T19:00:00Z',
    },
    {
      timestamp_start: '2020-07-06T19:00:00Z',
      timestamp_end: '2020-07-06T19:30:00Z',
    },
    {
      timestamp_start: '2020-07-06T19:30:00Z',
      timestamp_end: '2020-07-06T20:00:00Z',
    },
    {
      timestamp_start: '2020-07-06T20:00:00Z',
      timestamp_end: '2020-07-06T20:30:00Z',
    },
    {
      timestamp_start: '2020-07-06T20:30:00Z',
      timestamp_end: '2020-07-06T21:00:00Z',
    },
    {
      timestamp_start: '2020-07-06T21:00:00Z',
      timestamp_end: '2020-07-06T21:30:00Z',
    },
    {
      timestamp_start: '2020-07-06T21:30:00Z',
      timestamp_end: '2020-07-06T22:00:00Z',
    },
    {
      timestamp_start: '2020-07-06T22:00:00Z',
      timestamp_end: '2020-07-06T22:30:00Z',
    },
    {
      timestamp_start: '2020-07-06T22:30:00Z',
      timestamp_end: '2020-07-06T23:00:00Z',
    },
    {
      timestamp_start: '2020-07-06T23:00:00Z',
      timestamp_end: '2020-07-06T23:30:00Z',
    }
  ],
  '2020-07-07': [
    {
      timestamp_start: '2020-07-07T15:00:00Z',
      timestamp_end: '2020-07-07T15:30:00Z',
    },
    {
      timestamp_start: '2020-07-07T15:30:00Z',
      timestamp_end: '2020-07-07T16:00:00Z',
    },
    {
      timestamp_start: '2020-07-07T16:00:00Z',
      timestamp_end: '2020-07-07T16:30:00Z',
    },
    {
      timestamp_start: '2020-07-07T16:30:00Z',
      timestamp_end: '2020-07-07T17:00:00Z',
    },
    {
      timestamp_start: '2020-07-07T17:00:00Z',
      timestamp_end: '2020-07-07T17:30:00Z',
    },
    {
      timestamp_start: '2020-07-07T17:30:00Z',
      timestamp_end: '2020-07-07T18:00:00Z',
    },
    {
      timestamp_start: '2020-07-07T18:00:00Z',
      timestamp_end: '2020-07-07T18:30:00Z',
    },
    {
      timestamp_start: '2020-07-07T18:30:00Z',
      timestamp_end: '2020-07-07T19:00:00Z',
    },
    {
      timestamp_start: '2020-07-07T19:00:00Z',
      timestamp_end: '2020-07-07T19:30:00Z',
    },
    {
      timestamp_start: '2020-07-07T19:30:00Z',
      timestamp_end: '2020-07-07T20:00:00Z',
    },
    {
      timestamp_start: '2020-07-07T20:00:00Z',
      timestamp_end: '2020-07-07T20:30:00Z',
    },
    {
      timestamp_start: '2020-07-07T20:30:00Z',
      timestamp_end: '2020-07-07T21:00:00Z',
    },
    {
      timestamp_start: '2020-07-07T21:00:00Z',
      timestamp_end: '2020-07-07T21:30:00Z',
    },
    {
      timestamp_start: '2020-07-07T21:30:00Z',
      timestamp_end: '2020-07-07T22:00:00Z',
    },
    {
      timestamp_start: '2020-07-07T22:00:00Z',
      timestamp_end: '2020-07-07T22:30:00Z',
    },
    {
      timestamp_start: '2020-07-07T22:30:00Z',
      timestamp_end: '2020-07-07T23:00:00Z',
    },
    {
      timestamp_start: '2020-07-07T23:00:00Z',
      timestamp_end: '2020-07-07T23:30:00Z',
    }
  ],
  '2020-07-08': [
    {
      timestamp_start: '2020-07-08T15:00:00Z',
      timestamp_end: '2020-07-08T15:30:00Z',
    },
    {
      timestamp_start: '2020-07-08T15:30:00Z',
      timestamp_end: '2020-07-08T16:00:00Z',
    },
    {
      timestamp_start: '2020-07-08T16:00:00Z',
      timestamp_end: '2020-07-08T16:30:00Z',
    },
    {
      timestamp_start: '2020-07-08T16:30:00Z',
      timestamp_end: '2020-07-08T17:00:00Z',
    },
    {
      timestamp_start: '2020-07-08T17:00:00Z',
      timestamp_end: '2020-07-08T17:30:00Z',
    },
    {
      timestamp_start: '2020-07-08T17:30:00Z',
      timestamp_end: '2020-07-08T18:00:00Z',
    },
    {
      timestamp_start: '2020-07-08T18:00:00Z',
      timestamp_end: '2020-07-08T18:30:00Z',
    },
    {
      timestamp_start: '2020-07-08T18:30:00Z',
      timestamp_end: '2020-07-08T19:00:00Z',
    },
    {
      timestamp_start: '2020-07-08T19:00:00Z',
      timestamp_end: '2020-07-08T19:30:00Z',
    },
    {
      timestamp_start: '2020-07-08T19:30:00Z',
      timestamp_end: '2020-07-08T20:00:00Z',
    },
    {
      timestamp_start: '2020-07-08T20:00:00Z',
      timestamp_end: '2020-07-08T20:30:00Z',
    },
    {
      timestamp_start: '2020-07-08T20:30:00Z',
      timestamp_end: '2020-07-08T21:00:00Z',
    },
    {
      timestamp_start: '2020-07-08T21:00:00Z',
      timestamp_end: '2020-07-08T21:30:00Z',
    },
    {
      timestamp_start: '2020-07-08T21:30:00Z',
      timestamp_end: '2020-07-08T22:00:00Z',
    },
    {
      timestamp_start: '2020-07-08T22:00:00Z',
      timestamp_end: '2020-07-08T22:30:00Z',
    },
    {
      timestamp_start: '2020-07-08T22:30:00Z',
      timestamp_end: '2020-07-08T23:00:00Z',
    },
    {
      timestamp_start: '2020-07-08T23:00:00Z',
      timestamp_end: '2020-07-08T23:30:00Z',
    }
  ],
}

const buttonStatusText = {
  free: 'Reservar',
  pending: 'Pendiente',
  rejected: 'Rechazada',
}

function AppointmentModal({
  event,
  currentEventUserId,
  targetEventUserId,
  closeModal,
}) {
  const eventDatesRange = useMemo(() => {
    return getDatesRange(event.date_start, event.date_end);
  }, [event.date_start, event.date_end]);

  const [timetable, setTimetable] = useState({})
  const [selectedDate, setSelectedDate] = useState(eventDatesRange[0])
  const [loading, setLoading] = useState(true)
  const [reloadFlag, setReloadFlag] = useState(false)

  const reloadData = () => {
    setReloadFlag(!reloadFlag)
  }

  const resetModal = () => {
    closeModal()
    setSelectedDate(eventDatesRange[0])
    setLoading(true)
    setTimetable({})
  }

  useEffect(() => {
    if (targetEventUserId && currentEventUserId) {
      setLoading(true)
      setTimetable({})
      getAgendasFromEventUser(event._id, targetEventUserId)
        .then(agendas => {
          const newTimetable = {}
          const eventTimetable = pathOr(fakeEventTimetable, ['timetable'], event)
          const dates = keys(eventTimetable)

          dates.forEach((date) => {
            if (isNonEmptyArray(eventTimetable[date])) {
              eventTimetable[date].forEach((timetableItem) => {
                const occupiedAgenda = find(
                  whereEq({
                    timestamp_start: timetableItem.timestamp_start,
                    timestamp_end: timetableItem.timestamp_end
                  }),
                  agendas
                )

                const newTimetableItem = {
                  ...timetableItem,
                  id: !!occupiedAgenda ? occupiedAgenda.id : null,
                  status: !!occupiedAgenda &&
                    (
                      occupiedAgenda.request_status === 'accepted' ||
                      occupiedAgenda.owner_id === currentEventUserId
                    )
                    ? occupiedAgenda.request_status
                    : 'free'
                }

                if (isNonEmptyArray(newTimetable[date])) {
                  newTimetable[date].push(newTimetableItem)
                } else {
                  newTimetable[date] = [newTimetableItem]
                }
              })
            }
          })

          setTimetable(newTimetable)
        })
        .catch((error) => {
          console.error(error)
          notification.error({
            message: 'Error',
            description: 'Obteniendo las citas del usuario'
          })
        })
        .finally(() => setLoading(false))
    }
  }, [reloadFlag, event.timetable, event._id, targetEventUserId, currentEventUserId])

  return (
    <Modal
      visible={!!targetEventUserId}
      title={'Agendar cita'}
      footer={null}
      onCancel={resetModal}
    >
      {loading ? (
        <Row align="middle" justify="center" style={{ height: 300 }}>
          <Spin />
        </Row>
      ) : (
          <div>
            <Row justify="end">
              <Select
                style={{ width: 200 }}
                value={selectedDate}
                onChange={setSelectedDate}
              >
                {eventDatesRange.map((eventDate) => (
                  <Option value={eventDate} key={eventDate}>
                    {moment(eventDate).format('D MMMM')}
                  </Option>
                ))}
              </Select>
            </Row>
            <div>
              <List
                bordered
                dataSource={timetable[selectedDate]}
                renderItem={(timetableItem) => {
                  if (timetableItem.status === 'accepted') {
                    return null
                  }

                  return (
                    <List.Item>
                      <Row style={{ width: '100%' }} align="middle">
                        <Col xs={16}>
                          <Row justify="center">
                            {`${
                              moment(timetableItem.timestamp_start).format('hh:mm a')
                              } - ${
                              moment(timetableItem.timestamp_end).format('hh:mm a')
                              }`}
                          </Row>
                        </Col>
                        <Col xs={8}>
                          <Row justify="center">
                            <Button
                              type="primary"
                              shape="round"
                              disabled={timetableItem.status !== 'free'}
                              onClick={() => {
                                if (timetableItem.status === 'free') {
                                  setLoading(true)
                                  createAgendaToEventUser({
                                    eventId: event._id,
                                    currentEventUserId,
                                    targetEventUserId,
                                    timetableItem
                                  })
                                    .then(reloadData)
                                    .catch((error) => {
                                      console.error(error)
                                      if (!error) {
                                        notification.warning({
                                          message: 'Espacio reservado',
                                          description: 'Este espacio de tiempo ya fué reservado'
                                        })
                                      } else {
                                        notification.error({
                                          message: 'Error',
                                          description: 'Error creando la reserva'
                                        })
                                      }
                                      resetModal()
                                    })
                                }
                              }}
                            >
                              {buttonStatusText[timetableItem.status]}
                            </Button>
                          </Row>
                        </Col>
                      </Row>
                    </List.Item>
                  )
                }}
              />
            </div>
          </div>
        )}
    </Modal>
  )
}

export default AppointmentModal;
