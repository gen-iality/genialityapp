//import { useParams } from 'react-router';
import { withRouter } from 'react-router-dom';
import { firestore, fireRealtime } from '../../helpers/firebase';
import React, { useEffect, useMemo, useState } from 'react';
import { List, Avatar, Button, Skeleton, Typography, Row, Badge, Col } from 'antd';
import { ArrowLeftOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import { getCurrentUser } from '../../helpers/request';
import initUserPresence from '../../containers/userPresenceInEvent';
import SurveyComponent from '../events/surveys/surveyComponent';
const { TabPane } = Tabs;
const callback = () => {};
/** Inspiración para construir el monitoreo de presencia firestore
 * no tiene presencia pero firebase realtime si, usamos los dos entonces.
 * https://firebase.google.com/docs/firestore/solutions/presence
 */
let SocialZone = function(props) {
  //let { event_id } = useParams();
  /***** STATE ****/
  const [attendeeList, setAttendeeList] = useState({});
  const [attendeeListPresence, setAttendeeListPresence] = useState({});

  const [currentChat, setCurrentChatInner] = useState(null);
  const [currentChatName, setCurrentChatNameInner] = useState('');
  const [availableChats, setavailableChats] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentTab, setcurrentTab] = useState('1');
  const [totalNewMessages, setTotalNewMessages] = useState(0);

  let userName = 'LuisXXX';
  /***********/
  console.log('datafirebase nos inicamos nuevamente');
  let chat = props.chat;
  let attendees = props.attendees;
  let survey = props.survey;
  let games = props.games;
  let event_id = props.event_id;
  let tab = props.tab;

  let setCurrentChat = (id, chatname) => {
    setcurrentTab('2'); //chats tab
    setCurrentChatInner(id);
    setCurrentChatNameInner(chatname);
  };

  let generateUniqueIdFromOtherIds = (ida, idb) => {
    return ida < idb ? ida + '_' + idb : idb + '_' + ida;
  };

  let createNewOneToOneChat = (idcurrentUser, currentName, idOtherUser, otherUserName) => {
    let newId = generateUniqueIdFromOtherIds(idcurrentUser, idOtherUser);
    console.log('newId', newId);
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
  const monitorEventPresence = (event_id) => {
    console.log('datafirebase se inicio el monitoreo de presencia');
    var eventpresenceRef = fireRealtime.ref('status/' + event_id);
    eventpresenceRef.on('value', (snapshot) => {
      const data = snapshot.val();
      let attendeeListClone = { ...attendeeListPresence };
      console.log('datafirebase clone', attendeeListClone, attendeeListPresence);

      if (data === null) return;
      Object.keys(data).map((key) => {
        let attendee = attendeeListClone[key] || {};
        attendee['state'] = data[key]['state'];
        attendee['last_changed'] = data[key]['last_changed'];
        attendeeListClone[key] = attendee;
      });
      setAttendeeListPresence(attendeeListClone);
      console.log('datafirebase attendeeListPresence', attendeeListClone);
    });
    return true;
  };
  const inicializada = useMemo(() => initUserPresence(event_id), [event_id]);

  const flagmonitorEventPresence = useMemo(() => monitorEventPresence(event_id), [event_id]);

  useEffect(() => {
    const fetchData = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
      console.log('currentUser', currentUser);
      setcurrentTab('' + tab);
      if (tab != 2) {
        props.optionselected(tab == 1 ? 'attendees' : tab == 3 ? 'survey' : 'games');
      }
    };
    fetchData();
  }, []);

  //Cargar la lista de chats de una persona
  useEffect(() => {
    if (!event_id || !currentUser) return;
    console.log('Corriendo carga de chats');

    firestore
      .collection('eventchats/' + event_id + '/userchats/' + currentUser.uid + '/' + 'chats/')
      .onSnapshot(function(querySnapshot) {
        console.log('cargando lista de chats');
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

        console.log('Termianndo carga de chats', list);
      });
  }, [event_id, currentUser]);

  useEffect(() => {
    console.log('event_id', event_id);
    if (!event_id) return;
    console.log('datafirebase Corriendo carga de _event_attendees');

    let colletion_name = event_id + '_event_attendees';
    let attendee;
    firestore.collection(colletion_name).onSnapshot(function(querySnapshot) {
      let list = {};

      querySnapshot.forEach((doc) => {
        attendee = doc.data();
        let localattendee = attendeeList[attendee.user.uid] || {};
        list[attendee.user.uid] = { ...localattendee, ...attendee };
      });
      console.log('datafirebase del firestore', list);
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
        if (key != '2') {
          props.optionselected(key == '1' ? 'attendees' : key == '3' ? 'survey' : 'games');
        }
      }}>
      {
        /*attendees &&*/ <TabPane tab='Asistentes' key='1' className='asistente-list'>
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

      {
        /*chat  &&*/ <TabPane
          className='asistente-chat-list'
          tab={
            <>
              Chats<Badge count={totalNewMessages}></Badge>
            </>
          }
          key='2'>
          <ChatList
            availableChats={availableChats}
            currentUser={currentUser}
            setCurrentChat={setCurrentChat}
            currentChatName={currentChatName}
            currentChat={currentChat}
            event_id={event_id}
          />
        </TabPane>
      }
      {survey && (
        <TabPane className='asistente-survey-list' tab='Encuestas' key='3'>
          <Row justify='space-between'>
            <Col span={4}>
              <ArrowLeftOutlined
                onClick={() => {
                  props.optionselected('N/A');
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
        </TabPane>
      )}
      {games && (
        <TabPane className='asistente-survey-list' tab='Juegos' key='4'>
          <div>Juegos</div>
        </TabPane>
      )}
    </Tabs>
  );
};

export default withRouter(SocialZone);

let ChatList = function(props) {
  let userName = props.currentUser.names || '---';

  return props.currentChat ? (
    <>
      <a key='list-loadmore-edit' onClick={() => props.setCurrentChat(null, null)}>
        Todos los chats
      </a>
      <iframe
        title='chatevius'
        className='ChatEvius'
        src={
          'https://chatevius.web.app?nombre=' +
          userName +
          '&chatid=' +
          props.currentChat +
          '&eventid=' +
          props.event_id +
          '&userid=' +
          props.currentUser.uid
        }></iframe>
    </>
  ) : (
    <Tabs defaultActiveKey='chat1' size='small' onChange={callback}>
      <TabPane tab='Público' key='chat1'>
        <iframe
          title='chatevius'
          className='ChatEvius'
          src={
            'https://chatevius.web.app?nombre=' +
            userName +
            '&chatid=' +
            'event_' +
            props.event_id +
            '&eventid=' +
            props.event_id +
            '&userid=' +
            props.currentUser.uid
          }></iframe>
      </TabPane>

      <TabPane tab='Privados' key='chat2'>
        <List
          header={<div></div>}
          footer={<div></div>}
          bordered
          dataSource={props.availableChats}
          renderItem={(item) => (
            <List.Item
              actions={[
                <a key='list-loadmore-edit' onClick={() => props.setCurrentChat(item.id, item.name)}>
                  Chat{' '}
                  <Badge count={item.newMessages && item.newMessages.length ? item.newMessages.length : ''}></Badge>
                </a>
              ]}>
              <Typography.Text mark>Chat</Typography.Text> {item.name || '----'}
            </List.Item>
          )}
        />
      </TabPane>
    </Tabs>
  );
};

let AttendeList = function(props) {
  return (
    <List
      className='demo-loadmore-list'
      //loading={initLoading}
      itemLayout='horizontal'
      //loadMore={loadMore}
      dataSource={Object.keys(props.attendeeList).map((key) => {
        return { key: key, ...props.attendeeList[key] };
      })}
      renderItem={(item) => (
        <List.Item
          actions={[
            props.currentUser ? (
              <a
                key='list-loadmore-edit'
                onClick={() =>
                  props.createNewOneToOneChat(
                    props.currentUser.uid,
                    props.currentUser.names,
                    item.user.uid,
                    item.user.names
                  )
                }>
                Chat
              </a>
            ) : null
          ]}>
          {/* <Skeleton avatar title={false} loading={item.loading} active> */}
          <List.Item.Meta
            avatar={<Avatar src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' />}
            title={
              props.currentUser ? (
                <a
                  key='list-loadmore-edit'
                  onClick={() =>
                    props.createNewOneToOneChat(
                      props.currentUser.uid,
                      props.currentUser.names,
                      item.user.uid,
                      item.user.names
                    )
                  }>
                  {item.properties.names}
                </a>
              ) : null
            }
            description={props.attendeeListPresence[item.key] ? props.attendeeListPresence[item.key].state : 'offline'}
          />
          <div></div>
          {/* </Skeleton> */}
        </List.Item>
      )}
    />
  );
};
