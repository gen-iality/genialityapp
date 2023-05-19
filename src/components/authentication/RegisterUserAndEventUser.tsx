import { useState, useEffect, ReactNode } from 'react'
import { Steps, Button, Alert } from 'antd'
import RegisterFast from './Content/RegisterFast'
import RegistrationResult from './Content/RegistrationResult'
import AccountOutlineIcon from '@2fd/ant-design-icons/lib/AccountOutline'
import TicketConfirmationOutlineIcon from '@2fd/ant-design-icons/lib/TicketConfirmationOutline'
import { ScheduleOutlined } from '@ant-design/icons'
import FormComponent from '../events/registrationForm/form'
import { UsersApi } from '@helpers/request'
import { LoadingOutlined } from '@ant-design/icons'
import createNewUser, { CREATE_NEW_USER_SUCCESS } from './ModalsFunctions/createNewUser'
import { useIntl } from 'react-intl'
import { useEventContext } from '@context/eventContext'
import { useHelper } from '@context/helperContext/hooks/useHelper'
import { StateMessage } from '@context/MessageService'

const { Step } = Steps

const RegisterUserAndEventUser = ({
  screens,
  stylePaddingMobile,
  stylePaddingDesktop,
}: any) => {
  const intl = useIntl()
  const cEvent = useEventContext()
  const [current, setCurrent] = useState(0)
  const [basicDataUser, setbasicDataUser] = useState<any>({
    names: '',
    email: '',
    password: '',
    picture: '',
  })
  const { helperDispatch, currentAuthScreen } = useHelper()
  const [dataEventUser, setdataEventUser] = useState({})
  const [buttonStatus, setbuttonStatus] = useState(true)
  const [validationGeneral, setValidationGeneral] = useState<{
    status: boolean
    textError: string
    isLoading: boolean
    component?: ReactNode
  }>({
    status: false,
    textError: '',
    isLoading: false,
  })
  const [validateEventUser, setvalidateEventUser] = useState<{
    status: boolean
    textError: string
    statusFields?: boolean
  }>({
    status: false,
    textError: '',
    statusFields: false,
  })

  const hookValidations = (status: boolean, textError: string) => {
    setValidationGeneral({
      status: status,
      textError: textError,
      isLoading: false,
    })
    setbuttonStatus(status)
  }

  const HandleHookForm = (e: any, fieldName: string, picture: any) => {
    let value = ''
    if (fieldName === 'picture') {
      value = picture
    } else {
      value = e.target.value
    }

    if (current === 0) {
      if (fieldName === 'picture') {
        setbasicDataUser({ ...basicDataUser, [fieldName]: picture })
      } else {
        setbasicDataUser({
          ...basicDataUser,
          [fieldName]: value,
        })
      }
    } else {
      setdataEventUser({
        ...dataEventUser,
        [fieldName]: value,
      })
    }
  }

  const steps = [
    {
      title: 'First',
      content: (
        <RegisterFast basicDataUser={basicDataUser} formDataHandler={HandleHookForm} />
      ),
      icon: <AccountOutlineIcon style={{ fontSize: '32px' }} />,
    },
    {
      title: 'Second',
      content: (
        <FormComponent
          hookValidations={hookValidations}
          dataEventUser={dataEventUser}
          basicDataUser={basicDataUser}
          HandleHookForm={HandleHookForm}
          validateEventUser={validateEventUser}
          setvalidateEventUser={setvalidateEventUser}
        />
      ),
      icon: <TicketConfirmationOutlineIcon style={{ fontSize: '32px' }} />,
    },
    {
      title: 'Last',
      content: (
        <RegistrationResult
          validationGeneral={validationGeneral}
          basicDataUser={basicDataUser}
          cEvent={undefined}
          dataEventUser={undefined}
          requireAutomaticLoguin={undefined}
        />
      ),
      icon: <ScheduleOutlined style={{ fontSize: '32px' }} />,
    },
  ]

  const handleValidateAccountEvius = async () => {
    try {
      const validateEmail = await UsersApi.validateEmail({
        email: basicDataUser.email,
      })
      console.log(validateEmail, 'validateEmail')
      if (validateEmail?.message === 'Email valid') {
        setValidationGeneral({
          isLoading: false,
          status: false,
          textError: '',
        })
        setCurrent(current + 1)
      }
    } catch (err: any) {
      if (err?.response?.data?.errors?.email[0] === 'email ya ha sido registrado.') {
        setValidationGeneral({
          isLoading: false,
          status: true,
          textError: intl.formatMessage({
            id: 'modal.feedback.title.error',
            defaultMessage:
              'Correo electrónico ya en uso, inicie sesión si desea continuar con este correo.',
          }),
          component: intl.formatMessage({
            id: 'modal.feedback.title.errorlink',
            defaultMessage: 'iniciar sesión',
          }),
        })
      } else if (
        err?.response?.data?.errors?.email[0] === 'email no es un correo válido'
      ) {
        setValidationGeneral({
          isLoading: false,
          status: true,
          textError: intl.formatMessage({
            id: 'modal.feedback.errorDNSNotFound',
            defaultMessage: 'El correo ingresado no es válido.',
          }),
        })
      } else {
        setValidationGeneral({
          isLoading: false,
          status: true,
          textError: intl.formatMessage({
            id: 'modal.feedback.errorGeneralInternal',
            defaultMessage:
              'Se ha presentado un error interno. Por favor intenta de nuevo',
          }),
        })
      }
    }
  }

  const handleSubmit = () => {
    setCurrent(current + 1)

    async function createEventUser() {
      const clonBasicDataUser: any = { ...basicDataUser }
      delete clonBasicDataUser.password
      delete clonBasicDataUser.picture

      const datauser = {
        ...clonBasicDataUser,
        ...dataEventUser,
      }

      const propertiesuser = { properties: { ...datauser } }
      try {
        const respUser = await UsersApi.createOne(propertiesuser, cEvent.value?._id)
        if (respUser && respUser._id) {
          setValidationGeneral({
            status: false,
            isLoading: false,
            textError: intl.formatMessage({
              id: 'text_error.successfully_registered',
              defaultMessage: 'Te has inscrito correctamente a este curso',
            }),
          })
          setbasicDataUser({})
          setdataEventUser({})
        }
      } catch (err) {
        console.error(err)
        StateMessage.show(null, 'error', 'Ha ocurrido un error')
      }
    }

    createNewUser(basicDataUser)
      .then((createdUserInfo) => {
        console.log('createdUserInfo returned:', { createdUserInfo })
        const { status } = createdUserInfo

        if (status === CREATE_NEW_USER_SUCCESS) {
          createEventUser()
        } else {
          setValidationGeneral({
            status: false,
            isLoading: false,
            textError: intl.formatMessage({
              id: 'text_error.error_creating_user',
              defaultMessage: 'Hubo un error al crear el usuario, intente nuevamente',
            }),
          })
        }
      })
      .catch((err) => console.error(err))
  }

  const next = () => {
    if (current == 0) {
      setValidationGeneral({
        ...validationGeneral,
        isLoading: true,
        status: false,
      })

      handleValidateAccountEvius()
    } else if (current == 1) {
      setvalidateEventUser({
        status: true,
        textError: '',
      })
    }
  }

  useEffect(() => {
    if (validateEventUser.statusFields) {
      setValidationGeneral({
        ...validationGeneral,
        isLoading: true,
        status: false,
      })
      handleSubmit()
    }
  }, [validateEventUser.statusFields])

  const prev = () => {
    setCurrent(current - 1)
    setbuttonStatus(false)
  }

  function validateEmail(email: string) {
    const re = /\S+@\S+\.\S+/
    return re.test(email)
  }

  const ValidateGeneralFields = () => {
    if (basicDataUser.email && basicDataUser.password && basicDataUser.names) {
      if (
        validateEmail(basicDataUser.email) &&
        basicDataUser.password.length >= 6 &&
        basicDataUser.password.length <= 18
      ) {
        setbuttonStatus(false)
        setValidationGeneral({
          ...validationGeneral,
          isLoading: false,
          status: false,
          textError: '',
        })
      } else {
        setValidationGeneral({
          ...validationGeneral,
          isLoading: false,
          textError: intl.formatMessage({
            id: 'feedback.title.error',
            defaultMessage: 'Complete los campos solicitados correctamente.',
          }),
          status: true,
        })
      }
    } else {
      setbuttonStatus(true)
    }
  }

  useEffect(() => {
    if (current == 0) {
      ValidateGeneralFields()
    }
  }, [basicDataUser, dataEventUser, current])

  useEffect(() => {
    if (currentAuthScreen === 'login') setCurrent(0)

    return () => {
      setCurrent(0)
    }
  }, [currentAuthScreen])

  return (
    <div style={screens.xs ? stylePaddingMobile : stylePaddingDesktop}>
      <Steps current={current} responsive={false}>
        {steps.map((item) => (
          <Step key={item.title} icon={item.icon} />
        ))}
      </Steps>
      <div style={{ marginTop: '30px' }}>{steps[current].content}</div>
      <div style={{ marginTop: '30px' }}>
        {current > 0 && current < 2 && (
          <Button
            onClick={() => {
              hookValidations(false, '')
              prev()
            }}
            size="large"
            style={{ margin: '0 8px' }}
          >
            {intl.formatMessage({
              id: 'register.button.previous',
              defaultMessage: 'Anterior',
            })}
          </Button>
        )}

        {validationGeneral.isLoading ? (
          <LoadingOutlined style={{ fontSize: '28px' }} />
        ) : (
          <>
            {!validationGeneral.status && (
              <>
                {current < steps.length - 1 && (
                  <Button
                    id="btnnextRegister"
                    disabled={buttonStatus}
                    size="large"
                    type="primary"
                    onClick={() => {
                      next()
                    }}
                  >
                    {current > 0
                      ? intl.formatMessage({
                          id: 'register.button.finalize',
                          defaultMessage: 'Finalizar',
                        })
                      : intl.formatMessage({
                          id: 'register.button.next',
                          defaultMessage: 'Siguiente',
                        })}
                  </Button>
                )}
              </>
            )}
          </>
        )}
      </div>

      {validationGeneral.status && (
        <Alert
          showIcon
          /* style={{ marginTop: '5px' }} */
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
          /* closable */
          message={
            <>
              {validationGeneral.textError}
              {validationGeneral.component ? (
                <Button
                  style={{ padding: 4, color: '#333F44', fontWeight: 'bold' }}
                  onClick={() => helperDispatch({ type: 'showLogin' })}
                  type="link"
                >
                  {validationGeneral.component}
                </Button>
              ) : (
                ''
              )}
            </>
          }
          type="error"
        />
      )}
    </div>
  )
}

export default RegisterUserAndEventUser
