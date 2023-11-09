import { FunctionComponent, useEffect, useState } from 'react'
import { Result, Row, Space, Typography, Alert, Button } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { FrasesInspiradoras } from '../ModalsFunctions/utils'
import { app } from '@helpers/firebase'
import { useUserEvent } from '@context/eventUserContext'
import { useHelper } from '@context/helperContext/hooks/useHelper'
import { useIntl } from 'react-intl'
import { StateMessage } from '@context/MessageService'

import { AttendeeApi } from '@helpers/request'
import { ValidationStatusType } from '../types'
import { useEventContext } from '@context/eventContext'

interface RegistrationResultProps {
  validationGeneral: ValidationStatusType
  basicDataUser: any
  requireAutomaticLogin: any
  onlyAddOrganizationMember?: boolean
}

const RegistrationResult: FunctionComponent<RegistrationResultProps> = (props) => {
  const {
    validationGeneral,
    basicDataUser,
    requireAutomaticLogin,
    onlyAddOrganizationMember,
  } = props

  const [fraseLoading, setFraseLoading] = useState('')

  useEffect(() => {
    const random = Math.floor(Math.random() * FrasesInspiradoras.length)
    setFraseLoading(FrasesInspiradoras[random])
  }, [])

  useEffect(() => {
    //mientras el user espera se le dan frases motivadoras
    async function FraseInpiradora() {
      try {
        if (validationGeneral.isLoading) {
          const ramdon = Math.floor(Math.random() * FrasesInspiradoras.length)
          setFraseLoading(FrasesInspiradoras[ramdon])
          console.log('FrasesInspiradoras[ramdon]', FrasesInspiradoras[ramdon])
        }
      } catch (err) {
        console.log(err)
        StateMessage.show(null, 'error', 'Ha ocurrido un error')
      }
    }

    const intervalFrase = setTimeout(() => {
      FraseInpiradora()
    }, 8000)

    return () => {
      clearInterval(intervalFrase)
    }
  }, [])

  useEffect(() => {
    if (onlyAddOrganizationMember) {
      setTimeout(() => {
        window.location.reload()
      }, 3000)
    }
  }, [onlyAddOrganizationMember])

  if (validationGeneral.isLoading) {
    return (
      <Row>
        <Typography.Text type="secondary" style={{ fontSize: '18px' }}>
          {fraseLoading}
        </Typography.Text>
      </Row>
    )
  }

  if (validationGeneral.message) {
    return (
      <>
        <Result
          status={validationGeneral.error ? 'error' : 'success'}
          title={
            (basicDataUser ? basicDataUser?.email : '') + ' ' + validationGeneral.message
          }
        />
        {requireAutomaticLogin && !onlyAddOrganizationMember && (
          <RedirectUser basicDataUser={basicDataUser} />
        )}
      </>
    )
  }

  return (
    <>
      <Result status="success" title="Inscripción exitosa!" />
      {requireAutomaticLogin && <RedirectUser basicDataUser={basicDataUser} />}
    </>
  )
}

const RedirectUser = ({ basicDataUser }: { basicDataUser: any }) => {
  const cEventUser = useUserEvent()
  const cEvent = useEventContext()
  const { helperDispatch } = useHelper()
  const intl = useIntl()
  const [startedAutoLogin, setStartedAutoLogin] = useState(false)
  const [isSignInError, setIsSignInError] = useState(false)

  const loginFirebase = async () => {
    app
      .auth()
      .signInWithEmailAndPassword(basicDataUser.email, basicDataUser.password)
      .then((response) => {
        if (response.user) {
          cEventUser.requestUpdate()
          helperDispatch({ type: 'showLogin', visible: false })
        }
      })
      .catch((err) => {
        console.log(err)
        setIsSignInError(true)
      })
  }
  const loginFirebaseAnonymous = async () => {
    app
      .auth()
      .signInAnonymously()
      .then((response) => {
        app
          .auth()
          .currentUser.updateProfile({
            displayName: basicDataUser.names,
            photoURL: basicDataUser.picture || basicDataUser.email,
            email: basicDataUser.email,
          })
          .then(async () => {
            if (response.user) {
              const body = {
                event_id: cEvent.value._id,
                uid: response.user?.uid,
                anonymous: true,
                properties: {
                  email: basicDataUser.email,
                  names: basicDataUser.names,
                  ...basicDataUser,
                },
              }
              await app.auth().currentUser?.reload()
              await AttendeeApi.create(cEvent.value._id, body)
              cEventUser.requestUpdate()
              helperDispatch({ type: 'showLogin', visible: false })
            }
          })
      })
      .catch((err) => {
        console.log(err)
        setIsSignInError(true)
      })
  }

  useEffect(() => {
    setIsSignInError(false)
    if (startedAutoLogin) return

    if (basicDataUser.password) {
      loginFirebase()
    } else if (cEvent.value) {
      loginFirebaseAnonymous()
    }
  }, [startedAutoLogin, cEvent.value])

  useEffect(() => {
    const loginTrigger = setTimeout(() => setStartedAutoLogin(true), 5000)
    return () => {
      clearInterval(loginTrigger)
    }
  }, [])

  return (
    <>
      <Space>
        <Typography.Text type="secondary" style={{ fontSize: '18px' }}>
          {isSignInError ? (
            <Alert
              style={{ marginTop: '5px' }}
              message={
                <>
                  {intl.formatMessage({
                    id: 'modal.feedback.errorAutomaticSession',
                    defaultMessage:
                      'Ha fallado el inicio de sesión automático, por favor',
                  })}
                  <Button
                    style={{ padding: 4, color: '#333F44', fontWeight: 'bold' }}
                    onClick={() => {
                      helperDispatch({ type: 'showLogin' })
                    }}
                    type="link"
                  >
                    {intl.formatMessage({
                      id: 'modal.feedback.title.errorlink',
                      defaultMessage: 'iniciar sesión',
                    })}
                  </Button>
                </>
              }
              type="error"
            />
          ) : (
            <>
              <LoadingOutlined style={{ fontSize: '28px' }} />
              {intl.formatMessage({
                id: 'register.result.logging_in',
                defaultMessage: 'Iniciando sesión con tu cuenta!',
              })}
            </>
          )}
        </Typography.Text>
      </Space>
    </>
  )
}

export default RegistrationResult
