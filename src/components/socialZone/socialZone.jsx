import { withRouter } from 'react-router-dom';
import { firestore } from '../../helpers/firebase';
import React, { useEffect, useState, useContext } from 'react';
import { Tabs, Row, Badge, Col, notification, Button, Alert } from 'antd';
import { ArrowLeftOutlined, VideoCameraOutlined, MessageTwoTone, SearchOutlined } from '@ant-design/icons';
import SurveyList from '../events/surveys/surveyList';
import SurveyDetail from '../events/surveys/surveyDetail';
import { connect } from 'react-redux';
import * as StageActions from '../../redux/stage/actions';
import { setCurrentSurvey } from '../../redux/survey/actions';
import AttendeList from './attendees/index';
import * as notificationsActions from '../../redux/notifications/actions';
import ChatList from './ChatList';
import GameRanking from '../events/game/gameRanking';
import { useRef } from 'react';
import { UseEventContext } from '../../Context/eventContext';
import { UseCurrentUser } from '../../Context/userContext';
import { HelperContext } from '../../Context/HelperContext';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { monitorEventPresence } from './hooks';
const { setMainStage } = StageActions;
const { TabPane } = Tabs;
const callback = () => {};
const { setNotification } = notificationsActions;
const styleTabAttendes = {
  backgroundColor: '#ffffff4d',
  padding: 5,
  borderRadius: '10px',
};

