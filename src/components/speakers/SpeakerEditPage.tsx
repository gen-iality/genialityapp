import { ChangeEvent, FunctionComponent, useEffect, useState } from 'react'
import { redirect as redirectRouter, useNavigate, useLocation } from 'react-router-dom'
import EviusReactQuill from '../shared/eviusReactQuill'
import { fieldsSelect, handleRequestError, handleSelect } from '@helpers/utils'
import { CategoriesAgendaApi, EventsApi, SpeakersApi } from '@helpers/request'
import { Button, Row, Col, Form, Input, Switch, Modal, Tooltip, Select } from 'antd'
import {
  ExclamationCircleOutlined,
  PlusCircleOutlined,
  UpOutlined,
  EditOutlined,
} from '@ant-design/icons'
import Header from '@antdComponents/Header'
import BackTop from '@antdComponents/BackTop'
import { areaCode } from '@helpers/constants'
import { StateMessage } from '@context/MessageService'
import ImageUploaderDragAndDrop from '@components/imageUploaderDragAndDrop/imageUploaderDragAndDrop'
import Loading from '../profile/loading'

const { confirm } = Modal
const { Option } = Select

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
}

type SpeakerDataType = {
  name: string
  description: string
  description_activity: boolean
  profession: string
  published: boolean
  image: string | null
  order: number
  category_id: string
  index: number
  newItem: boolean
  phone?: any
}

interface ISpeakerEditPageProps {
  eventID: string
  justCreate?: boolean
  onCreated?: () => void
}

