import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  IdcardOutlined,
  LoadingOutlined,
  LockOutlined,
  MailOutlined,
} from '@ant-design/icons'
import {
  Modal,
  Tabs,
  Form,
  Input,
  Button,
  Divider,
  Typography,
  Space,
  Grid,
  Alert,
  Image,
  Spin,
} from 'antd'
import { Link, useParams } from 'react-router-dom'
import withContext from '@context/withContext'
import { useHelper } from '@context/helperContext/hooks/useHelper'
import { app } from '@helpers/firebase'
import { useIntl } from 'react-intl'
import { useEffect, useMemo, useState } from 'react'
import RegisterUser from './RegisterUser'
import { useEventContext } from '@context/eventContext'

import RegisterUserAndEventUser from './RegisterUserAndEventUser'
import { isEvent, isHome, useEventWithCedula } from '@helpers/helperEvent'
import { useCurrentUser } from '@context/userContext'
import { recordTypeForThisEvent } from '../events/Landing/helpers/thisRouteCanBeDisplayed'
import RegisterUserAndOrgMember from './RegisterUserAndOrgMember'
import { isOrganization } from '@helpers/helperOrg'
import { OrganizationFuction } from '@helpers/request'
import { stylePaddingDesktop, stylePaddingMobile } from './constants'

const { TabPane } = Tabs
const { useBreakpoint } = Grid

