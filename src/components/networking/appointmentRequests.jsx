import { Avatar, Button, Card, Col, Divider, notification, Row, Spin } from "antd"
import moment from "moment"
import { find, map, pathOr, propEq } from "ramda"
import { isNonEmptyArray } from "ramda-adjunct"
import React, { useEffect, useState } from 'react'

import { acceptOrRejectAgenda, getPendingAgendasFromEventUser } from "./services";

const { Meta } = Card;

const requestStatusText = {
  rejected: 'rechazada',
  accepted: 'aceptada'
}

function AppointmentRequests({
  eventId,
  currentEventUserId,
  eventUsers
}) {
  const [loading, setLoading] = useState(true)
  const [fetching, setFetching] = useState(false)
  const [pendingAgendas, setPendingAgendas] = useState([])

  useEffect(() => {
    if (eventId && currentEventUserId) {
      setLoading(true)
      setPendingAgendas([])

      getPendingAgendasFromEventUser(eventId, currentEventUserId)
        .then((agendas) => {
          if (isNonEmptyArray(agendas) && isNonEmptyArray(eventUsers)) {
            const pendingAgendas = map((agenda) => {
              const ownerEventUser = find(propEq('_id', agenda.owner_id), eventUsers)

              return {
                ...agenda,
                ownerEventUser
              }
            }, agendas)

            setPendingAgendas(pendingAgendas)
          }
        })
        .catch((error) => {
          console.error(error)
          notification.error({
            message: 'Error',
            description: 'Obteniendo las citas pendientes'
          })
        })
        .finally(() => setLoading(false))
    }
  }, [eventId, currentEventUserId, eventUsers])

  if (loading) {
    return (
      <Row align="middle" justify="center" style={{ height: 100 }}>
        <Spin />
      </Row>
    )
  }

  return (
    <div>
      <Divider>{'Solicitudes de citas recibidas'}</Divider>
      {
        pendingAgendas.length > 0
          ? pendingAgendas.map((pendingAgenda) => (
            <RequestCard
              key={`pending-${pendingAgenda.id}`}
              eventId={eventId}
              currentEventUserId={currentEventUserId}
              data={pendingAgenda}
              fetching={fetching}
              setFetching={setFetching}
            />
          ))
          : (
            <Card>{'No tienes solicitudes actualmente'}</Card>
          )
      }
    </div>
  )
}

function RequestCard({ data, eventId, currentEventUserId, fetching, setFetching }) {
  const [requestResponse, setRequestResponse] = useState('')
  const { ownerEventUser } = data
  const userName = pathOr('', ['properties', 'names'], ownerEventUser)
  const userEmail = pathOr('', ['properties', 'email'], ownerEventUser)

  const changeAgendaStatus = (newStatus) => {
    if (!fetching) {
      setFetching(true)
      acceptOrRejectAgenda(eventId, currentEventUserId, data, newStatus)
        .then(() => setRequestResponse(newStatus))
        .catch((error) => {
          if (!error) {
            notification.error({
              message: 'Solicitud no encontrada',
              description: 'La solicitud no existe o no esta en estado pendiente'
            })
          } else if (error === 'HOURS_NOT_AVAILABLE') {
            notification.error({
              message: 'Horario agendado',
              description: 'Ya tienes agendada esta hora'
            })
          } else {
            notification.error({
              message: 'Error',
              description: 'Error al actualizar la solicitud'
            })
          }
        })
        .finally(() => setFetching(false))
    }
  }

  return (
    <Row justify="center" style={{ marginBottom: "20px" }}>
      <Card
        style={{ width: 600, textAlign: "left" }}
        bordered={true}
      >
        <div style={{ marginBottom: '10px' }}>
          {'Solicitud de cita por: '}
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
              {!requestResponse ? (
                <Row>
                  <Button
                    style={{ marginRight: '10px' }}
                    disabled={fetching}
                    loading={fetching}
                    onClick={() => changeAgendaStatus('rejected')}
                  >
                    {'Rechazar'}
                  </Button>
                  <Button
                    type="primary"
                    disabled={fetching}
                    loading={fetching}
                    onClick={() => changeAgendaStatus('accepted')}
                  >
                    {'Aceptar'}
                  </Button>
                </Row>
              ) : (
                  <Row>
                    {`Solicitud ${requestStatusText[requestResponse]}.`}
                  </Row>
                )}
            </div>
          }
        />
      </Card>
    </Row>
  )
}

export default AppointmentRequests