const SpeakerEditPage: FunctionComponent<ISpeakerEditPageProps> = (props) => {
  const { eventID, justCreate } = props

  const [data, setData] = useState<SpeakerDataType>({
    name: '',
    description: '',
    description_activity: false,
    profession: '',
    published: true,
    image: null,
    order: 0,
    category_id: '',
    index: 0,
    newItem: true,
  })
  const [showDescription_activity, setShowDescription_activity] = useState(false)
  const [redirect, setRedirect] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [selectedCategories, setSelectedCategories] = useState<any>([])
  const [isloadingSelect, setIsloadingSelect] = useState({
    types: true,
    categories: true,
  })
  const [event, setEvent] = useState<any>()
  const [areacodeselected, setAreacodeselected] = useState(57)
  const [editDataIsLoading, setEditDataIsLoading] = useState(true)

  const { state } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    dataTheLoaded()
  }, [])

  async function dataTheLoaded() {
    console.log('getting data to eventID:', eventID)
    let categoriesData = await CategoriesAgendaApi.byEvent(eventID)
    const event = await EventsApi.getOne(eventID)
    if (event) {
      setEvent(event)
    }

    //Filtrado de categorias
    categoriesData = handleSelect(categoriesData)

    if (state.edit && !justCreate) {
      setEditDataIsLoading(true)
      const info = await SpeakersApi.getOne(state.edit, eventID)

      info ? setData({ ...info, newItem: false }) : ''

      setShowDescription_activity(info?.description_activity)
      const field = fieldsSelect(info.category_id, categoriesData)

      setSelectedCategories(field)

      if (info.description === '<p><br></p>') {
        setData({
          ...data,
          description: '',
        })
      }
    }
    const isloadingSelectChanged = { types: false, categories: false }

    setCategories(categoriesData)
    setIsloadingSelect(isloadingSelectChanged)
    setEditDataIsLoading(false)
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setData({ ...data, [name]: value })
  }

  function changeDescriptionText(content: string) {
    let description = content
    if (description === '<p><br></p>') {
      description = ''
    }
    setData({ ...data, description })
  }

  async function handleImage(imageUrl: string) {
    setData({ ...data, image: imageUrl })
  }

  async function submit(values: any) {
    if (values.name) {
      StateMessage.show(
        'loading',
        'loading',
        'Por favor espere mientras guarda la información...',
      )

      const { name, profession, description, order, published, image } = values

      const body = {
        name,
        image,
        description_activity: showDescription_activity,
        description,
        profession,
        published,
        category_id: selectedCategories?.value,
        order: parseInt(order),
        index: parseInt(order),
      }
      try {
        if (state.edit && !justCreate)
          await SpeakersApi.editOne(body, state.edit, eventID)
        else await SpeakersApi.create(eventID, body)
        StateMessage.destroy('loading')
        StateMessage.show(null, 'success', 'Conferencista guardado correctamente!')
        if (!justCreate) navigate('..')
        else if (props.onCreated) props.onCreated()
      } catch (e) {
        StateMessage.destroy('loading')
        StateMessage.show(null, 'error', handleRequestError(e).message)
        /* if (handleRequestError(e).message === 'Speakers/host limit reached')
          setMessageHeaderAlert(handleRequestError(e).message); */
      }
    } else {
      StateMessage.show(null, 'error', 'El nombre es requerido')
    }
  }

  function remove() {
    StateMessage.show(
      'loading',
      'loading',
      'Por favor espere mientras se borra la información...',
    )
    if (state.edit && !justCreate) {
      confirm({
        title: `¿Está seguro de eliminar al conferencista?`,
        icon: <ExclamationCircleOutlined />,
        content: 'Una vez eliminado, no lo podrá recuperar',
        okText: 'Borrar',
        okType: 'danger',
        cancelText: 'Cancelar',
        onOk() {
          const onHandlerRemoveSpeaker = async () => {
            try {
              await SpeakersApi.deleteOne(state.edit, eventID)
              setRedirect(true)
              StateMessage.destroy('loading')
              StateMessage.show(
                null,
                'success',
                'Se eliminó al conferencista correctamente!',
              )
            } catch (e) {
              StateMessage.destroy('loading')
              StateMessage.show(null, 'error', handleRequestError(e).message)
            }
          }
          onHandlerRemoveSpeaker()
        },
      })
    } else setRedirect(true)
  }

  //FN para guardar en el estado la opcion seleccionada
  function selectCategory(selectedCategories: any) {
    setSelectedCategories(selectedCategories)
  }

  //FN para ir a una ruta específica (ruedas en los select)
  function goSection(path: string, state: any) {
    navigate(path, state)
  }

  const prefixSelector = (
    <Select
      showSearch
      optionFilterProp="children"
      style={{ fontSize: '12px', width: 150 }}
      value={areacodeselected}
      onChange={(val) => {
        setAreacodeselected(val)
        console.log(val)
      }}
      placeholder="Codigo de area del pais"
    >
      {areaCode.map((code, key) => {
        return (
          <Option key={key} value={code.value}>
            {`${code.label} (+${code.value})`}
          </Option>
        )
      })}
    </Select>
  )

  if (!state || redirect) return redirectRouter('..')

  return (
    <Form onFinish={() => submit(data)} {...formLayout}>
      <Header
        title={'Conferencistas' + (justCreate ? ' - crear nuevo' : '')}
        back
        save
        form
        edit={state.edit && !justCreate}
        remove={remove}
        extra={
          <Form.Item label="Visible" labelCol={{ span: 13 }}>
            <Switch
              checkedChildren="Sí"
              unCheckedChildren="No"
              checked={data.published}
              onChange={(checked) =>
                setData({
                  ...data,
                  published: checked,
                })
              }
            />
          </Form.Item>
        }
        /* messageHeaderAlert={messageHeaderAlert} */
      />

      <Row justify="center" wrap gutter={12}>
        {state.edit && !justCreate && editDataIsLoading ? (
          <Loading />
        ) : (
          <Col span={justCreate ? 22 : 12}>
            <Form.Item
              label={
                <label style={{ marginTop: '2%' }} className="label">
                  Nombre <label style={{ color: 'red' }}>*</label>
                </label>
              }
              rules={[{ required: true, message: 'El nombre es requerido' }]}
            >
              <Input
                value={data.name}
                placeholder="Nombre del conferencista"
                name="name"
                onChange={(e) => handleChange(e)}
              />
            </Form.Item>

            <Form.Item label="Ocupación">
              <Input
                value={data.profession}
                placeholder="Ocupación del conferencista"
                name="profession"
                onChange={(e) => handleChange(e)}
              />
            </Form.Item>
            <Form.Item label="Carga de imagen">
              <Form.Item noStyle>
                <ImageUploaderDragAndDrop
                  imageDataCallBack={handleImage}
                  imageUrl={data.image}
                  width="1080"
                  height="1080"
                />
              </Form.Item>
            </Form.Item>

            {event && event?.organizer?.type_event == 'Misiones' && (
              <Form.Item label="phone" name="phone">
                <Input
                  addonBefore={prefixSelector}
                  value={data?.phone || ''}
                  type="number"
                  key="tel"
                  style={{ width: '100%' }}
                  placeholder="Numero de telefono"
                />
              </Form.Item>
            )}

            <Form.Item label="Descripción">
              <>
                {!showDescription_activity ? (
                  <Button
                    id="btnDescription"
                    type="link"
                    onClick={() => setShowDescription_activity(true)}
                    style={{ color: 'blue' }}
                  >
                    {!showDescription_activity && !data.newItem ? (
                      <div>
                        {' '}
                        <EditOutlined style={{ marginRight: '5px' }} /> Editar/mostrar
                        descripción{' '}
                      </div>
                    ) : (
                      <div>
                        {' '}
                        <PlusCircleOutlined style={{ marginRight: '5px' }} />{' '}
                        Agregar/mostrar descripción{' '}
                      </div>
                    )}
                  </Button>
                ) : (
                  <Tooltip
                    placement="top"
                    text="Si oculta la infomación da a entender que no desea mostrar el contenido de la misma"
                  >
                    <Button
                      type="link"
                      onClick={() => setShowDescription_activity(false)}
                      style={{ color: 'blue' }}
                    >
                      <div>
                        <UpOutlined style={{ marginRight: '5px' }} />
                        Ocultar descripción{' '}
                      </div>
                    </Button>
                  </Tooltip>
                )}
              </>
              {showDescription_activity && (
                <EviusReactQuill
                  id="description"
                  name="description"
                  data={data.description}
                  handleChange={changeDescriptionText}
                  style={{ marginTop: '5px' }}
                />
              )}
            </Form.Item>
          </Col>
        )}
      </Row>
      <BackTop />
    </Form>
  )
}

//Estilos para el tipo
const dot = (color = 'transparent') => ({
  alignItems: 'center',
  display: 'flex',
  ':before': {
    backgroundColor: color,
    content: '" "',
    display: 'block',
    margin: 8,
    height: 10,
    width: 10,
  },
})

export default SpeakerEditPage
