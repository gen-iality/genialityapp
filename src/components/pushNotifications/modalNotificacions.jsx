import React, { useState } from 'react';
import { Modal, Form, Input, Button, Typography, Upload, message, Space } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import axios from 'axios';
const { TextArea } = Input;
const ModalNotifications = (props) => {
  const { modalSendNotificationVisible, setModalSendNotificationVisible, data } = props;
  const [form] = Form.useForm();

  function resetFields() {
    form.resetFields();
  }
  const sendNotifications = (values) => {
    const { notificationMessage } = values;
    console.log('10. notificationMessage ', notificationMessage);
    const loading = message.loading({
      duration: 90,
      key: 'loading',
      content: `Enviando ${data.length > 0 ? 'notificaciones' : 'notificación'}`,
    });

    if (data.length > 0) {
      console.log('10. notificacion general ', data);
    } else {
      const body = {
        token: data.token,
        title: data.name || data.names,
        message: notificationMessage,
      };
      console.log('10. notificacion unica ', data);
      axios
        .post('https://eviusauth.web.app/notification', body)
        .then(function(response) {
          console.log('10. response ', response);
          message.destroy(loading.key);
          message.success('Notificación enviada correctamente');
          setModalSendNotificationVisible(false);
        })
        .catch(function(error) {
          console.log('10. error ', error);
          message.destroy(loading.key);
          message.error(`Error al enviar la notificación, ${error}`);

          setModalSendNotificationVisible(false);
        });
    }
  };

  return (
    <Modal
      bodyStyle={{
        textAlign: 'center',
        paddingRight: '80px',
        paddingLeft: '80px',
        paddingTop: '80px',
        paddingBottom: '50px',
        height: 'auto',
      }}
      centered
      footer={null}
      zIndex={1000}
      closable={true}
      visible={modalSendNotificationVisible}
      onCancel={() => {
        setModalSendNotificationVisible(false);
        resetFields();
      }}>
      <Form onFinish={sendNotifications} form={form} autoComplete='off' layout='vertical'>
        <Typography.Title level={4} type='secondary'>
          Enviar notificación push
        </Typography.Title>
        <Form.Item
          label={'Mensaje'}
          name='notificationMessage'
          style={{ marginBottom: '10px' }}
          rules={[{ required: true, message: 'Ingrese un mensaje!' }]}>
          <TextArea showCount maxLength={250} placeholder={'Máximo 250 caracteres'} />
        </Form.Item>
        <Form.Item style={{ marginBottom: '10px', marginTop: '30px' }}>
          <Button
            id={'submitButton'}
            htmlType='submit'
            block
            style={{ backgroundColor: '#52C41A', color: '#FFFFFF' }}
            size='large'
            icon={<SendOutlined />}>
            Enviar notificación
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalNotifications;
