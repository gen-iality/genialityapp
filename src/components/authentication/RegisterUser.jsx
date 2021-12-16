import React, { useEffect, useState } from 'react';
import { PictureOutlined, MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Form, Input, Button, Space, Upload, message } from 'antd';
import ImgCrop from 'antd-img-crop';
import createNewUser from './ModalsFunctions/createNewUser';
import ModalFeedback from './ModalFeedback';
import { app } from 'helpers/firebase';
import { useContext } from 'react';
import HelperContext from 'Context/HelperContext';

const RegisterUser = ({ screens, stylePaddingMobile, stylePaddingDesktop }) => {
  const { handleChangeTypeModal } = useContext(HelperContext);
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

  const [form] = Form.useForm();
  let [imageAvatar, setImageAvatar] = useState(null);
  let [modalInfo, setModalInfo] = useState(null);
  let [openOrCloseTheModalFeedback, setOpenOrCloseTheModalFeedback] = useState(false);

  /** request para no mostrar el error que genera el component upload de antd */
  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess('ok');
    }, 0);
  };

  function resetFields() {
    form.resetFields();
    setImageAvatar(null);
  }

  const onFinishCreateNewUser = async (values) => {
    const loading = message.open({
      key: 'loading',
      type: 'loading',
      content: <> Por favor espere...</>,
    });
    const newValues = {
      ...values,
      picture: imageAvatar,
      resetFields,
      setModalInfo,
      setOpenOrCloseTheModalFeedback,
    };
    let resp = await createNewUser(newValues);
    if (resp) {
      // SI SE REGISTRÓ CORRECTAMENTE LO LOGUEAMOS
      app
        .auth()
        .signInWithEmailAndPassword(newValues.email, newValues.password)
        .then((login) => {
          if (login) {
            //PERMITE VALIDAR EN QUE SECCIÓN DE EVIUS SE ENCUENTRA Y ASÍ RENDERIZAR EL MODAL CORRESPONDIENTE
            if (window.location.toString().includes('landing') || window.location.toString().includes('event')) {
              handleChangeTypeModal('loginSuccessNotRegister');
            } else {
              handleChangeTypeModal('loginSuccess');
            }
          }
        })
        .catch((err) => {
          handleChangeTypeModal('loginError');
        });
    } else {
      handleChangeTypeModal('loginError');
    }
    message.destroy(loading.key);
  };
  return (
    <>
      {' '}
      <Form
        onFinish={onFinishCreateNewUser}
        form={form}
        autoComplete='off'
        layout='vertical'
        style={screens.xs ? stylePaddingMobile : stylePaddingDesktop}>
        {/* <Typography.Title level={4} type='secondary'>
                      Nueva organizacion
                    </Typography.Title> */}
        <Form.Item>
          <ImgCrop rotate shape='round'>
            <Upload
              accept='image/png,image/jpeg'
              onChange={(file) => {
                if (file.fileList.length > 0) {
                  setImageAvatar(file.fileList);
                } else {
                  setImageAvatar(null);
                }
              }}
              customRequest={dummyRequest}
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
                    Subir logo
                  </Space>
                </Button>
              }
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
    </>
  );
};

export default RegisterUser;
