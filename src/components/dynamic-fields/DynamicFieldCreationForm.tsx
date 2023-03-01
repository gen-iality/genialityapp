import * as React from 'react';
import {
  FunctionComponent,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react'

import { dynamicFieldOptions } from '@components/dynamic-fields/constants';
import { Checkbox, Form, Input, Radio, Select, InputNumber, Button, Row, Divider } from 'antd';
import { DispatchMessageService } from '@context/MessageService';
import { FieldType, IDynamicFieldData } from '@components/dynamic-fields/types';
import { Rule } from 'antd/lib/form';


const { TextArea } = Input;

interface IDynamicFieldDataWithID extends IDynamicFieldData {
  _id: string,
}

interface IDynamicFieldCreationFormProps {
  isEditing?: boolean,
  dataToEdit?: IDynamicFieldDataWithID,
  onCancel?: () => void,
  onSave?: (data: any) => void,
}


const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

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
};

const toCapitalizeLower = (str: string) => {
  const splitted = str.split(' ');
  const init = splitted[0].toLowerCase();
  const end = splitted.slice(1).map((item) => {
    item = item.toLowerCase();
    return item.charAt(0).toUpperCase() + item.substr(1);
  });
  return [init, ...end].join('');
}

const generateFieldNameForLabel = (value: string) => {
  const generatedFieldName = toCapitalizeLower(value)
    .normalize('NFD')
    .replace(/[^a-z0-9_]+/gi, '');
  return generatedFieldName;
}

const checkIfEnter = (event: React.KeyboardEvent<HTMLDivElement>) => {
  if (event.keyCode === 9 || event.keyCode === 13) {
    return true
  }
  return false
}

const DynamicFieldCreationForm: FunctionComponent<IDynamicFieldCreationFormProps> = (props) => {
  const {
    isEditing,
    onCancel = () => {},
    onSave = (data: any) => { console.warn('cannot save data:', data) },
    dataToEdit,
  } = props

  const [inputValue, setInputValue] = useState('')
  const [inputValueDependency, setInputValueDependency] = useState('')
  const [isDependent, setIsDependent] = useState(false)
  const [currentFieldType, setCurrentFieldType] = useState<FieldType | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)

  const [basicRules] = useState<Rule[]>([{
    required: true,
    message: 'Este campo es obligatorio',
  }])

  const [fieldName, setFieldName] = useState('')

  const [form] = Form.useForm<IDynamicFieldDataWithID>()

  const onFinish = (values: IDynamicFieldDataWithID) => {
    console.log('submit', values)
  }

  useEffect(() => {
    // Load data to the form if it is required
    if (dataToEdit && isEditing) {
      form.setFieldsValue(dataToEdit)
      setCurrentFieldType(dataToEdit.type)
      setFieldName(dataToEdit.name)
    }
  }, [])

  return (
    <Form
      form={form}
      autoComplete="off"
      onFinish={onFinish}
      {...formLayout}
    >
      <Form.Item
        name="label"
        label="Nombre del campo"
        rules={basicRules}
        initialValue={dataToEdit?.name}
      >
        <Input
          placeholder="Ej: Celular"
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
        initialValue={dataToEdit?.type}
      >
        <Select
          options={dynamicFieldOptions}
          disabled={!!dataToEdit && ['picture', 'names', 'email'].includes(dataToEdit.name)}
          onChange={(type) => setCurrentFieldType(type)}
        />
      </Form.Item>

      <Form.Item>
        <Checkbox
          checked={isDependent || !!dataToEdit?.dependency?.fieldName}
          onChange={(e) => setIsDependent(e.target.checked)}
        >
          Marca este campo como dependiente de otro campo
        </Checkbox>
      </Form.Item>

      {(isDependent || dataToEdit?.dependency?.fieldName) && (
        <>
        <Form.Item
          label="Nombre del otro campo"
          name="fieldName"
          rules={basicRules}
          initialValue={dataToEdit?.dependency?.fieldName}
        >
          <Input placeholder="Escribe el nombre, en base de datos, exacto del otro campo" />
        </Form.Item>

        <Form.Item name="triggerValues" label="Valores exactos">
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

      {!!currentFieldType && ['list', 'multiplelist', 'multiplelisttable'].includes(currentFieldType) && (
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
          valuePropName="checked"
        >
          <Checkbox>
            Solo una opción por usuario (cuando un asistente selecciona una opción esta desaparece del listado)
          </Checkbox>
        </Form.Item>
        <Divider />
        </>
      )}

      {(currentFieldType === 'TTCC') && (
        <Form.Item
          name="link"
          label="Enlace para los términos y condiciones"
          rules={basicRules}
          initialValue={dataToEdit?.link}
        >
          <Input placeholder="Enlace (esto depende el tipo de campo)" />
          <Divider />
        </Form.Item>
      )}

      <Form.Item
        label="¿Obligatorio?"
        name="mandatory"
        initialValue={dataToEdit?.mandatory}
        valuePropName="checked"
      >
        <Checkbox />
      </Form.Item>

      <Form.Item
        label="Visible para contactos?"
        name="visibleByContacts"
        initialValue={dataToEdit?.visibleByContacts}
        valuePropName="checked"
      >
        <Checkbox />
      </Form.Item>

      <Form.Item
        label="Visible para admins?"
        name="visibleByAdmin"
        initialValue={dataToEdit?.visibleByAdmin}
        valuePropName="checked"
      >
        <Checkbox />
      </Form.Item>

      <Form.Item
        name="description"
        label="Descripción corta"
        initialValue={dataToEdit?.description}
      >
        <TextArea placeholder="Descripción corta" />
      </Form.Item>

      <Form.Item
        name="order_weight"
        label="Posición / Orden"
      >
        <InputNumber min={0} placeholder="1" />
      </Form.Item>

      <Form.Item>
        <Row style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Button
            style={{ marginRight: 20 }}
            type="primary"
            htmlType="submit"
            disabled={isLoading}
            loading={isLoading}
          >
            Guardar
          </Button>

          <Button onClick={onCancel} type="default" htmlType="button">
            Cancelar
          </Button>
        </Row>
      </Form.Item>
    </Form>
  );
};

export default DynamicFieldCreationForm;
