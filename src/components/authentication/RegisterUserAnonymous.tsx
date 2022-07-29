import { useState } from 'react';
import { PictureOutlined, MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Form, Input, Button, Space, Upload, Alert } from 'antd';
import ImgCrop from 'antd-img-crop';
import createNewUser from './ModalsFunctions/createNewUser';
import { app } from '../../helpers/firebase';
import { useHelper } from '../../context/helperContext/hooks/useHelper';
import { useIntl } from 'react-intl';
import { DispatchMessageService } from '@/context/MessageService';
import { uploadImagedummyRequest } from '@/Utilities/imgUtils';
import { UseEventContext } from '@/context/eventContext';
import { UseUserEvent } from '@/context/eventUserContext';
import { AttendeeApi } from '@/helpers/request';

const RegisterUserAnonymous = ({ screens, stylePaddingMobile, stylePaddingDesktop }: any) => {
  const intl = useIntl();
  const { handleChangeTypeModal } = useHelper();
  let cEvent = UseEventContext();
  let cEventUser = UseUserEvent();

  const [errorEmail, setErrorEmail] = useState(false);

  const [form] = Form.useForm();
  let [imageAvatar, setImageAvatar] = useState<any>(null);
  let [modalInfo, setModalInfo] = useState(null);
  let [openOrCloseTheModalFeedback, setOpenOrCloseTheModalFeedback] = useState(false);

  function resetFields() {
    form.resetFields();
    setImageAvatar(null);
  }

  const onFinishCreateNewUser = async (values: any) => {
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: ' Por favor espere...',
      action: 'show',
    });
    const newValues = {
      ...values,
      picture: imageAvatar,
      resetFields,
      setModalInfo,
      setOpenOrCloseTheModalFeedback,
    };

    try {
      let resp = await createNewUser(newValues);
      if (resp == 1) {
        // SI SE REGISTRÓ CORRECTAMENTE LO LOGUEAMOS
        app
          .auth()
          .signInAnonymously()
          .then((user) => {
            app
              .auth()
              .currentUser?.updateProfile({
                displayName: newValues.names,
                /**almacenamos el email en el photoURL para poder setearlo en el context del usuario y asi llamar el eventUser anonimo */
                photoURL: newValues.email,
              })
              .then(async () => {
                const body = {
                  event_id: cEvent.value._id,
                  uid: user.user?.uid,
                  anonymous: true,
                  properties: {
                    email: newValues.email,
                    names: newValues.names,
                  },
                };
                await app.auth().currentUser?.reload();
                await AttendeeApi.create(cEvent.value._id, body);
                cEventUser.setUpdateUser(true);
              });
          })
          .catch((err) => {
            handleChangeTypeModal('loginError');
          });
        DispatchMessageService({
          key: 'loading',
          action: 'destroy',
        });
        DispatchMessageService({
          type: 'success',
          msj: 'Información guardada correctamente!',
          action: 'show',
        });
      } else if (resp == 0) {
        handleChangeTypeModal('loginError');
        setErrorEmail(false);
        DispatchMessageService({
          key: 'loading',
          action: 'destroy',
        });
        DispatchMessageService({
          type: 'error',
          msj: 'Ha ocurrido un error inesperado',
          action: 'show',
        });
      } else {
        setErrorEmail(true);
        DispatchMessageService({
          key: 'loading',
          action: 'destroy',
        });
        DispatchMessageService({
          type: 'error',
          msj: 'Ha ocurrido un error inesperado',
          action: 'show',
        });
      }
    } catch (err) {
      DispatchMessageService({
        key: 'loading',
        action: 'destroy',
      });
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
              customRequest={uploadImagedummyRequest}
              multiple={false}
              listType='picture'
              maxCount={1}
              fileList={imageAvatar}>
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
          rules={[
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
          ]}>
          <Input
            type='email'
            size='large'
            placeholder={'micorreo@ejemplo.com'}
            prefix={<MailOutlined style={{ fontSize: '24px', color: '#c4c4c4' }} />}
          />
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({
            id: 'modal.label.name',
            defaultMessage: 'Nombre',
          })}
          name='names'
          hasFeedback
          style={{ marginBottom: '10px', textAlign: 'left' }}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'register.rule.name.message',
                defaultMessage: 'Ingrese su nombre completo para su cuenta en Evius',
              }),
            },
          ]}>
          <Input
            type='text'
            size='large'
            placeholder={intl.formatMessage({
              id: 'modal.label.name',
              defaultMessage: 'Nombre',
            })}
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
            {intl.formatMessage({
              id: 'modal.label.create_user_anonymous',
              defaultMessage: 'Ingresar',
            })}
          </Button>
        </Form.Item>
        {errorEmail && (
          <Alert
            showIcon
            onClose={() => setErrorEmail(false)}
            closable
            className='animate__animated animate__bounceIn'
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
            type='error'
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

export default RegisterUserAnonymous;
