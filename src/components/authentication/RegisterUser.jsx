import React from 'react';
import { PictureOutlined, MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Form, Input, Button, Space, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';

const RegisterUser = ({ screens, stylePaddingMobile, stylePaddingDesktop }) => {
  const ruleEmail = [
    {
      type: 'email',
      message: 'Ingrese un email valido',
    },
    { required: true, message: 'Ingrese un email para su cuenta en Evius' },
  ];

  const rulePassword = [
    { required: true, message: 'Ingrese una contraseña para su cuenta en Evius' },
    {
      type: 'string',
      min: 6,
      max: 18,
      message: 'La contraseña debe tener entre 6 a 18 caracteres',
    },
  ];
  const ruleName = [{ required: true, message: 'Ingrese un nombre para su cuenta en Evius!' }];

  return (
    <Form autoComplete='off' layout='vertical' style={screens.xs ? stylePaddingMobile : stylePaddingDesktop}>
      {/* <Typography.Title level={4} type='secondary'>
                      Nueva organizacion
                    </Typography.Title> */}
      <Form.Item>
        <ImgCrop rotate shape='round'>
          <Upload accept='image/png,image/jpeg' multiple={false} listType='picture' maxCount={1}>
            <Button type='primary' shape='circle' style={{ height: '125px', width: '125px' }}>
              <Space direction='vertical'>
                <PictureOutlined style={{ fontSize: '40px' }} />
                <span style={{ fontSize: '14px' }}>Subir imagen</span>
              </Space>
            </Button>
          </Upload>
        </ImgCrop>
      </Form.Item>
      <Form.Item
        label={'Email'}
        name='email'
        hasFeedback
        style={{ marginBottom: '10px', textAlign: 'left' }}
        rules={ruleEmail}>
        <Input
          type='email'
          size='large'
          placeholder={'micorreo@ejemplo.com'}
          prefix={<MailOutlined style={{ fontSize: '24px', color: '#c4c4c4' }} />}
        />
      </Form.Item>
      <Form.Item
        label={'Contraseña'}
        name='password'
        hasFeedback
        style={{ marginBottom: '10px', textAlign: 'left' }}
        rules={rulePassword}>
        <Input.Password
          type='password'
          size='large'
          placeholder={'Crea una contraseña'}
          prefix={<LockOutlined style={{ fontSize: '24px', color: '#c4c4c4' }} />}
        />
      </Form.Item>
      <Form.Item
        label={'Nombre'}
        name='name'
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
        <Button
          id={'submitButton'}
          htmlType='submit'
          block
          style={{ backgroundColor: '#52C41A', color: '#FFFFFF' }}
          size='large'>
          Crear Cuenta
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterUser;
