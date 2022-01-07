import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LoadingOutlined,
  LockOutlined,
  MailOutlined,
  PictureOutlined,
} from '@ant-design/icons';
import {
  Modal,
  Tabs,
  Form,
  Input,
  Button,
  Divider,
  Typography,
  Space,
  Grid,
  Alert,
  Spin,
  Image,
  Skeleton,
  Upload,
} from 'antd';
import FormComponent from '../events/registrationForm/form';
import withContext from '../../Context/withContext';
import { HelperContext } from '../../Context/HelperContext';
import { app } from '../../helpers/firebase';
import { useIntl } from 'react-intl';
import React, { useContext, useEffect, useState } from 'react';
import { UsersApi } from '../../helpers/request';
import RegisterUser from './RegisterUser';
import { UseEventContext } from 'Context/eventContext';
import RegisterUserAndEventUser from './RegisterUserAndEventUser';
import { isHome } from 'helpers/helperEvent';

const { TabPane } = Tabs;
const { useBreakpoint } = Grid;

const stylePaddingDesktop = {
  paddingLeft: '30px',
  paddingRight: '30px',
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
  const [errorRegisterUSer, setErrorRegisterUSer] = useState(false);
  const [form1] = Form.useForm();
  let { handleChangeTypeModal, typeModal, handleChangeTabModal, tabLogin } = useContext(HelperContext);
  const cEvent = UseEventContext();
  const [modalVisible, setmodalVisible] = useState(false);
  const [msjError, setmsjError] = useState('');
  const intl = useIntl();

  useEffect(() => {
    if (props.tab) {
      handleChangeTabModal(props.tab);
    }
  }, [props.tab]);

  useEffect(() => {
    //validar que solo se muestre y active la tab de inicio de sesion para los eventos
    app.auth().onAuthStateChanged((user) => {
      if (
        (!user && cEvent?.value?.allow_register && cEvent?.value?.visibility == 'PUBLIC') ||
        (!user && !window.location.toString().includes('landing') && !window.location.toString().includes('event')) ||
        (!user && !cEvent?.value?.allow_register && cEvent?.value?.visibility == 'PRIVATE') ||
        (!cEvent?.value?.allow_register && cEvent?.value?.visibility == 'PUBLIC' && props.visible)
      ) {
        setmodalVisible(true);
        handleChangeTabModal('1');
      } else {
        setmodalVisible(false);
      }
    });

    return () => {
      form1.resetFields();
    };
  }, [props.cUser.value, props.visible]);

  const registerUser = async (values) => {
    setLoading(true);
    try {
      let resp = await UsersApi.createUser(values);
    } catch (error) {
      setErrorRegisterUSer(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    form1.resetFields();
    setErrorRegisterUSer(false);
    setErrorLogin(false);
  }, [typeModal, tabLogin]);

  const DetecError = (code) => {
    switch (code) {
      case 'auth/wrong-password':
        setmsjError(intl.formatMessage({ id: 'auth.error.wrongPassword' }));
        break;
      case 'auth/user-not-found':
        setmsjError(intl.formatMessage({ id: 'auth.error.userNotFound' }));

        break;
      case 'auth/invalid-email':
        setmsjError(intl.formatMessage({ id: 'auth.error.invalidEmail' }));
        break;

      case 'auth/too-many-requests':
        setmsjError(intl.formatMessage({ id: 'auth.error.tooManyRequests' }));
        break;
    }
  };

  const callback = (key) => {
    form1.resetFields();
    handleChangeTabModal(key);
  };

  //Método ejecutado en el evento onSubmit (onFinish) del formulario de login
  const handleLoginEmailPassword = async (values) => {
    setLoading(true);
    loginFirebase(values);
  };

  //Realiza la validación del email y password con firebase
  const loginFirebase = async (data) => {
    app
      .auth()
      .signInWithEmailAndPassword(data.email, data.password)
      .then((response) => {
        if (response.user) {
          console.log('response', response);
        }
      })
      .catch((error) => {
        console.log('error', error);
        DetecError(error.code);
        setErrorLogin(true);
        setLoading(false);
      });
  };

  //Se ejecuta en caso que haya un error en el formulario de login en el evento onSubmit
  const onFinishFailed = (errorInfo) => {
    console.error('Failed:', errorInfo);
  };
  /* console.log('props para eventos', props.cEvent.value?.allow_register, props.cEvent.value?.visibility) */

  const isVisibleRegister = () => {
    if (
      (props.cEventUser?.value == null &&
        !props.cEvent.value?.allow_register &&
        props.cEvent.value?.visibility === 'PUBLIC') ||
      (props.cEventUser?.value == null &&
        (props.cEvent.value?.allow_register === true || props.cEvent.value?.allow_register === 'true') &&
        props.cEvent.value?.visibility === 'PUBLIC' &&
        props.organization !== 'landing' &&
        props.cEvent.value?._id != '61aa596d8fe0525f9a623c74' &&
        props.cEvent.value?._id != '61aa59af8b4d7c454c051224' &&
        props.cEvent.value?._id != '61aa5a007060fa339c7de8b5' &&
        props.cEvent.value?._id != '61aa5a518fe0525f9a623c7d' &&
        props.cEvent.value?._id != '61aa5adccf4598684c160363' &&
        props.cEvent.value?._id != '61aa5b188b4d7c454c05122e') ||
      props.cEvent?.value == null
    ) {
      return true;
    } else {
      return false;
    }
  };

  return (
    modalVisible && (
      <Modal
        maskStyle={props.organization == 'landing' && { backgroundColor: '#333333' }}
        onCancel={props.organization == 'register' ? () => props.closeModal() : null}
        bodyStyle={{ paddingRight: '10px', paddingLeft: '10px' }}
        centered
        footer={null}
        zIndex={1000}
        visible={props.organization == 'register' ? props.visible : typeModal == null ? true : false}
        closable={props.organization == 'register' ? true : false}>
        <Tabs onChange={callback} centered size='large' activeKey={tabLogin}>
          <TabPane
            tab={intl.formatMessage({
              id: 'modal.title.login',
              defaultMessage: 'Iniciar sesión',
            })}
            key='1'>
            <Form
              form={form1}
              onFinish={handleLoginEmailPassword}
              onFinishFailed={onFinishFailed}
              layout='vertical'
              style={screens.xs ? stylePaddingMobile : stylePaddingDesktop}>
              {props.organization == 'landing' && (
                <Form.Item>
                  <Image
                    style={{ borderRadius: '100px', objectFit: 'cover' }}
                    preview={{ maskClassName: 'circularMask' }}
                    src={props.logo ? props.logo : 'error'}
                    fallback='http://via.placeholder.com/500/F5F5F7/CCCCCC?text=No%20Image'
                    width={200}
                    height={200}
                  />
                </Form.Item>
              )}
              <Form.Item
                label={intl.formatMessage({
                  id: 'modal.label.email',
                  defaultMessage: 'Correo electrónico',
                })}
                name='email'
                style={{ marginBottom: '15px', textAlign: 'left' }}
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
                  placeholder={intl.formatMessage({
                    id: 'modal.label.email',
                    defaultMessage: 'Correo electrónico',
                  })}
                  prefix={<MailOutlined style={{ fontSize: '24px', color: '#c4c4c4' }} />}
                />
              </Form.Item>
              <Form.Item
                label={intl.formatMessage({
                  id: 'modal.label.password',
                  defaultMessage: 'Contraseña',
                })}
                name='password'
                style={{ marginBottom: '15px', textAlign: 'left' }}
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
                  placeholder={intl.formatMessage({
                    id: 'modal.label.password',
                    defaultMessage: 'Contraseña',
                  })}
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
                    {intl.formatMessage({
                      id: 'modal.option.restore',
                      defaultMessage: 'Olvidé mi contraseña',
                    })}
                  </Typography.Text>
                </Form.Item>
              )}
              {errorLogin && (
                <Alert
                  showIcon
                  onClose={() => setErrorLogin(false)}
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
                  message={msjError}
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
                    {intl.formatMessage({
                      id: 'modal.title.login',
                      defaultMessage: 'Iniciar sesión',
                    })}
                  </Button>
                </Form.Item>
              )}
              {loading && <LoadingOutlined style={{ fontSize: '50px' }} />}
            </Form>
            {props.organization !== 'landing' && <Divider style={{ color: '#c4c4c4c' }}>O</Divider>}
            {props.organization !== 'landing' && (
              <div style={screens.xs ? stylePaddingMobile : stylePaddingDesktop}>
                <Space direction='vertical' style={{ width: '100%' }}>
                  <Button
                    icon={<MailOutlined />}
                    disabled={loading}
                    onClick={() => handleChangeTypeModal('mail')}
                    type='primary'
                    block
                    size='large'>
                    {intl.formatMessage({
                      id: 'modal.option.send',
                      defaultMessage: 'Enviar acceso a mi correo',
                    })}
                  </Button>
                </Space>
              </div>
            )}
          </TabPane>
          {isVisibleRegister() && (
            <TabPane tab={intl.formatMessage({ id: 'modal.title.register', defaultMessage: 'Registrarme' })} key='2'>
              <div
                style={{
                  height: 'auto',
                  overflowY: 'hidden',
                  paddingLeft: '5px',
                  paddingRight: '5px',
                  paddingTop: '0px',
                  paddingBottom: '0px',
                }}>
                {isHome() ? (
                  <RegisterUser
                    screens={screens}
                    stylePaddingMobile={stylePaddingMobile}
                    stylePaddingDesktop={stylePaddingDesktop}
                  />
                ) : (
                  <RegisterUserAndEventUser
                    screens={screens}
                    stylePaddingMobile={stylePaddingMobile}
                    stylePaddingDesktop={stylePaddingDesktop}
                  />
                )}

                {/* {props.organization != 'register' && <FormComponent />}
                  {props.organization == 'register' && (
                    <FormComponent
                      conditionalsOther={[]}
                      initialOtherValue={{}}
                      eventUserOther={{}}
                      fields={fieldsUser}
                      organization={true}
                      options={[]}
                      callback={(values) => registerUser(values)}
                      loadingregister={loading}
                      errorRegisterUser={errorRegisterUSer}
                    />
                  )} */}
              </div>
            </TabPane>
          )}
        </Tabs>
      </Modal>
    )
  );
};

