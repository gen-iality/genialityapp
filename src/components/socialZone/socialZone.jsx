import { withRouter } from 'react-router-dom';
import { firestore } from '../../helpers/firebase';
import React, { useEffect, useMemo, useState } from 'react';
import { Tabs, Row, Badge, Col, notification, Button, Spin } from 'antd';
import { ArrowLeftOutlined, VideoCameraOutlined, MessageTwoTone, SearchOutlined } from '@ant-design/icons';
import { getCurrentUser } from '../../helpers/request';
import initUserPresence from '../../containers/userPresenceInEvent';
import SurveyList from '../events/surveys/surveyList';
import SurveyDetail from '../events/surveys/surveyDetail';
import { connect } from 'react-redux';
import * as StageActions from '../../redux/stage/actions';
import { setCurrentSurvey } from '../../redux/survey/actions';

import AttendeList from './attendees/index';
import * as notificationsActions from '../../redux/notifications/actions';
import ChatList from './ChatList';
import { monitorEventPresence } from './hooks';
import GameRanking from '../events/game/gameRanking';
import { useRef } from 'react';

const { setMainStage } = StageActions;

const { TabPane } = Tabs;
const callback = () => {};
const { setNotification } = notificationsActions;

let SocialZone = function(props) {
  const [attendeeList, setAttendeeList] = useState({});
  const [attendeeListPresence, setAttendeeListPresence] = useState({});
  const [currentChat, setCurrentChatInner] = useState(null);
  const [currentChatName, setCurrentChatNameInner] = useState('');
  const [availableChats, setavailableChats] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentTab, setcurrentTab] = useState('1');
  const [totalNewMessages, setTotalNewMessages] = useState(0);
  let [datamsjlast, setdatamsjlast] = useState();
  let [busqueda, setBusqueda] = useState();
  let [strAttende, setstrAttende] = useState();
  let [isFiltered, setIsFiltered] = useState(false);
  let busquedaRef = useRef();

  useEffect(() => {
    if (props.updateChat.idCurentUser) {
      createNewOneToOneChat(
        props.updateChat.idCurentUser,
        props.updateChat.currentName,
        props.updateChat.idOtherUser,
        props.updateChat.otherUserName
      );
    }
  }, [props.updateChat]);

  let userName = props.currentUser
    ? props.currentUser?.names
    : props.currentUser?.name
    ? props.currentUser?.name
    : '---';

  let usuarioactivo = props.currentUser?.name;

  /***********/

  let event_id = props.event_id;
  let tab = props.tab;

  let setCurrentChat = (id, chatname) => {
    setcurrentTab('1'); //chats tab
    setCurrentChatInner(id);
    setCurrentChatNameInner(chatname);
    setchattab('chat2'); //selecciona el tab de un chat privado
  };

  let generateUniqueIdFromOtherIds = (ida, idb) => {
    return ida < idb ? ida + '_' + idb : idb + '_' + ida;
  };

  let [chattab, setchattab] = useState('chat1');

  let createNewOneToOneChat = (idcurrentUser, currentName, idOtherUser, otherUserName) => {
    let newId = generateUniqueIdFromOtherIds(idcurrentUser, idOtherUser);
    let data = {};

    //agregamos una referencia al chat para el usuario actual
    data = { id: newId, name: otherUserName || '--', participants: [idcurrentUser, idOtherUser], type: 'onetoone' };
    firestore
      .doc('eventchats/' + event_id + '/userchats/' + idcurrentUser + '/' + 'chats/' + newId)
      .set(data, { merge: true });

    //agregamos una referencia al chat para el otro usuario del chat
    data = { id: newId, name: currentName || '--', participants: [idcurrentUser, idOtherUser], type: 'onetoone' };
    firestore
      .doc('eventchats/' + event_id + '/userchats/' + idOtherUser + '/' + 'chats/' + newId)
      .set(data, { merge: true });
    setCurrentChat(newId, otherUserName);
  };

  const inicializada = useMemo(() => initUserPresence(event_id), [event_id]);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setBusqueda(value);
  };

  const searhAttende = () => {
    if (!isFiltered && (busqueda != undefined || busqueda != '')) {
      setstrAttende(busqueda);
      setIsFiltered(true);
    } else {
      setIsFiltered(false);
      setstrAttende('');
      setBusqueda('');
      //
      busquedaRef.current = '';
    }
  };

  const flagmonitorEventPresence = useMemo(
    () => monitorEventPresence(event_id, attendeeList, setAttendeeListPresence),
    [event_id]
  );

  useEffect(() => {
    //
    const fetchData = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);

      setcurrentTab('' + tab);

      props.optionselected(tab == 1 ? 'attendees' : tab == 3 ? 'survey' : tab == 2 ? 'chat' : 'game');
    };
    setTotalNewMessages(props.totalMessages);
    fetchData();
  }, []);

  //Cargar la lista de chats de una persona
  let nombreactivouser = props.currentUser?.names;
  useEffect(() => {
    if (!event_id || !currentUser) return;

    firestore
      .collection('eventchats/' + event_id + '/userchats/' + currentUser.uid + '/' + 'chats/')
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
                setchattab('chat2');

                setCurrentChat(change.doc.data().id, change.doc.data()._name);
                notification.destroy();
              }
            });

            newmsj > 0 && setTotalNewMessages(newmsj);
          }
        }

        setavailableChats(list);
      });
  }, [event_id, currentUser, props.collapse]);

  useEffect(() => {
    if (!event_id) return;

    let colletion_name = event_id + '_event_attendees';
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
  }, [event_id]);

  return (
    <Tabs
      defaultActiveKey='1'
      onChange={callback}
      activeKey={currentTab}
      onTabClick={(key) => {
        setcurrentTab(key);

        if (key == '4') {
          props.setMainStage('game');
        }

        props.optionselected(key == '2' ? 'attendees' : key == '3' ? 'survey' : key == '1' ? 'chat' : 'game');
      }}>
      {(props.generalTabs.publicChat || props.generalTabs.privateChat) && (
        <TabPane
          className='asistente-chat-list'
          tab={
            <>
              {props.totalMessages !== undefined && props.totalMessages > 0 && (
                <Badge
                  onClick={() => setchattab('chat1')}
                  size='small'
                  style={{ minWidth: '10px', height: '10px', padding: '0px' }}
                  count={' '}>
                  Chats
                </Badge>
              )}
              {props.totalMessages !== undefined && props.totalMessages == 0 && (
                <div onClick={() => setchattab('chat1')}>Chats</div>
              )}
            </>
          }
          key='1'>
          <ChatList
            props={props}
            availableChats={availableChats}
            currentUser={currentUser}
            setCurrentChat={setCurrentChat}
            currentChatName={currentChatName}
            currentChat={currentChat}
            totalNewMessages={totalNewMessages}
            event_id={event_id}
            setTotalNewMessages={setTotalNewMessages}
            setchattab={setchattab}
            chattab={chattab}
            setCurrentUser={setCurrentUser}
            datamsjlast={datamsjlast}
            generalTabs={props.generalTabs}
            notNewMessages={props.notNewMessages}
          />
        </TabPane>
      )}
      {props.generalTabs.attendees && (
        <>
          {' '}
          <TabPane tab='Asistentes' key='2'>
            <Row>
              <Col sm={21}>
                <div className='control' style={{ marginBottom: '10px', marginRight: '5px' }}>
                  <input
                    ref={busquedaRef}
                    autoFocus
                    className='input'
                    type='text'
                    name={'name'}
                    onChange={handleChange}
                    placeholder='Buscar...'
                  />
                </div>
              </Col>
              <Col sm={2}>
                <Button shape='circle' onClick={searhAttende}>
                  {!isFiltered && <SearchOutlined />}
                  {isFiltered && 'X'}
                </Button>
              </Col>
            </Row>
            <div className='asistente-list'>
              {!Object.keys(attendeeList).length ? (
                <Spin tip='Loading...' />
              ) : (
                <AttendeList
                  agendarCita={props.agendarCita}
                  loadDataUser={props.loadDataUser}
                  notificacion={props.notificacion}
                  sendFriendship={props.sendFriendship}
                  perfil={props.perfil}
                  section={props.section}
                  containNetWorking={props.containNetWorking}
                  busqueda={strAttende}
                  currentUser={props.currentUser}
                  event_id={event_id}
                  currentChat={currentChat}
                  currentChatName={currentChatName}
                  createNewOneToOneChat={createNewOneToOneChat}
                  attendeeList={attendeeList}
                  attendeeListPresence={attendeeListPresence}
                />
              )}
            </div>
          </TabPane>
        </>
      )}

      {props.currentActivity !== null && props.tabs && (props.tabs.surveys === true || props.tabs.surveys === 'true') && (
        <TabPane
          className='asistente-survey-list'
          tab={
            <div style={{ marginBottom: '0px' }}>
              <Badge dot={props.hasOpenSurveys} size='default'>
                Encuestas
              </Badge>
            </div>
          }
          key='3'>
          <Row
            justify='space-between'
            style={{ display: 'pointer' }}
            onClick={() => {
              props.setMainStage(null);
              setcurrentTab('');
              // props.tcollapse();
            }}>
            <Col span={24}>
              <Button
                style={{ backgroundColor: '#1cdcb7', color: '#ffffff' }}
                size='large'
                icon={<VideoCameraOutlined />}
                block
                onClick={() => {
                  props.setMainStage(null);
                  setcurrentTab('');
                  props.tcollapse();
                }}>
                Volver a la Conferencia
              </Button>
            </Col>
          </Row>
          {props.currentSurvey === null ? (
            <SurveyList eventSurveys={props.eventSurveys} publishedSurveys={props.publishedSurveys} />
          ) : (
            <SurveyDetail />
          )}
        </TabPane>
      )}

      {props.currentActivity !== null && props.tabs && (props.tabs.games === true || props.tabs.games === 'true') && (
        <TabPane
          className='asistente-survey-list'
          tab={
            <>
              <p style={{ marginBottom: '0px' }} className='lowerTabs__mobile-hidden'>
                Juegos
              </p>
            </>
          }
          key='4'>
          <Row justify='space-between'>
            <Col span={4}>
              <ArrowLeftOutlined
                onClick={() => {
                  // props.optionselected('N/A');
                  props.setMainStage(null);
                  setcurrentTab('');
                  props.tcollapse();
                }}
              />
            </Col>
            <Col span={14}>
              <h2 style={{ fontWeight: '700' }}> Volver a la Conferencia </h2>
            </Col>
            <Col span={4}>
              <VideoCameraOutlined />
            </Col>
          </Row>

          <GameRanking />
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
  tabs: state.stage.data.tabs
});

const mapDispatchToProps = {
  setMainStage,
  setNotification,
  setCurrentSurvey
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SocialZone));
