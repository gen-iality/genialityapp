import { useEffect, useState } from 'react'
import { Result, Row, Space, Typography, Alert, Button } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { FrasesInspiradoras } from '../ModalsFunctions/utils'
import { app } from '@helpers/firebase'
import { useUserEvent } from '@context/eventUserContext'
import { useHelper } from '@context/helperContext/hooks/useHelper'
import { useIntl } from 'react-intl'
import { StateMessage } from '@context/MessageService'

import { AttendeeApi } from '@helpers/request'

const RegistrationResult = ({
  validationGeneral,
  basicDataUser,
  cEvent,
  dataEventUser,
  requireAutomaticLoguin,
}) => {
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
  })

  return (
    <>
      {validationGeneral.isLoading ? (
        <>
          <Row>
            <Typography.Text type="secondary" style={{ fontSize: '18px' }}>
              {fraseLoading}
            </Typography.Text>
          </Row>
        </>
      ) : (
        <>
          {!validationGeneral.status ? (
            <Result
              status="warning"
              title={
                (basicDataUser ? basicDataUser?.email : '') +
                ' ' +
                validationGeneral.textError
              }
            />
          ) : (
            <>
              <Result status="success" title="Inscripción exitosa!" />
              {requireAutomaticLoguin && (
                <RedirectUser
                  basicDataUser={basicDataUser}
                  cEvent={cEvent}
                  dataEventUser={dataEventUser}
                />
              )}
            </>
          )}
        </>
      )}
    </>
  )
}

const RedirectUser = ({ basicDataUser, cEvent, dataEventUser }) => {
  const cEventUser = useUserEvent()
  const { helperDispatch } = useHelper()
  const intl = useIntl()
  const [signInWithEmailAndPasswordError, setSignInWithEmailAndPasswordError] =
    useState(false)

  useEffect(() => {
    setSignInWithEmailAndPasswordError(false)
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
          setSignInWithEmailAndPasswordError(true)
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
              photoURL: basicDataUser.picture
                ? basicDataUser.picture
                : basicDataUser.email,
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
                    ...dataEventUser,
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
          setSignInWithEmailAndPasswordError(true)
        })
    }

    const loginInterval = setTimeout(() => {
      if (basicDataUser.password) {
        loginFirebase()
      } else {
        loginFirebaseAnonymous()
      }
    }, 5000)

    return () => {
      clearInterval(loginInterval)
    }
  }, [])

  return (
    <>
      <Space>
        <Typography.Text type="secondary" style={{ fontSize: '18px' }}>
          {signInWithEmailAndPasswordError ? (
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
