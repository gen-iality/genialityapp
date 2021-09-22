import { LeftCircleOutlined, MailOutlined } from '@ant-design/icons';
import { Modal, PageHeader, Space, Typography, Form, Input, Grid, Button, Alert } from 'antd';
import React, { useState, useContext } from 'react';
import { EventsApi } from '../../helpers/request';
import withContext from '../../Context/withContext';
import { HelperContext } from '../../Context/HelperContext';

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
  let { handleChangeTypeModal, typeModal } = useContext(HelperContext);
  // typeModal --> recover || send
  const [registerUser, setRegisterUser] = useState(false);
  const [sendRecovery, setSendRecovery] = useState(null);
  const screens = useBreakpoint();
  const textoTitle = props.typeModal == 'recover' ? 'Recuperar contraseña' : 'Enviar link de acceso al correo ';
  const textoButton = props.typeModal == 'recover' ? 'Recuperar contraseña' : 'Enviar al correo ';
  //FUNCIÓN QUE PERMITE ENVIAR LA CONTRASEÑA AL EMAIL DIGITADO
  const handleRecoveryPass = async ({ email }) => {
    try {
      const resp = await EventsApi.recoveryPassword(props.cEvent.value?._id, window.location.origin, { email });
      setSendRecovery(`Se ha enviado una nueva contraseña a: ${email} `);
    } catch (error) {
      setSendRecovery('Error al solicitar una nueva contraseña');
    }
  };
  //FUNCIÓN QUE SE EJECUTA AL PRESIONAR EL BOTON
  const onFinish = async (values) => {
    setRegisterUser(false);
    setSendRecovery(null);
    // SI EL EVENTO ES PARA RECUPERAR CONTRASEÑA
    if (typeModal == 'recover') {
      const { data } = await EventsApi.getStatusRegister(props.cEvent.value?._id, values.email);
      //console.log("RESPUESTA REGISTER USER==>",data)
      if (data.length == 0) {
        setRegisterUser(true);
      } else {
        //RECUPERAR CONTRASEÑA
        handleRecoveryPass(values);
      }
    } else {
      //ENVIAR ACCESO AL CORREO
    }
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
      zIndex={500}
      closable={false}
      visible={typeModal !== null}>
      <PageHeader
        style={screens.xs ? stylePaddingMobile : stylePaddingDesktop}
        backIcon={
          <Space onClick={() => handleChangeTypeModal(null)}>
            <LeftCircleOutlined style={{ color: '#6B7283', fontSize: '20px' }} />
            <span style={{ fontSize: '14px', color: '#6B7283' }}>Volver al inicio de sesión</span>
          </Space>
        }
        onBack={() => null}
        title=' ' // NO eliminar el espacio en blanco
      />

      <Form
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout='vertical'
        style={screens.xs ? stylePaddingMobile : stylePaddingDesktop}>
        <Typography.Title level={4} type='secondary'>
          {textoTitle}
        </Typography.Title>
        <Form.Item
          label='Email'
          name='email'
          style={{ marginBottom: '10px' }}
          rules={[
            { required: true, message: 'El email es requerido' },
            { type: 'email', message: 'Ingrese un email válido' },
          ]}>
          <Input
            type='email'
            size='large'
            placeholder='Email'
            prefix={<MailOutlined style={{ fontSize: '24px', color: '#c4c4c4' }} />}
          />
        </Form.Item>
        {sendRecovery != null && <Alert type='info' message={sendRecovery} />}
        {registerUser && <Alert showIcon type='error' message='Este email no se encuentra registrado en este evento' />}
        <Form.Item style={{ marginBottom: '10px', marginTop: '30px' }}>
          <Button htmlType='submit' block style={{ backgroundColor: '#52C41A', color: '#FFFFFF' }} size='large'>
            {textoButton}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default withContext(ModalLoginHelpers);
