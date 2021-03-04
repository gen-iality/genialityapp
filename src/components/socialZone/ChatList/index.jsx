import React, { useEffect, useState } from 'react';

import { List, Typography, Badge, Tooltip, Tabs, notification } from 'antd';
import { MessageTwoTone } from '@ant-design/icons';
import * as notificationsActions from '../../../redux/notifications/actions';
import { connect } from 'react-redux';
const { TabPane } = Tabs;
const { setNotification } = notificationsActions;

const ChatList = (props) => {
  let userName = props.currentUser
    ? props.currentUser?.names
    : props.currentUser?.name
    ? props.currentUser?.name
    : undefined;

  let usuarioactivo = props.currentUser?.name;
  let [usuariofriend, setusuariofriend] = useState(userName);
  const openNotificationWithIcon = (type) => {
    notification[type]({
      message: `${usuariofriend}   ${userName}`,
      // description: 'Tienes un nuevo mensaje',
    });
  };

  useEffect(() => {
    // console.log(userName);
    // console.log(usuariofriend);
    // if (props.totalNewMessages > 0 && usuariofriend !== usuarioactivo) {
    //   openNotificationWithIcon('success');
    // }
  }, [props.totalNewMessages, usuariofriend, usuarioactivo]);

  function callback(key) {
    if (key === 'chat1') {
      setusuariofriend(null);
      props.setCurrentChat(null, null);
    }
  }

  if (!props.currentUser) return <p>Debes haber ingresado con tu usuario</p>;

  return (
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
            <Badge size='small' count={userName !== usuariofriend ? props.totalNewMessages : null}>
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
                <a
                  key='list-loadmore-edit'
                  onClick={() => {
                    props.setCurrentChat(item.id, item.name);
                    setusuariofriend(item?.names ? item.names : item.name);
                  }}>
                  <Tooltip title='Chatear'>
                    <Badge count={usuarioactivo !== item.name ? item.newMessages.length : null}>
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

      {props.currentChat && (
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
      )}
    </Tabs>
  );
};

const mapStateToProps = (state) => ({
  mainStage: state.stage.data.mainStage,
  currentSurvey: state.survey.data.currentSurvey,
  currentActivity: state.stage.data.currentActivity,
  viewNotification: state.notifications.data,
});

const mapDispatchToProps = {
  setNotification,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatList);
