import { useState } from 'react';
import { PictureOutlined, MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Form, Input, Button, Space, Upload, Alert } from 'antd';
import ImgCrop from 'antd-img-crop';
import createNewUser, { CREATE_NEW_USER_FAIL, CREATE_NEW_USER_FAIL_BECAUSE_EMAIL, CREATE_NEW_USER_SUCCESS } from './ModalsFunctions/createNewUser';
import { app } from '@helpers/firebase';
import { useHelper } from '@context/helperContext/hooks/useHelper';
import { useIntl } from 'react-intl';
import { DispatchMessageService } from '@context/MessageService';
import { uploadImagedummyRequest } from '@Utilities/imgUtils';

const RegisterUser = ({ screens, stylePaddingMobile, stylePaddingDesktop }) => {
  const intl = useIntl();
  const { handleChangeTypeModal } = useHelper();
  const [isErrorBecauseEmail, setIsErrorBecauseEmail] = useState(false);
  // const [registrationErrorMessage, setRegistrationErrorMessage] = useState('');

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
  const [imageAvatar, setImageAvatar] = useState(null);

  function resetFields() {
    form.resetFields();
    setImageAvatar(null);
  }

  const onFinishCreateNewUser = async (values) => {
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: ' Por favor espere...',
      action: 'show',
    });
    const newValues = {
      ...values,
      picture: imageAvatar,
    };

    try {
      const {
        // user: userData,
        message: resultMessage,
        status: creatingStatus,
      } = await createNewUser(newValues, resetFields);

      if (creatingStatus === CREATE_NEW_USER_SUCCESS) {
        // If the registration was successful, then login it
        app
          .auth()
          .signInWithEmailAndPassword(newValues.email, newValues.password)
          .then((login) => {
            if (login) {
              // Let us to check in what GEN.iality section we are to render the right modal component
              if (window.location.toString().includes('landing') || window.location.toString().includes('event')) {
                handleChangeTypeModal('loginSuccess');
              } else {
                handleChangeTypeModal('loginSuccess');
              }
            }
          })
          .catch((err) => {
            console.error(err);
            handleChangeTypeModal('loginError');
          });
        DispatchMessageService({ key: 'loading', action: 'destroy' });
        DispatchMessageService({
          type: 'success',
          msj: 'Información guardada correctamente!',
          action: 'show',
        });
      } else {
        if (creatingStatus === CREATE_NEW_USER_FAIL_BECAUSE_EMAIL) {
          setIsErrorBecauseEmail(true);
        } else if (creatingStatus === CREATE_NEW_USER_FAIL) {
          setIsErrorBecauseEmail(false);
          handleChangeTypeModal('loginError');
        }

        DispatchMessageService({ key: 'loading', action: 'destroy' });
        DispatchMessageService({
          type: 'error',
          msj: 'Ha ocurrido un error inesperado',
          action: 'show',
        });
      }
    } catch (err) {
      console.error(err)
      DispatchMessageService({ key: 'loading', action: 'destroy' });
      DispatchMessageService({
        type: 'error',
        msj: 'Ha ocurrido un error inesperado',
        action: 'show',
      });
    }
  };
  return (
    <>
      {' '}
      <Form
        onFinish={onFinishCreateNewUser}
        form={form}
        autoComplete="off"
        layout="vertical"
        style={screens.xs ? stylePaddingMobile : stylePaddingDesktop}
      >
        <Form.Item>
          <ImgCrop rotate shape="round">
            <Upload
              accept="image/png,image/jpeg"
              onChange={(file) => {
                if (file.fileList.length > 0) {
                  setImageAvatar(file.fileList);
                } else {
                  setImageAvatar(null);
                }
              }}
              customRequest={uploadImagedummyRequest}
              multiple={false}
              listType="picture"
              maxCount={1}
              fileList={imageAvatar}
            >
              {
                <Button
                  type="primary"
                  shape="circle"
                  style={{
                    height: !imageAvatar ? '150px' : '95px',
                    width: !imageAvatar ? '150px' : '95px',
                  }}
                >
                  <Space direction="vertical">
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
          name="email"
          hasFeedback
          style={{ marginBottom: '10px', textAlign: 'left' }}
          rules={ruleEmail}
        >
          <Input
            type="email"
            size="large"
            placeholder="micorreo@ejemplo.com"
            prefix={<MailOutlined style={{ fontSize: '24px', color: '#c4c4c4' }} />}
          />
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({
            id: 'modal.label.password',
            defaultMessage: 'Contraseña',
          })}
          name="password"
          hasFeedback
          style={{ marginBottom: '10px', textAlign: 'left' }}
          rules={rulePassword}
        >
          <Input.Password
            type="password"
            size="large"
            placeholder={intl.formatMessage({
              id: 'modal.label.password',
              defaultMessage: 'Contraseña',
            })}
            prefix={<LockOutlined style={{ fontSize: '24px', color: '#c4c4c4' }} />}
          />
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({
            id: 'modal.label.name',
            defaultMessage: 'Nombre',
          })}
          name="names"
          hasFeedback
          style={{ marginBottom: '10px', textAlign: 'left' }}
          rules={ruleName}
        >
          <Input
            type="text"
            size="large"
            placeholder={intl.formatMessage({
              id: 'modal.label.name',
              defaultMessage: 'Nombre',
            })}
            prefix={<UserOutlined style={{ fontSize: '24px', color: '#c4c4c4' }} />}
          />
        </Form.Item>
        <Form.Item style={{ marginBottom: '10px', marginTop: '30px' }}>
          <Button
            id="submitButton"
            htmlType="submit"
            block
            style={{ backgroundColor: '#52C41A', color: '#FFFFFF' }}
            size="large"
          >
            {intl.formatMessage({
              id: 'modal.label.create_user',
              defaultMessage: 'Crear cuenta de usuario',
            })}
          </Button>
        </Form.Item>
        {isErrorBecauseEmail && (
          <Alert
            showIcon
            closable
            onClose={() => setIsErrorBecauseEmail(false)}
            className="animate__animated animate__bounceIn"
            style={{
              boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
              backgroundColor: '#FFFFFF',
              color: '#000000',
              borderLeft: '5px solid #FF4E50',
              fontSize: '14px',
              textAlign: 'start',
              borderRadius: '5px',
              marginBottom: '15px',
            }}
            type="error"
            message={intl.formatMessage({
              id: 'modal.feedback.errorDNSNotFound',
              defaultMessage: 'El correo ingresado no es válido.',
            })}
          />
        )}
      </Form>
    </>
  );
};

export default RegisterUser;
