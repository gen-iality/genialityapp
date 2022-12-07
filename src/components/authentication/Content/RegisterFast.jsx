import { useState, useEffect } from 'react';
import {
  PictureOutlined,
  MailOutlined,
  LockOutlined,
  UserOutlined,
  IdcardOutlined,
  CameraOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { Form, Input, Button, Space, Upload, Avatar, Image } from 'antd';
import ImgCrop from 'antd-img-crop';
import { useIntl } from 'react-intl';
import { useEventWithCedula } from '../../../helpers/helperEvent';
import { UseEventContext } from '../../../context/eventContext';
import { uploadImagedummyRequest } from '@/Utilities/imgUtils';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import './RegisterFast.css';

//import styles from './ReigsterFast.less';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

const RegisterFast = ({ basicDataUser, HandleHookForm }) => {
  const intl = useIntl();
  const cEvent = UseEventContext();
  const [takingPhoto, setTakingPhoto] = useState(false);
  const [imageAvatar, setImageAvatar] = useState(null);
  const [form] = Form.useForm();

  /* Toca hacerlo, porque por alguna razón cuando se actualiza basicDataUser.picture  no se renderiza el componente 
   y no se ve la imagen en el preview
  */
  useEffect(() => {
    if (basicDataUser.picture && basicDataUser.picture[0] && basicDataUser.picture[0].originFileObj) {
      getBase64(basicDataUser.picture[0].originFileObj, (imageUrl) => setImageAvatar(imageUrl));
    } else if (basicDataUser.picture && basicDataUser.picture[0] && basicDataUser.picture[0].url) {
      setImageAvatar(basicDataUser.picture[0].url);
    } else {
      setImageAvatar(null);
    }
  }, [basicDataUser.picture]);

  const handleTakePhotoAnimationDone = (dataUri) => {
    let pic = [
      {
        uid: '1',
        name: 'avatar.png',
        status: 'done',
        url: dataUri,
        thumbUrl: dataUri,
      },
    ];
    HandleHookForm(null, 'picture', pic);
    setImageAvatar(dataUri);
    setTakingPhoto(false);
  };

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

  function onFinish(values) {
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
        {/* Condición para no mostrar la foto temporalmente */}
        {false && (
          <>
            <Form.Item>
              <ImgCrop rotate shape='round'>
                <Upload
                  fileList={basicDataUser.picture || []}
                  accept='image/png,image/jpeg'
                  onChange={(info) => {
                    if (info.fileList.length > 0) {
                      getBase64(info.file.originFileObj, (imageUrl) => setImageAvatar(imageUrl));
                      HandleHookForm(null, 'picture', info.fileList);
                    } else {
                      HandleHookForm(null, 'picture', null);
                      setImageAvatar(null);
                    }
                  }}
                  onRemove={() => {
                    HandleHookForm(null, 'picture', null);
                  }}
                  customRequest={uploadImagedummyRequest}
                  multiple={false}
                  listType='picture'
                  maxCount={1}>
                  {!takingPhoto && (
                    <Space direction='vertical'>
                      <Button
                        type='primary'
                        shape='circle'
                        style={{
                          height: !imageAvatar ? '120px' : '95px',
                          width: !imageAvatar ? '120px' : '95px',
                        }}>
                        {!imageAvatar && <PictureOutlined style={{ fontSize: '50px' }} />}
                        {imageAvatar && <Avatar src={imageAvatar} size={90} />}
                      </Button>
                      <>
                        {intl.formatMessage({
                          id: 'modal.label.photo',
                          defaultMessage: 'Subir foto',
                        })}
                      </>
                    </Space>
                  )}
                </Upload>
              </ImgCrop>
            </Form.Item>
            {/* EN desktop el upload no toma fotos toca hacerlo por separado*/}
            <Form.Item>
              {takingPhoto && (
                <div className='avatarCamera'>
                  <Camera onTakePhotoAnimationDone={handleTakePhotoAnimationDone} isFullscreen={false} />
                </div>
              )}
              <Button
                type='primary'
                icon={takingPhoto ? <DeleteOutlined /> : <CameraOutlined />}
                onClick={() => {
                  //setImageAvatar(null);
                  setTakingPhoto(!takingPhoto);
                }}
              />
            </Form.Item>
          </>
        )}
        {/* FINAL Condición para no mostrar la foto temporalmente */}

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
        {useEventWithCedula(cEvent.value).isArkmed ? (
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
              // placeholder={'Cedula del medico ó especialista'}
              placeholder={'Cedula ó numero de identificación'}
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
