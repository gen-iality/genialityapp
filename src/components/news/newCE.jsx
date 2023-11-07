import { useState, useEffect } from 'react'
import { NewsFeed } from '@helpers/request'
import { handleRequestError } from '@helpers/utils'
import { Col, Row, Input, Form, DatePicker, Modal } from 'antd'

import dayjs from 'dayjs'

import Header from '@antdComponents/Header'
import BackTop from '@antdComponents/BackTop'
import { useNavigate } from 'react-router-dom'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import EviusReactQuill from '../shared/eviusReactQuill'
import { StateMessage } from '@context/MessageService'
import ImageUploaderDragAndDrop from '../imageUploaderDragAndDrop/imageUploaderDragAndDrop'
import Loading from '../profile/loading'

const { confirm } = Modal

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
}

const NewCE = (props) => {
  const navigate = useNavigate()
  const locationState = props.location.state
  const [notice, setNotice] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (locationState.edit) {
      getNew()
    }
  }, [])

  const getNew = async () => {
    const data = await NewsFeed.getOne(props.eventId, locationState.edit)
    setNotice(data)
    setIsLoading(false)
  }

  const handleChange = (e) => {
    const { name } = e.target
    const { value } = e.target
    setNotice({
      ...notice,
      [name]: value,
    })
  }

  const changeDescription = (e, name) => {
    if (notice) {
      setNotice({
        ...notice,
        [name]: e,
      })
    }
  }

  const handleImage = (imageUrl) => {
    setNotice({
      ...notice,
      image: imageUrl,
    })
  }

  const onChangeDate = (date, dateString) => {
    setNotice({ ...notice, time: date })
  }

  const onSubmit = async () => {
    const values = {}
    if (notice.title === '' || !notice.title) {
      StateMessage.show(null, 'error', 'El título es requerido')
      values.title = false
    } else {
      values.title = true
    }
    if (
      notice.description_complete === '' ||
      notice.description_complete === '<p><br></p>' ||
      !notice.description_complete
    ) {
      StateMessage.show(null, 'error', 'La noticia es requerida')
      values.description_complete = false
    } else {
      values.description_complete = true
    }
    if (
      notice.description_short === '' ||
      notice.description_short === '<p><br></p>' ||
      !notice.description_short
    ) {
      StateMessage.show(null, 'error', 'El subtítulo es requerido')
      values.description_short = false
    } else {
      values.description_short = true
    }
    if (notice.image === null || !notice.image) {
      StateMessage.show(null, 'error', 'La imagen es requerida')
      values.image = false
    } else {
      values.image = true
    }
    if (notice.fecha === null && notice.fecha !== '' && !notice.fecha) {
      StateMessage.show(null, 'error', 'La fecha es requerida')
      values.fecha = false
    } else {
      values.fecha = true
    }

    if (
      values &&
      values.title &&
      values.description_complete &&
      values.description_short &&
      values.image &&
      values.fecha
    ) {
      StateMessage.show(
        'loading',
        'loading',
        ' Por favor espere mientras se guarda la información...',
      )

      try {
        if (locationState.edit) {
          await NewsFeed.editOne(notice, locationState.edit, props.eventId)
        } else {
          await NewsFeed.create(notice, props.eventId)
        }

        StateMessage.destroy('loading')
        StateMessage.show(null, 'success', 'Información guardada correctamente!')
        navigate(`${props.match.url}`)
      } catch (e) {
        StateMessage.destroy('loading')
        StateMessage.show(null, 'error', handleRequestError(e).message)
      }
    }
  }

  const remove = () => {
    StateMessage.show(
      'loading',
      'loading',
      ' Por favor espere mientras se borra la información...',
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
              await NewsFeed.deleteOne(locationState.edit, props.eventId)
              StateMessage.destroy('loading')
              StateMessage.show(
                null,
                'success',
                'Se eliminó la información correctamente!',
              )
              navigate(`${props.match.url}`)
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
    <Form onFinish={onSubmit} {...formLayout} initialValues={notice}>
      <Header title="Noticia" back save form edit={locationState?.edit} remove={remove} />

      <Row justify="center" wrap gutter={12}>
        {locationState.edit && isLoading ? (
          <Loading />
        ) : (
          <Col span={16}>
            <Form.Item
              label={
                <label style={{ marginTop: '2%' }}>
                  Título <label style={{ color: 'red' }}>*</label>
                </label>
              }
              rules={[{ required: true, message: 'El título es requerido' }]}
            >
              <Input
                name="title"
                value={notice && notice.title}
                placeholder="Título de la noticia"
                onChange={(e) => handleChange(e)}
              />
            </Form.Item>

            <Form.Item
              label={
                <label style={{ marginTop: '2%' }}>
                  Subtítulo <label style={{ color: 'red' }}>*</label>
                </label>
              }
              rules={[{ required: true, message: 'El subtítulo es requerido' }]}
            >
              <EviusReactQuill
                id="description_short"
                name="description_short"
                data={notice && notice.description_short ? notice.description_short : ''}
                handleChange={(e) => changeDescription(e, 'description_short')}
              />
            </Form.Item>

            <Form.Item
              label={
                <label style={{ marginTop: '2%' }}>
                  Noticia <label style={{ color: 'red' }}>*</label>
                </label>
              }
              rules={[{ required: true, message: 'La noticia es requerida' }]}
            >
              <EviusReactQuill
                id="description_complete"
                name="description_complete"
                data={(notice && notice.description_complete) || ''}
                handleChange={(e) => changeDescription(e, 'description_complete')}
              />
            </Form.Item>

            <Form.Item
              label={
                <label style={{ marginTop: '2%' }}>
                  Imagen <label style={{ color: 'red' }}>*</label>
                </label>
              }
              rules={[{ required: true, message: 'La imagen es requerida' }]}
            >
              <Form.Item noStyle>
                <ImageUploaderDragAndDrop
                  imageDataCallBack={handleImage}
                  imageUrl={notice && notice?.image}
                  width="1080"
                  height="1080"
                />
              </Form.Item>
            </Form.Item>

            <Form.Item label="Link del video">
              <Input
                name="linkYoutube"
                value={notice && notice.linkYoutube}
                type="url"
                placeholder="www.video.com"
                onChange={(e) => handleChange(e)}
              />
            </Form.Item>

            <Form.Item label="Fecha">
              <DatePicker
                name="time"
                format="YYYY-DD-MM"
                value={notice && dayjs(notice.time)}
                onChange={onChangeDate}
              />
            </Form.Item>
          </Col>
        )}
      </Row>
      <BackTop />
    </Form>
  )
}

export default NewCE
