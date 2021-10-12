import React from 'react';
import { Modal, Form, Input, Button, Typography } from 'antd';

const ModalCreateTemplate = () => {
  return (
    <Modal
      bodyStyle={{ textAlign: 'center', paddingRight: '80px', paddingLeft: '80px', paddingTop: '80px', height: 'auto' }}
      centered
      footer={null}
      zIndex={1000}
      closable={true}
      visible={true}>
      <Form layout='vertical'>
        <Typography.Title level={4} type='secondary'>
          Nuevo template de datos a recolectar
        </Typography.Title>
        <Form.Item label={'Nombre del template'} name='email' style={{ marginBottom: '10px', marginTop:'20px' }}>
          <Input type='email' size='large' placeholder={'Nombre del template'} />
        </Form.Item>
        <Form.Item style={{ marginBottom: '10px', marginTop: '30px' }}>
          <Button
            id={'submitButton'}
            htmlType='submit'
            block
            style={{ backgroundColor: '#52C41A', color: '#FFFFFF' }}
            size='large'>
            Crear template
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalCreateTemplate;
