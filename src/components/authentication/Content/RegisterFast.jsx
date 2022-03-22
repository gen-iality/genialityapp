import { useState } from 'react';
import { PictureOutlined, MailOutlined, LockOutlined, UserOutlined, IdcardOutlined } from '@ant-design/icons';
import { Form, Input, Button, Space, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { useIntl } from 'react-intl';
import { useEventArkmed } from '../../../helpers/helperEvent';
import { UseEventContext } from '../../../context/eventContext';

const RegisterFast = ({ basicDataUser, HandleHookForm }) => {
  const intl = useIntl();
  const cEvent = UseEventContext();

  const ruleEmail = [
    {
      type: 'email',
      message: intl.formatMessage({
        id: 'register.rule.email.message',
        defaultMessage: 'Ingrese un email valido',
      }),
    },
    {
      required: true,
      message: intl.formatMessage({
        id: 'register.rule.email.message2',
        defaultMessage: 'Ingrese un email para su cuenta en Evius',
      }),
    },
  ];

  const rulePassword = [
    {
      required: true,
      message: intl.formatMessage({
        id: 'register.rule.password.message',
        defaultMessage: 'Ingrese una contraseña para su cuenta en Evius',
      }),
    },
    {
      type: 'string',
      min: 6,
      max: 18,
      message: intl.formatMessage({
        id: 'register.rule.password.message2',
        defaultMessage: 'La contraseña debe tener entre 6 a 18 caracteres',
      }),
    },
  ];

  const ruleCedula = [
    { required: true, message: 'Ingrese una cedula para su cuenta en Evius' },
    {
      type: 'string',
      min: 8,
      max: 12,
      message: 'La cedula debe tener entre 6 a 18 caracteres',
    },
  ];
  const ruleName = [
    {
      required: true,
      message: intl.formatMessage({
        id: 'register.rule.name.message',
        defaultMessage: 'Ingrese su nombre completo para su cuenta en Evius',
      }),
    },
  ];

  const [form] = Form.useForm();
  let [imageAvatar, setImageAvatar] = useState(null);

  /** request para no mostrar el error que genera el component upload de antd */
  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess('ok');
    }, 0);
  };

  function onFinish(values) {
    console.log('values', values);
    handleNext(values);
  }

  return (
    <>
      <Form
        initialValues={{
          names: basicDataUser.names,
          email: basicDataUser.email,
          password: basicDataUser.password,
        }}
        form={form}
        autoComplete='on'
        layout='vertical'
        onFinish={onFinish}>
        <Form.Item>
          <ImgCrop rotate shape='round'>
            <Upload
              accept='image/png,image/jpeg'
              onChange={(file) => {
                if (file.fileList.length > 0) {
                  setImageAvatar(file.fileList);
                  HandleHookForm(null, 'picture', file.fileList);
                } else {
                  setImageAvatar(null);
                }
              }}
              customRequest={dummyRequest}
              multiple={false}
              listType='picture'
              maxCount={1}
              fileList={basicDataUser.picture ? basicDataUser.picture : imageAvatar}>
              {
                <Button
                  type='primary'
                  shape='circle'
                  style={{
                    height: !imageAvatar ? '150px' : '95px',
                    width: !imageAvatar ? '150px' : '95px',
                  }}>
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
            id: 'modal.label.email',
            defaultMessage: 'Correo electrónico',
          })}
          name='email'
          hasFeedback
          style={{ marginBottom: '10px', textAlign: 'left' }}
          rules={ruleEmail}>
          <Input
            onChange={(e) => HandleHookForm(e, 'email')}
            type='email'
            size='large'
            placeholder={'micorreo@ejemplo.com'}
            prefix={<MailOutlined style={{ fontSize: '24px', color: '#c4c4c4' }} />}
          />
        </Form.Item>
        {useEventArkmed(cEvent.value?._id).isArkmed ? (
          <Form.Item
            label={intl.formatMessage({
              id: 'modal.label.cedula',
              defaultMessage: 'Cedula',
            })}
            name='password'
            hasFeedback
            style={{ marginBottom: '10px', textAlign: 'left' }}
            rules={ruleCedula}>
            <Input
              onChange={(e) => HandleHookForm(e, 'password')}
              type='number'
              size='large'
              placeholder={'Cedula del medico ó especialista'}
              prefix={<IdcardOutlined style={{ fontSize: '24px', color: '#c4c4c4' }} />}
            />
          </Form.Item>
        ) : (
          <Form.Item
            label={intl.formatMessage({
              id: 'modal.label.password',
              defaultMessage: 'Contraseña',
            })}
            name='password'
            hasFeedback
            style={{ marginBottom: '10px', textAlign: 'left' }}
            rules={rulePassword}>
            <Input.Password
              onChange={(e) => HandleHookForm(e, 'password')}
              type='password'
              size='large'
              placeholder={intl.formatMessage({
                id: 'modal.label.password',
                defaultMessage: 'Contraseña',
              })}
              prefix={<LockOutlined style={{ fontSize: '24px', color: '#c4c4c4' }} />}
            />
          </Form.Item>
        )}
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
            onChange={(e) => HandleHookForm(e, 'names')}
            type='text'
            size='large'
            placeholder={intl.formatMessage({
              id: 'modal.label.name',
              defaultMessage: 'Nombre',
            })}
            prefix={<UserOutlined style={{ fontSize: '24px', color: '#c4c4c4' }} />}
          />
        </Form.Item>
      </Form>
    </>
  );
};

export default RegisterFast;
