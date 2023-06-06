import { useState, useEffect } from 'react'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Row, Input, Form, Col, Modal } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { EventsApi } from '@helpers/request'
import Header from '@antdComponents/Header'
import BackTop from '@antdComponents/BackTop'
import EviusReactQuill from '../shared/eviusReactQuill'
import { handleRequestError } from '@helpers/utils'
import { StateMessage } from '@context/MessageService'
import ImageUploaderDragAndDrop from '../imageUploaderDragAndDrop/imageUploaderDragAndDrop'
import { removeObjectFromArray, renderTypeImage } from '@Utilities/imgUtils'
import Loading from '../profile/loading'

export const toolbarEditor = {
  toolbar: [
    [{ font: [] }],
    [{ header: [0, 1, 2, 3] }],
    [{ size: [] }],
    [{ align: [] }],
    [{ syntax: true }],
    ['bold', 'italic', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
  ],
}

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
}

const { confirm } = Modal

function AddProduct(props) {
  const [product, setProduct] = useState()
  const [name, setName] = useState('')
  const [creator, setCreator] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [picture, setPicture] = useState(null)
  const [optionalPicture, setOptionalPicture] = useState(null)
  const [imageFile, setImgFile] = useState([])
  const [error, setError] = useState(null)
  const [idNew, setIdNew] = useState()
  const [isLoading, setIsLoading] = useState(true)

  const params = useParams()
  const history = useHistory()

  useEffect(() => {
    if (params.id) {
      setIdNew(params.id)
      EventsApi.getOneProduct(props.eventId, params.id).then((product) => {
        setProduct(product)
        setName(product.name)
        setCreator(product.by)
        setDescription(product.description || '')
        setPicture(product.image && product.image[0] ? product.image[0] : null)
        setImgFile([
          { name: 'Imagen', file: product.image[0] },
          { name: 'img_optional', file: product.image[1] },
        ])
        setOptionalPicture(product.image && product.image[1] ? product.image[1] : null)
        setPrice(product.price)
        setIsLoading(false)
      })
    }
  }, [params.id])

  const goBack = () => history.goBack()

  const changeInput = (e, key) => {
    if (key === 'name') {
      setName(e.target.value)
    } else if (key === 'price') {
      setPrice(e.target.value)
    } else if (key === 'creator') {
      setCreator(e.target.value)
    }
  }

  const changeDescription = (e) => {
    if (description.length < 10000) {
      setDescription(e)
    } else {
    }
  }

  const changeImg = (file, name) => {
    let temp = imageFile
    const ImagenSearch = imageFile.filter((img) => img.name === name)
    if (ImagenSearch.length > 0) {
      const newtemp = imageFile.filter((img) => img.name !== name)
      temp = newtemp
      temp.push({ name, file })
      setImgFile(temp)
      return
    }

    if (file) {
      temp.push({ name, file })
      setImgFile(temp)
    } else {
      removeObjectFromArray(name, temp, setImgFile)
      temp.push({ name, file: '' })
    }
  }

  const saveProduct = async () => {
    StateMessage.show(
      'loading',
      'loading',
      ' Por favor espere mientras se guarda la información...',
    )

    const validators = {}
    validators.price = false
    validators.creator = false

    if (name === '') {
      validators.name = true
    } else {
      validators.name = false
    }
    if (description === '') {
      validators.description = true
    } else {
      validators.description = false
    }
    // if (picture === null) {
    //   validators.picture = true;
    // } else {
    //   validators.picture = false;
    // }
    const ImagenFilled = imageFile.filter((img) => img.name === 'Imagen')
    if (ImagenFilled.length === 0) {
      validators.picture = true
    } else {
      validators.picture = false
    }

    setError(validators)
    if (
      validators &&
      validators.name == false &&
      validators.creator == false &&
      validators.description == false &&
      validators.picture == false &&
      validators.price == false
    ) {
      try {
        if (idNew !== undefined) {
          const resp = await EventsApi.editProduct(
            {
              name,
              by: creator,
              description,
              price,
              image: [
                renderTypeImage('Imagen', imageFile),
                renderTypeImage('img_optional', imageFile),
              ],
            },
            props.eventId,
            product._id,
          )
          if (resp) {
            history.push(`/eventadmin/${props.eventId}/product`)
          }
        } else {
          const newProduct = await EventsApi.createProducts(
            {
              name,
              by: creator,
              description,
              price,
              image: [
                renderTypeImage('Imagen', imageFile),
                renderTypeImage('img_optional', imageFile),
              ],
            },
            props.eventId,
          )
          if (newProduct) {
            history.push(`/eventadmin/${props.eventId}/product`)
          }
        }
        StateMessage.destroy('loading')
        StateMessage.show(null, 'success', 'Información guardada correctamente!')
      } catch (e) {
        e
        StateMessage.destroy('loading')
        StateMessage.show(null, 'error', e)
      }
    } else {
      console.log('algo fallo', validators)
    }
  }

  const remove = () => {
    StateMessage.show(
      'loading',
      'loading',
      ' Por favor espere mientras se borra la información...',
    )
    if (params.id) {
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
              await EventsApi.deleteProduct(params.id, props.eventId)
              StateMessage.destroy('loading')
              StateMessage.show(
                null,
                'success',
                'Se eliminó la información correctamente!',
              )
              goBack()
            } catch (e) {
              StateMessage.destroy('loading')
              StateMessage.show(null, 'error', handleRequestError(e)?.message)
            }
          }
          onHandlerRemove()
        },
      })
    }
  }

  return (
    <Form {...formLayout} onFinish={saveProduct}>
      <Header title="Producto" back save form edit={params.id} remove={remove} />
      <Row justify="center" wrap gutter={12}>
        {params.id && isLoading ? (
          <Loading />
        ) : (
          <Col span={16}>
            <Form.Item
              label={
                <label style={{ marginTop: '2%' }}>
                  Nombre del producto <label style={{ color: 'red' }}>*</label>
                </label>
              }
              rules={[{ required: true, message: 'Ingrese el nombre de la producto' }]}
            >
              <Input
                value={name}
                placeholder="Nombre del producto"
                name="name"
                onChange={(e) => changeInput(e, 'name')}
              />
              {error != null && error.name && (
                <small style={{ color: 'red' }}>
                  El nombre del producto es requerido
                </small>
              )}
            </Form.Item>
            <Form.Item
              label={<label style={{ marginTop: '2%' }}>Por</label>}
              rules={[{ required: false }]}
            >
              <Input
                value={creator}
                placeholder="Nombre del autor, creador o descripción corta"
                name="creator"
                onChange={(e) => changeInput(e, 'creator')}
              />
              {error != null && error.creator && (
                <small style={{ color: 'red' }}>Este campo es requerido</small>
              )}
            </Form.Item>
            <Form.Item
              label={
                <label style={{ marginTop: '2%' }}>
                  Descripción <label style={{ color: 'red' }}>*</label>
                </label>
              }
            >
              <EviusReactQuill
                data={description}
                id="descriptionProduct"
                handleChange={changeDescription}
              />
              {error != null && error.description && (
                <small style={{ color: 'red' }}>
                  La descripción del producto es requerida
                </small>
              )}
            </Form.Item>
            <Form.Item
              label={<label style={{ marginTop: '2%' }}>Valor</label>}
              rules={[{ required: false, message: 'Ingrese el valor del producto' }]}
            >
              <Input
                value={price}
                placeholder="Valor del producto"
                name="price"
                onChange={(e) => changeInput(e, 'price')}
              />{' '}
            </Form.Item>

            <label style={{ marginTop: '2%' }}>
              Imagen <label style={{ color: 'red' }}>*</label>
            </label>
            <ImageUploaderDragAndDrop
              imageDataCallBack={(file) => changeImg(file, 'Imagen')}
              imageUrl={picture}
              width="1080"
              height="1080"
            />

            {error != null && error.picture && (
              <small style={{ color: 'red' }}>La imagen es requerida</small>
            )}

            <label style={{ marginTop: '2%' }}>Imagen opcional</label>

            <ImageUploaderDragAndDrop
              imageDataCallBack={(file) => changeImg(file, 'img_optional')}
              imageUrl={optionalPicture}
              width="1080"
              height="1080"
            />
          </Col>
        )}
      </Row>
      <BackTop />
    </Form>
  )
}

export default AddProduct
