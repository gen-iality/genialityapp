import dayjs, { Dayjs } from 'dayjs'

import { Card, Col, Form, FormInstance, Row, Space, TimePicker, Typography } from 'antd'

import {
  Select,
  Input,
  InputNumber,
} from 'antd'

import * as React from 'react';
import { FunctionComponent, useEffect, useState } from 'react';
import { CategoriesAgendaApi, ModulesApi, SpacesApi, SpeakersApi, ToolsApi } from '@helpers/request';
import AgendaType from '@Utilities/types/AgendaType';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import EviusReactQuill from '@components/shared/eviusReactQuill';
import ImageUploaderDragAndDrop from '@components/imageUploaderDragAndDrop/imageUploaderDragAndDrop';
import { DispatchMessageService } from '@context/MessageService';
import BackTop from '@antdComponents/BackTop';

export interface FormValues {
  name: string,
  module_id: string,
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
}

interface IAgendaFormProps {
  form: FormInstance<FormValues>,
  activityId?: string,
  event?: any,
  agenda?: AgendaType,
}

const AgendaForm: FunctionComponent<IAgendaFormProps> = (props) => {
  const [allDays, setAllDays] = useState<any[]>([])
  const [allModules, setAllModules] = useState<any[]>([])
  const [allHosts, setAllHosts] = useState<any[]>([])
  const [allSpaces, setAllSpaces] = useState<any[]>([])
  const [allCategories, setAllCategories] = useState<any[]>([])
  const [allTools, setAllTools] = useState<any[]>([])

  const handleImageChange = (file: any) => {
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: 'Por favor espere mientras carga la imagen...',
      action: 'show',
    });
    props.form.setFieldsValue({image: file})
  };

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
        {props.activityId && (
          <>Aquí va el componente que selecciona el tipo de contenido</>
        )}
      </Col>
      <Col span={20}>
        <Form.Item
          label="Nombre"
          name="name"
          rules={[{ required: true, message: 'Nombre de la lección requerida' }]}
        >
          <Input autoFocus placeholder="Nombre de la lección" />
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
              rules={[{ required: true, message: 'La hora de inicio es requerida' }]}
            >
              <TimePicker use12Hours format="h:mm a" allowClear={false} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Hora fin"
              name="hour_end"
              rules={[{ required: true, message: 'La hora final es requerida' }]}
            >
              <TimePicker use12Hours format="h:mm a" allowClear={false} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          label="Herramientas"
          name="tool_ids"
        >
          <Select
            options={allTools}
            mode="multiple"
          />
        </Form.Item>
        <Form.Item
          label="Conferencias"
          name="host_ids"
        >
          <Select
            options={allHosts}
            mode="multiple"
          />
        </Form.Item>
        <Form.Item
          label="Espacios"
          name="space_id"
        >
          <Select
            options={[
              { label: 'Seleccionar', value: null },
              ...allSpaces,
            ]}
          />
        </Form.Item>
        <Form.Item
          label="Categorías"
          name="activity_categories_ids"
        >
          <Select
            options={allCategories}
            mode="multiple"
          />
        </Form.Item>
        <Form.Item
          label="Descripción"
          name="description"
        >
          <Space>
            <ExclamationCircleOutlined style={{ color: '#faad14' }} />
            <Typography.Text type="secondary">Esta información no es visible en la Agenda/Lección en versión Mobile.</Typography.Text>
          </Space>
          {/* <EviusReactQuill /> */}
        </Form.Item>
        <Form.Item
          label="Imagen"
          name="image"
        >
          <Card style={{ textAlign: 'center', borderRadius: '20px' }}>
            <Form.Item noStyle>
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
              <ImageUploaderDragAndDrop
                imageDataCallBack={handleImageChange}
                imageUrl={props.form.getFieldValue('image')}
                width="1080"
                height="1080"
              />
            </Form.Item>
          </Card>
        </Form.Item>
        <BackTop />
      </Col>
    </Row>
  );
};

export default AgendaForm;
