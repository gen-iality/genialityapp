import React, { useEffect, useState, useContext } from 'react';
import { List, Typography, Badge, Tooltip, Tabs, Form, Input, Button, Row, Space, Avatar, Popover } from 'antd';
import { ExclamationCircleOutlined, MessageTwoTone } from '@ant-design/icons';
import * as notificationsActions from '../../../redux/notifications/actions';
import { UseEventContext } from '../../../Context/eventContext';
import { UseCurrentUser } from '../../../Context/userContext';
import { connect } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { InitialsNameUser } from '../hooks';
import PopoverInfoUser from '../hooks/Popover';
import { useHistory } from 'react-router-dom';
import { HelperContext } from '../../../Context/HelperContext';
const { TabPane } = Tabs;
const { setNotification } = notificationsActions;
const { Text } = Typography;

const styleItemCard = {
  backgroundColor: 'white',
  padding: 15,
  margin: 6,
  border: '1px solid #cccccc',
  borderRadius: '10px',
};

const styleList = {
  padding: 5,
  borderRadius: '10px',
  backgroundColor: '#ffffff63',
};

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const ChatList = (props) => {
  const history = useHistory();
  let cUser = UseCurrentUser();
  let cEvent = UseEventContext();
  let { chatActual, HandleGoToChat } = useContext(HelperContext);
  const onFinish = (values) => {
    cUser.value = values;
  };

  console.log('====================================');
  console.log("props.availableChats",props.availableChats);
  console.log('====================================');
  let usernameR = chatActual && chatActual.chatname;
  useEffect(() => {
    props.datamsjlast &&
      props.datamsjlast.remitente !== undefined &&
      props.datamsjlast.remitente !== null &&
      props.datamsjlast.remitente !== usernameR &&
      props.totalNewMessages > 0;
  }, [props.datamsjlast, props.totalNewMessages]);

  // constante para insertar texto dinamico con idioma
  const intl = useIntl();
  let [usuariofriend, setusuariofriend] = useState(null);
  let [totalmsjpriv, settotalmsjpriv] = useState(0);

  function callback(key) {
    if (key === 'chat1') {
      if (chatActual) {
        HandleGoToChat(null, null, null, null);
      }
    }
    if (key === 'chat2') {
      if (chatActual) {
        HandleGoToChat(null, null, null, null);
      }
    }

    props.setchattab(key);
  }

  if (!cUser.value)
    return (
      <Form className='asistente-list' {...layout} name='basic' initialValues={{ remember: true }} onFinish={onFinish}>
        <Row justify='center'>
          <h1>
            <strong>
              <FormattedMessage
                id='form.title.socialzone'
                defaultMessage='Ingresa tus datos para participar en el chat'
              />
            </strong>
          </h1>
          <Space>
            <ExclamationCircleOutlined style={{ color: '#faad14' }} />
            <Text type='secondary'>
              <FormattedMessage
                id='form.message.socialzone'
                defaultMessage='Este formulario sólo es válido para participar en el chat, si desea disfrutar del evento en su totalidad debe registrase.'
              />
            </Text>
          </Space>
        </Row>
        <Row justify='center' style={{ paddingTop: '10px' }}>
          <Form.Item
            label={intl.formatMessage({ id: 'form.label.name' })}
            name='name'
            rules={[{ required: true, message: 'Digita tu nombre' }]}>
            <Input />
          </Form.Item>

          <Form.Item name='email' label='Email' rules={[{ required: true, type: 'email', message: 'Digita tu email' }]}>
            <Input />
          </Form.Item>
        </Row>

        <Row justify='center'>
          <Space size='small' wrap>
            <Form.Item>
              <Button type='dashed' htmlType='submit'>
                <FormattedMessage id='form.button.enter' defaultMessage='Entrar' />
              </Button>
            </Form.Item>
            <Form.Item>
              <Button onClick={() => history.push(`/landing/${cEvent.value._id}/tickets`)} type='primary'>
                <FormattedMessage id='form.button.register' defaultMessage='Registrarme' />
              </Button>
            </Form.Item>
          </Space>
        </Row>
      </Form>
    );

  let userNameActive = cUser.value.name ? cUser.value.name : cUser.value.names;

  return (
    <Tabs activeKey={props.chattab} size='small' onChange={callback} centered>
      {props.generalTabs.publicChat && (
        <TabPane
          tab={
            <div style={{ color: cEvent.value.styles.textMenu }}>
              <FormattedMessage id='tabs.public.socialzone' defaultMessage='Público' />
            </div>
          }
          key='chat1'>
          <iframe
            title='chatevius'
            className='ChatEviusLan'
            src={
              'https://chatevius.web.app?nombre=' +
              userNameActive +
              '&chatid=event_' +
              cEvent.value._id +
              '&eventid=' +
              cEvent.value._id +
              '&userid=' +
              cUser.value.uid +
              '&version=0.0.2'
            }></iframe>
        </TabPane>
      )}

      {props.generalTabs.privateChat && (
        <TabPane
          tab={
            <>
              {props.totalNewMessages !== undefined && props.totalNewMessages > 0 && (
                <Badge
                  size='small'
                  style={{ minWidth: '10px', height: '10px', padding: '0px', color: cEvent.value.styles.textMenu }}
                  count={' '}>
                  <div style={{ color: cEvent.value.styles.textMenu }}>
                    <FormattedMessage id='tabs.private.socialzone' defaultMessage='Privados' />
                    {chatActual && chatActual.chatname
                      ? ` ( ${intl.formatMessage({ id: 'tabs.private.socialzone.message' })} )`
                      : ''}
                  </div>
                </Badge>
              )}
              {props.totalNewMessages !== undefined && props.totalNewMessages == 0 && (
                <div style={{ color: cEvent.value.styles.textMenu }}>
                  <FormattedMessage id='tabs.private.socialzone' defaultMessage='Privados' />
                  {chatActual && chatActual.chatname
                    ? ` ( ${intl.formatMessage({ id: 'tabs.private.socialzone.message' })} )`
                    : ''}
                </div>
              )}
            </>
          }
          key='chat2'>
          {!chatActual.chatname && (
            <List
              className='asistente-list'
              style={styleList}
              dataSource={props.availableChats}
              renderItem={(item) => (
                <List.Item
                  style={styleItemCard}
                  actions={[
                    <a
                      key='list-loadmore-edit'
                      onClick={() => {
                        HandleGoToChat(
                          cUser.value.uid,
                          item.id,
                          cUser.value.name ? cUser.value.name : cUser.value.names,
                          "private"
                        );
                        settotalmsjpriv(0);
                        props.setTotalNewMessages(0);
                        props.notNewMessages();
                      }}>
                      <Tooltip title='Chatear'>
                        {item.newMessages && item.newMessages.length > 0 && (
                          <Badge count={' '} style={{ minWidth: '10px', height: '10px', padding: '0px' }}>
                            <MessageTwoTone style={{ fontSize: '27px' }} />
                          </Badge>
                        )}
                        {item.newMessages && item.newMessages.length == 0 && (
                          <MessageTwoTone style={{ fontSize: '27px' }} />
                        )}
                      </Tooltip>
                    </a>,
                  ]}>
                  <List.Item.Meta
                    avatar={
                      item.currentUser?.image ? (
                        <Avatar src={item.currentUser?.image} />
                      ) : (
                        <Avatar style={{ backgroundColor: '#4A90E2', color: 'white' }} size={30}>
                          {InitialsNameUser(item.name ? item.name : 'User')}
                        </Avatar>
                      )
                    }
                    title={
                      <a style={{ color: 'black' }} key='list-loadmore-edit'>
                        {item.name ? item.name : item.names}
                      </a>
                    }
                  />
                </List.Item>
              )}
            />
          )}

          {chatActual.chatname && (
            <>
              <iframe
                title='chatevius'
                className='ChatEviusLan'
                src={
                  'https://chatevius.web.app?nombre=' +
                  chatActual.chatname +
                  '&chatid=' +
                  chatActual.chatid +
                  '&eventid=' +
                  cEvent.value._id +
                  '&userid=' +
                  chatActual.idactualuser
                }></iframe>
            </>
          )}
        </TabPane>
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
