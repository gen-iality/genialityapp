import { withRouter } from 'react-router-dom';
import { firestore } from '../../helpers/firebase';
import React, { useEffect, useMemo, useState } from 'react';
import { Tabs, Row, Badge, Col } from 'antd';
import { ArrowLeftOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { getCurrentUser } from '../../helpers/request';
import initUserPresence from '../../containers/userPresenceInEvent';
import SurveyList from '../events/surveys/surveyList';
import SurveyDetail from '../events/surveys/surveyDetail';
import { connect } from 'react-redux';
import * as StageActions from '../../redux/stage/actions';

import AttendeList from './attendees/index';
import * as notificationsActions from '../../redux/notifications/actions';
import ChatList from './ChatList';
import { monitorEventPresence } from './hooks';
import GameRanking from '../events/game/gameRanking';

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

  let userName = props.currentUser
    ? props.currentUser?.names
    : props.currentUser?.name
    ? props.currentUser?.name
    : '---';

  let usuarioactivo = props.currentUser?.name;

  /***********/
  console.log('datafirebase nos inicamos nuevamente');
  let chat = props.chat;
  let attendees = props.attendees;
  let survey = props.survey;
  let games = props.games;
  let event_id = props.event_id;
  let tab = props.tab;

  let setCurrentChat = (id, chatname) => {
    setcurrentTab('1'); //chats tab
    setCurrentChatInner(id);
    setCurrentChatNameInner(chatname);
  };

  let generateUniqueIdFromOtherIds = (ida, idb) => {
    return ida < idb ? ida + '_' + idb : idb + '_' + ida;
  };

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

  const flagmonitorEventPresence = useMemo(
    () => monitorEventPresence(event_id, attendeeListPresence, setAttendeeListPresence),
    [event_id]
  );

  useEffect(() => {
    const fetchData = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
      setcurrentTab('' + tab);

      props.optionselected(tab == 1 ? 'attendees' : tab == 3 ? 'survey' : tab == 2 ? 'chat' : 'game');
    };
    fetchData();
  }, []);

  //Cargar la lista de chats de una persona

  useEffect(() => {
    if (!event_id || !currentUser) return;

    firestore
      .collection('eventchats/' + event_id + '/userchats/' + currentUser.uid + '/' + 'chats/')
      .onSnapshot(function(querySnapshot) {
        let list = [];
        let data;
        let totalNewMessages = 0;
        querySnapshot.forEach((doc) => {
          data = doc.data();
          if (data.newMessages) {
            totalNewMessages += !isNaN(parseInt(data.newMessages.length)) ? parseInt(data.newMessages.length) : 0;
          }
          list.push(data);
        });

        console.timeLog('setTotalNewMessages ZONA');
        setTotalNewMessages(totalNewMessages);
        setavailableChats(list);
      });
  }, [event_id, currentUser]);

  useEffect(() => {
    if (!event_id) return;

    let colletion_name = event_id + '_event_attendees';
    let attendee;
    firestore.collection(colletion_name).onSnapshot(function(querySnapshot) {
      let list = {};

      querySnapshot.forEach((doc) => {
        attendee = doc.data();
        let localattendee = attendeeList[attendee.user.uid] || {};
        list[attendee.user.uid] = { ...localattendee, ...attendee };
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
      {
        <TabPane
          className='asistente-chat-list'
          tab={
            <>
              <Badge size='small' count={usuarioactivo !== props.currentUser?.name ? totalNewMessages : null}>
                Chats
              </Badge>
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
          />
        </TabPane>
      }
      {
        /*attendees &&*/

        <TabPane tab='Asistentes' key='2' className='asistente-list'>
          <AttendeList
            currentUser={currentUser}
            event_id={event_id}
            currentChat={currentChat}
            currentChatName={currentChatName}
            createNewOneToOneChat={createNewOneToOneChat}
            attendeeList={attendeeList}
            attendeeListPresence={attendeeListPresence}
          />
        </TabPane>
      }

      {props.currentActivity !== null && (
        <>
          <TabPane
            className='asistente-survey-list'
            tab={
              <div style={{ marginBottom: '0px' }} className='lowerTabs__mobile-hidden'>
                <Badge dot={props.hasOpenSurveys} size='default'>
                  Encuestas
                </Badge>
              </div>
            }
            key='3'>
            <Row justify='space-between'>
              <Col span={4}>
                <ArrowLeftOutlined
                  onClick={() => {
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
            {props.currentSurvey === null ? <SurveyList /> : <SurveyDetail />}
          </TabPane>
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
        </>
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
});

const mapDispatchToProps = {
  setMainStage,
  setNotification,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SocialZone));
