import { Avatar, Button, Card, Col, Modal, notification, Row, Spin, Tabs, Space, Typography, Popconfirm, Divider } from 'antd';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import { find, map, mergeRight, path, propEq } from 'ramda';
import { isNonEmptyArray } from 'ramda-adjunct';
import React, { useEffect, useMemo, useState } from 'react';
import { firestore } from '../../helpers/firebase';
import { getDatesRange } from '../../helpers/utils';
import { deleteAgenda, getAcceptedAgendasFromEventUser } from './services';
import { createChatRoom } from './agendaHook';

const { TabPane } = Tabs;
const { Meta } = Card;
const { confirm } = Modal;

function MyAgenda({ event, eventUser, currentEventUserId, eventUsers }) {
  const [loading, setLoading] = useState(true);
  const [enableMeetings, setEnableMeetings] = useState(false);
  const [acceptedAgendas, setAcceptedAgendas] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);

  const eventDatesRange = useMemo(() => {
    return getDatesRange(event.date_start || event.datetime_from, event.date_end || event.datetime_to);
  }, [event.date_start, event.date_end]);

  useEffect(() => {
    if (!event || !event._id) return;

    firestore
      .collection('events')
      .doc(event._id)
      .onSnapshot(function(doc) {
        setEnableMeetings(doc.data() && doc.data().enableMeetings ? true : false);
      });
  }, [event]);

  useEffect(() => {
    if (event._id && currentEventUserId && isNonEmptyArray(eventUsers)) {
      setLoading(true);
      getAcceptedAgendasFromEventUser(event._id, currentEventUserId)
        .then((agendas) => {
          if (isNonEmptyArray(agendas)) {
            const newAcceptedAgendas = map((agenda) => {
              const agendaAttendees = path(['attendees'], agenda);
              const otherAttendeeId = isNonEmptyArray(agendaAttendees)
                ? find((attendeeId) => attendeeId !== currentEventUserId, agendaAttendees)
                : null;

              if (otherAttendeeId) {
                const otherEventUser = find(propEq('_id', otherAttendeeId), eventUsers);
                return mergeRight(agenda, { otherEventUser });
              } else {
                return agenda;
              }
            }, agendas);
            setAcceptedAgendas(newAcceptedAgendas);
          }
        })
        .catch((error) => {
          console.error(error);
          notification.error({
            message: 'Error',
            description: 'Obteniendo las citas del usuario',
          });
        })
        .finally(() => setLoading(false));
    }
  }, [event._id, currentEventUserId, eventUsers]);

  useEffect(() => {
    if (currentRoom) {
      createChatRoom(currentRoom);
    }
  }, [currentRoom]);

  if (loading) {
    return (
      <Row align='middle' justify='center' style={{ height: 100 }}>
        <Spin />
        <p>Aun no se encuentran reuniones activas, vuelve mas tarde</p>
      </Row>
    );
  }

  if (currentRoom) {
    let userName = eventUser && eventUser.properties ? eventUser.properties.names : 'Anonimo' + new Date().getTime();
    //https://video-app-1496-dev.twil.io/?UserName=vincent&URLRoomName=hola2&passcode=8816111496
    //

    return (
      <Row align='middle'>
        <Col span={24}>
          <Button
            className='button_regresar'
            type='primary'
            onClick={() => {
              setCurrentRoom(null);
            }}>
            Regresar al listado de citas
          </Button>
          <Row gutter={[12, 12]}>
            <Col xs={24} sm={24} md={16} xl={16} xxl={16}>
              <div className='aspect-ratio-box' style={{ width: '100%' }}>
                <div className='aspect-ratio-box-inside'>
                  <iframe
                    style={{ border: '2px solid blue' }}
                    src={
                      'https://video-app-0463-9499-dev.twil.io?UserName=' +
                      userName +
                      '&URLRoomName=' +
                      currentRoom +
                      '&passcode=07945704639499'
                    }
                    allow='autoplay;fullscreen; camera *;microphone *'
                    allowusermedia
                    allowFullScreen
                    title='video'
                    className='iframe-zoom nuevo'>
                    <p>Your browser does not support iframes.</p>
                  </iframe>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={24} md={8} xl={8} xxl={8}>
              {userName && (
                <iframe
                  title='chatevius'
                  className='ChatEviusLan'
                  src={
                    'https://chatevius.web.app?nombre=' +
                    userName +
                    '&chatid=' +
                    currentRoom +
                    '&eventid=' +
                    event._id +
                    '&userid=' +
                    currentEventUserId +
                    '&version=0.0.2'
                  }></iframe>
              )

              // https://chatevius.web.app?nombre=Pruebas Mocionsoft&chatid=6XNNGi7NCpQXHwOmU6xy

              // <iframe
              //   title='chatevius'
              //   className='ChatEvius'
              //   style={{ width: 400, height: 373 }}
              //   src={'https://chatevius.web.app?nombre=' + userName + '&chatid=' + currentRoom}></iframe>
              }
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }

  return (
    <div>
      {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
      {/* <Switch>
          <Route path={props.match.url+"listadoCitas"} render={(props) => (
             <ListadoCitas {...props}/>
          )} />
            
            <Route path={props.match.url+"/reunion"} render={(props) => (
          
            <Reunion {...props}/>
            )} />
          
          <Route path={props.match.url+""} render={(props) => (
            <ListadoCitas {...props}/>
            )} />
        </Switch> */}

      {isNonEmptyArray(eventDatesRange) ? (
        <Tabs>
          {eventDatesRange.map((eventDate, eventDateIndex) => {
            const dayAgendas = acceptedAgendas.filter(({ timestamp_start }) => {
              const agendaDate = moment(timestamp_start).format('YYYY-MM-DD');
              return agendaDate === eventDate;
            });

            return (
              <TabPane
                tab={
                  <div style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>
                    {moment(eventDate).format('MMMM DD')}
                  </div>
                }
                key={`event-date-${eventDateIndex}-${eventDate}`}>
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
                  <Card style={{ textAlign: 'center' }}>{'No tienes citas agendadas para esta fecha'}</Card>
                )}
              </TabPane>
            );
          })}
        </Tabs>
      ) : (
        <Card>{'No tienes citas actualmente'}</Card>
      )}
    </div>
  );
}

