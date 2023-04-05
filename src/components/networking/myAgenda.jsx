import { Button, Card, Col, notification, Row, Spin, Tabs } from 'antd';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import { find, map, mergeRight, path, propEq } from 'ramda';
import { isNonEmptyArray } from 'ramda-adjunct';
import { useEffect, useMemo, useState } from 'react';
import { firestore } from '../../helpers/firebase';
import { getDatesRange } from '../../helpers/utils';
import { getAcceptedAgendasFromEventUser } from './services';
import { createChatRoom } from './agendaHook';
import { isStagingOrProduccion } from '@/Utilities/isStagingOrProduccion';
import useGetMeetingConfirmed from './hooks/useGetMeetingConfirmed';
import AcceptedCard from './components/my-agenda/AcceptedCard';
import TabComponent from './components/my-agenda/TabComponent';

const { TabPane } = Tabs;

function MyAgenda({ event, eventUser, currentEventUserId, eventUsers }) {
  const eventDatesRange = useMemo(() => {
    return getDatesRange(event.date_start || event.datetime_from, event.date_end || event.datetime_to);
  }, [event.date_start, event.date_end]);

  const [loading, setLoading] = useState(true);
  const [enableMeetings, setEnableMeetings] = useState(false);
  const [acceptedAgendas, setAcceptedAgendas] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const { loading: loadingMeeting, listDays, haveMeetings } = useGetMeetingConfirmed();

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
                      '&passcode=52125404639499'
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
                  }></iframe>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }

  return (
    <>
      {/* <div>
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
      </div> */}

      <div>

      {
          haveMeetings? (<TabComponent listTabPanels={listDays} eventUser={eventUser} enableMeetings={enableMeetings} setCurrentRoom={setCurrentRoom}/>):(
            <Card>{'No tienes citas actualmente'}</Card>
          )
        }
      </div>
    </>
  );
}

export default withRouter(MyAgenda);
