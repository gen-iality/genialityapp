import { useState } from 'react';
import { Modal, Form, Input, Button, Typography, Upload, Space } from 'antd';
import ImgCrop from 'antd-img-crop';
import { PictureOutlined } from '@ant-design/icons';
import functionCreateNewOrganization from './functionCreateNewOrganization';
import { DispatchMessageService } from '@context/MessageService';

const ModalCreateOrg = (props) => {
  const [form] = Form.useForm();
  const [imageAvatar, setImageAvatar] = useState(null);

  const beforeUpload = (file) => {
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      DispatchMessageService({
        type: 'error',
        msj: 'Image must smaller than 5MB!',
        action: 'show',
      });
    }
    return isLt5M ? true : false;
  };

  function resetFields() {
    form.resetFields();
    setImageAvatar(null);
  }
  const saveNewOrganization = (values) => {
    const newValues = {
      ...values,
      logo: imageAvatar,
      closeModal: props.setModalCreateOrgIsVisible,
      fetchItem: props.fetchItem,
      resetFields: resetFields,
    };
    functionCreateNewOrganization(newValues);
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
      visible={props.modalCreateOrgIsVisible}
      onCancel={() => {
        props.setModalCreateOrgIsVisible(false);
        resetFields();
      }}>
      <Form onFinish={saveNewOrganization} form={form} autoComplete='off' layout='vertical'>
        <Typography.Title level={4} type='secondary'>
          Nueva organizacion
        </Typography.Title>
        <Form.Item>
          <ImgCrop rotate shape='round'>
            <Upload
              accept='image/png,image/jpeg'
              onChange={(file) => {
                const fls = (file ? file.fileList : []).map((fl) => ({
                  ...fl,
                  status: 'success',
                }));
                if (file.fileList.length > 0) {
                  setImageAvatar(fls);
                } else {
                  setImageAvatar(null);
                }
              }}
              multiple={false}
              listType='picture'
              maxCount={1}
              fileList={imageAvatar}
              beforeUpload={beforeUpload}>
              {imageAvatar === null && (
                <Button type='primary' shape='circle' style={{ height: '150px', width: '150px' }}>
                  <Space direction='vertical'>
                    <PictureOutlined style={{ fontSize: '40px' }} />
                    Subir logo
                  </Space>
                </Button>
              )}
            </Upload>
          </ImgCrop>
        </Form.Item>
        <Form.Item
          label={'Nombre de la organizacion'}
          name='name'
          style={{ marginBottom: '10px' }}
          rules={[{ required: true, message: 'Ingrese un nombre para su organización!' }]}>
          <Input type='text' size='large' placeholder={'Nombre de la organizacion'} />
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
