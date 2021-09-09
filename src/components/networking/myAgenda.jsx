import { Avatar, Button, Card, Col, Modal, notification, Row, Spin, Tabs } from 'antd';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import { find, map, mergeRight, path, pathOr, propEq } from 'ramda';
import { isNonEmptyArray } from 'ramda-adjunct';
import React, { useEffect, useMemo, useState } from 'react';
import { firestore } from '../../helpers/firebase';
import { getDatesRange } from '../../helpers/utils';
import { deleteAgenda, getAcceptedAgendasFromEventUser } from './services';

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

  useEffect(() => {}, []);
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
                  className='ChatEvius'
                  style={{ width: 400, height: 373 }}
                  src={'https://chatevius.web.app?nombre=' + userName + '&chatid=' + currentRoom}></iframe>
              )}
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
  console.log("EVENT USER==>",data)

  //const userName = pathOr('', ['names','name'], data);
  const userName =data.owner_id==eventUser._id?data.name ??'Sin nombre':data.name_requesting??'Sin nombre';
  //const userEmail = pathOr('', ['otherEventUser', 'properties', 'email'], data);
  const userEmail = (data.otherEventUser && data.otherEventUser.properties.email) || data.email;

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
      <Card style={{ width: 600, textAlign: 'left' }} bordered={true}>
        <div style={{ marginBottom: '10px' }}>{'Cita con: '}</div>
        <Meta
          avatar={<Avatar>{userName ? userName.charAt(0).toUpperCase() : userName}</Avatar>}
          title={userName || 'No registra nombre'}
          description={
            <div>
              <Row className='mi_agenda' justify='space-around'>
                <Col xs={24} sm={24} md={24} lg={16} xl={16} xxl={16}>
                  <p>{userEmail || 'No registra correo'}</p>
                  {!!data.message && (
                    <p style={{ paddingRight: '20px' }}>
                      {'Mensaje: '}
                      {data.message}
                    </p>
                  )}
                </Col>
                <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
                  <Row justify='center'>
                    <div style={{ textTransform: 'capitalize' }}>{moment(data.timestamp_start).format('MMMM DD')}</div>
                    <div>{moment(data.timestamp_start).format('hh:mm a')}</div>
                    {' - '}
                    <div>{moment(data.timestamp_end).format('hh:mm a')}</div>
                  </Row>
                </Col>
              </Row>
              <br />
              {!deleted ? (
                <Row justify='center'>
                  <Col xs={24} sm={24} md={12} xl={12}>
                    <Button
                      type='primary'
                      disabled={loading || enableMeetings}
                      loading={loading}
                      onClick={() => {
                        accessMeetRoom(data, eventUser);
                      }}>
                      {!enableMeetings ? 'Ingresar a reunión' : 'Reunión Cerrada'}
                    </Button>
                    <br />
                  </Col>
                  <Col xs={24} sm={24} md={12} xl={12}>
                    <Button
                      type='danger'
                      disabled={loading}
                      loading={loading}
                      onClick={() => {
                        confirm({
                          title: 'Confirmar cancelación',
                          content: '¿Desea cancelar/eliminar esta cita?',
                          okText: 'Si',
                          cancelText: 'No',
                          onOk: deleteThisAgenda,
                        });
                      }}>
                      {'Cancelar'}
                    </Button>
                  </Col>
                </Row>
              ) : (
                <Row>{`Cita cancelada.`}</Row>
              )}
            </div>
          }
        />
      </Card>
    </Row>
  );
}

export default withRouter(MyAgenda);
