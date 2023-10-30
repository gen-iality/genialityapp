import { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react'

import { Col, Form, Input, Row, Select, TimePicker } from 'antd'
import { useNavigate } from 'react-router'
import { hourWithAdditionalMinutes } from './hooks/useHourWithAdditionalMinutes'
import useAvailableDaysFromEvent from './hooks/useAvailableDaysFromEvent'
import Header from '@antdComponents/Header'
import { StateMessage } from '@context/MessageService'
import { FormValues } from './components/AgendaForm'
import dayjs from 'dayjs'
import { AgendaApi } from '@helpers/request'
import AgendaType from '@Utilities/types/AgendaType'
import useActivityType from '@context/activityType/hooks/useActivityType'
import ActivityTypeModalLayout from './activityType/components/ActivityTypeModalLayout'
import ActivityTypeSelectableCards from './activityType/components/ActivityTypeSelectableCards'
import { ActivityType } from '@context/activityType/types/activityType'
import editActivityType from './activityType/utils/editActivityType'

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
}

interface IAgendaCreatorPageProps {
  event: any
}

const AgendaCreatorPage: FunctionComponent<IAgendaCreatorPageProps> = (props) => {
  const [currentAgenda, setCurrentAgenda] = useState<AgendaType | undefined>()
  const [selectedActivityType, setSelectedActivityType] =
    useState<ActivityType.Name | null>(null)

  const [form] = Form.useForm<FormValues>()
  const allDays = useAvailableDaysFromEvent(props.event)

  const navigate = useNavigate()

  const { formWidgetFlow } = useActivityType()

  const somethingWasSelected = useMemo(
    () => selectedActivityType !== null,
    [selectedActivityType],
  )

  const onWidgetChange = useCallback((widget: ActivityType.CardUI) => {
    // In this case, the keys are the same of the activity type value
    if (widget.key !== selectedActivityType) {
      console.debug('select activity type:', widget.key)
      setSelectedActivityType(widget.key as ActivityType.Name)
    } else {
      console.log('reset selected activity type')
      setSelectedActivityType(null)
    }
  }, [])

  const onFinish = useCallback(async (values: FormValues) => {
    console.log('submit', values, 'selected activity type:', selectedActivityType)

    // Fix the datetime values
    values.datetime_start = values.date + ' ' + dayjs(values.hour_start).format('HH:mm')
    values.datetime_end = values.date + ' ' + dayjs(values.hour_end).format('HH:mm')

    StateMessage.show(
      'loading',
      'loading',
      'Por favor espere mientras se guarda la información...',
    )

    const _agenda: AgendaType = await AgendaApi.create(props.event._id, values)
    setCurrentAgenda(_agenda)

    StateMessage.destroy('loading')

    StateMessage.show(null, 'success', 'Información guardada correctamente!')
  }, [])

  useEffect(() => {
    if (!currentAgenda?._id) {
      return
    }

    // Set activity type if it is defined
    ;(async () => {
      if (selectedActivityType) {
        await editActivityType(props.event._id, currentAgenda._id!, selectedActivityType)
      }
    })()
      .then(() => {
        console.debug('redirecting to /activity')
        navigate(`../${currentAgenda._id}`)
      })
      .catch((err) => {
        console.error(err)
        StateMessage.show(
          null,
          'error',
          'Algo salió mal, no se ha podido terminar de guardar - Vaya atrás',
        )
      })
  }, [currentAgenda, selectedActivityType])

  return (
    <Form form={form} onFinish={(values) => onFinish(values)} {...formLayout}>
      <Header
        back
        save
        form
        saveNameIcon
        customBack=".."
        title="Crea actividad"
        saveName="Crear"
      />
      <Row justify="center" wrap gutter={12}>
        <Col span={20}>
          <Form.Item
            label="Nombre"
            name="name"
            rules={[{ required: true, message: 'Nombre de la lección requerida' }]}
          >
            <Input autoFocus placeholder="Nombre de la lección" />
          </Form.Item>
          <Form.Item
            label="Día"
            name="date"
            initialValue={`${new Date().getFullYear()}-${
              new Date().getMonth() + 1
            }-${new Date().getDate()}`}
            rules={[{ required: true, message: 'La fecha es requerida' }]}
          >
            <Select options={allDays} />
          </Form.Item>
          <Row wrap justify="center" gutter={[8, 8]}>
            <Col span={12}>
              <Form.Item
                label="Hora inicio"
                name="hour_start"
                initialValue={hourWithAdditionalMinutes(0)}
                rules={[{ required: true, message: 'La hora de inicio es requerida' }]}
              >
                <TimePicker
                  use12Hours
                  format="h:mm a"
                  allowClear={false}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Hora fin"
                name="hour_end"
                initialValue={hourWithAdditionalMinutes(19)}
                rules={[{ required: true, message: 'La hora final es requerida' }]}
              >
                <TimePicker
                  use12Hours
                  format="h:mm a"
                  allowClear={false}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Col>
        <Col span={20}>
          <ActivityTypeModalLayout
            hideSelectButton
            somethingWasSelected={somethingWasSelected}
            title={formWidgetFlow.MainTitle}
            render={() => (
              <ActivityTypeSelectableCards
                selected={selectedActivityType}
                widget={formWidgetFlow}
                onWidgetChange={onWidgetChange}
              />
            )}
          />
        </Col>
      </Row>
    </Form>
  )
}

export default AgendaCreatorPage
