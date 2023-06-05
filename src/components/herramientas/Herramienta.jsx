import { useEffect, useState } from 'react'
import { ToolsApi } from '@helpers/request'
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

const Herramienta = (props) => {
  const eventID = props.event._id
  const locationState = props.location.state //si viene new o edit en el state, si es edit es un id
  const history = useHistory()
  const [herramienta, setHerramienta] = useState({})

  useEffect(() => {
    if (locationState.edit) {
      getOne()
    }
  }, [])

  const getOne = async () => {
    const response = await ToolsApi.getOne(locationState.edit, eventID)
    const data = response.data.find(
      (herramientas) => herramientas._id === locationState.edit,
    )
    setHerramienta(data)
  }

  const onSubmit = async () => {
    if (herramienta.name) {
      StateMessage.show(
        'loading',
        'loading',
        'Por favor espere mientras se guarda la información...',
      )

      try {
        if (locationState.edit) {
          const resp = await ToolsApi.editOne(herramienta, locationState.edit, eventID)
          console.log('resp', resp)
        } else {
          const resp = await ToolsApi.create(herramienta, eventID)
          console.log('resp', resp)
        }
        StateMessage.destroy('loading')
        StateMessage.show(null, 'success', 'Información guardada correctamente!')
        history.push(`${props.parentUrl}/herramientas`)
      } catch (e) {
        StateMessage.destroy('loading')
        StateMessage.show(null, 'error', handleRequestError(e).message)
      }
    } else {
      StateMessage.show(null, 'error', 'El nombre es requerido')
    }
  }

  const handleChangeName = (e) => {
    setHerramienta({ ...herramienta, name: e.target.value })
  }

  const handleChangeLink = (e) => {
    console.log('Se ejecuta esto')
    setHerramienta({ ...herramienta, link: e.target.value })
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
              await ToolsApi.deleteOne(locationState.edit, eventID)
              StateMessage.destroy('loading')
              StateMessage.show(
                null,
                'success',
                'Se eliminó la información correctamente!',
              )
              history.push(`${props.parentUrl}/herramientas`)
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
        title="Herramienta"
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
              value={herramienta.name}
              name="name"
              placeholder="Nombre de la herramienta"
              onChange={(e) => handleChangeName(e)}
            />
          </Form.Item>

          <Form.Item
            label={
              <label style={{ marginTop: '2%' }} className="label">
                Enlace (Opcional)
              </label>
            }
          >
            <Input
              value={herramienta.link}
              name="link"
              placeholder="Link de la herramienta"
              onChange={(e) => handleChangeLink(e)}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}

export default Herramienta