const ModalAuth = (props) => {
  const screens = useBreakpoint()
  const [isLoading, setIsLoading] = useState(false)
  const [errorLogin, setErrorLogin] = useState(false)
  const [errorRegisterUSer, setErrorRegisterUSer] = useState(false)
  const [organization, setOrganization] = useState(null)

  const [form1] = Form.useForm()
  const {
    handleChangeTypeModal,
    typeModal,
    controllerLoginVisible,
    helperDispatch,
    currentAuthScreen,
  } = useHelper()

  const cEvent = useEventContext()
  const cUser = useCurrentUser()
  const [modalVisible, setModalVisible] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const intl = useIntl()

  const params = useParams()
  const orgId = params.id

  const isVisibleRegister = () => {
    const typeEvent = recordTypeForThisEvent(cEvent)
    switch (typeEvent) {
      case 'PRIVATE_EVENT':
        return false
      case 'PUBLIC_EVENT_WITH_REGISTRATION_ANONYMOUS':
        return !!props.isPrivateRoute
      case 'PUBLIC_EVENT_WITH_REGISTRATION':
        return true
      default:
        return true
    }
  }

  const isModalVisible = () => {
    const typeEvent = recordTypeForThisEvent(cEvent)
    switch (typeEvent) {
      case 'PRIVATE_EVENT':
        setModalVisible(true)
        helperDispatch({ type: 'showLogin', visible: true })
        break

      case 'PUBLIC_EVENT_WITH_REGISTRATION':
        setModalVisible(true)
        helperDispatch({ type: 'showRegister', visible: true })
        break

      case 'UN_REGISTERED_PUBLIC_EVENT':
        setModalVisible(true)
        helperDispatch({ type: 'showLogin', visible: false })
        break

      default:
        setModalVisible(true)
        break
    }
  }

  const isUserAuth = () => {
    return app.auth().onAuthStateChanged((user) => {
      if (user) {
        setModalVisible(false)

        helperDispatch({ type: 'showLogin', visible: false })
      } else {
        if (cEvent.value?.organiser?._id) {
          console.log('Vaaaaamonos')
          window.location.href = `/organization/${cEvent.value.organiser._id}/events`
        }
        console.debug(window.location.href, cEvent.value)
        isModalVisible()
      }
    })
  }

  /*Cargando la información de la organización esto debería estar en un contexto*/
  useEffect(() => {
    if (!orgId) return
    let _organization = null
    let asyncfunc = async () => {
      _organization = await OrganizationFuction.obtenerDatosOrganizacion(orgId)
      setOrganization(_organization)
    }
    asyncfunc()
  }, [orgId])

  useEffect(() => {
    let unsubscribe = isUserAuth()

    return () => {
      unsubscribe && unsubscribe()
    }
  }, [cEvent, cUser])

  useEffect(() => {
    form1.resetFields()
    setErrorRegisterUSer(false)
    setErrorLogin(false)
  }, [typeModal, currentAuthScreen])

  const DetecError = (code) => {
    switch (code) {
      case 'auth/wrong-password':
        setErrorMessage(intl.formatMessage({ id: 'auth.error.wrongPassword' }))
        break
      case 'auth/user-not-found':
        setErrorMessage(intl.formatMessage({ id: 'auth.error.userNotFound' }))

        break
      case 'auth/invalid-email':
        setErrorMessage(intl.formatMessage({ id: 'auth.error.invalidEmail' }))
        break

      case 'auth/too-many-requests':
        setErrorMessage(intl.formatMessage({ id: 'auth.error.tooManyRequests' }))
        break
    }
  }

  const callback = (key) => {
    form1.resetFields()
    switch (key) {
      case 'login':
        helperDispatch({
          type: 'showLogin',
          visible: true,
          organizationId: controllerLoginVisible?.organizationId,
        })
        break

      case 'register':
        helperDispatch({
          type: 'showRegister',
          visible: true,
          organizationId: controllerLoginVisible?.organizationId,
        })
        break

      default:
        return key
    }
  }

  //Método ejecutado en el curso onSubmit (onFinish) del formulario de login
  const handleLoginEmailPassword = async (values) => {
    setIsLoading(true)
    loginFirebase(values)
  }

  //Realiza la validación del email y password con firebase
  const loginFirebase = async (data) => {
    app
      .auth()
      .signInWithEmailAndPassword(data.email, data.password)
      .then(async (response) => {
        if (response.user) {
          setIsLoading(false)
          helperDispatch({ type: 'showLogin', visible: false })
          form1.resetFields()
        }
      })
      .catch((error) => {
        console.log('error', error)
        DetecError(error.code)
        setErrorLogin(true)
        setIsLoading(false)
      })
  }

  //Se ejecuta en caso que haya un error en el formulario de login en el curso onSubmit
  const onFinishFailed = (errorInfo) => {
    console.error('Failed:', errorInfo)
  }

  const tabItems = [
    {
      key: 'login',
      label: intl.formatMessage({
        id: 'modal.title.login',
        defaultMessage: 'Iniciar sesión',
      }),
      children: (
        <>
          <Form
            form={form1}
            onFinish={handleLoginEmailPassword}
            onFinishFailed={onFinishFailed}
            layout="vertical"
            style={screens.xs ? stylePaddingMobile : stylePaddingDesktop}
          >
            {props.organization == 'organization' && (
              <Form.Item>
                <Image
                  style={{ borderRadius: '100px', objectFit: 'cover' }}
                  preview={{ maskClassName: 'circularMask' }}
                  src={props.logo ? props.logo : 'error'}
                  fallback="http://via.placeholder.com/500/F5F5F7/CCCCCC?text=No%20Image"
                  width={200}
                  height={200}
                />
              </Form.Item>
            )}
            <Form.Item
              label={intl.formatMessage({
                id: 'modal.label.email',
                defaultMessage: 'Correo electrónico',
              })}
              name="email"
              style={{ marginBottom: '15px', textAlign: 'left' }}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({
                    id: 'modal.rule.required.email',
                    defaultMessage: 'Ingrese un correo',
                  }),
                },
              ]}
            >
              <Input
                disabled={isLoading}
                type="email"
                size="large"
                placeholder={intl.formatMessage({
                  id: 'modal.label.email',
                  defaultMessage: 'Correo electrónico',
                })}
                prefix={<MailOutlined style={{ fontSize: '24px', color: '#c4c4c4' }} />}
              />
            </Form.Item>

            <Form.Item
              label={
                organization?.access_settings?.custom_password_label
                  ? organization?.access_settings?.custom_password_label
                  : intl.formatMessage({
                      id: 'modal.label.password',
                      defaultMessage: 'Contraseña',
                    })
              }
              name="password"
              style={{ marginBottom: '15px', textAlign: 'left' }}
              rules={[
                {
                  required: true,
                  message: organization?.access_settings?.custom_password_label
                    ? `Se requiere ${organization?.access_settings?.custom_password_label}`
                    : intl.formatMessage({
                        id: 'modal.rule.required.password',
                        defaultMessage: 'Ingrese una contraseña',
                      }),
                },
              ]}
            >
              {typeof controllerLoginVisible.customPasswordLabel === 'string' ? (
                <Input
                  disabled={isLoading}
                  size="large"
                  placeholder={
                    organization?.access_settings?.custom_password_label
                      ? organization?.access_settings?.custom_password_label
                      : intl.formatMessage({
                          id: 'modal.label.password',
                          defaultMessage: 'Contraseña',
                        })
                  }
                  prefix={
                    <IdcardOutlined style={{ fontSize: '24px', color: '#c4c4c4' }} />
                  }
                />
              ) : (
                <Input.Password
                  disabled={isLoading}
                  size="large"
                  placeholder={
                    organization?.access_settings?.custom_password_label
                      ? organization?.access_settings?.custom_password_label
                      : intl.formatMessage({
                          id: 'modal.label.password',
                          defaultMessage: 'Contraseña',
                        })
                  }
                  prefix={<LockOutlined style={{ fontSize: '24px', color: '#c4c4c4' }} />}
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              )}
            </Form.Item>

            {!isLoading && (
              <Form.Item style={{ marginBottom: '15px' }}>
                <Typography.Text
                  onClick={() => handleChangeTypeModal('recover')}
                  underline
                  id="forgotpassword"
                  type="secondary"
                  style={{ float: 'right', cursor: 'pointer' }}
                >
                  {intl.formatMessage({
                    id: 'modal.option.restore',
                    defaultMessage: 'Olvidé mi contraseña',
                  })}
                </Typography.Text>
              </Form.Item>
            )}
            {errorLogin && (
              <Alert
                showIcon
                onClose={() => setErrorLogin(false)}
                closable
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
                message={errorMessage}
              />
            )}
            {!isLoading && (
              <Form.Item style={{ marginBottom: '15px' }}>
                <Button
                  id="loginButton"
                  htmlType="submit"
                  block
                  style={{ backgroundColor: '#52C41A', color: '#FFFFFF' }}
                  size="large"
                >
                  {intl.formatMessage({
                    id: 'modal.title.login',
                    defaultMessage: 'Iniciar sesión',
                  })}
                </Button>
              </Form.Item>
            )}
            {isLoading && <LoadingOutlined style={{ fontSize: '50px' }} />}
          </Form>
          {props.organization !== 'landing' && (
            <Divider style={{ color: '#c4c4c4c' }}>O</Divider>
          )}
          {props.organization !== 'landing' && (
            <div style={screens.xs ? stylePaddingMobile : stylePaddingDesktop}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button
                  icon={<MailOutlined />}
                  disabled={isLoading}
                  onClick={() => handleChangeTypeModal('mail')}
                  type="primary"
                  block
                  size="large"
                >
                  {intl.formatMessage({
                    id: 'modal.option.send',
                    defaultMessage: 'Enviar acceso a mi correo',
                  })}
                </Button>
              </Space>
            </div>
          )}
        </>
      ),
    },
  ]

  if (isVisibleRegister) {
    tabItems.push({
      key: 'register',
      label: intl.formatMessage({
        id: 'modal.title.register',
        defaultMessage: 'Registrarme',
      }),
      children: (
        <div
          style={{
            height: 'auto',
            overflowY: 'hidden',
            paddingLeft: '5px',
            paddingRight: '5px',
            paddingTop: '0px',
            paddingBottom: '0px',
          }}
        >
          {isHome() ? (
            <RegisterUser />
          ) : isEvent() ? (
            <RegisterUserAndEventUser />
          ) : isOrganization() ? (
            <RegisterUserAndOrgMember
              organizationId={controllerLoginVisible.organizationId} // New!
              defaultPositionId={controllerLoginVisible.defaultPositionId} // New!
              requireAutomaticLogin={true}
            />
          ) : (
            <Spin />
          )}
        </div>
      ),
    })
  }

  return (
    modalVisible && (
      <Modal
        maskStyle={props.organization == 'organization' && { backgroundColor: '#333333' }}
        onCancel={() => helperDispatch({ type: 'showLogin', visible: false })}
        bodyStyle={{ paddingRight: '10px', paddingLeft: '10px' }}
        centered
        footer={null}
        zIndex={1000}
        open={controllerLoginVisible?.visible}
        closable={controllerLoginVisible?.organization !== 'organization' ? true : false}
      >
        <Tabs
          onChange={callback}
          centered
          size="large"
          activeKey={currentAuthScreen}
          items={tabItems}
        />
      </Modal>
    )
  )
}

