//import { useParams } from 'react-router';
import { withRouter } from 'react-router-dom';
import { firestore } from '../../helpers/firebase';
import React, { useEffect, useMemo, useState } from 'react';
import { List, Avatar, Button, Skeleton, Typography } from 'antd';
import { Tabs } from 'antd';

const { TabPane } = Tabs;
const callback = () => {};

let SocialZone = function(props) {
  //let { event_id } = useParams();
  /***** STATE ****/
  const [attendeeList, setAttendeeList] = useState([]);
  const [currentChat, setCurrentChatInner] = useState(null);
  const [currentTab, setcurrentTab] = useState('1');
  let userName = 'LuisXXX';
  /***********/
  let event_id = props.match.params.event_id;
  let setCurrentChat = (id) => {
    setcurrentTab('2'); //chats tab
    setCurrentChatInner(id);
  };
  useEffect(() => {
    if (!event_id) return;

    let colletion_name = event_id + '_event_attendees';
    firestore.collection(colletion_name).onSnapshot(function(querySnapshot) {
      let list = [];
      querySnapshot.forEach((doc) => {
        list.push(doc.data());
      });
      setAttendeeList(list);
      console.log(attendeeList);
      //setEnableMeetings(doc.data() && doc.data().enableMeetings ? true : false);
    });
  }, [event_id]);

  return (
    <Tabs defaultActiveKey='1' onChange={callback} activeKey={currentTab} onTabClick={(key) => setcurrentTab(key)}>
      <TabPane tab='Asistentes' key='1'>
        <AttendeList event_id={event_id} setCurrentChat={setCurrentChat} currentChat={currentChat} />
      </TabPane>
      <TabPane tab='Chats' key='2'>
        <ChatList setCurrentChat={setCurrentChat} currentChat={currentChat} />
      </TabPane>
    </Tabs>
  );
};

export default withRouter(SocialZone);

let ChatList = function(props) {
  let userName = 'LuisXXX';
  const data = [
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.'
  ];
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
      dataSource={data}
      renderItem={(item) => (
        <List.Item
          actions={[
            <a key='list-loadmore-edit' onClick={() => props.setCurrentChat('axax')}>
              Chat
            </a>
          ]}>
          <Typography.Text mark>Chat</Typography.Text> {item}
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
      console.log(attendeeList);
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
            <a key='list-loadmore-edit' onClick={() => props.setCurrentChat('axax')}>
              Chat
            </a>
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
