import { useState } from 'react';
import { PictureOutlined, MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Form, Input, Button, Space, Upload, Alert, Select } from 'antd';
import ImgCrop from 'antd-img-crop';
import createNewUser from './ModalsFunctions/createNewUser';
import { app } from '@helpers/firebase';
import { useHelper } from '@context/helperContext/hooks/useHelper';
import { useIntl } from 'react-intl';
import { DispatchMessageService } from '@context/MessageService';
import { uploadImagedummyRequest } from '@Utilities/imgUtils';
import { OrganizationApi } from '@helpers/request';

const RegisterUser = ({ screens, stylePaddingMobile, stylePaddingDesktop }) => {
  const intl = useIntl();
  const { handleChangeTypeModal } = useHelper();
  const [errorEmail, setErrorEmail] = useState(false);
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
  const [modalInfo, setModalInfo] = useState(null);
  const [openOrCloseTheModalFeedback, setOpenOrCloseTheModalFeedback] = useState(false);

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
      resetFields,
      setModalInfo,
      setOpenOrCloseTheModalFeedback,
    };

    try {
      const response = await createNewUser(newValues);
      console.log('response', response);
      if (response._id) {
        // SI SE REGISTRÓ CORRECTAMENTE LO LOGUEAMOS

        app
          .auth()
          .signInWithEmailAndPassword(newValues.email, newValues.password)
          .then(async (login) => {
            //registrarlo en la organización
            if (login) {
              let data = {
                properties: {
                  names: newValues.names || newValues.name,
                  email: newValues.email,
                },
              };
              let organization_quemada = '62a915954e1452197604901b';
              await OrganizationApi.saveUser(organization_quemada, data);

              let cargo_quemado = '63b63f0c7fd60e3c84646d12';
              let id_usuario_quemado = response._id;
              await PositionsApi.Organizations.addUser(organization_quemada, cargo_quemado, id_usuario_quemado);

              //PERMITE VALIDAR EN QUE SECCIÓN DE EVIUS SE ENCUENTRA Y ASÍ RENDERIZAR EL MODAL CORRESPONDIENTE
              if (window.location.toString().includes('landing') || window.location.toString().includes('event')) {
                handleChangeTypeModal('loginSuccess');
              } else {
                handleChangeTypeModal('loginSuccess');
              }
            }
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
        style={screens.xs ? stylePaddingMobile : stylePaddingDesktop}
      >
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
              fileList={imageAvatar}
            >
              {
                <Button
                  type='primary'
                  shape='circle'
                  style={{
                    height: !imageAvatar ? '150px' : '95px',
                    width: !imageAvatar ? '150px' : '95px',
                  }}
                >
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
          rules={ruleEmail}
        >
          <Input
            type='email'
            size='large'
            placeholder={'micorreo@ejemplo.com'}
            prefix={<MailOutlined style={{ fontSize: '24px', color: '#c4c4c4' }} />}
          />
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({
            id: 'modal.label.password',
            defaultMessage: 'Contraseña',
          })}
          name='password'
          hasFeedback
          style={{ marginBottom: '10px', textAlign: 'left' }}
          rules={rulePassword}
        >
          <Input.Password
            type='password'
            size='large'
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
          name='names'
          hasFeedback
          style={{ marginBottom: '10px', textAlign: 'left' }}
          rules={ruleName}
        >
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

        {/*Inicio cambios rápidos */}
        <div>
          <Form.Item label='Indicativo' name='indicative' rules={[{ required: true, message: 'Falta el indicativo' }]}>
            <Input />
          </Form.Item>

          <Form.Item
            label='Numero de contacto'
            name='number_cel'
            rules={[{ required: true, message: 'Falta el numero de contacto' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label='País' name='country' rules={[{ required: true, message: 'Falta el país' }]}>
            <Input />
          </Form.Item>

          <Form.Item label='Ciudad' name='city' rules={[{ required: true, message: 'Falta la ciudad' }]}>
            <Input />
          </Form.Item>

          <Form.Item
            label='Perfil profesional'
            name='professional_profile'
            rules={[{ required: true, message: 'Falta el perfil pofesional' }]}
          >
            <Select
              options={[
                {
                  value: 'specialist_doctor',
                  label: 'Médico especialista',
                },
                {
                  value: 'resident',
                  label: 'Residente',
                },
                {
                  value: 'general_doctor',
                  label: 'Médico general',
                },
                { value: 'professional_from_another_health_area', label: 'Profesional de otra área de a salud' },
                { value: 'medical_student', label: 'Estudiante de medicina' },
                { value: 'comercial_sample', label: 'Muestra comercial' },
                { value: 'others', label: 'Otros' },
              ]}
            ></Select>
          </Form.Item>

          <Form.Item
            label='Especialidad'
            name='speciality'
            rules={[{ required: true, message: 'Falta la especialidad' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label='Cédula'
            name='email'
            rules={[
              { required: true, message: 'Falta el numero de identificación' },
              // { type: 'number', message: 'Solo númerico' },
            ]}
          >
            <Input />
          </Form.Item>
        </div>
        {/* finalización campos rapidos */}

        <Form.Item style={{ marginBottom: '10px', marginTop: '30px' }}>
          <Button
            id={'submitButton'}
            htmlType='submit'
            block
            style={{ backgroundColor: '#52C41A', color: '#FFFFFF' }}
            size='large'
          >
            {intl.formatMessage({
              id: 'modal.label.create_user',
              defaultMessage: 'Crear cuenta de usuario',
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

export default RegisterUser;
