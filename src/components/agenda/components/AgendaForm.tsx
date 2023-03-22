import dayjs, { Dayjs } from 'dayjs'

import { Button, Card, Col, Form, FormInstance, InputRef, Modal, Row, Space, Switch, TimePicker, Typography } from 'antd'

import {
  Select,
  Input,
  InputNumber,
} from 'antd'

import * as React from 'react'
import { FunctionComponent, useCallback, useEffect, useRef, useState } from 'react'
import { CategoriesAgendaApi, ModulesApi, SpacesApi, SpeakersApi, ToolsApi } from '@helpers/request'
import AgendaType from '@Utilities/types/AgendaType'
import { ExclamationCircleOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons'
import EviusReactQuill from '@components/shared/eviusReactQuill'
import ImageUploaderDragAndDrop from '@components/imageUploaderDragAndDrop/imageUploaderDragAndDrop'
import { DispatchMessageService } from '@context/MessageService'
import BackTop from '@antdComponents/BackTop'
import ActivityTypeSelector from '../activityType/ActivityTypeSelector'

import { hourWithAdditionalMinutes } from '../hooks/useHourWithAdditionalMinutes'
import Speaker from '@components/speakers/speaker'
import { Link, useHistory } from 'react-router-dom'

export interface FormValues {
  name: string,
  module_id: string,
  is_info_only?: boolean,
  datetime_start: string, // real
  datetime_end: string, // real
  date: string, // clone
  hour_start: Dayjs,
  hour_end: Dayjs,
  tool_ids: string[],
  host_ids: string[],
  space_id: string,
  activity_categories_ids: string[],
  description: string,
  image?: string,
  vimeo_id?: string,
  selected_document: string[],
}

interface IAgendaFormProps {
  form: FormInstance<FormValues>,
  matchUrl?: string,
  activityId?: string,
  event?: any,
  agenda?: AgendaType | null,
}

const AgendaForm: FunctionComponent<IAgendaFormProps> = (props) => {
  const [allDays, setAllDays] = useState<any[]>([])
  const [allModules, setAllModules] = useState<any[]>([])
  const [allHosts, setAllHosts] = useState<any[]>([])
  const [allSpaces, setAllSpaces] = useState<any[]>([])
  const [allCategories, setAllCategories] = useState<any[]>([])
  const [allTools, setAllTools] = useState<any[]>([])

  const [isFocused, setIsFocused] = useState(false)

  const [isSpeakerModalOpened, setIsSpeakerModalOpened] = useState(false)

  const ref = useRef<InputRef>(null)
  const history = useHistory()

  const goSection = useCallback((path: string, state?: any) => {
    history.push(path, state);
  }, [])

  useEffect(() => {
    if (ref.current && !isFocused) {
      ref.current.focus()
      setIsFocused(true)
      window.scrollTo(0, 0)
    }
  }, [ref.current, isFocused])

  useEffect(() => {
    if (!props.event?._id) return

    console.log('agenda:', props.agenda)

    const eventId = props.event._id

    if (props.agenda) {
      // Parse the date to get start and end hours
      const date = dayjs(props.agenda.datetime_end).format('YYYY-MM-DD')
      const hour_start = dayjs(props.agenda.datetime_start)
      const hour_end = dayjs(props.agenda.datetime_end)
      props.form.setFieldsValue({
        date, hour_end, hour_start,
      })      
    }

    // If dates exist, then iterate the specific dates array, formating specially.
    if (props.event.dates && props.event.dates.length > 0) {
      const newDays = props.event.dates.map((dates: any) => {
        const formatDate = dayjs(dates, ['YYYY-MM-DD']).format('YYYY-MM-DD')
        return {
          value: formatDate,
          label: formatDate,
        }
      })
      setAllDays(newDays)
    } else {
      // If else, take the start date and the end date and format it
      const initMoment = dayjs(props.event.date_start)
      const endMoment = dayjs(props.event.date_end)
      const dayDiff = endMoment.diff(initMoment, 'days')
      // Convert all days between this range
      const newDays: any[] = []
      for (let i = 0; i < dayDiff + 1; i++) {
        const formatDate = dayjs(initMoment)
          .add(i, 'd')
          .format('YYYY-MM-DD')
        newDays.push({ value: formatDate, label: formatDate })
      }
      setAllDays(newDays)
    }

    ModulesApi.byEvent(eventId).then((modules) => {
      setAllModules(modules)
    })

    SpeakersApi.byEvent(eventId).then((speakers) => {
      setAllHosts(speakers.map((speaker: any) => (
        { label: speaker.name, value: speaker._id }
      )))
    })

    SpacesApi.byEvent(eventId).then((spaces) => {
      setAllSpaces(spaces.map((space: any) => (
        { label: space.name, value: space._id }
      )))
    })

    ToolsApi.byEvent(eventId).then((tools) => {
      setAllTools(tools.map((tool: any) => (
        { label: tool.name, value: tool._id }
      )))
    })

    CategoriesAgendaApi.byEvent(eventId).then((categories) => {
      setAllCategories(categories.map((category: any) => (
        { label: category.name, value: category._id }
      )))
    })
  }, [])

  return (
    <Row justify="center" wrap gutter={12}>
      <Col span={20}>
        {props.activityId && <ActivityTypeSelector />}
      </Col>
      <Col span={20}>
        <Form.Item
          label="Nombre"
          name="name"
          rules={[{ required: true, message: 'Nombre de la lección requerida' }]}
        >
          <Input autoFocus ref={ref} placeholder="Nombre de la lección" />
        </Form.Item>
        <Form.Item
          label="Módulo (opcional)"
          name="module_id"
        >
          <Select
            options={[
              { label: 'Seleccionar...', value: null },
              ...allModules.map((module) => ({
                label: module.module_name,
                value: module._id,
              })),
            ]}
            placeholder="Seleccionar..."
          />
        </Form.Item>

        <Form.Item
          label="¿Actividad informativa (opcional)?"
          name="is_info_only"
          valuePropName="checked"
        >
          <Switch
            checkedChildren="Informativa"
            unCheckedChildren="Normal"
          />
        </Form.Item>

        <Form.Item
          label="Día"
          name="date"
          initialValue={`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`}
          rules={[{ required: true, message: 'La fecha es requerida' }]}
        >
          <Select
            options={allDays}
          />
        </Form.Item>
        <Row wrap justify="center" gutter={[8, 8]}>
          <Col span={12}>
            <Form.Item
              label="Hora inicio"
              name="hour_start"
              initialValue={hourWithAdditionalMinutes(0)}
              rules={[{ required: true, message: 'La hora de inicio es requerida' }]}
            >
              <TimePicker use12Hours format="h:mm a" allowClear={false} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Hora fin"
              name="hour_end"
              initialValue={hourWithAdditionalMinutes(19)}
              rules={[{ required: true, message: 'La hora final es requerida' }]}
            >
              <TimePicker use12Hours format="h:mm a" allowClear={false} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="Herramientas">
          <Row wrap gutter={[8, 8]}>
            <Col span={23}>
              <Form.Item name="tool_ids">
                <Select
                  options={allTools}
                  mode="multiple"
                />
              </Form.Item>
            </Col>
            <Col span={1}>
              {props.matchUrl && <Link to={props.matchUrl.replace('agenda', 'herramientas')}
            >
                <Button icon={<SettingOutlined />} />
              </Link>}
            </Col>
          </Row>
        </Form.Item>
        <Form.Item label="Conferencistas">
          <Row wrap gutter={[8, 8]}>
            <Col span={22}>
              <Form.Item name="host_ids">
                <Select options={allHosts} mode="multiple" />
              </Form.Item>
            </Col>
            <Col span={1}>
              <Button
                onClick={() => setIsSpeakerModalOpened(true)}
                title="Agregar conferencista"
                icon={<PlusOutlined />}
              />
            </Col>
            <Col span={1}>
              <Button
                onClick={() => props.matchUrl && goSection(props.matchUrl.replace('agenda', 'speakers'), { child: true })}
                icon={<SettingOutlined />}
                title="Configurar en otra página"
              />
            </Col>
            {/* The speaker modal */}
            <Modal
              visible={isSpeakerModalOpened}
              onCancel={() => setIsSpeakerModalOpened(false)}
              okButtonProps={{ disabled: true }}
            >
              <Speaker
                eventID={props.event._id}
                matchUrl={props.matchUrl}
                onCreated={() => {
                  const loading = async () => {
                    const incommingHosts = await SpeakersApi.byEvent(props.event._id)
                    setAllHosts(incommingHosts.map((host: any) => ({
                      value: host._id,
                      label: host.name,
                    })))
                  };
                  loading().then(() => console.log('hosts reloaded'))
                  setIsSpeakerModalOpened(false);
                }}
                justCreate
              />
            </Modal>
          </Row>
        </Form.Item>

        <Form.Item label="Espacios">
          <Row wrap gutter={[8, 8]}>
            <Col span={23}>
              <Form.Item name="space_id">
                <Select
                  options={[
                    { label: 'Seleccionar', value: null },
                    ...allSpaces,
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={1}>
              {props.matchUrl && <Link to={props.matchUrl.replace('agenda', 'espacios')}
            >
                <Button icon={<SettingOutlined />} />
              </Link>}
            </Col>
          </Row>
        </Form.Item>

        <Form.Item label="Categorías">
          <Row wrap gutter={[8, 8]}>
            <Col span={23}>
              <Form.Item name="activity_categories_ids">
                <Select
                  options={allCategories}
                  mode="multiple"
                />
              </Form.Item>
            </Col>
            <Col span={1}>
              <Button onClick={() => goSection(`${props.matchUrl}/categorias`)} icon={<SettingOutlined />} />
            </Col>
          </Row>
        </Form.Item>

        <Form.Item
          label="Descripción"
          name="description"
          getValueProps={(value) => ({
            data: value || '',
            handleChange: (description: string) => {
              props.form.setFieldsValue({ description })
            },
          })}
          extra={(
            <Space>
              <ExclamationCircleOutlined style={{ color: '#faad14' }} />
              <Typography.Text type="secondary">Esta información no es visible en la Agenda/Lección en versión Mobile.</Typography.Text>
            </Space>
          )}
        >
          {/*
          If THERE IS problem with this component, comment `getValueProps` at
          the `Form.Item` component, and uncomment the next commented code, please
          */}
          <EviusReactQuill
            // handleChange={(description: string) => {
            //   props.form.setFieldsValue({ description })
            // }}
            // data={props.form.getFieldValue('description') || ''}
          />
        </Form.Item>
        <Form.Item label="Imagen">
          <Card style={{ textAlign: 'center', borderRadius: '20px' }}>
            <p>
              Dimensiones:
              {' '}
              <b>
                <small>600px X 400px, 400px X 600px, 200px X 200px, 400px X 400px ...</small>
              </b>{' '}
            </p>
            <p>
              <small>
                Se recomienda que la imagen debe tener dimensiones iguales (cuadradas) para su mejor
                funcionamiento
              </small>
            </p>
            <p>
              <small>La imagen tarda unos segundos en cargar</small>
            </p>
            <Form.Item
              noStyle
              name="image"
              getValueProps={(value) => ({
                imageUrl: value,
                imageDataCallBack: (image: string) => {
                  DispatchMessageService({
                    type: 'loading',
                    key: 'loading',
                    msj: 'Por favor espere mientras carga la imagen...',
                    action: 'show',
                  })
                  props.form.setFieldsValue({ image })
                },
              })}
            >
              <ImageUploaderDragAndDrop
                // imageDataCallBack={handleImageChange}
                // imageUrl={props.form.getFieldValue('image')}
                width="1080"
                height="1080"
              />
            </Form.Item>
          </Card>
        </Form.Item>
        <BackTop />
      </Col>
    </Row>
  )
}

export default AgendaForm
