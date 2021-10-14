import React from 'react';
import { Modal, Form, Input, Button, Typography, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { UploadOutlined } from '@ant-design/icons';

const ModalCreateOrg = (props) => {
  return (
    <Modal
      bodyStyle={{ textAlign: 'center', paddingRight: '80px', paddingLeft: '80px', paddingTop: '80px', height: '70vh' }}
      centered
      footer={null}
      zIndex={1000}
      closable={true}
      visible={props.isVisible}
      onCancel={() => props.setIsVisible(false)}>
      <Form layout='vertical'>
        <Typography.Title level={4} type='secondary'>
          Nueva organizacion
        </Typography.Title>
        <Form.Item>
          <ImgCrop rotate shape='round'>
            <Upload multiple={false} listType='picture' maxCount={1}>
              <Button type='primary' shape='circle' style={{ height: '100px', width: '100px' }}>
                Subir logo
              </Button>
            </Upload>
          </ImgCrop>
        </Form.Item>
        <Form.Item label={'Nombre de la organizacion'} name='email' style={{ marginBottom: '10px' }}>
          <Input type='email' size='large' placeholder={'Nombre de la organizacion'} />
        </Form.Item>
        <Form.Item style={{ marginBottom: '10px', marginTop: '30px' }}>
          <Button
            id={'submitButton'}
            htmlType='submit'
            block
            style={{ backgroundColor: '#52C41A', color: '#FFFFFF' }}
            size='large'>
            Crear organizacion
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalCreateOrg;
