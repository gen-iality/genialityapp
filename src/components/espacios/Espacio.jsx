import { useEffect, useState } from 'react'
import { SpacesApi } from '@helpers/request'
import { useHistory } from 'react-router-dom'
import { handleRequestError } from '@helpers/utils'
import { Row, Col, Form, Input, Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import Header from '@antdComponents/Header'
import { StateMessage } from '@context/MessageService'

const { confirm } = Modal

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
}

const Espacio = (props) => {
  const eventID = props.event._id
  const locationState = props.location.state //si viene new o edit en el state, si es edit es un id
  const history = useHistory()
  const [espacio, setEspacio] = useState({})

  useEffect(() => {
    if (locationState.edit) {
      getOne()
    }
  }, [])

  const getOne = async () => {
    const response = await SpacesApi.getOne(locationState.edit, eventID)
    const data = response.data.find((espacios) => espacios._id === locationState.edit)
    setEspacio(data)
  }

  const onSubmit = async () => {
    if (espacio.name) {
      StateMessage.show(
        'loading',
        'loading',
        'Por favor espere mientras se guarda la información...',
      )

      try {
        if (locationState.edit) {
          await SpacesApi.editOne(espacio, locationState.edit, eventID)
        } else {
          await SpacesApi.create(espacio, eventID)
        }
        StateMessage.destroy('loading')
        StateMessage.show(null, 'success', 'Información guardada correctamente!')
        history.push(`${props.parentUrl}/espacios`)
      } catch (e) {
        StateMessage.destroy('loading')
        StateMessage.show(null, 'error', handleRequestError(e).message)
      }
    } else {
      StateMessage.show(null, 'error', 'El nombre es requerido')
    }
  }

  const handleChange = (e) => {
    setEspacio({ ...espacio, name: e.target.value })
  }

  const onRemoveId = () => {
    StateMessage.show(
      'loading',
      'loading',
      'Por favor espere mientras se borra la información...',
    )
    if (locationState.edit) {
      confirm({
        title: `¿Está seguro de eliminar la información?`,
        icon: <ExclamationCircleOutlined />,
        content: 'Una vez eliminado, no lo podrá recuperar',
        okText: 'Borrar',
        okType: 'danger',
        cancelText: 'Cancelar',
        onOk() {
          const onHandlerRemove = async () => {
            try {
              await SpacesApi.deleteOne(locationState.edit, eventID)
              StateMessage.destroy('loading')
              StateMessage.show(
                null,
                'success',
                'Se eliminó la información correctamente!',
              )
              history.push(`${props.parentUrl}/espacios`)
            } catch (e) {
              StateMessage.destroy('loading')
              StateMessage.show(null, 'error', handleRequestError(e).message)
            }
          }
          onHandlerRemove()
        },
      })
    }
  }

  return (
    <Form onFinish={onSubmit} {...formLayout}>
      <Header
        title="Espacio"
        back
        save
        form
        remove={onRemoveId}
        edit={locationState.edit}
      />

      <Row justify="center" wrap gutter={12}>
        <Col span={12}>
          <Form.Item
            label={
              <label style={{ marginTop: '2%' }} className="label">
                Nombre <label style={{ color: 'red' }}>*</label>
              </label>
            }
            rules={[{ required: true, message: 'El nombre es requerido' }]}
          >
            <Input
              value={espacio.name}
              name="name"
              placeholder="Nombre del espacio"
              onChange={(e) => handleChange(e)}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}

export default Espacio
