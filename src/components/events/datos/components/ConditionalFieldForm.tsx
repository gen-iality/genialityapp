import { Button, Form, Select } from 'antd';
import { IConditionalField, IConditionalFieldForm } from '../types/conditional-form.types';
import { useEffect } from 'react';
import { useGetEventsFields } from '../hooks/useGetEventsFields';
import { useFieldConditionalForm } from '../hooks/useFieldConditionalForm';
import { DispatchMessageService } from '@/context/MessageService';
import { fieldToValidateRules, fieldsRules, valueRules } from '../utils/formConditional.rules';

interface Props {
  selectedConditionalField?: IConditionalField;
  eventId: string;

  onCloseModal: () => void;
}

const OPTIONS_BOOLEAN_SELECT = [
  {
    label: 'Si',
    value: true,
  },
  {
    label: 'No',
    value: false,
  },
];
export const ConditionalFieldForm = ({ selectedConditionalField, onCloseModal, eventId }: Props) => {
  const [form] = Form.useForm<IConditionalFieldForm>();
  const { fields, isLoadingEventsFields } = useGetEventsFields({ eventId });
  const {
    selectedField,
    typeFieldToValidate,
    valueConditional,
    fieldsParsedToSelect,
    onChangeField,
    onChangeValueConditional,
    onCreate,
    fieldsFromCondition,
    onUpdate,
    isCreating,
  } = useFieldConditionalForm({
    fields,
    eventId,
  });

  const onSubmit = async (values: IConditionalFieldForm) => {
    if (valueConditional === null) {
      return DispatchMessageService({
        action: 'show',
        type: 'error',
        msj: 'Debe definir un valor de condicion',
      });
    }
    if (selectedConditionalField && selectedConditionalField._id) {
      const { error } = await onUpdate(selectedConditionalField?._id, { ...values, state: 'enabled' });
      if (!error) {
        onCloseModal();
      }
    } else {
      const { error } = await onCreate({ ...values, state: 'enabled' });
      if (!error) {
        onCloseModal();
      }
    }
  };

  useEffect(() => {
    if (selectedConditionalField) {
      form.setFieldsValue(selectedConditionalField);
      onChangeField(selectedConditionalField.fieldToValidate);
      onChangeValueConditional(selectedConditionalField.value);
    }
  }, [selectedConditionalField, isLoadingEventsFields]);

  return (
    <Form layout='vertical' form={form} onFinish={onSubmit}>
      <Form.Item label='Campo validador' name={'fieldToValidate'} rules={fieldToValidateRules}>
        <Select
          value={selectedField?.name}
          loading={isLoadingEventsFields}
          onChange={(value, item) => {
            onChangeField(value);
            form.setFieldsValue({ fields: [] });
            form.setFieldsValue({ value: undefined });
          }}
          options={fieldsParsedToSelect}
        />
      </Form.Item>

      {typeFieldToValidate && selectedField && (
        <>
          <Form.Item label='Valores condicionales' name={'value'} rules={valueRules}>
            <Select
              value={valueConditional}
              loading={isLoadingEventsFields}
              onChange={(value, item) => {
                onChangeValueConditional(value);
              }}
              //@ts-ignore
              options={typeFieldToValidate === 'list' ? selectedField.options : OPTIONS_BOOLEAN_SELECT}
            />
          </Form.Item>
        </>
      )}

      {valueConditional !== null && (
        <Form.Item label='Campos condicionados' name={'fields'} rules={fieldsRules}>
          <Select mode='multiple' loading={isLoadingEventsFields} options={fieldsFromCondition} />
        </Form.Item>
      )}
      <Form.Item>
        <Button htmlType='submit' loading={isCreating}>
          {selectedConditionalField ? 'Guardar' : 'Crear'}
        </Button>
      </Form.Item>
    </Form>
  );
};