export default withContext(ModalAuth);

const fieldsUser = [
  {
    name: 'avatar',
    mandatory: false,
    visibleByContacts: false,
    visibleByAdmin: false,
    label: 'Imagen de perfil',
    description: null,
    type: 'avatar',
    justonebyattendee: false,
    updated_at: '2021-09-22 14:25:33',
    created_at: '2021-09-21 21:56:24',
    _id: {
      $oid: '6160b1a7f6cfdd38d4502e74',
    },
    author: null,
    categories: [],
    event_type: null,
    organiser: null,
    organizer: null,
    currency: {},
    tickets: [],
    index: 2,
    order_weight: 1,
  },
  {
    name: 'names',
    mandatory: true,
    visibleByContacts: false,
    visibleByAdmin: false,
    label: 'Nombre',
    description: null,
    type: 'text',
    options: [],
    justonebyattendee: false,
    updated_at: '2021-09-22 14:25:31',
    created_at: '2021-09-21 22:43:05',
    _id: {
      $oid: '6160b1a7f6cfdd38d4502e72',
    },
    author: null,
    categories: [],
    event_type: null,
    organiser: null,
    organizer: null,
    currency: {},
    tickets: [],
    index: 0,
    order_weight: 2,
  },
  {
    name: 'email',
    mandatory: true,
    visibleByContacts: false,
    visibleByAdmin: false,
    label: 'Correo electrónico',
    description: null,
    type: 'email',
    options: [],
    justonebyattendee: false,
    updated_at: '2021-09-22 14:25:32',
    created_at: '2021-09-21 21:18:04',
    _id: {
      $oid: '6160b1a7f6cfdd38d4502e73',
    },
    author: null,
    categories: [],
    event_type: null,
    organiser: null,
    organizer: null,
    currency: {},
    tickets: [],
    index: 1,
    order_weight: 3,
    sensibility: true,
  },
  {
    name: 'password',
    mandatory: true,
    visibleByContacts: false,
    visibleByAdmin: false,
    label: 'Contraseña',
    description: null,
    type: 'password',
    justonebyattendee: false,
    updated_at: '2021-09-22 14:25:33',
    created_at: '2021-09-21 21:56:24',
    _id: {
      $oid: '6160b1a7f6cfdd38d4502e74',
    },
    author: null,
    categories: [],
    event_type: null,
    organiser: null,
    organizer: null,
    currency: {},
    tickets: [],
    index: 2,
    order_weight: 1,
  },
];
