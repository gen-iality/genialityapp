import { EyeInvisibleOutlined, EyeTwoTone, LoadingOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Modal, Tabs, Form, Input, Button, Divider, Typography, Space, Grid, Alert, Spin } from 'antd';
import FormComponent from '../events/registrationForm/form';
import withContext from '../../Context/withContext';
import { HelperContext } from '../../Context/HelperContext';
import { app } from '../../helpers/firebase';
import * as Cookie from 'js-cookie';
import { useIntl } from 'react-intl';

import React, { useContext, useEffect, useState } from 'react';
import { EventsApi } from '../../helpers/request';

const { TabPane } = Tabs;
const { useBreakpoint } = Grid;

const stylePaddingDesktop = {
  paddingLeft: '25px',
  paddingRight: '25px',
  textAlign: 'center',
};
const stylePaddingMobile = {
  paddingLeft: '10px',
  paddingRight: '10px',
  textAlign: 'center',
};

const ModalAuth = (props) => {
  const screens = useBreakpoint();
  const [loading, setLoading] = useState(false);
  const [errorLogin, setErrorLogin] = useState(false);
  const [form1] = Form.useForm();
  let { handleChangeTypeModal, typeModal, handleChangeTabModal, tabLogin } = useContext(HelperContext);
  const intl = useIntl();

  useEffect(() => {
    async function userAuth() {
      // console.log("IDORG==>",props.idOrganization)
      app.auth().onAuthStateChanged((user) => {
        if (user) {
          user.getIdToken().then(async function(idToken) {
            if (idToken && !Cookie.get('evius_token')) {
              Cookie.set('evius_token', idToken, { expires: 180 });
              let url =
                props.organization == 'landing'
                  ? `/organization/${props.idOrganization}/events?token=${idToken}`
                  : `/landing/${props.cEvent.value?._id}?token=${idToken}`;
              setTimeout(function() {
                window.location.replace(url);
              }, 1000);
            }
          });
        }
      });
    }
    userAuth();

    if(props.cEvent.value?._id==="61816f5a039c0f2db65384a2"){
      handleChangeTabModal('1');
    }


    return () => {
      form1.resetFields();
    };
  }, []);

  useEffect(() => {
    form1.resetFields();
  }, [typeModal, tabLogin]);
  const callback = (key) => {
    form1.resetFields();
    handleChangeTabModal(key);
  };

  //Método ejecutado en el evento onSubmit (onFinish) del formulario de login
  const handleLoginEmailPassword = async (values) => {
    setLoading(true);
    loginEmailPassword(values);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  //Realiza la validación del email y password con firebase
  const loginFirebase = async (data) => {};

  const loginEmailPassword = async (data) => {
    let loginNormal = false;
    let loginFirst = false;
    setErrorLogin(false);
   
    app
      .auth()
      .signInWithEmailAndPassword(data.email, data.password)
      .then((response) => {
        loginNormal = true;
        setErrorLogin(false);
        //setLoading(false);
      })
      .catch(async () => {
        let user = await EventsApi.getStatusRegister(props.cEvent.value?._id, data.email);
        if (user.data.length > 0) {
          if (
            user.data[0].properties?.password == data.password ||
            user.data[0].contrasena == data.password ||
            user.data[0]?.user?.contrasena == data.password
          ) {
            let url =
              props.organization == 'landing'
                ? `/organization/${props.idOrganization}/events?token=${user.data[0]?.user?.initial_token}`
                : `/landing/${props.cEvent.value?._id}?token=${user.data[0]?.user?.initial_token}`;
            window.location.href = url;
            loginFirst = true;
            setErrorLogin(false);
            //setLoading(false);
            //loginFirebase(data)
            //leafranciscobar@gmail.com
            //Mariaguadalupe2014
          } else {
            setErrorLogin(true);
            setLoading(false);
          }
        } else {
          setErrorLogin(true);
          setLoading(false);
        }
      });
  };

  //Se ejecuta en caso que haya un error en el formulario de login en el evento onSubmit
  const onFinishFailed = (errorInfo) => {
    console.error('Failed:', errorInfo);
  };
  return (
    props.cUser?.status == 'LOADED' &&
    props.cUser?.value == null &&
    typeModal == null && (
      <Modal
        bodyStyle={{ paddingRight: '10px', paddingLeft: '10px' }}
        centered
        footer={null}
        zIndex={1000}
        closable={false}
        visible={true}>
        <Tabs onChange={callback} centered size='large' activeKey={tabLogin}>
          <TabPane tab={intl.formatMessage({ id: 'modal.title.login', defaultMessage: 'Iniciar sesión' })} key='1'>
            <Form
              form={form1}
              onFinish={handleLoginEmailPassword}
              onFinishFailed={onFinishFailed}
              layout='vertical'
              style={screens.xs ? stylePaddingMobile : stylePaddingDesktop}>
              <Form.Item
                label={intl.formatMessage({ id: 'modal.label.email', defaultMessage: 'Correo electrónico' })}
                name='email'
                style={{ marginBottom: '15px' }}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'modal.rule.required.email',
                      defaultMessage: 'Ingrese un correo',
                    }),
                  },
                ]}>
                <Input
                  disabled={loading}
                  type='email'
                  size='large'
                  placeholder={intl.formatMessage({ id: 'modal.label.email', defaultMessage: 'Correo electrónico' })}
                  prefix={<MailOutlined style={{ fontSize: '24px', color: '#c4c4c4' }} />}
                />
              </Form.Item>
              <Form.Item
                label={intl.formatMessage({ id: 'modal.label.password', defaultMessage: 'Contraseña' })}
                name='password'
                style={{ marginBottom: '15px' }}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'modal.rule.required.password',
                      defaultMessage: 'Ingrese una contraseña',
                    }),
                  },
                ]}>
                <Input.Password
                  disabled={loading}
                  size='large'
                  placeholder={intl.formatMessage({ id: 'modal.label.password', defaultMessage: 'Contraseña' })}
                  prefix={<LockOutlined style={{ fontSize: '24px', color: '#c4c4c4' }} />}
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>
              {!loading && (
                <Form.Item style={{ marginBottom: '15px' }}>
                  <Typography.Text
                    onClick={() => handleChangeTypeModal('recover')}
                    underline
                    id={'forgotpassword'}
                    type='secondary'
                    style={{ float: 'right', cursor: 'pointer' }}>
                    {intl.formatMessage({ id: 'modal.option.restore', defaultMessage: 'Olvidé mi contraseña' })}
                  </Typography.Text>
                </Form.Item>
              )}
              {errorLogin && (
                <Alert
                  showIcon
                  closable
                  className='animate__animated animate__bounceIn'
                  style={{
                    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                    backgroundColor: '#FFFFFF',
                    color: '#000000',
                    borderLeft: '5px solid #FF4E50',
                    fontSize: '14px',
                    textAlign: 'start',
                    borderRadius: '5px',
                    marginBottom: '15px',
                  }}
                  type='error'
                  message={intl.formatMessage({
                    id: 'modal.login.message',
                    defaultMessage: 'Correo o contraseña equivocada',
                  })}
                />
              )}
              {!loading && (
                <Form.Item style={{ marginBottom: '15px' }}>
                  <Button
                    id={'loginButton'}
                    htmlType='submit'
                    block
                    style={{ backgroundColor: '#52C41A', color: '#FFFFFF' }}
                    size='large'>
                    {intl.formatMessage({ id: 'modal.title.login', defaultMessage: 'Iniciar sesión' })}
                  </Button>
                </Form.Item>
              )}
              {loading && <LoadingOutlined style={{ fontSize: '50px' }} />}
            </Form>
            {props.organization !== 'landing' && <Divider style={{ color: '#c4c4c4c' }}>O</Divider>}
            {props.organization !== 'landing' && (
              <div style={screens.xs ? stylePaddingMobile : stylePaddingDesktop}>
                {/* <Typography.Paragraph type='secondary'>
                {intl.formatMessage({
                  id: 'modal.info.options',
                  defaultMessage: 'Mira otras formas de entrar al evento',
                })}
              </Typography.Paragraph> */}
                <Space direction='vertical' style={{ width: '100%' }}>
                  {/* <Button
                  disabled={loading}
                  block
                  style={{ backgroundColor: '#F0F0F0', color: '#8D8B8B', border: 'none' }}
                  size='large'>
                  Invitado anónimo
                </Button> */}
                  <Button
                    icon={<MailOutlined />}
                    disabled={loading}
                    onClick={() => handleChangeTypeModal('mail')}
                    type='primary'
                    block
                    // style={{ backgroundColor: '#F0F0F0', color: '#8D8B8B', border: 'none' }}
                    size='large'>
                    {intl.formatMessage({ id: 'modal.option.send', defaultMessage: 'Enviar acceso a mi correo' })}
                  </Button>
                </Space>
              </div>
            )}
          </TabPane>
          {props.cEventUser?.value == null &&
            props.organization !== 'landing' &&
            props.cEvent.value?._id != '61816f5a039c0f2db65384a2' && (
              <TabPane tab={intl.formatMessage({ id: 'modal.title.register', defaultMessage: 'Registrarme' })} key='2'>
                <div
                  // className='asistente-list'
                  style={{
                    height: 'auto',
                    overflowY: 'hidden',
                    paddingLeft: '5px',
                    paddingRight: '5px',
                    paddingTop: '0px',
                    paddingBottom: '0px',
                  }}>
                  <FormComponent />
                </div>
              </TabPane>
            )}
        </Tabs>
      </Modal>
    )
  );
};

export default withContext(ModalAuth);
