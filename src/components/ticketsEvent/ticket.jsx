import { useEffect, useState } from 'react'
import { eventTicketsApi } from '@helpers/request'
import { useNavigate, useLocation } from 'react-router-dom'
import { handleRequestError } from '@helpers/utils'
import { Row, Col, Form, Input, Modal, Switch } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import Header from '@antdComponents/Header'
import { StateMessage } from '@context/MessageService'

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
}

const { confirm } = Modal

const Ticket = (props) => {
  const eventID = props.event._id
  const location = useLocation()
  const locationState = location.state //si viene new o edit en el state, si es edit es un id
  const navigate = useNavigate()
  const [ticket, setTicket] = useState({ event_id: props.event._id })

  useEffect(() => {
    if (locationState.edit) {
      getOne()
    }
  }, [locationState.edit])

  const getOne = async () => {
    const data = await eventTicketsApi.getOne(locationState.edit, eventID)

    setTicket(data)
  }

  const handleInputChange = (e) => {
    if (ticket) {
      setTicket({ ...ticket, title: e.target.value })
    }
  }

  const onSubmit = async () => {
    if (ticket.title) {
      StateMessage.show(
        'loading',
        'loading',
        'Por favor espere mientras se guarda la información...',
      )
      try {
        if (locationState.edit) {
          await eventTicketsApi.update(eventID, ticket, locationState.edit)
        } else {
          const data = {
            title: ticket.title,
            allowed_to_vote: ticket.allowed_to_vote,
            event_id: eventID,
          }
          await eventTicketsApi.create(eventID, data)
        }
        StateMessage.destroy('loading')
        StateMessage.show(null, 'success', 'Información guardada correctamente!')
        navigate('../ticketsEvent')
      } catch (e) {
        StateMessage.destroy('loading')
        StateMessage.show(null, 'error', handleRequestError(e).message)
      }
    } else {
      StateMessage.show(null, 'error', 'El título es requerido')
    }
  }

  const onRemoveId = () => {
    StateMessage.show(
      'loading',
      'loading',
      'Por favor espere mientras se borra la información...',
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
              await eventTicketsApi.deleteOne(locationState.edit, eventID)
              StateMessage.destroy('loading')
              StateMessage.show(
                null,
                'success',
                'Se eliminó la información correctamente!',
              )
              navigate('../ticketsEvent')
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
        title="Ticket"
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
                Título <label style={{ color: 'red' }}>*</label>
              </label>
            }
            rules={[{ required: true, message: 'El título es requerido' }]}
          >
            <Input
              name="title"
              placeholder="Título del ticket"
              value={ticket.title}
              onChange={(e) => handleInputChange(e)}
            />
          </Form.Item>
          <Form.Item label="Permiso de enviar respuestas">
            <Switch
              name="allowed_to_vote"
              checked={ticket.allowed_to_vote}
              checkedChildren="Sí"
              unCheckedChildren="No"
              onChange={(checked) => setTicket({ ...ticket, allowed_to_vote: checked })}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}

export default Ticket
