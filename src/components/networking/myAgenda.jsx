import {
  Avatar,
  Button,
  Card,
  Col,
  notification,
  Row,
  Spin,
  Tabs,
  Space,
  Typography,
  Popconfirm,
  Divider,
} from 'antd'
import dayjs from 'dayjs'
import { find, map, mergeRight, path, propEq } from 'ramda'
import { isNonEmptyArray } from 'ramda-adjunct'
import { useEffect, useMemo, useState } from 'react'
import { firestore } from '@helpers/firebase'
import { getDatesRange } from '@helpers/utils'
import { deleteAgenda, getAcceptedAgendasFromEventUser } from './services'
import { createChatRoom } from './agendaHook'
import { isStagingOrProduccion } from '@Utilities/isStagingOrProduccion'

const { TabPane } = Tabs
const { Meta } = Card

function MyAgenda({ event, eventUser, currentEventUserId, eventUsers }) {
  const [isLoading, setIsLoading] = useState(true)
  const [enableMeetings, setEnableMeetings] = useState(false)
  const [acceptedAgendas, setAcceptedAgendas] = useState([])
  const [currentRoom, setCurrentRoom] = useState(null)

  const eventDatesRange = useMemo(() => {
    return getDatesRange(
      event.date_start || event.datetime_from,
      event.date_end || event.datetime_to,
    )
  }, [event.date_start, event.date_end])

  useEffect(() => {
    if (!event || !event._id) return

    firestore
      .collection('events')
      .doc(event._id)
      .onSnapshot(function (doc) {
        setEnableMeetings(doc.data() && !!doc.data().enableMeetings)
      })
  }, [event])

  useEffect(() => {
    if (event._id && currentEventUserId && isNonEmptyArray(eventUsers)) {
      setIsLoading(true)
      getAcceptedAgendasFromEventUser(event._id, currentEventUserId)
        .then((agendas) => {
          if (isNonEmptyArray(agendas)) {
            const newAcceptedAgendas = map((agenda) => {
              const agendaAttendees = path(['attendees'], agenda)
              const otherAttendeeId = isNonEmptyArray(agendaAttendees)
                ? find((attendeeId) => attendeeId !== currentEventUserId, agendaAttendees)
                : null

              if (otherAttendeeId) {
                const otherEventUser = find(propEq('_id', otherAttendeeId), eventUsers)
                return mergeRight(agenda, { otherEventUser })
              } else {
                return agenda
              }
            }, agendas)
            setAcceptedAgendas(newAcceptedAgendas)
          }
        })
        .catch((error) => {
          console.error(error)
          notification.error({
            message: 'Error',
            description: 'Obteniendo las citas del usuario',
          })
        })
        .finally(() => setIsLoading(false))
    }
  }, [event._id, currentEventUserId, eventUsers])

  useEffect(() => {
    if (currentRoom) {
      createChatRoom(currentRoom)
    }
  }, [currentRoom])

  if (isLoading) {
    return (
      <Row align="middle" justify="center" style={{ height: 100 }}>
        <Spin />
        <p>Aun no se encuentran reuniones activas, vuelve mas tarde</p>
      </Row>
    )
  }

  if (currentRoom) {
    const userName =
      eventUser && eventUser.properties
        ? eventUser.properties.names
        : 'Anonimo' + new Date().getTime()
    //https://video-app-1496-dev.twil.io/?UserName=vincent&URLRoomName=hola2&passcode=8816111496
    //

    return (
      <Row align="middle">
        <Col span={24}>
          <Button
            className="button_regresar"
            type="primary"
            onClick={() => {
              setCurrentRoom(null)
            }}
          >
            Regresar al listado de citas
          </Button>
          <Row gutter={[12, 12]}>
            <Col xs={24} sm={24} md={16} xl={16} xxl={16}>
              <div className="aspect-ratio-box" style={{ width: '100%' }}>
                <div className="aspect-ratio-box-inside">
                  <iframe
                    style={{ border: '2px solid blue' }}
                    src={
                      'https://video-app-0463-9499-dev.twil.io?UserName=' +
                      userName +
                      '&URLRoomName=' +
                      currentRoom +
                      '&passcode=52125404639499'
                    }
                    allow="autoplay;fullscreen; camera *;microphone *"
                    allowusermedia
                    allowFullScreen
                    title="video"
                    className="iframe-zoom nuevo"
                  >
                    <p>Your browser does not support iframes.</p>
                  </iframe>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={24} md={8} xl={8} xxl={8}>
              {userName && (
                <iframe
                  title="chatevius"
                  className="ChatEviusLan"
                  src={
                    'https://chatevius.netlify.app?nombre=' +
                    userName +
                    '&chatid=' +
                    currentRoom +
                    '&eventid=' +
                    event._id +
                    '&userid=' +
                    currentEventUserId +
                    '&version=0.0.2' +
                    '&mode=' +
                    isStagingOrProduccion()
                  }
                ></iframe>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }

  return (
    <div>
      {isNonEmptyArray(eventDatesRange) ? (
        <Tabs>
          {eventDatesRange.map((eventDate, eventDateIndex) => {
            const dayAgendas = acceptedAgendas.filter(({ timestamp_start }) => {
              const agendaDate = dayjs(timestamp_start).format('YYYY-MM-DD')
              return agendaDate === eventDate
            })

            return (
              <TabPane
                tab={
                  <div style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>
                    {dayjs(eventDate).format('MMMM DD')}
                  </div>
                }
                key={`event-date-${eventDateIndex}-${eventDate}`}
              >
                {isNonEmptyArray(dayAgendas) ? (
                  dayAgendas.map((acceptedAgenda) => (
                    <>
                      <AcceptedCard
                        key={`accepted-${acceptedAgenda.id}`}
                        eventId={event._id}
                        eventUser={eventUser}
                        data={acceptedAgenda}
                        enableMeetings={enableMeetings}
                        setCurrentRoom={setCurrentRoom}
                      />
                    </>
                  ))
                ) : (
                  <Card style={{ textAlign: 'center' }}>
                    No tienes citas agendadas para esta fecha
                  </Card>
                )}
              </TabPane>
            )
          })}
        </Tabs>
      ) : (
        <Card>No tienes citas actualmente</Card>
      )}
    </div>
  )
}

function AcceptedCard({ data, eventId, eventUser, enableMeetings, setCurrentRoom }) {
  const [isLoading, setIsLoading] = useState(false)
  const [deleted, setDeleted] = useState(false)

  const userName =
    data.owner_id == eventUser._id
      ? data.name ?? 'Sin nombre'
      : data.name_requesting ?? 'Sin nombre'
  const userEmail =
    (data.otherEventUser && data.otherEventUser.properties.email) || data.email
  const userImage =
    (data.otherEventUser && data.otherEventUser.properties.picture) || undefined

  /** Entramos a la sala 1 a 1 de la reunión
   */
  const accessMeetRoom = (data, eventUser) => {
    if (!eventUser) {
      alert('Tenemos problemas con tu usuario, itenta recargar la página')
      return
    }
    const roomName = data.id

    setCurrentRoom(roomName)
  }

  const deleteThisAgenda = () => {
    if (!isLoading) {
      setIsLoading(true)
      deleteAgenda(eventId, data.id)
        .then(() => setDeleted(true))
        .catch((error) => {
          console.error(error)
          notification.error({
            message: 'Error',
            description: 'Error eliminando la cita',
          })
        })
        .finally(() => setIsLoading(false))
    }
  }

  const validDateRoom = (room) => {
    const dateFrom = dayjs(room.timestamp_start).format('YYYY-MM-DD')

    if (dayjs().format('YYYY-MM-DD') == dateFrom) {
      return true
    }
    return false
  }

  return (
    <Row justify="center" style={{ marginBottom: '20px' }}>
      <Card
        headStyle={{ border: 'none' }}
        style={{ width: 600, textAlign: 'left', borderRadius: '10px' }}
        bodyStyle={{ paddingTop: '0px' }}
        bordered
        extra={
          <Popconfirm
            title="¿Desea cancelar/eliminar esta cita?"
            onConfirm={deleteThisAgenda}
            okText="Si"
            cancelText="No"
          >
            <Button type="text" danger disabled={isLoading} loading={isLoading}>
              Cancelar cita
            </Button>
          </Popconfirm>
        }
        title={
          <Space wrap>
            <Typography.Text style={{ fontSize: '12px' }} type="secondary">
              {dayjs(data.timestamp_start).format('hh:mm a')}
            </Typography.Text>
            <Typography.Text style={{ fontSize: '12px' }} type="secondary">
              {dayjs(data.timestamp_end).format('hh:mm a')}
            </Typography.Text>
          </Space>
        }
      >
        <Meta
          avatar={
            userImage ? (
              <Avatar size={50} src={userImage}></Avatar>
            ) : (
              <Avatar size={50}>
                {userName ? userName.charAt(0).toUpperCase() : userName}
              </Avatar>
            )
          }
          title={
            <Typography.Title level={5}>
              {userName || 'No registra nombre'}
            </Typography.Title>
          }
          description={
            <Typography.Paragraph style={{ marginTop: '-15px' }}>
              <Typography.Text type="secondary" style={{ paddingRight: '20px' }}>
                {userEmail || 'No registra correo'}
              </Typography.Text>
              {!!data.message && (
                <p style={{ paddingRight: '20px' }}>
                  <Divider orientation="left" plain style={{ marginBottom: '0px' }}>
                    Mensaje
                  </Divider>
                  <Typography.Paragraph type="secondary" ellipsis={{ rows: 2 }}>
                    {data.message}
                  </Typography.Paragraph>
                </p>
              )}
            </Typography.Paragraph>
          }
        />
        {!deleted ? (
          <Row justify="center">
            <Col xs={24} sm={24} md={12} xl={12}>
              <Button
                block
                type="primary"
                disabled={isLoading || (!enableMeetings && !validDateRoom(data))}
                loading={isLoading}
                onClick={() => {
                  accessMeetRoom(data, eventUser)
                }}
              >
                {validDateRoom(data) && !enableMeetings
                  ? 'Ingresar a reunión'
                  : !validDateRoom(data) && !enableMeetings
                  ? 'Reunión no iniciada'
                  : 'Reunión Cerrada'}
              </Button>
            </Col>
          </Row>
        ) : (
          <Row>{`Cita cancelada.`}</Row>
        )}
      </Card>
    </Row>
  )
}

export default MyAgenda
