import { useEffect, useState } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { ChromePicker } from 'react-color'
import { CategoriesAgendaApi, TypesAgendaApi } from '@helpers/request'
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

const AgendaTypeCatCE = (props) => {
  const eventID = props.event._id
  const location = useLocation()
  const subject = location.pathname.split('/').slice(-1)[0]
  const apiURL =
    subject === 'addcategorias' || subject === 'editcategorias'
      ? CategoriesAgendaApi
      : TypesAgendaApi
  const navigate = useNavigate()
  const [categoryValues, setCategoryValues] = useState({})
  const [name, setName] = useState('')
  const [color, setColor] = useState('#000000')

  const locationState = location.state // If is coming from "new" or "edit" in the state, if "edit", then it is an ID

  useEffect(() => {
    if (locationState.edit) {
      getOne()
    }
  }, [])

  const getOne = async () => {
    const response = await apiURL.getOne(locationState.edit, eventID)
    setCategoryValues(response)
    setName(response.name)
    if (subject === 'addcategorias' || (subject === 'editcategorias' && response.color)) {
      setColor(response.color)
    }
  }

  const onSubmit = async () => {
    StateMessage.show(
      'loading',
      'loading',
      ' Por favor espere mientras se guarda la información..',
    )

    if (subject === 'addcategorias' || subject === 'editcategorias') {
      setCategoryValues({ name: name, color: color ? color : '#000000' })
    } else {
      setCategoryValues({ name: name })
    }
    try {
      if (Object.keys(categoryValues).length) {
        if (locationState.edit) {
          await apiURL.editOne(categoryValues, locationState.edit, eventID)
        } else {
          await apiURL.create(eventID, categoryValues)
        }

        StateMessage.destroy('loading')
        StateMessage.show(null, 'success', 'Información guardada correctamente!')
        navigate(
          `/${
            subject === 'addcategorias' || subject === 'editcategorias'
              ? 'categorias'
              : 'tipos'
          }`,
        )
      }
    } catch (e) {
      StateMessage.destroy('loading')
      StateMessage.show(null, 'error', handleRequestError(e).message)
    }
  }

  const handleChangeComplete = (color) => {
    setColor(color.hex)
  }

  const handleChange = (e) => {
    setName(e.target.value)
  }

  const onRemoveId = () => {
    StateMessage.show(
      'loading',
      'loading',
      ' Por favor espere mientras se borra la información...',
    )
    if (locationState.edit) {
      confirm({
        title: `¿Está seguro de eliminar la categoría?`,
        icon: <ExclamationCircleOutlined />,
        content: 'Una vez eliminado, no lo podrá recuperar',
        okText: 'Borrar',
        okType: 'danger',
        cancelText: 'Cancelar',
        onOk() {
          const onHandlerRemove = async () => {
            try {
              await apiURL.deleteOne(locationState.edit, eventID)
              StateMessage.destroy('loading')
              StateMessage.show(
                null,
                'success',
                'Se eliminó la información correctamente!',
              )
              navigate(
                `/${
                  subject === 'addcategorias' || subject === 'editcategorias'
                    ? 'categorias'
                    : 'tipos'
                }`,
              )
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
        title={`${
          subject === 'addcategorias' || subject === 'editcategorias'
            ? 'Categoría'
            : 'Tipo'
        }`}
        back
        save
        saveMethod={onSubmit}
        form
        remove={onRemoveId}
        edit={locationState.edit}
      />

      <Row justify="center" wrap gutter={12}>
        <Col>
          <Form.Item label="Nombre">
            <Input
              name="name"
              placeholder={`Nombre ${
                subject === 'addcategorias' || subject === 'editcategorias'
                  ? 'de la categoría'
                  : 'del tipo'
              }`}
              value={name}
              onChange={(e) => handleChange(e)}
            />
          </Form.Item>
          {subject === 'addcategorias' || subject === 'editcategorias' ? (
            <Form.Item label="Color">
              <ChromePicker color={color} onChange={handleChangeComplete} />
            </Form.Item>
          ) : null}
        </Col>
      </Row>
    </Form>
  )
}

export default AgendaTypeCatCE
