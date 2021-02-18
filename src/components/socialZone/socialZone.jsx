//import { useParams } from 'react-router';
import { withRouter } from 'react-router-dom';
import { firestore, fireRealtime } from '../../helpers/firebase';
import React, { useEffect, useMemo, useState } from 'react';
import { List, Avatar, Button, Skeleton, Typography } from 'antd';
import { Tabs } from 'antd';
import { getCurrentUser } from '../../helpers/request';
import initUserPresence from '../../containers/userPresenceInEvent';
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
  let userName = 'LuisXXX';
  /***********/
  console.log('datafirebase nos inicamos nuevamente');
  let event_id = props.match.params.event_id;

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
    };
    fetchData();
  });

  useEffect(() => {
    if (!event_id || !currentUser) return;
    console.log('Corriendo carga de chats');

    firestore
      .collection('eventchats/' + event_id + '/userchats/' + currentUser.uid + '/' + 'chats/')
      .onSnapshot(function(querySnapshot) {
        console.log('cargando lista de chats');
        let list = [];
        querySnapshot.forEach((doc) => {
          list.push(doc.data());
        });
        setavailableChats(list);
        console.log('Termianndo carga de chats', list);
      });
  }, [event_id, currentUser]);

  useEffect(() => {
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
    <Tabs defaultActiveKey='1' onChange={callback} activeKey={currentTab} onTabClick={(key) => setcurrentTab(key)}>
      <TabPane tab='Asistentes' key='1'>
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
      <TabPane tab='Chats' key='2'>
        <ChatList
          availableChats={availableChats}
          currentUser={currentUser}
          setCurrentChat={setCurrentChat}
          currentChatName={currentChatName}
          currentChat={currentChat}
        />
      </TabPane>
    </Tabs>
  );
};

export default withRouter(SocialZone);

let ChatList = function(props) {
  let userName = props.currentUser.names || '---';

  return props.currentChat ? (
    <>
      <a key='list-loadmore-edit' onClick={() => props.setCurrentChat(null, null)}>
        Listado
      </a>
      <p>{props.currentChatName}</p>
      <iframe
        title='chatevius'
        className='ChatEvius'
        src={'https://chatevius.web.app?nombre=' + userName + '&chatid=' + props.currentChat}></iframe>
    </>
  ) : (
    <List
      header={<div></div>}
      footer={<div></div>}
      bordered
      dataSource={props.availableChats}
      renderItem={(item) => (
        <List.Item
          actions={[
            <a key='list-loadmore-edit' onClick={() => props.setCurrentChat(item.id, item.name)}>
              Chat
            </a>
          ]}>
          <Typography.Text mark>Chat</Typography.Text> {item.name || '----'}
        </List.Item>
      )}
    />
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
