import { useEffect, useState } from 'react'
import { RolAttApi } from '@helpers/request'
import { useNavigate, useLocation } from 'react-router-dom'
import { handleRequestError } from '@helpers/utils'
import { Row, Col, Form, Input, Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import Header from '@antdComponents/Header'
import { StateMessage } from '@context/MessageService'

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
}

const { confirm } = Modal

const TipoAsistente = (props) => {
  const eventID = props.event._id

  const location = useLocation()

  const locationState = location.state //si viene new o edit en el state, si es edit es un id
  const navigate = useNavigate()
  const [tipoAsistente, setTipoAsistente] = useState({ event_id: props.event._id })

  useEffect(() => {
    if (locationState.edit) {
      getOne()
    }
  }, [locationState.edit])

  const getOne = async () => {
    const response = await RolAttApi.getOne(eventID, locationState.edit)
    const data = response.find(
      (tipoAsistentes) => tipoAsistentes._id === locationState.edit,
    )

    setTipoAsistente(data)
  }

  const handleInputChange = (e) => {
    if (tipoAsistente) {
      setTipoAsistente({ ...tipoAsistente, name: e.target.value, type: 'attendee' })
    }
  }

  const onSubmit = async () => {
    if (tipoAsistente.name) {
      StateMessage.show(
        'loading',
        'loading',
        ' Por favor espere mientras se guarda la información...',
      )
      try {
        if (locationState.edit) {
          await RolAttApi.editOne(tipoAsistente, locationState.edit, eventID)
        } else {
          await RolAttApi.create(tipoAsistente, eventID)
        }

        StateMessage.destroy('loading')
        StateMessage.show(null, 'success', 'Información guardada correctamente!')
        navigate('..')
      } catch (e) {
        StateMessage.destroy('loading')
        StateMessage.show(null, 'error', handleRequestError(e).message)
      }
    } else {
      StateMessage.show(null, 'error', 'El nombre es requerido')
    }
  }

  const onRemoveId = () => {
    StateMessage.show(
      'loading',
      'loading',
      ' Por favor espere mientras se borra la información...',
    )
    if (locationState.edit) {
      confirm({
        title: '¿Está seguro de eliminar la información?',
        icon: <ExclamationCircleOutlined />,
        content: 'Una vez eliminado, no lo podrá recuperar',
        okText: 'Borrar',
        okType: 'danger',
        cancelText: 'Cancelar',
        onOk() {
          const onHandlerRemove = async () => {
            try {
              await RolAttApi.deleteOne(locationState.edit, eventID)
              StateMessage.destroy('loading')
              StateMessage.show(
                null,
                'success',
                'Se eliminó la información correctamente!',
              )
              navigate('..')
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
        title="Tipo de Asistente"
        back
        save
        form
        remove={onRemoveId}
        edit={locationState.edit}
      />

      <Row justify="center" wrap gutter={18}>
        <Col>
          <Form.Item
            label={
              <label style={{ marginTop: '2%' }} className="label">
                Nombre del rol <label style={{ color: 'red' }}>*</label>
              </label>
            }
            rules={[{ required: true, message: 'El nombre es requerido' }]}
          >
            <Input
              name="name"
              placeholder="Nombre del rol"
              value={tipoAsistente?.name}
              onChange={(e) => handleInputChange(e)}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}

export default TipoAsistente
