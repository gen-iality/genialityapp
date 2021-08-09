import React, { useEffect, useState } from 'react';
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
  overflow: 'auto',
};

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const ChatList = (props) => {
  const history = useHistory();
  //contextos
  let cUser = UseCurrentUser();
  let cEvent = UseEventContext();
  const [bandera, setbandera] = useState();
  const [userNameChat, SetUserNameChat] = useState("");

  const onFinish = (values) => {
    cUser.value = values;
    setbandera('');
  };
  console.log(props)

  let userName = props.currentChatName;

  //para los eventos tipo asamblea que tienen una propiedad llamada casa que sirve para identificaar las personas
  userName = cUser.value && cUser.value.casa ? '(' + cUser.value.casa + ') ' + userName : userName;

  useEffect(() => {
    props.datamsjlast &&
      props.datamsjlast.remitente !== undefined &&
      props.datamsjlast.remitente !== null &&
      props.datamsjlast.remitente !== userName &&
      props.totalNewMessages > 0;
    
  }, [props.datamsjlast, props.totalNewMessages]);
  
  useEffect(()=>{
    if(userName!=null){
      SetUserNameChat(userName)
    }
  },[userName])

  // constante para insertar texto dinamico con idioma
  const intl = useIntl();
  let [usuariofriend, setusuariofriend] = useState(userName);
  let [totalmsjpriv, settotalmsjpriv] = useState(0);

  function callback(key) {
    if (key === 'chat1') {
      if (props.currentChat) {
        props.setCurrentChat(null, null);
      }
    }
    if (key === 'chat2') {
      if (props.currentChat) {
        props.setCurrentChat(null, null);
      }
    }
    props.setchattab(key);
  }

  if (!cUser.value)
    return (
      <Form {...layout} name='basic' initialValues={{ remember: true }} onFinish={onFinish}>
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
          <Space size='large'>
            <Form.Item>
              <Button onClick={() => history.push(`/landing/${cEvent.value._id}/tickets`)} type='primary'>
                <FormattedMessage id='form.button.register' defaultMessage='Registrarme' />
              </Button>
            </Form.Item>

            <Form.Item>
              <Button type='dashed' htmlType='submit'>
                <FormattedMessage id='form.button.enter' defaultMessage='Entrar' />
              </Button>
            </Form.Item>
          </Space>
        </Row>
      </Form>
    );

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
              'https://chatevius.web.app?nombre=pr' +
              userName +
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
                    {props.currentChat ? ` ( ${intl.formatMessage({ id: 'tabs.private.socialzone.message' })} )` : ''}
                  </div>
                </Badge>
              )}
              {props.totalNewMessages !== undefined && props.totalNewMessages == 0 && (
                <div style={{ color: cEvent.value.styles.textMenu }}>
                  <FormattedMessage id='tabs.private.socialzone' defaultMessage='Privados' />
                  {props.currentChat ? ` ( ${intl.formatMessage({ id: 'tabs.private.socialzone.message' })} )` : ''}
                </div>
              )}
            </>
          }
          key='chat2'>
          {!props.currentChat && (
            <List
              style={styleList}
              dataSource={props.availableChats}
              renderItem={(item) => (
                <List.Item
                  style={styleItemCard}
                  actions={[
                    <a
                      key='list-loadmore-edit'
                      onClick={() => {
                        props.setCurrentChat(item.id, item.name ? item.name : item.names);
                        setusuariofriend(item?.names ? item.names : item.name);
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
          {console.log("Name==>",props.currentChatName)}
          {console.log(props.currentChat)}
          {console.log(cUser.value.uid)}          
          {props.currentChat && (
            <>                   
              <iframe
                title='chatevius'
                className='ChatEviusLan'
                src={
                  'https://chatevius.web.app?nombre=' +
                  userName+
                  '&chatid=' +
                  props.currentChat +
                  '&eventid=' +
                  cEvent.value._id +
                  '&userid=' +
                  cUser.value.uid
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
