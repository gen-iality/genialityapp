import * as React from 'react'
import { FunctionComponent, useState, useEffect, useCallback, useMemo } from 'react'

import { dynamicFieldOptions } from '@components/dynamic-fields/constants'
import { Checkbox, Form, Input, Select, InputNumber, Button, Row, Divider } from 'antd'
import { DispatchMessageService } from '@context/MessageService'
import { FieldType, IDynamicFieldData } from '@components/dynamic-fields/types'
import { Rule } from 'antd/lib/form'

const { TextArea } = Input

interface IDynamicFieldDataWithAux extends IDynamicFieldData {
  fieldName: string
  triggerValues: string[]
}

interface IDynamicFieldCreationFormProps {
  isEditing?: boolean
  dataToEdit?: IDynamicFieldData
  onCancel?: () => void
  onSave?: (data: IDynamicFieldData) => void
}

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
}

const extraInputs = {
  country: [
    {
      id: undefined,
      name: 'region',
      description: undefined,
      label: 'Region',
      unique: false,
      mandatory: true,
      options: undefined,
      order_weight: undefined,
      type: 'region',
      visibleByAdmin: true,
      visibleByContacts: undefined,
    },
    {
      id: undefined,
      name: 'city',
      description: undefined,
      label: 'Ciudad',
      unique: false,
      mandatory: true,
      options: undefined,
      order_weight: undefined,
      type: 'city',
      visibleByAdmin: true,
      visibleByContacts: undefined,
    },
  ],
  region: [
    {
      id: undefined,
      name: 'pais',
      description: undefined,
      label: 'Pais',
      unique: false,
      mandatory: true,
      options: undefined,
      order_weight: undefined,
      type: 'country',
      visibleByAdmin: true,
      visibleByContacts: undefined,
    },
    {
      id: undefined,
      name: 'city',
      description: undefined,
      label: 'Ciudad',
      unique: false,
      mandatory: true,
      options: undefined,
      order_weight: undefined,
      type: 'city',
      visibleByAdmin: true,
      visibleByContacts: undefined,
    },
  ],
  city: [
    {
      id: undefined,
      name: 'region',
      description: undefined,
      label: 'Region',
      unique: false,
      mandatory: true,
      options: undefined,
      order_weight: undefined,
      type: 'region',
      visibleByAdmin: true,
      visibleByContacts: undefined,
    },
    {
      id: undefined,
      name: 'pais',
      description: undefined,
      label: 'Pais',
      unique: false,
      mandatory: true,
      options: undefined,
      order_weight: undefined,
      type: 'country',
      visibleByAdmin: true,
      visibleByContacts: undefined,
    },
  ],
}

const toCapitalizeLower = (str: string) => {
  const splitted = str.split(' ')
  const init = splitted[0].toLowerCase()
  const end = splitted.slice(1).map((item) => {
    item = item.toLowerCase()
    return item.charAt(0).toUpperCase() + item.substr(1)
  })
  return [init, ...end].join('')
}

const generateFieldNameForLabel = (value: string) => {
  const generatedFieldName = toCapitalizeLower(value)
    .normalize('NFD')
    .replace(/[^a-z0-9_]+/gi, '')
  return generatedFieldName
}

