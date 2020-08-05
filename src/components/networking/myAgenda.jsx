import { Avatar, Button, Card, Col, Modal, notification, Row, Spin, Tabs } from 'antd'
import moment from 'moment'
import { find, map, mergeRight, path, pathOr, propEq } from 'ramda'
import { isNonEmptyArray } from 'ramda-adjunct'
import React, { useEffect, useMemo, useState } from 'react'

import { getDatesRange } from "../../helpers/utils"
import { deleteAgenda, getAcceptedAgendasFromEventUser } from "./services";

const { TabPane } = Tabs
const { Meta } = Card
const { confirm } = Modal

function MyAgenda({ event, currentEventUserId, eventUsers }) {
  const [loading, setLoading] = useState(true)
  const [acceptedAgendas, setAcceptedAgendas] = useState([])

  const eventDatesRange = useMemo(() => {
    return getDatesRange(event.date_start, event.date_end);
  }, [event.date_start, event.date_end]);

  useEffect(() => {
    if (event._id && currentEventUserId && isNonEmptyArray(eventUsers)) {
      setLoading(true)
      getAcceptedAgendasFromEventUser(event._id, currentEventUserId)
        .then((agendas) => {
          if (isNonEmptyArray(agendas)) {
            const newAcceptedAgendas = map((agenda) => {
              const agendaAttendees = path(['attendees'], agenda)
              const otherAttendeeId = isNonEmptyArray(agendaAttendees)
                ? find(attendeeId => attendeeId !== currentEventUserId, agendaAttendees)
                : null

              if (otherAttendeeId) {
                const otherEventUser = find(propEq('_id', otherAttendeeId), eventUsers)
                return mergeRight(agenda, { otherEventUser })
              } else {
                return agenda
              }
            }, agendas)

            console.log(`#### currentEventUserId >>> '${currentEventUserId}'`)
            console.log('#### agendas >>>', agendas)
            console.log('#### newAcceptedAgendas >>>', newAcceptedAgendas)
            console.log('#### eventUsers >>>', eventUsers)
            setAcceptedAgendas(newAcceptedAgendas)
          }
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
  }, [event._id, currentEventUserId, eventUsers])

  if (loading) {
    return (
      <Row align="middle" justify="center" style={{ height: 100 }}>
        <Spin />
      </Row>
    )
  }

  return (
    <div>
      {isNonEmptyArray(eventDatesRange) ? (
        <Tabs>
          {eventDatesRange.map((eventDate, eventDateIndex) => {
            const dayAgendas = acceptedAgendas.filter(({ timestamp_start }) => {
              const agendaDate = moment(timestamp_start).format('YYYY-MM-DD')
              return agendaDate === eventDate
            })

            return (
              <TabPane
                tab={
                  <div style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>
                    {moment(eventDate).format('MMMM DD')}
                  </div>}
                key={`event-date-${eventDateIndex}-${eventDate}`}
              >
                {isNonEmptyArray(dayAgendas)
                  ? dayAgendas.map((acceptedAgenda) => (
                    <AcceptedCard
                      key={`accepted-${acceptedAgenda.id}`}
                      eventId={event._id}
                      data={acceptedAgenda}
                    />
                  )) : (
                    <Card>{'No tienes citas agendadas para esta fecha'}</Card>
                  )}
              </TabPane>
            )
          })}
        </Tabs>
      ) : (
          <Card>{'No tienes citas actualmente'}</Card>
        )}
    </div>
  )
}

function AcceptedCard({ data, eventId }) {
  const [loading, setLoading] = useState(false)
  const [deleted, setDeleted] = useState(false)
  const userName = pathOr('', ['otherEventUser', 'properties', 'names'], data)
  const userEmail = pathOr('', ['otherEventUser', 'properties', 'email'], data)

  const deleteThisAgenda = () => {
    if (!loading) {
      setLoading(true)
      deleteAgenda(eventId, data.id)
        .then(() => setDeleted(true))
        .catch((error) => {
          console.error(error)
          notification.error({
            message: 'Error',
            description: 'Error eliminando la cita'
          })
        })
        .finally(() => setLoading(false))
    }
  }

  return (
    <Row justify="center" style={{ marginBottom: "20px" }}>
      <Card
        style={{ width: 600, textAlign: "left" }}
        bordered={true}
      >
        <div style={{ marginBottom: '10px' }}>
          {'Cita con: '}
        </div>
        <Meta
          avatar={
            <Avatar>
              {userName
                ? userName.charAt(0).toUpperCase()
                : userName}
            </Avatar>
          }
          title={userName || "No registra nombre"}
          description={
            <div>
              <Row>
                <Col xs={18}>
                  <p>
                    {userEmail || "No registra correo"}
                  </p>
                  {!!data.message && (
                    <p style={{ paddingRight: '20px' }}>
                      {'Mensaje: '}
                      {data.message}
                    </p>
                  )}
                </Col>
                <Col xs={6}>
                  <div style={{ textTransform: 'capitalize' }}>
                    {moment(data.timestamp_start).format('MMMM DD')}
                  </div>
                  <div>
                    {moment(data.timestamp_start).format('hh:mm a')}
                  </div>
                  <div>
                    {moment(data.timestamp_end).format('hh:mm a')}
                  </div>
                </Col>
              </Row>
              {!deleted ? (
                <Row>
                  <Button
                    type="danger"
                    disabled={loading}
                    loading={loading}
                    onClick={() => {
                      confirm({
                        title: 'Confirmar cancelación',
                        content: '¿Desea cancelar/eliminar esta cita?',
                        okText: 'Si',
                        cancelText: 'No',
                        onOk: deleteThisAgenda
                      })
                    }}
                  >
                    {'Cancelar'}
                  </Button>
                </Row>
              ) : (
                  <Row>
                    {`Cita cancelada.`}
                  </Row>
                )}
            </div>
          }
        />
      </Card>
    </Row>
  )
}

export default MyAgenda
