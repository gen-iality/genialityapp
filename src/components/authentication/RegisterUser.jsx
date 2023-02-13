import { useEffect, useState } from 'react';
import { PictureOutlined, MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Form, Input, Button, Space, Upload, Alert, Select, Checkbox } from 'antd';
import ImgCrop from 'antd-img-crop';
import createNewUser from './ModalsFunctions/createNewUser';
import { app } from '@helpers/firebase';
import { useHelper } from '@context/helperContext/hooks/useHelper';
import { useIntl } from 'react-intl';
import { DispatchMessageService } from '@context/MessageService';
import { uploadImagedummyRequest } from '@Utilities/imgUtils';
import { OrganizationApi } from '@helpers/request';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import countryOptions from '@components/eventOrganization/listOptions/countryOptions';
import cityOptions from '@components/eventOrganization/listOptions/cityOptions';
import professionalProfilOptions from '@components/eventOrganization/listOptions/professionalProfileOptions';
import mainSpecialistOptions from '@components/eventOrganization/listOptions/mainSpecialistOptions';
import otherHealthAreaOptions from '@components/eventOrganization/listOptions/otherHealthAreaOptions';

const RegisterUser = ({ screens, stylePaddingMobile, stylePaddingDesktop, idOrganization, defaultPositionId }) => {
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
  const [proProfile, setProProfile] = useState();
  const [isThisColombia, setIsThisColombia] = useState(true);
  const [imageAvatar, setImageAvatar] = useState(null);
  const [modalInfo, setModalInfo] = useState(null);
  const [openOrCloseTheModalFeedback, setOpenOrCloseTheModalFeedback] = useState(false);

  const [specialistOptions, setSpecialistOptions] = useState([]);
  const [labelABC, setLabelABC] = useState('Especialidad');

  useEffect(() => {
    if (['specialist_doctor', 'resident'].includes(proProfile)) {
      setSpecialistOptions(mainSpecialistOptions);
      setLabelABC('Especialidad')
    } else if (['professional_from_another_health_area'].includes(proProfile)) {
      setSpecialistOptions(otherHealthAreaOptions);
      setLabelABC('Área')
    } else {
      setSpecialistOptions([]);
    }
  }, [proProfile]);

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

              if (idOrganization) {
                console.log('RegisterUser: has idOrganization', { idOrganization });

                await OrganizationApi.saveUser(idOrganization, data);

                let userId = response._id;

                if (defaultPositionId) {
                  console.log('RegisterUser: has default position Id', { defaultPositionId });
                  await PositionsApi.Organizations.addUser(idOrganization, defaultPositionId, userId);
                } else {
                  console.warn('RegisterUser: missing default position ID, not problem');
                }
              } else {
                console.log('RegisterUser: missing organization ID, not problem');
              }

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
          // label={intl.formatMessage({
          //   id: 'modal.label.password',
          //   defaultMessage: 'Contraseña',
          // })}
          label={'Documento Identidad'}
          name='password'
          hasFeedback
          style={{ marginBottom: '10px', textAlign: 'left' }}
          rules={rulePassword}
        >
          <Input
            type='text'
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
          <Form.Item
            label='Numero de contacto'
            name='number_cel'
            rules={[{ required: true, message: 'Falta el numero de contacto' }]}
          >
            <PhoneInput
              placeholder='Número'
              defaultCountry='CO'
              // value={null}
              // onChange={() => {
              //   return false;
              // }}
            />
          </Form.Item>

          <Form.Item
            label='País'
            name='country'
            rules={[{ required: true, message: 'Falta el país' }]}
            initialValue='Colombia'
          >
            <Select options={countryOptions} onChange={(value) => setIsThisColombia(value === 'Colombia')} />
          </Form.Item>

          <Form.Item
            label='Ciudad'
            name='city'
            rules={[{ required: true, message: 'Falta la ciudad' }]}
            initialValue={isThisColombia ? 'Bogotá' : ''}
          >
            {isThisColombia ? (
              <Select options={cityOptions} />
            ) : (
              <Input />
            )}
          </Form.Item>

          <Form.Item
            label='Perfil profesional'
            name='professional_profile'
            rules={[{ required: true, message: 'Falta el perfil pofesional' }]}
          >
            <Select
              options={professionalProfilOptions}
              onChange={(value) => {
                setProProfile(value);
              }}
            />
          </Form.Item>

          {specialistOptions.length > 0 && (
            <Form.Item
              label={labelABC}
              name='speciality'
              rules={[{ required: true, message: 'Falta la especialidad' }]}
            >
              <Select options={specialistOptions} />
            </Form.Item>
          )}

          {/* <Form.Item
            label='Cédula'
            name='identification_card'
            rules={[
              { required: true, message: 'Falta el número de identificación' },
              { pattern: /\d+/g, message: 'Sólo números' },
            ]}
          >
            <Input />
          </Form.Item> */}

          <Form.Item
            name='t&c'
            rules={[
              {
                required: true,
                message: 'Acepta los términos y condiciones',
                validator: (_, value) => {
                  if (!value) return Promise.reject()
                  return Promise.resolve()
                },
              },
            ]}
            valuePropName='checked'
          >
            <Checkbox>
              He leído y acepto los{' '}
              <a
                href='https://firebasestorage.googleapis.com/v0/b/geniality-sas.appspot.com/o/public%2FACE_Politica_Tratamiento_Datos.pdf?alt=media&token=fba112af-ed54-405b-9695-25a2827afd2b'
                target='_blank'
              >
                términos y condiciones
              </a>
              . Acepto y manifiesto bajo la gravedad de juramento.
            </Checkbox>
          </Form.Item>

          <Form.Item
            name='iampro'
            rules={[
              {
                required: true,
                message: 'Es importante que esto sea evidenciado',
                validator: (_, value) => {
                  if (!value) return Promise.reject()
                  return Promise.resolve()
                },
              },
            ]}
            valuePropName='checked'
          >
            <Checkbox>
              Que soy profesional del la salud y por lo tanto beneficiario directo de la información digital que se me
              ofrecerá. Manifiesto que la presente autorización me fue solicitada y puesta de presente antes de entregar
              mis datos y que la suscribo de forma libre y voluntaria ya que este evento es exclusivo para profesionales
              de la salud.
            </Checkbox>
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
