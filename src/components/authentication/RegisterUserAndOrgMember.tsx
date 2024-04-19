/** React's libraries imports */
import { useState, useEffect, ReactNode } from 'react'
import { useIntl } from 'react-intl'
import { useLocation } from 'react-router'

/** Antd imports */
import { Steps, Button, Alert, Form, Grid, Typography } from 'antd'
import { ScheduleOutlined } from '@ant-design/icons'
import { LoadingOutlined } from '@ant-design/icons'
import AccountOutlineIcon from '@2fd/ant-design-icons/lib/AccountOutline'
import TicketConfirmationOutlineIcon from '@2fd/ant-design-icons/lib/TicketConfirmationOutline'

/** Components imports */
import RegisterFast from './Content/RegisterFast'
import RegistrationResult from './Content/RegistrationResult'

/** External functions imports */
import createNewUser, { CREATE_NEW_USER_SUCCESS } from './ModalsFunctions/createNewUser'

/** Helpers and utils imports */
import { OrganizationApi, PositionsApi, UsersApi } from '@helpers/request'

/** Context imports */
import { useHelper } from '@context/helperContext/hooks/useHelper'
import { StateMessage } from '@context/MessageService'
import OrganizationPropertiesForm from '@components/organization/forms/OrganizationPropertiesForm'
import { ValidationStatusType } from './types'
import { stylePaddingDesktop, stylePaddingMobile } from './constants'
import { useCurrentUser } from '@context/userContext'

type RegisterUserAndOrgMemberProps = {
  organizationId?: string
  defaultPositionId?: string
  requireAutomaticLogin?: boolean
  startingComponent?: () => void
  onlyAddOrganizationMember?: boolean
}