export default withContext(ModalAuth)

const fieldsUser = [
  {
    name: 'avatar',
    mandatory: false,
    visibleByContacts: false,
    visibleByAdmin: false,
    label: 'Imagen de perfil',
    description: null,
    type: 'avatar',
    justonebyattendee: false,
    updated_at: '2021-09-22 14:25:33',
    created_at: '2021-09-21 21:56:24',
    _id: {
      $oid: '6160b1a7f6cfdd38d4502e74',
    },
    author: null,
    categories: [],
    event_type: null,
    organiser: null,
    organizer: null,
    currency: {},
    tickets: [],
    index: 2,
    order_weight: 1,
  },
  {
    name: 'names',
    mandatory: true,
    visibleByContacts: false,
    visibleByAdmin: false,
    label: 'Nombre',
    description: null,
    type: 'text',
    options: [],
    justonebyattendee: false,
    updated_at: '2021-09-22 14:25:31',
    created_at: '2021-09-21 22:43:05',
    _id: {
      $oid: '6160b1a7f6cfdd38d4502e72',
    },
    author: null,
    categories: [],
    event_type: null,
    organiser: null,
    organizer: null,
    currency: {},
    tickets: [],
    index: 0,
    order_weight: 2,
  },
  {
    name: 'email',
    mandatory: true,
    visibleByContacts: false,
    visibleByAdmin: false,
    label: 'Correo electrónico',
    description: null,
    type: 'email',
    options: [],
    justonebyattendee: false,
    updated_at: '2021-09-22 14:25:32',
    created_at: '2021-09-21 21:18:04',
    _id: {
      $oid: '6160b1a7f6cfdd38d4502e73',
    },
    author: null,
    categories: [],
    event_type: null,
    organiser: null,
    organizer: null,
    currency: {},
    tickets: [],
    index: 1,
    order_weight: 3,
    sensibility: true,
  },
  {
    name: 'password',
    mandatory: true,
    visibleByContacts: false,
    visibleByAdmin: false,
    label: 'Contraseña',
    description: null,
    type: 'password',
    justonebyattendee: false,
    updated_at: '2021-09-22 14:25:33',
    created_at: '2021-09-21 21:56:24',
    _id: {
      $oid: '6160b1a7f6cfdd38d4502e74',
    },
    author: null,
    categories: [],
    event_type: null,
    organiser: null,
    organizer: null,
    currency: {},
    tickets: [],
    index: 2,
    order_weight: 1,
  },
]
