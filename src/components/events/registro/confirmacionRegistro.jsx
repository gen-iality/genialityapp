import { useState } from 'react'
import { Row, Col, Form } from 'antd'
import EviusReactQuill from '../../shared/eviusReactQuill'
import { EventsApi } from '@helpers/request'
import Header from '@antdComponents/Header'
import { StateMessage } from '@context/MessageService'

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
}

function ConfirmacionRegistro(props) {
  console.log('props.event.validateEmail', props.event.validateEmail)
  // Se definen las variables de useState para enviar y obtener datos
  const [validateEmail] = useState(() => {
    if (props.event && props.event.validateEmail) {
      if (props.event.validateEmail === 'true' || props.event.validateEmail) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  })
  const [registrationMessage, setRegistrationMessage] = useState(
    props.event && props.event.registration_message
      ? props.event.registration_message
      : '',
  )

  if (!props.event) return 'Cargando ...'

  //funcion para guardar la inormación
  const saveData = async () => {
    StateMessage.show(
      'loading',
      'loading',
      ' Por favor espere mientras se guarda el contenido...',
    )
    const data = {
      registration_message: registrationMessage,
      validateEmail: validateEmail,
    }
    try {
      await EventsApi.editOne(data, props.event._id)
      StateMessage.destroy('loading')
      StateMessage.show(null, 'success', 'Contenido guardada correctamente!')
    } catch (e) {
      StateMessage.destroy('loading')
      StateMessage.show(null, 'error', e)
    }
  }

  return (
    <>
      <Form onFinish={saveData} {...formLayout}>
        <Header
          title="Confirmación de Inscripción"
          description="El siguiente mensaje le llegará a las personas inscritas en el curso o lección"
          save
          form
        />
        <Row justify="center" wrap gutter={[8, 8]}>
          <Col span={18}>
            <Form.Item label="Mensaje de Inscripción">
              <EviusReactQuill
                data={registrationMessage}
                handleChange={(e) => setRegistrationMessage(e)}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  )
}

export default ConfirmacionRegistro
