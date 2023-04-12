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
import TabComponent from './components/my-agenda/TabComponent';

function MyAgenda({ event, eventUser, currentEventUserId, eventUsers }) {
  const [enableMeetings, setEnableMeetings] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const { listDays, haveMeetings, loading } = useGetMeetingConfirmed();
  useEffect(() => {
    if (!event || !event._id) return;

    firestore
      .collection('events')
      .doc(event._id)
      .onSnapshot(function(doc) {
        setEnableMeetings(doc.data() && doc.data().enableMeetings ? true : false);
      });
  }, [event]);

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
      <div>
        {haveMeetings ? (
          <TabComponent
            listTabPanels={listDays}
            eventUser={eventUser}
            enableMeetings={enableMeetings}
            setCurrentRoom={setCurrentRoom}
            eventId={event._id}
          />
        ) : (
          <Card>{'No tienes citas actualmente'}</Card>
        )}
      </div>
    </>
  );
}

export default withRouter(MyAgenda);
