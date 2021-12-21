import React, { useContext } from 'react';
import { List, Typography, Badge, Tabs, Form, Button, Row, Space, Col, Input } from 'antd';
import * as notificationsActions from '../../../redux/notifications/actions';
import { UseEventContext } from '../../../Context/eventContext';
import { UseCurrentUser } from '../../../Context/userContext';
import { UseUserEvent } from '../../../Context/eventUserContext';
import { connect } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { HelperContext } from '../../../Context/HelperContext';
import UsersCard from '../../shared/usersCard';
import { app } from 'helpers/firebase';
import ThisRouteCanBeDisplayed from '../../events/Landing/helpers/thisRouteCanBeDisplayed';
const { TabPane } = Tabs;
const { setNotification } = notificationsActions;
const { Text } = Typography;

const styleList = {
  padding: 5,
  borderRadius: '10px',
  backgroundColor: '#ffffff63',
};

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const ChatList = (props) => {
  const history = useHistory();
  let cUser = UseCurrentUser();
  let cEvent = UseEventContext();
  let cEventUser = UseUserEvent();

  let { chatActual, HandleGoToChat, privateChatsList, chatPublicPrivate, HandlePublicPrivate } = useContext(
    HelperContext
  );

  const onFinish = (values) => {
    app
      .auth()
      .signInAnonymously()
      .then((user) => {
        app
          .auth()
          .currentUser.updateProfile({
            displayName: values.name,
            photoURL: 'https://example.com/jane-q-user/profile.jpg',
          })
          .then(async (respother) => {
            await app.auth().currentUser.reload();
            console.log('RESP OTHER==>', respother);
            /* app
              .auth()
              .currentUser.updateEmail(values.email)
              .then((resp) => {
                console.log('EMAIL VALUES==>', values.email);
                console.log('LOGIN ANONIMO', resp);
                setUserAnosimous({ ...values });
              })
              .catch((err) => console.log('ERROR==>', err));*/
          });
      });
  };

  // constante para insertar texto dinamico con idioma
  const intl = useIntl();

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

  if (!cUser.value && !cEvent?.value?.allow_register && cEvent?.value?.visibility == 'PUBLIC')
    return (
      <Form className='asistente-list' {...layout} name='basic' initialValues={{ remember: true }} onFinish={onFinish}>
        <Row justify='start' style={{ marginBottom: 15 }}>
          <Col>
            <Text type='secondary'>
              <FormattedMessage
                id='form.message.socialzone'
                defaultMessage='Registrate para participar en el chat de este evento'
              />
            </Text>
          </Col>
        </Row>

        <Form.Item label='Nombre' name='name' rules={[{ required: true, message: 'Ingrese su nombre' }]}>
          <Input />
        </Form.Item>

        <Form.Item label='Email' name='email' rules={[{ required: true, message: 'Ingrese su email' }]}>
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
          <Button htmlType='submit' onClick={() => history.push(`/landing/${cEvent.value._id}/tickets`)} type='primary'>
            {/*<FormattedMessage id='form.button.register' defaultMessage='Registrarme' />*/}
            Ingresar
          </Button>
        </Form.Item>
      </Form>
    );

  let userNameActive = cUser.value.name ? cUser.value.name : cUser.value.names;
  console.log('Props', props);
  return (
    <Tabs style={{ marginTop: '-15px' }} activeKey={chatPublicPrivate} size='small' onChange={callback} centered>
      {props.generalTabs.publicChat && (
        <TabPane
          tab={
            <div style={{ color: cEvent.value.styles.textMenu }}>
              <FormattedMessage id='tabs.public.socialzone' defaultMessage='Público' />
            </div>
          }
          key='public'>
          <iframe
            style={{ marginTop: `${props.props.mobile && props.props.mobile === true ? '-74px' : '-45px'}` }}
            title='chatevius'
            className='ChatEviusLan'
            src={
              'https://chatevius.netlify.app?nombre=' +
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
            <ThisRouteCanBeDisplayed>
              <List
                key='PrivateChat'
                className='asistente-list'
                style={styleList}
                dataSource={privateChatsList}
                renderItem={(item) => <UsersCard type='privateChat' item={item} />}
              />
            </ThisRouteCanBeDisplayed>
          )}

          {chatActual.chatname && (
            <>
              <iframe
                style={{ marginTop: `${props.props.mobile && props.props.mobile === true ? '-74px' : '-45px'}` }}
                title='chatevius'
                className='ChatEviusLan'
                src={
                  'https://chatevius.netlify.app?iduser=' +
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