const RegisterUserAndOrgMember = (props: RegisterUserAndOrgMemberProps) => {
  const {
    organizationId,
    defaultPositionId,
    requireAutomaticLogin,
    startingComponent,
    onlyAddOrganizationMember,
  } = props

  const intl = useIntl()
  const screens = Grid.useBreakpoint()
  const [form] = Form.useForm()
  const { helperDispatch, currentAuthScreen } = useHelper()
  const location = useLocation()

  const cUser = useCurrentUser()

  const [current, setCurrent] = useState(0)
  const [basicUserData, setBasicUserData] = useState({
    names: '',
    email: '',
    password: '',
    picture: '',
  })
  const [orgMemberData, setOrgMemberData] = useState<any | undefined>(undefined)
  const [buttonStatus, setButtonStatus] = useState(true)
  const [validationStatus, setValidationStatus] = useState<ValidationStatusType>({
    error: false,
    isLoading: false,
  })

  const [organization, setOrganization] = useState({})
  const [existGenialialityUser, setExistGenialialityUser] = useState(false)

  const hookValidations = (error: boolean, textError: string) => {
    setValidationStatus({
      error,
      message: textError,
      isLoading: false,
    })
    setButtonStatus(error)
  }

  const formDataHandler = (e: any, fieldName: string, picture: any) => {
    const value = fieldName === 'picture' ? picture : e.target.value

    setBasicUserData((previous: any) => ({
      ...previous,
      [fieldName]: value,
    }))
  }

  const onSubmit = (values: any) => {
    setOrgMemberData(values)
  }

  const steps = [
    {
      title: 'Básico',
      content: (
        <RegisterFast userData={basicUserData} formDataHandler={formDataHandler} />
      ),
      icon: <AccountOutlineIcon style={{ fontSize: '32px' }} />,
    },
    {
      title: 'Adicionales',
      content: (
        <OrganizationPropertiesForm
          form={form}
          basicDataUser={basicUserData}
          organization={organization}
          onSubmit={onSubmit}
          noSubmitButton
        />
      ),
      icon: <TicketConfirmationOutlineIcon style={{ fontSize: '32px' }} />,
    },
    {
      title: 'Confirmación',
      content: (
        <RegistrationResult
          validationGeneral={validationStatus}
          basicDataUser={basicUserData}
          requireAutomaticLogin={requireAutomaticLogin}
          onlyAddOrganizationMember={onlyAddOrganizationMember}
        />
      ),
      icon: <ScheduleOutlined style={{ fontSize: '32px' }} />,
    },
  ]

  const handleValidateAccountGeniality = async () => {
    try {
      const validateEmail = await UsersApi.validateEmail({ email: basicUserData.email })
      if (validateEmail?.message === 'Email valid') {
        setValidationStatus({
          isLoading: false,
          error: false,
        })
        setCurrent(current + 1)
      }
    } catch (err: any) {
      if (err?.response?.data?.errors?.email[0] === 'email ya ha sido registrado.') {
        if (isAdminPage()) {
          setCurrent(current + 1)
          setExistGenialialityUser(true)

          setValidationStatus({
            isLoading: false,
            error: true,
            message: 'El usuario ya existe. Debes registrar miembro a la organización',
            component: 'Registrar miembro de la organización',
          })
        } else {
          setValidationStatus({
            isLoading: false,
            error: true,
            message: intl.formatMessage({
              id: 'modal.feedback.title.error',
              defaultMessage:
                'Correo electrónico ya en uso, inicie sesión si desea continuar con este correo.',
            }),
            component: intl.formatMessage({
              id: 'modal.feedback.title.errorlink',
              defaultMessage: 'inicia sesión',
            }),
          })
        }
      } else if (
        err?.response?.data?.errors?.email[0] === 'email no es un correo válido'
      ) {
        setValidationStatus({
          isLoading: false,
          error: true,
          message: intl.formatMessage({
            id: 'modal.feedback.errorDNSNotFound',
            defaultMessage: 'El correo ingresado no es válido.',
          }),
        })
      } else {
        setValidationStatus({
          isLoading: false,
          error: true,
          message: intl.formatMessage({
            id: 'modal.feedback.errorGeneralInternal',
            defaultMessage:
              'Se ha presentado un error interno. Por favor intenta de nuevo',
          }),
        })
      }
    }
  }

  async function createOrgMember() {
    const propertiesOrgMember = { properties: { ...basicUserData, ...orgMemberData } }
    delete propertiesOrgMember.properties.password
    delete propertiesOrgMember.properties.picture

    // Si organizationId no está definido o es falso, usamos alternateId.
    let effectiveOrgId = organizationId
    if (!effectiveOrgId) {
      console.log("no se encontró organizationId por props, se usa el alterno")
      const id = location.pathname.split('/')[2]
      effectiveOrgId = id // Utilizamos id como alternateId.
      if (!effectiveOrgId) {
        StateMessage.show(
          null,
          'error',
          'Hubo un error, pero se ajusto para poder proceder con normalidad',
        )
        console.error(`The value of effectiveOrgId is ${effectiveOrgId}`);
      }
    }

    try {
      const respUser = await OrganizationApi.saveUser(effectiveOrgId, propertiesOrgMember)
      console.debug('RegisterUser: has default position Id', { defaultPositionId })
      if (defaultPositionId === undefined) {
        console.warn('This organization has no default position. Eh!')
      } else {
        await PositionsApi.Organizations.addUser(
          effectiveOrgId,
          defaultPositionId,
          respUser.account_id,
        )
      }
      if (respUser && respUser.account_id) {
        setValidationStatus({
          error: false,
          isLoading: false,
          message: intl.formatMessage({
            id: 'text_error.organization_successfully_registered',
            defaultMessage: 'Te has inscrito correctamente a esta organización',
          }),
        })
        // setBasicDataUser({ email: '', names: '', password: '', picture: '' });
        setOrgMemberData(undefined)
        startingComponent && startingComponent()
      }
    } catch (err) {
      console.error(err)
      StateMessage.show(null, 'error', 'Ha ocurrido un error')
    }
  }

  const handleSubmit = () => {
    if (current < 3) {
      setCurrent(current + 1)
    }

    if (existGenialialityUser) {
      createOrgMember()
    } else {
      createNewUser(basicUserData)
        .then((createdUserInfo) => {
          console.log('createdUserInfo returned:', { createdUserInfo })
          const { status } = createdUserInfo

          if (status === CREATE_NEW_USER_SUCCESS) {
            createOrgMember()
          } else {
            setValidationStatus({
              error: true,
              isLoading: false,
              message: intl.formatMessage({
                id: 'text_error.error_creating_user',
                defaultMessage: 'Hubo un error al crear el usuario, intente nuevamente',
              }),
            })
          }
        })
        .catch((err) => console.error(err))
    }
  }

  const goToNextStep = () => {
    if (current == 0) {
      setValidationStatus({
        ...validationStatus,
        isLoading: true,
        error: false,
        message: undefined,
      })

      handleValidateAccountGeniality()
    } else if (current == 1) {
      form
        .validateFields()
        .then(() => {
          console.log('3. Validate Fields')
          form.submit()
          setValidationStatus((previous) => ({
            ...previous,
            isLoading: true,
            error: false,
            message: undefined,
          }))
        })
        .catch((error) => console.log(error))
    }
  }

  const goTopreviousStep = () => {
    if (current == 2 && onlyAddOrganizationMember) {
      // don't go to basic form
      return false
    }
    setCurrent(current - 1)
    setButtonStatus(false)
  }

  function validateEmail(email: string) {
    const re = /\S+@\S+\.\S+/
    return re.test(email)
  }

  const validateGeneralFields = () => {
    if (
      basicUserData.email &&
      (basicUserData.password || onlyAddOrganizationMember) &&
      basicUserData.names
    ) {
      const goodPassword =
        basicUserData.password.length >= 6 && basicUserData.password.length <= 18
      if (
        validateEmail(basicUserData.email) &&
        (goodPassword || onlyAddOrganizationMember)
      ) {
        setButtonStatus(false)
        setValidationStatus({
          ...validationStatus,
          isLoading: false,
          error: false,
          message: undefined,
        })
      } else {
        setValidationStatus({
          ...validationStatus,
          isLoading: false,
          message: intl.formatMessage({
            id: 'feedback.title.error',
            defaultMessage: 'Complete los campos solicitados correctamente.',
          }),
          error: true,
        })
      }
    } else {
      setButtonStatus(true)
    }
  }

  const isAdminPage = () => {
    const isAdmin = location.pathname.includes('admin')

    if (isAdmin) {
      return true
    } else return false
  }

  useEffect(() => {
    if (current === 0 && onlyAddOrganizationMember) {
      setCurrent(1)
    }

    if (cUser.value && current != 0 && onlyAddOrganizationMember) {
      // Load basic user data to visualization only
      setButtonStatus(false)
      setExistGenialialityUser(true)
      setBasicUserData({
        email: cUser.value.email,
        names: cUser.value.names,
        password: '',
        picture: '',
      })
    }
  }, [onlyAddOrganizationMember, current, cUser.value])

  useEffect(() => {
    if (orgMemberData !== undefined) {
      handleSubmit()
    }
  }, [orgMemberData])

  useEffect(() => {
    if (!organizationId) return
    OrganizationApi.getOne(organizationId).then((response) => {
      setOrganization(response)
    })
  }, [organizationId])

  useEffect(() => {
    if (current == 0) {
      validateGeneralFields()
    }
  }, [basicUserData, current])

  useEffect(() => {
    if (currentAuthScreen === 'login') setCurrent(0)

    return () => {
      setCurrent(0)
    }
  }, [currentAuthScreen])

  return (
    <div style={screens.xs ? stylePaddingMobile : stylePaddingDesktop}>
      <Steps
        current={current}
        responsive={false}
        items={steps.map((item) => ({
          title: item.title,
          icon: item.icon,
        }))}
      />
      {onlyAddOrganizationMember && (
        <Typography.Paragraph type="danger">
          Sólo registrarse a la organización
        </Typography.Paragraph>
      )}
      {existGenialialityUser && (
        <Typography.Paragraph type="secondary">Usuario conocido</Typography.Paragraph>
      )}
      <div style={{ marginTop: '30px' }}>{steps[current].content}</div>
      <div style={{ marginTop: '30px' }}>
        {current > 0 && current < 2 && (
          <Button
            disabled={onlyAddOrganizationMember}
            onClick={() => {
              hookValidations(false, '')
              goTopreviousStep()
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

        {validationStatus.isLoading ? (
          <LoadingOutlined style={{ fontSize: '28px' }} />
        ) : (
          <>
            {!validationStatus.message && (
              <>
                {current < steps.length - 1 && (
                  <Button
                    id="btnnextRegister"
                    disabled={buttonStatus}
                    size="large"
                    type="primary"
                    onClick={goToNextStep}
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
      {typeof validationStatus.message === 'string' && (
        <Alert
          showIcon
          style={{
            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
            backgroundColor: '#FFFFFF',
            color: '#000000',
            borderLeft: `5px solid ${validationStatus.error ? '#FF4E50' : '#4fff4e'}`,
            fontSize: '14px',
            textAlign: 'start',
            borderRadius: '5px',
            marginBottom: '15px',
          }}
          message={
            <>
              {validationStatus.message}
              {validationStatus.component && (
                <Button
                  style={{ padding: 4, color: '#333F44', fontWeight: 'bold' }}
                  onClick={() =>
                    helperDispatch({ type: 'showLogin', organizationId: organizationId })
                  }
                  type="link"
                >
                  {validationStatus.component}
                </Button>
              )}
            </>
          }
          type={validationStatus.error ? 'error' : 'success'}
        />
      )}
    </div>
  )
}

export default RegisterUserAndOrgMember
