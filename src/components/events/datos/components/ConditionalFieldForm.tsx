import { Button, Form, Input, Select } from 'antd';
import { IConditionalField, IConditionalFieldForm } from '../types/conditional-form.types';
import { useEffect } from 'react';
import { useGetEventsFields } from '../hooks/useGetEventsFields';
import { useForm } from '@/hooks/useForm';
import { useFieldConditionalForm } from '../hooks/useFieldConditionalForm';

const initialValues: IConditionalFieldForm = {
  fields: [],
  fieldToValidate: '',
  state: '',
  value: '',
};

interface Props {
  selectedConditionalField?: IConditionalField;
  eventId: string;
}
export const ConditionalFieldForm = ({ selectedConditionalField, eventId }: Props) => {
  const [form] = Form.useForm<IConditionalFieldForm>();
  const { fields, isLoadingEventsFields } = useGetEventsFields({ eventId });
  const {
    selectedField,
    onChangeField,
    fieldsParsedToSelect,
    typeFieldToValidate,
    onChangeValueConditional,
    valueConditional,
  } = useFieldConditionalForm({
    fields,
  });
  useEffect(() => {
    if (selectedConditionalField) {
      form.setFieldsValue(selectedConditionalField);
      onChangeField(selectedConditionalField.fieldToValidate);
    }
  }, [selectedConditionalField, isLoadingEventsFields]);

  return (
    <Form layout='vertical' form={form}>
      <Form.Item label='Campo validador'>
        <Select
          value={selectedField?.name}
          loading={isLoadingEventsFields}
          onChange={(value, item) => {
            onChangeField(value);
          }}
          options={fieldsParsedToSelect}
        />
      </Form.Item>

      {typeFieldToValidate && selectedField && typeFieldToValidate === 'list' && (
        <>
          <Form.Item label='Valores condicionales'>
            <Select
              value={valueConditional}
              loading={isLoadingEventsFields}
              onChange={(value, item) => {
                onChangeValueConditional(value);
              }}
              options={selectedField.options}
            />
          </Form.Item>
        </>
      )}

      {typeFieldToValidate && selectedField && typeFieldToValidate === 'boolean' && (
        <>
          <Form.Item label='Valores condicionales'>
            <Select
              loading={isLoadingEventsFields}
              onChange={(value, item) => {
                onChangeValueConditional(value);
              }}
              options={[
                {
                  label: 'Si',
                  value: true,
                },
                {
                  label: 'No',
                  value: false,
                },
              ]}
            />
          </Form.Item>
        </>
      )}

      <Form.Item label='Campo condicional'>
        <Button>{selectedConditionalField ? 'Guardar' : 'Crear'}</Button>
      </Form.Item>
    </Form>
  );
};
