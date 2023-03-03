import { useState, useEffect, useMemo } from 'react'
import { OrganizationApi, ToolsApi, PositionsApi } from '@helpers/request'
import { Modal, Row, Col, Form, Input, Select, Spin, FormInstance } from 'antd'
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { DispatchMessageService } from '@context/MessageService'
import Header from '@antdComponents/Header'
import { handleRequestError } from '@helpers/utils'

import Loading from '@components/loaders/loading'
import { PositionRequestType, PositionResponseType } from '@Utilities/types/PositionType'

const { confirm } = Modal

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
}

type PositionsFormFields = {
  position_name: string,
  event_ids: string[],
}

type PositionsFormModalHandler = {
  currentPosition?: PositionResponseType,
  open: (position?: PositionResponseType) => void,
  close: () => void,
  isOpened: boolean,
  isEditing: boolean,
  form: FormInstance<PositionsFormFields>,
}

function usePositionsFormModal(): PositionsFormModalHandler {
  const [isOpened, setIsOpened] = useState(false)

  const [currentPosition, setCurrentPosition] = useState<PositionResponseType | undefined>()

  const [form] = Form.useForm<PositionsFormFields>()

  const setValues = (position: PositionResponseType) => {
    console.debug('usePositionsFormModal.setValues:', position)
    setCurrentPosition(position)

    form.setFieldsValue({
      event_ids: position.event_ids,
      position_name: position.position_name,
    })
  }

  const clearValues = () => {
    console.debug('usePositionsFormModal.clearValues')
    setCurrentPosition(undefined)
    form.resetFields()
  }

  const open = (position?: PositionResponseType) => {
    if (position !== undefined) setValues(position)
    setIsOpened(true)
  }

  const close = () => {
    clearValues()
    setIsOpened(false)
  }

  const isEditing = useMemo(() => !!currentPosition, [currentPosition])

  const hookResult: PositionsFormModalHandler = {
    currentPosition,
    open,
    close,
    isOpened,
    isEditing,
    form,
  }

  return hookResult
}

export interface PositionsFormModalProps {
  organizationId: string,
  handler: PositionsFormModalHandler,
  onSubmit?: (position: PositionResponseType) => void,
}

function PositionsFormModal(props: PositionsFormModalProps) {
  const {
    handler,
    organizationId,
    onSubmit: onSubmitCallback,
  } = props

  const [possibleEvents, setPossibleEvents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Get all the events for this organization
  useEffect(() => {
    setIsLoading(true)
    OrganizationApi.events(organizationId)
      .then(({ data: events }) => {
        console.debug('PositionsFormModal.useEffect:events', events)
        setPossibleEvents(events)
      })
      .finally(() => setIsLoading(false))
  }, [organizationId])

  const onSubmit = async (values: PositionsFormFields) => {
    const data: PositionRequestType = {
      ...values,
      organization_id: organizationId,
    }

    try {
      let updatedPosition
      if (handler.currentPosition) {
        updatedPosition = handler.currentPosition
        await PositionsApi.update(handler.currentPosition._id, data)
      } else {
        updatedPosition = await PositionsApi.create(data)
      }

      DispatchMessageService({
        key: 'loading',
        action: 'destroy',
      })
      DispatchMessageService({
        type: 'success',
        msj: 'Información guardada correctamente!',
        action: 'show',
      })

      onSubmitCallback && onSubmitCallback(updatedPosition)
    } catch (e) {
      DispatchMessageService({
        key: 'loading',
        action: 'destroy',
      })
      DispatchMessageService({
        type: 'error',
        msj: handleRequestError(e).message,
        action: 'show',
      })
    } finally {
      handler.close()
    }
  }

  const onRemoveId = () => {
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: 'Por favor espere mientras se borra la información...',
      action: 'show',
    })
    if (handler.currentPosition) {
      confirm({
        title: `¿Está seguro de eliminar la información?`,
        icon: <ExclamationCircleOutlined />,
        content: 'Una vez eliminado, no lo podrá recuperar',
        okText: 'Borrar',
        okType: 'danger',
        cancelText: 'Cancelar',
        onOk: async () => {
          try {
            await PositionsApi.delete(handler.currentPosition!._id)
            DispatchMessageService({ key: 'loading', action: 'destroy' })
            DispatchMessageService({
              type: 'success',
              msj: 'Se eliminó la información correctamente!',
              action: 'show',
            })
          } catch (e) {
            DispatchMessageService({ key: 'loading', action: 'destroy' })
            DispatchMessageService({
              type: 'error',
              msj: handleRequestError(e).message,
              action: 'show',
            })
          } finally {
            handler.close()
          }
        },
      })
    }
  }

  return (
    <Modal
      closable
      footer={false}
      visible={handler.isOpened}
      onCancel={() => handler.close()}
    >
      {/**
      I am finding for a Loading component, but I get be lazy to find the Loading that
      has a circle and it's turning 🔄
      */}
      {isLoading ? (
          <Loading />
      ) : (
      <Form onFinish={onSubmit} {...formLayout} form={handler.form}>
        <Header title="Cargo" save form remove={onRemoveId} edit={!!handler.currentPosition} />

        <Row justify="center" wrap gutter={12}>
          <Col>
            <Form.Item
              initialValue={handler.currentPosition?.position_name}
              name="position_name"
              label="Nombre del cargo"
              rules={[{ required: true, message: 'El nombre es requerido' }]}
            >
              <Input placeholder="Nombre del cargo" />
            </Form.Item>

            <Form.Item
              initialValue={handler.currentPosition?.event_ids || []}
              name="event_ids"
              label="Cursos asignados"
            >
              <Select
                mode="multiple"
                placeholder="Asigna los cursos al cargo"
                options={(possibleEvents || []).map((event) => ({
                  value: event._id,
                  label: event.name,
                }))}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      )}
    </Modal>
  )
}

PositionsFormModal.usePositionsFormModal = usePositionsFormModal

export default PositionsFormModal
