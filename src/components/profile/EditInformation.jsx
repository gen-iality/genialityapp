import React, { useState } from 'react';
import { Button, Card, Form, Input, Space, Upload } from 'antd';
import { PictureOutlined, UserOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import { useIntl } from 'react-intl';

const EditInformation = () => {
  let [imageAvatar, setImageAvatar] = useState(null);

  const intl = useIntl();

  const ruleName = [{ required: true, message: 'Ingrese un nombre para su cuenta en Evius!' }];

  return (
    <Card style={{ borderRadius: '15px' }}>
      <Form
        //   onFinish={onFinishCreateNewUser}
        //   form={form}
        autoComplete='off'
        layout='vertical'
        style={{ padding: '10px' }}>
        <Form.Item>
          <ImgCrop rotate shape='round'>
            <Upload
              accept='image/png,image/jpeg'
              //   onChange={(file) => {
              //     if (file.fileList.length > 0) {
              //       setImageAvatar(file.fileList);
              //     } else {
              //       setImageAvatar(null);
              //     }
              //   }}
              //   customRequest={dummyRequest}
              multiple={false}
              listType='picture'
              maxCount={1}
              fileList={imageAvatar}>
              {
                <Button
                  type='primary'
                  shape='circle'
                  style={{ height: !imageAvatar ? '150px' : '95px', width: !imageAvatar ? '150px' : '95px' }}>
                  <Space direction='vertical'>
                    <PictureOutlined style={{ fontSize: '40px' }} />
                    {intl.formatMessage({
                      id: 'modal.label.photo',
                      defaultMessage: 'Subir foto',
                    })}
                  </Space>
                </Button>
              }
            </Upload>
          </ImgCrop>
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({
            id: 'modal.label.name',
            defaultMessage: 'Nombre',
          })}
          name='names'
          hasFeedback
          style={{ marginBottom: '10px', textAlign: 'left' }}
          rules={ruleName}>
          <Input
            type='text'
            size='large'
            placeholder={'¿Como te llamas?'}
            prefix={<UserOutlined style={{ fontSize: '24px', color: '#c4c4c4' }} />}
          />
        </Form.Item>
        <Form.Item style={{ marginBottom: '10px', marginTop: '30px' }}>
          <Button style={{ backgroundColor: '#52C41A', color: '#FFFFFF' }} size='large'>
            Guardar cambios
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default EditInformation;
