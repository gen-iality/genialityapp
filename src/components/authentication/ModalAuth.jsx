import { EyeInvisibleOutlined, EyeTwoTone, LoadingOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Modal, Tabs, Form, Input, Button, Divider, Typography, Space, Grid, Alert, Spin } from 'antd';
import FormComponent from '../events/registrationForm/form';
import withContext from '../../Context/withContext';
import { HelperContext } from '../../Context/HelperContext';
import { app } from '../../helpers/firebase';
import * as Cookie from 'js-cookie';

import React, { useContext, useEffect, useState } from 'react';

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
  let { handleChangeTypeModal, typeModal, handleChangeTabModal } = useContext(HelperContext);

  useEffect(() => {
    async function userAuth() {
      app.auth().onAuthStateChanged((user) => {
        if (user) {
          user.getIdToken().then(async function(idToken) {
            if (idToken && !Cookie.get('evius_token')) {
              Cookie.set('evius_token', idToken, { expires: 180 });
              setTimeout(function() {
                window.location.replace(`/landing/${props.cEvent.value?._id}?token=${idToken}`);
              }, 1000);
            }
          });
        }
      });
    }

    userAuth();
  }, []);

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
  const loginEmailPassword = (data) => {
    setErrorLogin(false);
    console.log('DATA==>', data.email.trim(), data.password.trim());
    app
      .auth()
      .signInWithEmailAndPassword(data.email, data.password)
      // .then(response =>
      .catch(() => {
        console.error('Error: Email or password invalid');
        setErrorLogin(true);
        setLoading(false);
      });
  };

  //Se ejecuta en caso que haya un error en el formulario de login en el evento onSubmit
  const onFinishFailed = (errorInfo) => {
    console.error('Failed:', errorInfo);
  };
  return (
    props.cUser?.value == null &&
    typeModal == null && (
      <Modal
        bodyStyle={{ paddingRight: '10px', paddingLeft: '10px' }}
        centered
        footer={null}
        zIndex={1000}
        closable={false}
        visible={true}>
        <Tabs onChange={callback} centered size='large'>
          <TabPane tab='Iniciar sesión' key='1'>
            <Form
              form={form1}
              onFinish={handleLoginEmailPassword}
              onFinishFailed={onFinishFailed}
              layout='vertical'
              style={screens.xs ? stylePaddingMobile : stylePaddingDesktop}>
              <Form.Item
                label='Email'
                name='email'
                style={{ marginBottom: '15px' }}
                rules={[{ required: true, message: 'Ingrese un email' }]}>
                <Input
                  disabled={loading}
                  type='email'
                  size='large'
                  placeholder='Email'
                  prefix={<MailOutlined style={{ fontSize: '24px', color: '#c4c4c4' }} />}
                />
              </Form.Item>
              <Form.Item
                label='Contraseña'
                name='password'
                style={{ marginBottom: '15px' }}
                rules={[{ required: true, message: 'Ingrese una contraseña' }]}>
                <Input.Password
                  disabled={loading}
                  size='large'
                  placeholder='Contraseña'
                  prefix={<LockOutlined style={{ fontSize: '24px', color: '#c4c4c4' }} />}
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>
              {!loading && (
                <Form.Item style={{ marginBottom: '15px' }}>
                  <Typography.Text
                    onClick={() => handleChangeTypeModal('recover')}
                    underline
                    type='secondary'
                    style={{ float: 'right', cursor: 'pointer' }}>
                    Olvide mi contraseña
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
                  message={'Email o contraseña incorrecta'}
                />
              )}
              {!loading && (
                <Form.Item style={{ marginBottom: '15px' }}>
                  <Button htmlType='submit' block style={{ backgroundColor: '#52C41A', color: '#FFFFFF' }} size='large'>
                    Iniciar sesión
                  </Button>
                </Form.Item>
              )}
              {loading && <LoadingOutlined style={{ fontSize: '50px' }} />}
            </Form>
            <Divider style={{ color: '#c4c4c4c' }}>O</Divider>
            <div style={screens.xs ? stylePaddingMobile : stylePaddingDesktop}>
              <Typography.Paragraph type='secondary'>Mira otras formas de entrar al evento</Typography.Paragraph>
              <Space direction='vertical' style={{ width: '100%' }}>
                <Button
                  disabled={loading}
                  block
                  style={{ backgroundColor: '#F0F0F0', color: '#8D8B8B', border: 'none' }}
                  size='large'>
                  Invitado anónimo
                </Button>
                <Button
                  disabled={loading}
                  onClick={() => handleChangeTypeModal('mail')}
                  block
                  style={{ backgroundColor: '#F0F0F0', color: '#8D8B8B', border: 'none' }}
                  size='large'>
                  Enviar acceso a mi correo
                </Button>
              </Space>
            </div>
          </TabPane>
          {props.cEventUser?.value == null && (
            <TabPane tab='Registrarme' key='2'>
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