const DynamicFieldCreationForm: FunctionComponent<IDynamicFieldCreationFormProps> = (
  props,
) => {
  const {
    isEditing,
    onCancel = () => {},
    onSave = (data: any) => {
      console.warn('cannot save data:', data)
    },
    dataToEdit,
  } = props

  const [info, setInfo] = useState<IDynamicFieldData>({} as IDynamicFieldData)
  const [isDependent, setIsDependent] = useState(false)
  const [currentFieldType, setCurrentFieldType] = useState<FieldType | undefined>(
    undefined,
  )
  const [isLoading, setIsLoading] = useState(false)

  const [basicRules] = useState<Rule[]>([
    {
      required: true,
      message: 'Este campo es obligatorio',
    },
  ])

  const [form] = Form.useForm<IDynamicFieldDataWithAux>()

  const onFinish = (values: IDynamicFieldDataWithAux) => {
    setIsLoading(true)

    const field: IDynamicFieldData = {
      ...info,
      label: values.label,
      name: values.name,
      dependency: {
        fieldName: values.fieldName,
        triggerValues: values.triggerValues,
      },
      description: values.description,
      justonebyattendee: !!values.justonebyattendee,
      labelPosition: values.labelPosition,
      link: values.link,
      mandatory: !!values.mandatory,
      options:
        values.options &&
        values.options.map((option) => {
          if (
            typeof option === 'string' ||
            (typeof option.label !== 'string' && typeof option.value !== 'string')
          ) {
            return {
              label: option.toString(),
              value: option.toString(),
            }
          }
          return option
        }),
      props: values.props,
      type: values.type,
      visibleByAdmin: !!values.visibleByAdmin,
      visibleByContacts: !!values.visibleByContacts,
    }

    console.debug('send', field)
    onSave(field)

    setInfo((previous) => ({ ...previous, ...values }))

    form.resetFields()

    setIsLoading(false)
  }

  useEffect(() => {
    // Load data to the form if it is required
    if (dataToEdit && isEditing) {
      setInfo(dataToEdit)

      form.setFieldsValue(dataToEdit)
      setCurrentFieldType(dataToEdit.type)

      if (dataToEdit.dependency && dataToEdit.dependency.fieldName) {
        form.setFieldsValue({ fieldName: dataToEdit.dependency.fieldName })
      }

      if (dataToEdit.dependency && dataToEdit.dependency.triggerValues) {
        form.setFieldsValue({ triggerValues: dataToEdit.dependency.triggerValues })
      }
    }
  }, [])

  return (
    <Form form={form} autoComplete="off" onFinish={onFinish} {...formLayout}>
      <Form.Item
        name="label"
        label="Nombre del campo"
        rules={basicRules}
        initialValue={dataToEdit?.name}>
        <Input
          placeholder="Ej: Teléfono"
          onChange={(e) => {
            const { value } = e.target
            form.setFieldsValue({
              name: generateFieldNameForLabel(value),
            })
          }}
        />
      </Form.Item>

      <Form.Item name="name" initialValue={dataToEdit?.name}>
        <Input disabled={false} placeholder="Nombre del campo en base de datos" />
      </Form.Item>

      <Form.Item
        name="type"
        label="Tipo de dato"
        rules={basicRules}
        initialValue={dataToEdit?.type}>
        <Select
          options={dynamicFieldOptions}
          disabled={
            !!dataToEdit && ['picture', 'names', 'email'].includes(dataToEdit.name)
          }
          onChange={(type) => setCurrentFieldType(type)}
        />
      </Form.Item>

      <Form.Item>
        <Checkbox
          checked={isDependent || !!dataToEdit?.dependency?.fieldName}
          onChange={(e) => setIsDependent(e.target.checked)}>
          Marca este campo como dependiente de otro campo
        </Checkbox>
      </Form.Item>

      {(isDependent || dataToEdit?.dependency?.fieldName) && (
        <>
          <Form.Item
            label="Nombre del otro campo"
            name="fieldName"
            rules={basicRules}
            initialValue={dataToEdit?.dependency?.fieldName}>
            <Input placeholder="Escribe el nombre, en base de datos, exacto del otro campo" />
          </Form.Item>

          <Form.Item
            name="triggerValues"
            label="Valores exactos"
            rules={[
              {
                required: true,
                message: 'Al menos un valor',
                validator: (_, ones?: any[]) => {
                  if (!ones || ones.length === 0) return Promise.reject('triggerValues')
                  return Promise.resolve()
                },
              },
            ]}>
            <Select
              mode="tags"
              open={false}
              placeholder="Escribe la opción y presiona Enter o Tab..."
              aria-required
            />
          </Form.Item>

          <Divider />
        </>
      )}

      {!!currentFieldType &&
        ['list', 'multiplelist', 'multiplelisttable'].includes(currentFieldType) && (
          <>
            <Form.Item name="options" label="Opciones">
              <Select
                mode="tags"
                open={false}
                placeholder="Escribe la opción y presiona Enter o Tab..."
                aria-required
              />
            </Form.Item>

            <Form.Item
              name="justonebyattendee"
              initialValue={dataToEdit?.justonebyattendee}
              valuePropName="checked">
              <Checkbox>
                Solo una opción por usuario (cuando un asistente selecciona una opción
                esta desaparece del listado)
              </Checkbox>
            </Form.Item>
            <Divider />
          </>
        )}

      {currentFieldType === 'TTCC' && (
        <Form.Item
          name="link"
          label="Enlace para los términos y condiciones"
          rules={basicRules}
          initialValue={dataToEdit?.link}>
          <Input placeholder="Enlace (esto depende el tipo de campo)" />
          <Divider />
        </Form.Item>
      )}

      <Form.Item
        label="¿Obligatorio?"
        name="mandatory"
        initialValue={dataToEdit?.mandatory}
        valuePropName="checked">
        <Checkbox />
      </Form.Item>

      <Form.Item
        label="Visible para contactos?"
        name="visibleByContacts"
        initialValue={dataToEdit?.visibleByContacts}
        valuePropName="checked">
        <Checkbox />
      </Form.Item>

      <Form.Item
        label="Visible para admins?"
        name="visibleByAdmin"
        initialValue={dataToEdit?.visibleByAdmin}
        valuePropName="checked">
        <Checkbox />
      </Form.Item>

      <Form.Item
        name="description"
        label="Descripción corta"
        initialValue={dataToEdit?.description}>
        <TextArea placeholder="Descripción corta" />
      </Form.Item>

      <Form.Item name="order_weight" label="Posición / Orden">
        <InputNumber min={0} placeholder="1" />
      </Form.Item>

      <Form.Item>
        <Row style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Button
            style={{ marginRight: 20 }}
            type="primary"
            htmlType="submit"
            disabled={isLoading}
            loading={isLoading}>
            Guardar
          </Button>

          <Button onClick={onCancel} type="default" htmlType="button">
            Cancelar
          </Button>
        </Row>
      </Form.Item>
    </Form>
  )
}

export default DynamicFieldCreationForm
