import { EyeInvisibleOutlined, EyeTwoTone, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Modal, Tabs, Form, Input, Button, Divider, Typography, Space, Grid } from 'antd';
import FormComponent from '../events/registrationForm/form';
import withContext from '../../Context/withContext';

import React from 'react';

const { TabPane } = Tabs;
const { useBreakpoint } = Grid;

const stylePaddingDesktop = {
  paddingLeft: '25px',
  paddingRight: '25px',
};
const stylePaddingMobile = {
  paddingLeft: '10px',
  paddingRight: '10px',
};

const ModalAuth = (props) => {
  const screens = useBreakpoint();
  return (
    props.cUser?.value == null &&
    props.typeModal == null && (
      <Modal
        bodyStyle={{ textAlign: 'center', paddingRight: '10px', paddingLeft: '10px' }}
        centered
        footer={null}
        zIndex={999999999}
        closable={false}
        visible={true}>
        <Tabs centered size='large'>
          <TabPane tab='Iniciar sesión' key='1'>
            <Form layout='vertical' style={screens.xs ? stylePaddingMobile : stylePaddingDesktop}>
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
                <Typography.Text
                  onClick={() => props.setTypeModal('recover')}
                  underline
                  type='secondary'
                  style={{ float: 'right', cursor: 'pointer' }}>
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
            <div style={screens.xs ? stylePaddingMobile : stylePaddingDesktop}>
              <Typography.Paragraph type='secondary'>Mira otras formas de entrar al evento</Typography.Paragraph>
              <Space direction='vertical' style={{ width: '100%' }}>
                <Button block style={{ backgroundColor: '#F0F0F0', color: '#8D8B8B', border: 'none' }} size='large'>
                  Invitado anónimo
                </Button>
                <Button
                  onClick={() => props.setTypeModal('send')}
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
                  height: '70vh',
                  overflowY: 'hidden',
                  paddingLeft: '5px',
                  paddingRight: '5px',
                  paddingTop: '8px',
                  paddingBottom: '8px',
                }}>
                <FormComponent
                  extraFieldsOriginal={props.cEvent.value?.user_properties}
                  eventId={props.cEvent.value?._id}
                  conditionals={props.cEvent.value?.fields_conditions || []}
                  initialValues={props.cEventUser?.value || {}}
                  eventUser={props.cEventUser?.value}
                />
              </div>
            </TabPane>
          )}
        </Tabs>
      </Modal>
    )
  );
};

export default withContext(ModalAuth);
