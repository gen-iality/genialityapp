import { LeftCircleOutlined, LoadingOutlined, MailOutlined } from '@ant-design/icons';
import { Modal, PageHeader, Space, Typography, Form, Input, Grid, Button, Alert, Row, Spin } from 'antd';
import React, { useState, useContext, useEffect } from 'react';
import { EventsApi, UsersApi } from '../../helpers/request';
import withContext from '../../Context/withContext';
import { HelperContext } from '../../Context/HelperContext';
import { useIntl } from 'react-intl';
import { auth } from '../../helpers/firebase';

const { useBreakpoint } = Grid;

const stylePaddingDesktop = {
  paddingLeft: '25px',
  paddingRight: '25px',
};
const stylePaddingMobile = {
  paddingLeft: '0px',
  paddingRight: '0px',
};

const ModalLoginHelpers = (props) => {
  let { handleChangeTypeModal, typeModal, handleChangeTabModal } = useContext(HelperContext);
  // typeModal --> recover || send
  const [registerUser, setRegisterUser] = useState(false);
  const [sendRecovery, setSendRecovery] = useState(null);
  const [resul, setresul] = useState('');
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const intl = useIntl();
  const screens = useBreakpoint();
  const textoTitle =
    typeModal == 'recover'
      ? intl.formatMessage({ id: 'modal.restore.message', defaultMessage: 'Restablecer contraseña' })
      : intl.formatMessage({ id: 'modal.send.message', defaultMessage: 'Enviar link de acceso al correo' });
  const textoButton =
    typeModal == 'recover'
      ? intl.formatMessage({ id: 'modal.restore.button', defaultMessage: 'Restablecer contraseña' })
      : intl.formatMessage({ id: 'modal.send.button', defaultMessage: 'Enviar link de acceso al correo' });
  //FUNCIÓN QUE PERMITE ENVIAR LA CONTRASEÑA AL EMAIL DIGITADO
  const handleRecoveryPass = async ({ email }) => {
    try {
      const resp = await EventsApi.changePassword(props.cEvent.value?._id, email);
      if (resp) {
        console.log('1. RESPUESTA API DEV===>', resp);
      }
      setSendRecovery(
        `${intl.formatMessage({
          id: 'modal.restore.alert.success',
          defaultMessage: 'Se ha enviado una nueva contraseña a:',
        })} ${email} `
      );
      setresul('OK');
    } catch (error) {
      setSendRecovery(
        `${intl.formatMessage({
          id: 'modal.restore.alert.error',
          defaultMessage: 'Error al solicitar una nueva contraseña',
        })}`
      );
    }
  };
  //FUNCIÓN QUE SE EJECUTA AL PRESIONAR EL BOTON
  const onFinish = async (values) => {
    setLoading(true);
    setRegisterUser(false);
    setSendRecovery(null);
    // SI EL EVENTO ES PARA RECUPERAR CONTRASEÑA
    if (typeModal == 'recover') {
      if (!props.organization) {
        const { data } = await EventsApi.getStatusRegister(props.cEvent.value?._id, values.email);
        if (data.length == 0) {
          setRegisterUser(true);
        } else {
          //RECUPERAR CONTRASEÑA
          handleRecoveryPass(values);
        }
      } else {
        //alert('ACA');
        const userExists = await UsersApi.findByEmail(values.email);
        if (userExists.length > 0) {
          auth.sendPasswordResetEmail(values.email);
          setSendRecovery(
            `${intl.formatMessage({
              id: 'modal.restore.alert.success',
              defaultMessage: 'Se ha enviado una nueva contraseña a:',
            })} ${values.email} `
          );
          setresul('OK');
          //setRegisterUser(true);
        } else {
          setSendRecovery(
            `${values.email} ${intl.formatMessage({
              id: 'modal.message.notregistered.org',
              defaultMessage: 'no se encuentra registrado.',
            })} `
          );
        }
        setLoading(false);
      }
    } else {
      //ENVIAR ACCESO AL CORREO
      try {
        //const resp = await EventsApi.requestUrlEmail(props.cEvent.value?._id, window.location.origin, { email:values.email });
        console.log('1. EMAIL A ENVIAR LINK', values.email);
        const resp = await EventsApi.requestLinkEmail(props.cEvent.value?._id, values.email);
        if (resp) {
          console.log('1. RESPUESTA ENVíO DE LINK');
          setSendRecovery(
            `${intl.formatMessage({
              id: 'modal.send.alert.success',
              defaultMessage: 'Se ha enviado un link de acceso a su correo electrónico',
            })} ${values.email}`
          );
        } else {
          setSendRecovery(
            `${values.email} ${intl.formatMessage({
              id: 'modal.send.notregistered',
              defaultMessage: 'no se encuentra registrado en este evento',
            })}`
          );
          setresul('noRegister');
        }
      } catch (error) {
        setSendRecovery(
          `${intl.formatMessage({
            id: 'modal.restore.alert.error',
            defaultMessage: 'Error al solicitar acceso al evento',
          })}`
        );
      }
    }
    setLoading(false);
  };

  //FAILDE DE VALIDACIONES DEL FORMULARIO
  const onFinishFailed = () => {
    console.log('FALIED FORM');
  };
  return (
    <Modal
      bodyStyle={{ textAlign: 'center' }}
      centered
      footer={null}
      zIndex={1000}
      closable={false}
      visible={typeModal !== null && typeModal != 'preregisterMessage'}>
      <PageHeader
        className={
          (sendRecovery != null || registerUser) &&
          'animate__animated animate__headShake animate__delay-2s animate__slower animate__infinite'
        }
        style={screens.xs ? stylePaddingMobile : stylePaddingDesktop}
        backIcon={
          <Space
            onClick={() => {
              handleChangeTypeModal(null);
              setSendRecovery(null);
              setRegisterUser(false);
              form.resetFields();
            }}>
            <LeftCircleOutlined style={{ color: '#6B7283', fontSize: '20px' }} />
            <span style={{ fontSize: '16px', color: '#6B7283' }}>
              {intl.formatMessage({ id: 'modal.restore.back', defaultMessage: 'Volver al inicio de sesión' })}
            </span>
          </Space>
        }
        onBack={() => null}
        title=' ' // NO eliminar el espacio en blanco
      />

      <Form
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout='vertical'
        style={screens.xs ? stylePaddingMobile : stylePaddingDesktop}>
        <Typography.Title level={4} type='secondary'>
          {textoTitle}
        </Typography.Title>
        <Form.Item
          label={intl.formatMessage({ id: 'modal.label.email', defaultMessage: 'Correo electrónico' })}
          name='email'
          style={{ marginBottom: '10px' }}
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'modal.rule.required', defaultMessage: 'El email es requerido' }),
            },
            {
              type: 'email',
              message: intl.formatMessage({ id: 'modal.rule.type', defaultMessage: 'Ingrese un email válido' }),
            },
          ]}>
          <Input
            type='email'
            size='large'
            placeholder={intl.formatMessage({ id: 'modal.label.email', defaultMessage: 'Correo electrónico' })}
            prefix={<MailOutlined style={{ fontSize: '24px', color: '#c4c4c4' }} />}
          />
        </Form.Item>
        {sendRecovery != null && (
          <Alert
            type='warning'
            message={sendRecovery}
            showIcon
            closable
            className='animate__animated animate__bounceIn'
            style={{
              boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
              backgroundColor: '#FFFFFF',
              color: '#000000',
              borderLeft: '5px solid #FAAD14',
              fontSize: '14px',
              textAlign: 'start',
              borderRadius: '5px',
            }}
            description={
              resul !== 'OK' && (
                <Button
                  size='middle'
                  type='primary'
                  onClick={() => {
                    handleChangeTabModal('2');
                    handleChangeTypeModal(null);
                    setSendRecovery(null);
                    setRegisterUser(false);
                    form.resetFields();
                  }}>
                  {intl.formatMessage({ id: 'modal.title.register', defaultMessage: 'Registrarme' })}
                </Button>
              )
            }
          />
        )}
        {registerUser && (
          <Alert
            showIcon
            type='error'
            message={intl.formatMessage({
              id: 'modal.message.notregistered',
              defaultMessage: 'Este email no se encuentra registrado en este evento',
            })}
            closable
            className='animate__animated animate__bounceIn animate__faster'
            style={{
              boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
              backgroundColor: '#FFFFFF',
              color: '#000000',
              borderLeft: '5px solid #FF4E50',
              fontSize: '14px',
              textAlign: 'start',
              borderRadius: '5px',
            }}
            description={
              <Button
                size='middle'
                type='primary'
                onClick={() => {
                  handleChangeTabModal('2');
                  handleChangeTypeModal(null);
                  setSendRecovery(null);
                  setRegisterUser(false);
                  form.resetFields();
                }}>
                {intl.formatMessage({ id: 'modal.title.register', defaultMessage: 'Registrarme' })}
              </Button>
            }
          />
        )}
        {!loading && (
          <Form.Item style={{ marginBottom: '10px', marginTop: '30px' }}>
            <Button
              id={'submitButton'}
              htmlType='submit'
              block
              style={{ backgroundColor: '#52C41A', color: '#FFFFFF' }}
              size='large'>
              {textoButton}
            </Button>
          </Form.Item>
        )}
        {loading && (
          <Row justify='center'>
            <LoadingOutlined style={{ fontSize: '50px' }} />
          </Row>
        )}
      </Form>
    </Modal>
  );
};

export default withContext(ModalLoginHelpers);
