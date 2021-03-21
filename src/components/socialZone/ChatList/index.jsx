import React, { useEffect, useState } from 'react';

import {
  List,
  Typography,
  Badge,
  Tooltip,
  Tabs,
  notification,
  Form,
  FormGroup,
  Input,
  Checkbox,
  Button,
  Row
} from 'antd';
import { MessageTwoTone } from '@ant-design/icons';
import * as notificationsActions from '../../../redux/notifications/actions';
import { connect } from 'react-redux';
const { TabPane } = Tabs;
const { setNotification } = notificationsActions;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 }
};

const ChatList = (props) => {
  const onFinish = (values) => {
    props.setCurrentUser(values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  let userName = props.currentUser
    ? props.currentUser.names
      ? props.currentUser.names
      : props.currentUser.name
    : undefined;

  //para los eventos tipo asamblea que tienen una propiedad llamada casa que sirve para identificaar las personas
  userName = props.currentUser && props.currentUser.casa ? '(' + props.currentUser.casa + ') ' + userName : userName;

  let usuarioactivo = props.currentUser?.name;
  let [usuariofriend, setusuariofriend] = useState(userName);
  const openNotificationWithIcon = (type) => {
    notification[type]({
      message: 'holap'
      // description: 'Tienes un nuevo mensaje',
    });
  };

  let [totalmsjpriv, settotalmsjpriv] = useState(props.totalNewMessages);

  useEffect(() => {
    console.log(props.datamsjlast);
    console.log(userName);

    props.datamsjlast &&
      props.datamsjlast.remitente !== undefined &&
      props.datamsjlast.remitente !== null &&
      props.datamsjlast.remitente !== userName &&
      props.totalNewMessages > 0 &&
      settotalmsjpriv(props.totalNewMessages);
  }, [props.datamsjlast, props.totalNewMessages]);

  let [currentab, setcurrentab] = useState(props.chattab);

  useEffect(() => {
    setcurrentab(props.chattab);
  }, [props.chattab]);

  function callback(key) {
    setcurrentab(key);
    if (key === 'chat1') {
      setusuariofriend(null);
      props.setCurrentChat(null, null);
    }
  }

  if (!props.currentUser)
    return (
      <Form
        {...layout}
        name='basic'
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}>
        <Row justify='center'>
          {' '}
          <h1>
            <strong>Ingresa tus datos para entrar al chat </strong>
          </h1>
        </Row>
        <Form.Item label='Nombre' name='name' rules={[{ required: true, message: 'Digita tu nombre' }]}>
          <Input />
        </Form.Item>

        <Form.Item name='email' label='Email' rules={[{ required: true, type: 'email', message: 'Digita tu email' }]}>
          <Input />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type='primary' htmlType='submit'>
            Entrar
          </Button>
        </Form.Item>
      </Form>
    );

  return (
    <Tabs activeKey={currentab} size='small' onChange={callback} centered>
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
            props.currentUser.uid +
            '&version=0.0.2'
          }></iframe>
      </TabPane>

      <TabPane
        tab={
          <>
            <Badge size='small' count={totalmsjpriv}>
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
                    settotalmsjpriv(0);
                    props.setTotalNewMessages(0);
                  }}>
                  <Tooltip title='Chatear'>
                    <Badge count={totalmsjpriv}>
                      <MessageTwoTone style={{ fontSize: '20px' }} />
                    </Badge>
                  </Tooltip>
                </a>
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
  viewNotification: state.notifications.data
});

const mapDispatchToProps = {
  setNotification
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatList);
