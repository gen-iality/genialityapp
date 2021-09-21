import { LeftCircleOutlined, MailOutlined } from '@ant-design/icons';
import { Modal, PageHeader, Space, Typography, Form, Input, Grid, Button, Alert } from 'antd';
import React from 'react';

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

  // typeModal recover || send  
  const screens = useBreakpoint();
  const textoTitle = props.typeModal == 'recover' ? 'Recuperar contraseña' : 'Enviar link de acceso al correo '
  const textoButton = props.typeModal == 'recover' ? 'Recuperar contraseña' : 'Enviar al correo '

  return (
    <Modal
      bodyStyle={{ textAlign: 'center' }}
      centered
      footer={null}
      zIndex={999999999}
      closable={false}
      visible={props.typeModal !==null}>
      <PageHeader 
      style={screens.xs ? stylePaddingMobile : stylePaddingDesktop}
        backIcon={
          <Space onClick={()=>props.setTypeModal(null)}>
            <LeftCircleOutlined style={{ color: '#6B7283', fontSize: '20px' }} />
            <span style={{ fontSize: '14px', color: '#6B7283' }}>Volver al inicio de sesión</span>
          </Space>
        }
        onBack={() => null}
        title=' '
      />

      <Form layout='vertical' style={screens.xs ? stylePaddingMobile : stylePaddingDesktop}>
        <Typography.Title level={4} type='secondary'>
          {textoTitle}
        </Typography.Title>
        <Form.Item label='Email' style={{ marginBottom: '10px' }} >
          <Input
            type='email'
            size='large'
            placeholder='Email'
            prefix={<MailOutlined style={{ fontSize: '24px', color: '#c4c4c4' }} />}
          />
        </Form.Item>
        <Form.Item style={{ marginBottom: '10px', marginTop: '30px' }}>
          <Button block style={{ backgroundColor: '#52C41A', color: '#FFFFFF' }} size='large'>
            {textoButton}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalLoginHelpers;
