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
      <Divider>Solicitudes de citas recibidas</Divider>
      {
        pendingAgendas.length > 0
          ? pendingAgendas.map((pendingAgenda) => (
            <RequestCard
              key={pendingAgenda.id}
              eventId={eventId}
              data={pendingAgenda}
            />
          ))
          : (
            <Card>No tiene solicitudes actualmente</Card>
          )
      }
    </div>
  )
}

function RequestCard({ data, eventId }) {
  const [loading, setLoading] = useState(false)
  const [requestResponse, setRequestResponse] = useState('')
  const { ownerEventUser } = data
  const userName = pathOr('', ['properties', 'names'], ownerEventUser)
  const userEmail = pathOr('', ['properties', 'email'], ownerEventUser)

  const changeAgendaStatus = (newStatus) => {
    if (!loading) {
      setLoading(true)
      acceptOrRejectAgenda(eventId, data.id, newStatus)
        .then((res) => {
          console.log('RES @>>>', res)
          setRequestResponse(newStatus)
        })
        .catch((error) => {
          if (!error) {
            notification.error({
              message: 'Solicitud no encontrada',
              description: 'La solicitud no existe o no esta en estado pendiente'
            })
          } else {
            notification.error({
              message: 'Error',
              description: 'Error al actualizar la solicitud'
            })
          }
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
          {'Solicitud de cita por: '}
        </div>
        <Meta
          avatar={
            <Avatar>
              {!!userName
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
                    disabled={loading}
                    loading={loading}
                    onClick={() => changeAgendaStatus('rejected')}
                  >
                    {'Rechazar'}
                  </Button>
                  <Button
                    type="primary"
                    disabled={loading}
                    loading={loading}
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
