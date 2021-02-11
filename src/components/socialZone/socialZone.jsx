//import { useParams } from 'react-router';
import { withRouter } from 'react-router-dom';
import { firestore } from '../../helpers/firebase';
import React, { useEffect, useMemo, useState } from 'react';
import { List, Avatar, Button, Skeleton, Typography } from 'antd';
import { Tabs } from 'antd';
import { getCurrentUser } from '../../helpers/request';
const { TabPane } = Tabs;
const callback = () => {};

let SocialZone = function(props) {
  //let { event_id } = useParams();
  /***** STATE ****/
  const [attendeeList, setAttendeeList] = useState([]);
  const [currentChat, setCurrentChatInner] = useState(null);
  const [availableChats, setavailableChats] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentTab, setcurrentTab] = useState('1');
  let userName = 'LuisXXX';
  /***********/

  let event_id = props.match.params.event_id;
  let setCurrentChat = (id) => {
    setcurrentTab('2'); //chats tab
    setCurrentChatInner(id);
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
    setCurrentChat(newId);
  };

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
      .collection('eventchats/' + event_id + '/userchats/' + currentUser._id + '/' + 'chats/')
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
    console.log('Corriendo carga de _event_attendees');
    let colletion_name = event_id + '_event_attendees';
    firestore.collection(colletion_name).onSnapshot(function(querySnapshot) {
      let list = [];
      querySnapshot.forEach((doc) => {
        list.push(doc.data());
      });
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
          createNewOneToOneChat={createNewOneToOneChat}
          attendeeList={attendeeList}
        />
      </TabPane>
      <TabPane tab='Chats' key='2'>
        <ChatList
          availableChats={availableChats}
          currentUser={currentUser}
          setCurrentChat={setCurrentChat}
          currentChat={currentChat}
        />
      </TabPane>
    </Tabs>
  );
};

export default withRouter(SocialZone);

let ChatList = function(props) {
  let userName = 'LuisXXX';

  return props.currentChat ? (
    <>
      <a key='list-loadmore-edit' onClick={() => props.setCurrentChat(null)}>
        Listado
      </a>
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
            <a key='list-loadmore-edit' onClick={() => props.setCurrentChat(item.id)}>
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
  //let { event_id } = useParams();
  /***** STATE ****/
  const [attendeeList, setAttendeeList] = useState([]);

  let userName = 'LuisXXX';
  /***********/
  let event_id = props.event_id || null;
  useEffect(() => {
    if (!event_id) return;

    let colletion_name = event_id + '_event_attendees';
    firestore.collection(colletion_name).onSnapshot(function(querySnapshot) {
      let list = [];
      querySnapshot.forEach((doc) => {
        list.push(doc.data());
      });
      setAttendeeList(list);
      console.log(list);
      //setEnableMeetings(doc.data() && doc.data().enableMeetings ? true : false);
    });
  }, [event_id]);

  return (
    <List
      className='demo-loadmore-list'
      //loading={initLoading}
      itemLayout='horizontal'
      //loadMore={loadMore}
      dataSource={attendeeList}
      renderItem={(item) => (
        <List.Item
          actions={[
            props.currentUser ? (
              <a
                key='list-loadmore-edit'
                onClick={() =>
                  props.createNewOneToOneChat(props.currentUser._id, props.currentUser.names, item._id, item.user.names)
                }>
                Chat
              </a>
            ) : null
          ]}>
          {/* <Skeleton avatar title={false} loading={item.loading} active> */}
          <List.Item.Meta
            avatar={<Avatar src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' />}
            title={<a href='https://ant.design'>{item.properties.names}</a>}
            description='Ant'
          />
          <div></div>
          {/* </Skeleton> */}
        </List.Item>
      )}
    />
  );
};
