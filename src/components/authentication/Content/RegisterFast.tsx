import { useState, useEffect, FunctionComponent } from 'react'
import {
  PictureOutlined,
  MailOutlined,
  LockOutlined,
  UserOutlined,
  IdcardOutlined,
  CameraOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import { Form, Input, Button, Space, Upload, Avatar } from 'antd'
import ImgCrop from 'antd-img-crop'
import { useIntl } from 'react-intl'
import { useEventWithCedula } from '@helpers/helperEvent'
import { useEventContext } from '@context/eventContext'
import { uploadImagedummyRequest } from '@Utilities/imgUtils'
import Camera from 'react-html5-camera-photo'
import 'react-html5-camera-photo/build/css/index.css'
import './RegisterFast.css'
import { useParams } from 'react-router-dom'
import { OrganizationFuction } from '@helpers/request'

function getBase64(img: any, callback: (data: any) => void) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

// TODO: rename to SignUpFastForm

interface IRegisterFastProps {
  /** @deprecated use userData instead */
  basicDataUser?: any
  userData?: any
  formDataHandler?: (e: any, fieldName: string, picture?: any) => void
}

const RegisterFast: FunctionComponent<IRegisterFastProps> = (props) => {
  const {
    basicDataUser: _basicDataUser,
    userData: _userData,
    formDataHandler = () => {},
  } = props

  const basicDataUser = _basicDataUser ?? _userData

  const [takingPhoto, setTakingPhoto] = useState(false)
  const [imageAvatar, setImageAvatar] = useState<any>(null)
  const [organization, setOrganization] = useState<any>(null)

  const params = useParams()
  const orgId = params.id

  const [form] = Form.useForm()
  const intl = useIntl()
  const cEvent = useEventContext()

  /*Cargando la información de la organización esto debería estar en un contexto*/
  useEffect(() => {
    if (!orgId) return null
    let _organization = null
    let asyncfunc = async () => {
      _organization = await OrganizationFuction.obtenerDatosOrganizacion(orgId)
      setOrganization(_organization)
    }
    asyncfunc()
  }, [orgId])

  /* Toca hacerlo, porque por alguna razón cuando se actualiza basicDataUser.picture  no se renderiza el componente 
   y no se ve la imagen en el preview
  */
  useEffect(() => {
    if (
      basicDataUser.picture &&
      basicDataUser.picture[0] &&
      basicDataUser.picture[0].originFileObj
    ) {
      getBase64(basicDataUser.picture[0].originFileObj, (imageUrl) =>
        setImageAvatar(imageUrl),
      )
    } else if (
      basicDataUser.picture &&
      basicDataUser.picture[0] &&
      basicDataUser.picture[0].url
    ) {
      setImageAvatar(basicDataUser.picture[0].url)
    } else {
      setImageAvatar(null)
    }
  }, [basicDataUser.picture])

  const handleTakePhotoAnimationDone = (dataUri: string) => {
    const pic = [
      {
        uid: '1',
        name: 'avatar.png',
        status: 'done',
        url: dataUri,
        thumbUrl: dataUri,
      },
    ]

    formDataHandler(null, 'picture', pic)
    setImageAvatar(dataUri)
    setTakingPhoto(false)
  }

  const ruleEmail: any[] = [
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
  ]

  const rulePassword: any[] = [
    {
      required: true,
      message: intl.formatMessage({
        id: 'register.rule.password.message',
        defaultMessage: 'Ingrese una contraseña para su cuenta en GEN.iality',
      }),
    },
    {
      type: 'string',
      min: 6,
      message: intl.formatMessage({
        id: 'register.rule.password.message2',
        defaultMessage: 'La contraseña debe tener entre 6 a 18 caracteres',
      }),
    },
  ]

  const generalPassphraseRule: any[] = [
    { required: true, message: 'Ingrese una cedula para su cuenta en Evius' },
    {
      type: 'string',
      min: 8,
      message: 'Este valor requiere un mínimo de caracteres',
    },
  ]
  const ruleName = [
    {
      required: true,
      message: intl.formatMessage({
        id: 'register.rule.name.message',
        defaultMessage: 'Ingrese su nombre completo para su cuenta en Evius',
      }),
    },
  ]

  function onFinish(values: any) {
    // handleNext(values); it is undefined
    console.log('nothing to do with:', values)
  }

  return (
    <Form
      initialValues={{
        names: basicDataUser.names,
        email: basicDataUser.email,
        password: basicDataUser.password,
      }}
      form={form}
      autoComplete="on"
      layout="vertical"
      onFinish={onFinish}
    >
      <Form.Item>
        <ImgCrop rotate shape="round">
          <Upload
            fileList={basicDataUser.picture || []}
            accept="image/png,image/jpeg"
            onChange={(info) => {
              if (info.fileList.length > 0) {
                getBase64(info.file.originFileObj, (imageUrl) => setImageAvatar(imageUrl))
                formDataHandler(null, 'picture', info.fileList)
              } else {
                formDataHandler(null, 'picture', null)
                setImageAvatar(null)
              }
            }}
            onRemove={() => {
              formDataHandler(null, 'picture', null)
            }}
            customRequest={uploadImagedummyRequest}
            multiple={false}
            listType="picture"
            maxCount={1}
          >
            {!takingPhoto && (
              <Space direction="vertical">
                <Button
                  type="primary"
                  shape="circle"
                  style={{
                    height: !imageAvatar ? '120px' : '95px',
                    width: !imageAvatar ? '120px' : '95px',
                    padding: '0px',
                    border: '0px',
                  }}
                >
                  {!imageAvatar && <PictureOutlined style={{ fontSize: '50px' }} />}
                  {imageAvatar && <Avatar src={imageAvatar} size={95} />}
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

      {/* En desktop el upload no toma fotos toca hacerlo por separado */}
      <Form.Item>
        {takingPhoto && (
          <div className="avatarCamera">
            <Camera
              onTakePhotoAnimationDone={handleTakePhotoAnimationDone}
              isFullscreen={false}
            />
          </div>
        )}
        <Button
          type="primary"
          icon={takingPhoto ? <DeleteOutlined /> : <CameraOutlined />}
          onClick={() => setTakingPhoto(!takingPhoto)}
        />
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
          onChange={(e) => formDataHandler(e, 'email')}
          type="email"
          size="large"
          placeholder="micorreo@ejemplo.com"
          prefix={<MailOutlined style={{ fontSize: '24px', color: '#c4c4c4' }} />}
        />
      </Form.Item>

      <Form.Item
        label={organization?.access_settings?.custom_password_label || 'Contraseña'}
        name="password"
        hasFeedback
        style={{ marginBottom: '10px', textAlign: 'left' }}
        rules={
          organization?.access_settings?.custom_password_label
            ? generalPassphraseRule
            : rulePassword
        }
      >
        {organization?.access_settings?.custom_password_label ? (
          <Input
            onChange={(e) => formDataHandler(e, 'password')}
            type="number"
            size="large"
            placeholder="Cedula ó numero de identificación"
            prefix={<IdcardOutlined style={{ fontSize: '24px', color: '#c4c4c4' }} />}
          />
        ) : (
          <Input.Password
            onChange={(e) => formDataHandler(e, 'password')}
            type="password"
            size="large"
            placeholder={intl.formatMessage({
              id: 'modal.label.password',
              defaultMessage: 'Contraseña',
            })}
            prefix={<LockOutlined style={{ fontSize: '24px', color: '#c4c4c4' }} />}
          />
        )}
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
          onChange={(e) => formDataHandler(e, 'names')}
          type="text"
          size="large"
          placeholder={intl.formatMessage({
            id: 'modal.label.name',
            defaultMessage: 'Nombre',
          })}
          prefix={<UserOutlined style={{ fontSize: '24px', color: '#c4c4c4' }} />}
        />
      </Form.Item>
    </Form>
  )
}

export default RegisterFast
