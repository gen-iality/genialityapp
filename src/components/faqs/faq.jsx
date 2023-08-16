import { useEffect, useState } from 'react'
import { FaqsApi } from '@helpers/request'
import { useNavigate, useLocation } from 'react-router-dom'
import { toolbarEditor } from '@helpers/constants'
import { handleRequestError } from '@helpers/utils'
import { Row, Col, Form, Input, Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import Header from '@antdComponents/Header'
import ReactQuill from 'react-quill'
import { StateMessage } from '@context/MessageService'

const { confirm } = Modal

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
}

const Faq = (props) => {
  const eventID = props.event?._id

  const location = useLocation()
  const locationState = location.state //si viene new o edit en el state, si es edit es un id
  const navigate = useNavigate()
  const [faq, setFaq] = useState({})

  useEffect(() => {
    if (locationState?.edit) {
      getOne()
    }
  }, [locationState?.edit])

  const getOne = async () => {
    const response = await FaqsApi.getOne(locationState?.edit, eventID)
    const data = response.data.find((faqs) => faqs._id === locationState?.edit)

    setFaq(data)
    setFaq(data) //este esta repedito para poder cargar el titulo en caso de que tenga contenido, con uno solo no se porque no vuelve a cargar
    // if (data.content === '<p><br></p>') {
    //   setFaq({ content: '', title: data.title });
    // }
  }

  const onSubmit = async () => {
    if (faq.content && faq.title) {
      StateMessage.show(
        'loading',
        'loading',
        ' Por favor espere mientras se guarda la información...',
      )

      try {
        if (locationState?.edit) {
          await FaqsApi.editOne(faq, locationState?.edit, eventID)
        } else {
          await FaqsApi.create(faq, eventID)
        }
        StateMessage.destroy('loading')
        StateMessage.show(null, 'success', 'Información guardada correctamente!')
        navigate('../faqs')
      } catch (e) {
        StateMessage.destroy('loading')
        StateMessage.show(null, 'error', handleRequestError(e).message)
      }
    } else {
      StateMessage.show(null, 'error', 'El título y contenido son requeridos')
    }
  }

  const handleChange = (e) => {
    setFaq({ ...faq, title: e.target.value })
  }

  const onRemoveId = () => {
    StateMessage.show(
      'loading',
      'loading',
      ' Por favor espere mientras se borra la información...',
    )
    if (locationState?.edit) {
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
              await FaqsApi.deleteOne(locationState?.edit, eventID)
              StateMessage.destroy('loading')
              StateMessage.show(
                null,
                'success',
                'Se eliminó la información correctamente!',
              )
              navigate('../faqs')
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

  const HandleQuillEditorChange = (contents) => {
    let content = contents
    if (content === '<p><br></p>') {
      content = ''
    }
    if (faq) {
      setFaq({ ...faq, content: content })
    }
  }

  return (
    <Form onFinish={onSubmit} {...formLayout}>
      <Header
        title="Pregunta frecuente"
        back
        save
        form
        remove={onRemoveId}
        edit={locationState?.edit}
      />

      <Row justify="center" wrap gutter={12}>
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
              value={faq && faq.title}
              name="title"
              placeholder="Título de la pregunta frecuente"
              onChange={(e) => handleChange(e)}
            />
          </Form.Item>
          <Form.Item
            label={
              <label style={{ marginTop: '2%' }} className="label">
                Contenido <label style={{ color: 'red' }}>*</label>
              </label>
            }
            rules={[{ required: true, message: 'El contenido es requerido' }]}
          >
            <ReactQuill
              id="faqContent"
              value={(faq && faq.content) || ''}
              name="content"
              onChange={HandleQuillEditorChange}
              modules={toolbarEditor}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}

export default Faq