let SocialZone = function(props) {
  //contextos
  let cEvent = UseEventContext();
  let cUser = UseCurrentUser();

  const [attendeeList, setAttendeeList] = useState({});
  const [attendeeListPresence, setAttendeeListPresence] = useState({});
  const [availableChats, setavailableChats] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [totalNewMessages, setTotalNewMessages] = useState(0);
  let [datamsjlast, setdatamsjlast] = useState();
  let [busqueda, setBusqueda] = useState(null);
  let [strAttende, setstrAttende] = useState();
  let [isFiltered, setIsFiltered] = useState(false);
  let busquedaRef = useRef();
  let history = useHistory();
  let { HandleGoToChat } = useContext(HelperContext);
  let userName = cUser.value ? cUser.value?.names : cUser.value?.name ? cUser.value?.name : '---';

  useEffect(() => {
    if (cEvent.value) {
      monitorEventPresence(cEvent.value._id, attendeeList, setAttendeeListPresence);
    }
  }, [cEvent.value]);

  let generateUniqueIdFromOtherIds = (ida, idb) => {
    return ida < idb ? ida + '_' + idb : idb + '_' + ida;
  };

  let createNewOneToOneChat = (idcurrentUser, currentName, idOtherUser, otherUserName) => {
    console.log('====================================');
    console.log("veces ejecuta");
    console.log('====================================');
    let newId = generateUniqueIdFromOtherIds(idcurrentUser, idOtherUser);
    let data = {};
    //agregamos una referencia al chat para el usuario actual
    data = { id: newId, name: otherUserName || '--', participants: [idcurrentUser, idOtherUser], type: 'onetoone' };
    firestore
      .doc('eventchats/' + cEvent.value._id + '/userchats/' + idcurrentUser + '/' + 'chats/' + newId)
      .set(data, { merge: true });

    //agregamos una referencia al chat para el otro usuario del chat
    data = { id: newId, name: currentName || '--', participants: [idcurrentUser, idOtherUser], type: 'onetoone' };
    firestore
      .doc('eventchats/' + cEvent.value._id + '/userchats/' + idOtherUser + '/' + 'chats/' + newId)
      .set(data, { merge: true });

    HandleGoToChat(idcurrentUser, idOtherUser, currentName,newId);
  };

  const handleChange = async (e) => {
    const { value } = e.target;
    setBusqueda(value);
  };

  const searhAttende = () => {
    if (!isFiltered && (busqueda != undefined || busqueda != '')) {
      setstrAttende(busqueda);
      setIsFiltered(true);
    } else {
      setIsFiltered(false);
      setstrAttende('');
      setBusqueda(null);
      //
      busquedaRef.current.value = '';
    }
  };

  useEffect(() => {
    setTotalNewMessages(props.totalMessages);
  }, []);

  //Cargar la lista de chats de una persona

  useEffect(() => {
    if (cEvent.value == null) return;
    let colletion_name = cEvent.value._id + '_event_attendees';
    let attendee;
    firestore
      .collection(colletion_name)
      .orderBy('state_id', 'asc')
      .onSnapshot(function(querySnapshot) {
        let list = {};

        querySnapshot.forEach((doc) => {
          attendee = doc.data();
          let localattendee = attendeeList[attendee.user?.uid] || {};
          list[attendee.user?.uid] = { ...localattendee, ...attendee };
        });

        setAttendeeList(list);

        //setEnableMeetings(doc.data() && doc.data().enableMeetings ? true : false);
      });
  }, [cEvent.value]);

  useEffect(() => {
    if (cEvent.value == null || cUser.value == null) return;

    firestore
      .collection('eventchats/' + cEvent.value._id + '/userchats/' + cUser.value.uid + '/' + 'chats/')
      .onSnapshot(function(querySnapshot) {
        let list = [];
        let data;
        let newmsj = 0;
        querySnapshot.forEach((doc) => {
          data = doc.data();

          if (data.newMessages) {
            newmsj += !isNaN(parseInt(data.newMessages.length)) ? parseInt(data.newMessages.length) : 0;
          }

          list.push(data);
        });

        let change = querySnapshot.docChanges()[0];
        setdatamsjlast(change?.doc.data());
        let userNameFirebase = null;
        if (change) {
          if (change.doc.data().remitente) {
            if (
              change.doc
                .data()
                .remitente.toLowerCase()
                .indexOf('(admin)') > -1 ||
              change.doc
                .data()
                .remitente.toLowerCase()
                .indexOf('(casa)')
            ) {
              // QUITAR ALGUNOS PREFIJOS PARA HACER EL MATCH DE NOMBRE ******HAY QUE MEJORAR*******
              userNameFirebase = change.doc.data().remitente.replace('(admin)', '');
              userNameFirebase = change.doc.data().remitente.replace('(casa)', '');
            }
          }
        }
        if (change) {
          if (
            userName !== userNameFirebase &&
            change.doc.data().remitente !== null &&
            change.doc.data().remitente !== undefined &&
            newmsj > 0
          ) {
            notification.open({
              description: `Nuevo mensaje de ${change.doc.data().remitente}`,
              icon: <MessageTwoTone />,
              onClick: () => {
                props.settabselected('chat2');
                // setCurrentChat(change.doc.data().id, change.doc.data().name);
                notification.destroy();
              },
            });

            newmsj > 0 && setTotalNewMessages(newmsj);
          }
        }

        setavailableChats(list);
      });
  }, [cEvent.value, cUser.value, props.collapse, attendeeList]);

  function redirectRegister() {
    history.push(`/landing/${cEvent.value._id}/tickets`);
  }

  return (
    <Tabs
      defaultActiveKey='2'
      onChange={callback}
      activeKey={props.tabselected}
      onTabClick={(key) => {
        props.settabselected(key);
      }}>
      {(props.generalTabs.publicChat || props.generalTabs.privateChat) && (
        <TabPane
          className='asistente-chat-list'
          tab={
            <>
              {props.totalMessages !== undefined && props.totalMessages > 0 && (
                <Badge
                  onClick={() => props.settabselected('1')}
                  size='small'
                  style={{ minWidth: '10px', height: '10px', padding: '0px', color: 'black' }}
                  count={' '}>
                  Chats
                </Badge>
              )}
              {props.totalMessages !== undefined && props.totalMessages == 0 && (
                <div style={{ color: cEvent.value.styles.textMenu }} onClick={() => props.settabselected('1')}>
                  Chats
                </div>
              )}
            </>
          }
          key='1'>
          <ChatList
            props={props}
            availableChats={availableChats}
            totalNewMessages={totalNewMessages}
            setTotalNewMessages={setTotalNewMessages}
            settabselected={props.settabselected}
            tabselected={props.tabselected}
            setCurrentUser={setCurrentUser}
            datamsjlast={datamsjlast}
            generalTabs={props.generalTabs}
            notNewMessages={props.notNewMessages}
            chattab={props.chattab}
            setchattab={props.setchattab}
          />
        </TabPane>
      )}
      {props.generalTabs.attendees && (
        <>
          {' '}
          <TabPane
            style={styleTabAttendes}
            tab={
              <div style={{ color: cEvent.value.styles.textMenu }}>
                <FormattedMessage id='tabs.attendees.socialzone' defaultMessage='Asistentes' />
              </div>
            }
            key='2'>
            <Row>
              <Col sm={21}>
                {!Object.keys(attendeeList).length ? (
                  ''
                ) : (
                  <div className='control' style={{ marginBottom: '10px', marginRight: '5px', color: 'white' }}>
                    <input
                      style={{ color: 'white' }}
                      ref={busquedaRef}
                      autoFocus
                      className='input'
                      type='text'
                      name={'name'}
                      onChange={handleChange}
                      placeholder='Buscar Participante...'
                    />
                  </div>
                )}
              </Col>
              <Col sm={2}>
                {!Object.keys(attendeeList).length ? null : (
                  <>
                    {busqueda !== null && (
                      <Button shape='circle' onClick={searhAttende}>
                        {!isFiltered && <SearchOutlined />}
                        {isFiltered && 'X'}
                      </Button>
                    )}
                  </>
                )}
              </Col>
            </Row>
            <div className='asistente-list'>
              {!Object.keys(attendeeList).length ? (
                <Row justify='center'>
                  <p>No hay asistentes aún</p>
                </Row>
              ) : (
                <AttendeList
                  agendarCita={props.agendarCita}
                  notificacion={props.notificacion}
                  sendFriendship={props.sendFriendship}
                  perfil={props.perfil}
                  section={props.section}
                  containNetWorking={props.containNetWorking}
                  busqueda={strAttende}
                  createNewOneToOneChat={createNewOneToOneChat}
                  attendeeList={attendeeList}
                  attendeeListPresence={attendeeListPresence}
                  settabselected={props.settabselected}
                  setchattab={props.setchattab}
                />
              )}
            </div>
          </TabPane>
        </>
      )}

      {props.currentActivity !== null && props.tabs && (props.tabs.surveys === true || props.tabs.surveys === 'true') && (
        <TabPane
          className='asistente-survey-list asistente-list'
          tab={
            <div style={{ marginBottom: '0px' }}>
              <Badge dot={props.hasOpenSurveys} size='default'>
                <span style={{ color: cEvent.value.styles.textMenu }}>
                  <FormattedMessage id='tabs.surveys.socialzone' defaultMessage='Encuestas' />
                </span>
              </Badge>
            </div>
          }
          key='3'>
          <Row
            justify='space-between'
            style={{ display: 'pointer' }}
            onClick={() => {
              props.setMainStage(null);
              props.settabselected('1');
            }}>
            {/* <Col span={24}>
              <Button
                style={{ backgroundColor: '#1cdcb7', color: '#ffffff' }}
                size='large'
                icon={<VideoCameraOutlined />}
                block
                onClick={() => {
                  props.setMainStage(null);
                  props.settabselected('1');
                  // props.tcollapse();
                }}>
                Volver a la Conferencia
              </Button>
            </Col> */}
          </Row>
          {cUser.value !== null ? (
            <SurveyList
              eventSurveys={props.eventSurveys}
              publishedSurveys={props.publishedSurveys}
              listOfEventSurveys={props.listOfEventSurveys}
              loadingSurveys={props.loadingSurveys}
            />
          ) :  (
            <div style={{ paddingTop: 30 }}>
              <Alert
                showIcon
                message='Para poder responder una encuesta debes ser usuario del sistema'
                type='warning'
              />
              <Row style={{ marginTop: 30 }} justify='center'>
                <Button onClick={redirectRegister}>Registrarme</Button>
              </Row>
            </div>
          )}
        </TabPane>
      )}

      {props.currentActivity !== null && props.tabs && (props.tabs.games === true || props.tabs.games === 'true') && (
        <TabPane
          className='asistente-survey-list'
          tab={
            <>
              <p
                style={{ marginBottom: '0px', color: cEvent.value.styles.textMenu }}
                className='lowerTabs__mobile-hidden'>
                <FormattedMessage id='tabs.games.socialzone' defaultMessage='Juegos' />
              </p>
            </>
          }
          key='4'>
          <Row justify='space-between'>
            <Col span={4}>
              <ArrowLeftOutlined
                style={{ color: cEvent.value.styles.textMenu }}
                onClick={() => {
                  props.setMainStage(null);
                  props.settabselected('');
                  props.tcollapse();
                }}
              />
            </Col>
            <Col span={14}>
              <h2 style={{ fontWeight: '700', color: cEvent.value.styles.textMenu }}> Volver a la Conferencia </h2>
            </Col>
            <Col span={4}>
              <VideoCameraOutlined style={{ color: cEvent.value.styles.textMenu }} />
            </Col>
          </Row>

          <GameRanking currentUser={currentUser} cEvent={cEvent.value} />
        </TabPane>
      )}
    </Tabs>
  );
};

const mapStateToProps = (state) => ({
  mainStage: state.stage.data.mainStage,
  currentSurvey: state.survey.data.currentSurvey,
  hasOpenSurveys: state.survey.data.hasOpenSurveys,
  currentActivity: state.stage.data.currentActivity,
  event: state.event.data,
  viewNotification: state.notifications.data,
  tabs: state.stage.data.tabs,
});

const mapDispatchToProps = {
  setMainStage,
  setNotification,
  setCurrentSurvey,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SocialZone));