function AcceptedCard({ data, eventId, eventUser, enableMeetings, setCurrentRoom }) {
  const [loading, setLoading] = useState(false);
  const [deleted, setDeleted] = useState(false);
  console.log('EVENT USER==>', data);

  //const userName = pathOr('', ['names','name'], data);
  const userName = data.owner_id == eventUser._id ? data.name ?? 'Sin nombre' : data.name_requesting ?? 'Sin nombre';
  //const userEmail = pathOr('', ['otherEventUser', 'properties', 'email'], data);
  const userEmail = (data.otherEventUser && data.otherEventUser.properties.email) || data.email;
  const userImage = (data.otherEventUser && data.otherEventUser.properties.picture) || undefined;

  /** Entramos a la sala 1 a 1 de la reunión
   *
   */
  const accessMeetRoom = (data, eventUser) => {
    if (!eventUser) {
      alert('Tenemos problemas con tu usuario, itenta recargar la página');
      return;
    }
    let roomName = data.id;

    setCurrentRoom(roomName);
  };

  const deleteThisAgenda = () => {
    if (!loading) {
      setLoading(true);
      deleteAgenda(eventId, data.id)
        .then(() => setDeleted(true))
        .catch((error) => {
          console.error(error);
          notification.error({
            message: 'Error',
            description: 'Error eliminando la cita',
          });
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <Row justify='center' style={{ marginBottom: '20px' }}>
      <Card
        headStyle={{ border: 'none' }}
        style={{ width: 600, textAlign: 'left', borderRadius:'10px' }}
        bodyStyle={{ paddingTop: '0px' }}
        bordered={true}
        extra={
          <Popconfirm
            title='¿Desea cancelar/eliminar esta cita?'
            onConfirm={deleteThisAgenda}
            okText='Si'
            cancelText='No'>
            <Button type='text' danger disabled={loading} loading={loading}>
              {'Cancelar Cita'}
            </Button>
          </Popconfirm>
        }
        title={
          <Space wrap>
            {/* <div style={{ textTransform: 'capitalize' }}>{moment(data.timestamp_start).format('MMMM DD')}</div> */}
            <Typography.Text style={{ fontSize: '12px' }} type='secondary'>
              {moment(data.timestamp_start).format('hh:mm a')}
            </Typography.Text>
            <Typography.Text style={{ fontSize: '12px' }} type='secondary'>
              {moment(data.timestamp_end).format('hh:mm a')}
            </Typography.Text>
          </Space>
        }>
        {/* <div style={{ marginBottom: '10px' }}>{'Cita con: '}</div> */}
        <Meta
          avatar={
            userImage ? (
              <Avatar size={50} src={userImage}></Avatar>
            ) : (
              <Avatar size={50}>{userName ? userName.charAt(0).toUpperCase() : userName}</Avatar>
            )
          }
          title={<Typography.Title level={5}>{userName || 'No registra nombre'}</Typography.Title>}
          description={
            <Typography.Paragraph style={{marginTop:'-15px'}}>
              <Typography.Text type='secondary' style={{ paddingRight: '20px' }}>{userEmail || 'No registra correo'}</Typography.Text>
              {!!data.message && (
                <p style={{ paddingRight: '20px' }}>
                  <Divider orientation="left" plain style={{marginBottom:'0px'}}>Mensaje</Divider>
                  <Typography.Paragraph type='secondary' ellipsis={{rows:2}}>{data.message}</Typography.Paragraph>
                </p>
              )}
            </Typography.Paragraph>
          }
        />
        {!deleted ? (
          <Row justify='center'>
            <Col xs={24} sm={24} md={12} xl={12}>
              <Button
                block
                type='primary'
                disabled={loading || enableMeetings}
                loading={loading}
                onClick={() => {
                  accessMeetRoom(data, eventUser);
                }}>
                {!enableMeetings ? 'Ingresar a reunión' : 'Reunión Cerrada'}
              </Button>
            </Col>
          </Row>
        ) : (
          <Row>{`Cita cancelada.`}</Row>
        )}
      </Card>
    </Row>
  );
}

export default withRouter(MyAgenda);
