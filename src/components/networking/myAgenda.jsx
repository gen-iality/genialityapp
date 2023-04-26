import { Button, Card, Col, notification, Row, Spin, Typography } from 'antd';
import { withRouter } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { firestore } from '../../helpers/firebase';
import { isStagingOrProduccion } from '@/Utilities/isStagingOrProduccion';
import useGetMeetingConfirmed from './hooks/useGetMeetingConfirmed';
import TabComponent from './components/my-agenda/TabComponent';
import { JitsiMeeting } from '@jitsi/react-sdk';
import {INITIAL_MEET_CONFIG} from './utils/utils' 
import { LeftOutlined } from '@ant-design/icons';
import { getConfig } from './services/configuration.service';
function MyAgenda({ event, eventUser, currentEventUserId, eventUsers }) {
  const [enableMeetings, setEnableMeetings] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [meetConfig, setMeetConfig] = useState(INITIAL_MEET_CONFIG);
  const { listDays, haveMeetings, loading } = useGetMeetingConfirmed();

  const defineName = () => {
    let userName = 'Anonimo' + new Date().getTime();
    let userEmail = `${userName}@gmail.com`
    if(eventUser && eventUser.properties && eventUser.properties.names ) userName = eventUser.properties.names
    if(eventUser && eventUser.properties && eventUser.properties.email ) userEmail = eventUser.properties.email
    
    return {
      userName,
      userEmail
    }
  }
  const loadConfigMeet = async () => {
    const data = await getConfig(event._id);
    console.log('configuracion',data)
    if (data?.ConfigMeet) setMeetConfig(data.ConfigMeet);
    };

  useEffect(() => {
    if (!event || !event._id) return;
    loadConfigMeet()
    firestore
      .collection('events')
      .doc(event._id)
      .onSnapshot(function(doc) {
        setEnableMeetings(doc.data() && doc.data().enableMeetings ? true : false);
      });
  }, [event]);

  if (loading) {
    return (
      <Row align='middle' justify='center' >
        <Spin 
          size='large'
          tip={<Typography.Text strong>Cargando...</Typography.Text>}/>
      </Row>
    );
  }

  if (currentRoom) {
    const {userEmail, userName} = defineName()


    return (
      <Row align='middle'>
        <Col span={24}>
          <Button
            className='button_regresar'
            type='primary'
            danger
            icon={<LeftOutlined />}
            onClick={() => {
              setCurrentRoom(null);
            }}>
            Regresar al listado de citas
          </Button>
          <Row gutter={[12, 12]}>
            <Col xs={24} sm={24} md={12} lg={24} xl={16} xxl={16}>
              <div className='aspect-ratio-box' style={{ width: '100%' }}>
                <div className='aspect-ratio-box-inside'>
                  <JitsiMeeting
                    domain='meet.evius.co'
                    roomName={currentRoom}
                    configOverwrite={meetConfig.config} 
                    userInfo={{
                      displayName : userName,
                      email : userEmail
                    }}
                    getIFrameRef={(wrapperRef) => {
                      wrapperRef.style.height = '100%';
                      wrapperRef.lang = 'es';
                    }}
                    onApiReady={(externalApi) => {
                      console.log(externalApi);
                    }}
                  />
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
