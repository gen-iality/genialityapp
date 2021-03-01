import React from 'react';
import { List, Typography, Badge, Tooltip, Tabs } from 'antd';
import { MessageTwoTone } from '@ant-design/icons';
const { TabPane } = Tabs;
const callback = () => {};

const ChatList = (props) => {
  if (!props.currentUser) return <p>Debes haber ingresado con tu usuario</p>;

  let userName = props.currentUser ? props.currentUser.name : '---';

  return props.currentChat ? (
    <>
      <a key='list-loadmore-edit' onClick={() => props.setCurrentChat(null, null)}>
        Todos los chats
      </a>
      <iframe
        title='chatevius'
        className='ChatEviusLan'
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
          className='ChatEviusLan'
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

      <TabPane
        tab={
          <>
            <Badge size='small' count={props.totalNewMessages}>
              Privados
            </Badge>
          </>
        }
        key='chat2'>
        <List
          header={<div></div>}
          footer={<div></div>}
          bordered
          dataSource={props.availableChats}
          renderItem={(item) => (
            <List.Item
              actions={[
                <a key='list-loadmore-edit' onClick={() => props.setCurrentChat(item.id, item.name)}>
                  <Tooltip title='Chatear'>
                    <Badge count={item.newMessages && item.newMessages.length ? item.newMessages.length : ''}>
                      <MessageTwoTone style={{ fontSize: '20px' }} />
                    </Badge>
                  </Tooltip>
                </a>,
              ]}>
              <Typography.Text mark></Typography.Text> {item.name || '----'}
            </List.Item>
          )}
        />
      </TabPane>
    </Tabs>
  );
};

export default ChatList;
