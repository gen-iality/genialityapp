import { useState } from 'react'
import { Typography } from 'antd'
import { useIntl } from 'react-intl'
import { useEventContext } from '@context/eventContext'
import { useHelper } from '@context/helperContext/hooks/useHelper'
import { StateMessage } from '@context/MessageService'
import FormEnrollAttendeeToEvent from '@components/forms/FormEnrollAttendeeToEvent'
import { fieldNameEmailFirst } from '@helpers/utils'
import { app } from '@helpers/firebase'
import { AttendeeApi } from '@helpers/request'
import { useUserEvent } from '@context/eventUserContext'
const { Title } = Typography

const RegisterUserAndEventUserAnonymous = ({}: any) => {
  const intl = useIntl()
  const cEvent = useEventContext()
  const cEventUser = useUserEvent()
  const { helperDispatch } = useHelper()
  const [loading, setLoading] = useState(false)
  const { fields_conditions, user_properties } = cEvent?.value || {}
  const fields = fieldNameEmailFirst(user_properties)
  const handleSubmit = async (values: any) => {
    setLoading(true)
    app
      .auth()
      .signInAnonymously()
      .then((user) => {
        app
          .auth()
          .currentUser?.updateProfile({
            displayName: values.names,
            /**almacenamos el email en el photoURL para poder setearlo en el context del usuario y asi llamar el eventUser anonimo */
            photoURL: values.email,
          })
          .then(async () => {
            console.log('response', user)
            if (user.user) {
              const body = {
                event_id: cEvent.value._id,
                uid: user.user?.uid,
                anonymous: true,
                properties: {
                  ...values,
                },
              }
              await app.auth().currentUser?.reload()
              AttendeeApi.create(cEvent.value._id, body).then((data) => {
                console.log('response', data)
                cEventUser.setUpdateUser(true)
                helperDispatch({ type: 'showLogin', visible: false })
                setLoading(false)
              })
            }
          })
      })
      .catch((err) => {
        console.log(err)
        StateMessage.show(null, 'error', 'Ha ocurrido un error')
      })
  }

  return (
    <div>
      <Title level={3} style={{ textAlign: 'center' }}>
        {intl.formatMessage({
          id: 'modal.title.registerevent..',
          defaultMessage: 'Información para el curso',
        })}
      </Title>
      <FormEnrollAttendeeToEvent
        saveAttendee={handleSubmit}
        fields={fields}
        conditionalFields={fields_conditions}
        loaderWhenSavingUpdatingOrDelete={loading}
        submitButtonProps={{
          styles: {
            marginTop: '20px',
          },
          text: 'Ingresar',
        }}
      />
    </div>
  )
}

export default RegisterUserAndEventUserAnonymous
