import { EyeInvisibleOutlined, EyeTwoTone, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Modal, Tabs, Form, Input, Button, Divider, Typography, Space } from 'antd';
import FormComponent from '../events/registrationForm/form';

import React from 'react';

const { TabPane } = Tabs;

const stylepadding = {
  paddingLeft: '25px',
  paddingRight: '25px',
};

const ModalAuth = () => {
  return (
    <Modal
      bodyStyle={{ textAlign: 'center', minHeight: '80vh' }}
      centered
      footer={null}
      zIndex={999999999}
      closable={false}
      visible={true}>
      <Tabs centered size='large'>
        <TabPane tab='Iniciar sesión' key='1'>
          <Form layout='vertical' style={stylepadding}>
            <Form.Item label='Email' style={{ marginBottom: '10px' }}>
              <Input
                size='large'
                placeholder='Email'
                prefix={<MailOutlined style={{ fontSize: '24px', color: '#c4c4c4' }} />}
              />
            </Form.Item>
            <Form.Item label='Contraseña' style={{ marginBottom: '10px' }}>
              <Input.Password
                size='large'
                placeholder='Contraseña'
                prefix={<LockOutlined style={{ fontSize: '24px', color: '#c4c4c4' }} />}
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>
            <Form.Item style={{ marginBottom: '10px' }}>
              <Typography.Text underline type='secondary' style={{ float: 'right', cursor: 'pointer' }}>
                Olvide mi contraseña
              </Typography.Text>
            </Form.Item>
            <Form.Item style={{ marginBottom: '10px' }}>
              <Button block style={{ backgroundColor: '#52C41A', color: '#FFFFFF' }} size='large'>
                Iniciar sesión
              </Button>
            </Form.Item>
          </Form>
          <Divider style={{ color: '#c4c4c4c' }}>O</Divider>
          <div style={stylepadding}>
            <Typography.Paragraph type='secondary'>Mira otras formas de entrar al evento</Typography.Paragraph>
            <Space direction='vertical' style={{ width: '100%' }}>
              <Button block style={{ backgroundColor: '#F0F0F0', color: '#8D8B8B', border: 'none' }} size='large'>
                Invitado anónimo
              </Button>
              <Button block style={{ backgroundColor: '#F0F0F0', color: '#8D8B8B', border: 'none' }} size='large'>
                Enviar acceso a mi correo
              </Button>
            </Space>
          </div>
        </TabPane>
        <TabPane tab='Registrarme' key='2'>
          <div
          className='asistente-list'
            style={{
              height: '70vh',
              overflowY: 'auto',
              paddingLeft: '5px',
              paddingRight: '5px',
              paddingTop: '10px',
              paddingBottom: '10px',
            }}>
                Aqui va el formulario
          </div>
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default ModalAuth;
