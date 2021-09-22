import { LeftCircleOutlined, MailOutlined } from '@ant-design/icons';
import { Modal, PageHeader, Space, Typography, Form, Input, Grid, Button } from 'antd';
import React, { useContext } from 'react';
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
  const screens = useBreakpoint();
  const textoTitle = typeModal == 'recover' ? 'Recuperar contraseña' : 'Enviar link de acceso al correo ';
  const textoButton = typeModal == 'recover' ? 'Recuperar contraseña' : 'Enviar al correo ';

  return (
    <Modal
      bodyStyle={{ textAlign: 'center' }}
      centered
      footer={null}
      zIndex={999999999}
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

      <Form layout='vertical' style={screens.xs ? stylePaddingMobile : stylePaddingDesktop}>
        <Typography.Title level={4} type='secondary'>
          {textoTitle}
        </Typography.Title>
        <Form.Item label='Email' style={{ marginBottom: '10px' }}>
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
