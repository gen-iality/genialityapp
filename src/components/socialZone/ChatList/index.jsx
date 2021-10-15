import React, { useState, useContext } from 'react';
import { List, Typography, Badge, Tooltip, Tabs, Form, Input, Button, Row, Space, Avatar, Popover, Col } from 'antd';
import { ExclamationCircleOutlined, MessageTwoTone } from '@ant-design/icons';
import * as notificationsActions from '../../../redux/notifications/actions';
import { UseEventContext } from '../../../Context/eventContext';
import { UseCurrentUser } from '../../../Context/userContext';
import { UseUserEvent } from '../../../Context/eventUserContext';
import { connect } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { InitialsNameUser } from '../hooks';
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
  let cEventUser = UseUserEvent();

  let {
    chatActual,
    HandleGoToChat,
    privateChatsList,
    chatPublicPrivate,
    HandlePublicPrivate,
    imageforDefaultProfile,
  } = useContext(HelperContext);

  const onFinish = (values) => {
    cUser.value = values;
  };

  // constante para insertar texto dinamico con idioma
  const intl = useIntl();
  let [usuariofriend, setusuariofriend] = useState(null);

  function callback(key) {
    if (key === 'public') {
      if (chatActual) {
        HandleGoToChat(null, null, null, null, null);
      }
    }
    if (key === 'private') {
      if (chatActual) {
        HandleGoToChat(null, null, null, null, null);
      }
    }

    HandlePublicPrivate(key);
  }

  console.log('privateChatsList', privateChatsList);
  if (!cUser.value)
    return (
      <Form className='asistente-list' {...layout} name='basic' initialValues={{ remember: true }} onFinish={onFinish}>
        <Row justify='start'>
          <Col>
            <Text type='secondary'>
              <FormattedMessage
                id='form.message.socialzone'
                defaultMessage='Registrate para participar en el chat de este evento'
              />
            </Text>

            {/* <h1>
              <strong>
                <FormattedMessage
                  id='form.title.socialzone'
                  defaultMessage='Ingresa tus datos para participar en el chat'
                />
              </strong>
            </h1> */}

            {/* 
            <Text type='secondary'>
              <FormattedMessage
                id='form.message.socialzone'
                defaultMessage='Este formulario sólo es válido para participar en el chat, si desea disfrutar del evento en su totalidad debe registrase.'
              />
            </Text> */}
          </Col>
        </Row>
        {/* <Row justify='start' style={{ paddingTop: '10px' }}>
          <Col>
            <Form.Item
              label={intl.formatMessage({ id: 'form.label.name' })}
              name='name'
              rules={[{ required: true, message: 'Digita tu nombre' }]}>
              <Input style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name='email'
              label='Email'
              rules={[{ required: true, type: 'email', message: 'Digita tu email' }]}>
              <Input style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row> */}

        <Row justify='center'>
          <Space size='small' wrap>
            {/* <Form.Item>
              <Button type='dashed' htmlType='submit'>
                <FormattedMessage id='form.button.enter' defaultMessage='Entrar' />
              </Button>
            </Form.Item> */}
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
    <Tabs activeKey={chatPublicPrivate} size='small' onChange={callback} centered>
      {props.generalTabs.publicChat && (
        <TabPane
          tab={
            <div style={{ color: cEvent.value.styles.textMenu }}>
              <FormattedMessage id='tabs.public.socialzone' defaultMessage='Público' />
            </div>
          }
          key='public'>
          <iframe
          style={{marginTop:'8px'}}
            title='chatevius'
            className='ChatEviusLan'
            src={
              'https://chatevius.web.app?nombre=' +
              userNameActive +
              '&chatid=event_' +
              cEvent.value?._id +
              '&usereventid=' +
              cEventUser.value?._id +
              '&eventid=' +
              cEvent.value?._id +
              '&userid=' +
              cUser.value?.uid +
              '&version=0.0.2'
            }></iframe>
        </TabPane>
      )}

      {props.generalTabs.privateChat && (
        <TabPane
          tab={
            <>
              <Badge
                size='small'
                style={{ minWidth: '10px', height: '10px', padding: '0px', color: cEvent.value.styles.textMenu }}
                count={0}>
                <div style={{ color: cEvent.value.styles.textMenu }}>
                  <FormattedMessage id='tabs.private.socialzone' defaultMessage='Privados' />
                  {chatActual && chatActual.chatname
                    ? ` ( ${intl.formatMessage({ id: 'tabs.private.socialzone.message' })} )`
                    : ''}
                </div>
              </Badge>
            </>
          }
          key='private'>
          {!chatActual.chatname && (
            <List
              className='asistente-list'
              style={styleList}
              dataSource={privateChatsList}
              renderItem={(item) => (
                <List.Item
                  style={styleItemCard}
                  extra={[
                    <a
                      key='list-loadmore-edit'
                      onClick={() => {
                        HandleGoToChat(
                          cUser.value.uid,
                          item.id,
                          cUser.value.name ? cUser.value.name : cUser.value.names,
                          'private',
                          item,
                          null
                        );
                      }}>
                      <Tooltip title='Chatear'>
                        {item.participants &&
                        item.participants.filter((part) => part.idparticipant != cUser.value.uid)[0]?.countmessajes &&
                        item.participants.filter((part) => part.idparticipant != cUser.value.uid)[0]?.countmessajes >
                          0 ? (
                          <Badge
                            count={
                              item.participants.filter((part) => part.idparticipant != cUser.value.uid)[0]
                                ?.countmessajes
                            }>
                            <MessageTwoTone style={{ fontSize: '27px' }} />
                          </Badge>
                        ) : (
                          <MessageTwoTone style={{ fontSize: '27px' }} />
                        )}
                      </Tooltip>
                    </a>,
                  ]}>
                  <List.Item.Meta
                    avatar={
                      item.participants?.filter((part) => part.idparticipant != cUser.value.uid)[0]?.profilePicUrl ? (
                        <Avatar
                          src={
                            item.participants?.filter((part) => part.idparticipant != cUser.value.uid)[0]?.profilePicUrl
                          }
                        />
                      ) : (
                        <Avatar src={imageforDefaultProfile} />
                      )
                    }
                    title={
                      <Typography.Text  style={{ color: 'black',width:'200px' }} key='list-loadmore-edit'>
                        {item.name ? item.name : item.names}
                      </Typography.Text>
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
                  'https://chatevius.web.app?iduser=' +
                  chatActual?.idotheruser +
                  '&chatid=' +
                  chatActual?.chatid +
                  '&eventid=' +
                  cEvent.value?._id +
                  '&usereventid=' +
                  cEventUser.value?._id +
                  '&userid=' +
                  cUser.value?.uid +
                  '&nombre=' +
                  chatActual?.chatname
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
