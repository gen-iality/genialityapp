import { useState } from 'react';
import { Field } from '../types';
import { TTypeFieldConditional } from '../types/conditional-form.types';
interface IOptions {
  fields: Field[];
}
export const useFieldConditionalForm = ({ fields }: IOptions) => {
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [typeFieldToValidate, setTypeFieldToValidate] = useState<TTypeFieldConditional | null>(null);
  const [valueConditional, setValueConditional] = useState<string | null>(null);

  const onChangeField = (fieldName: string) => {
    const selectedField = fields.find((item) => item.name === fieldName) ?? null;
    setSelectedField(selectedField);
    setTypeFieldToValidate((selectedField?.type as TTypeFieldConditional) ?? null);
    setValueConditional(null);
  };

  const onChangeValueConditional = (valueConditional: string) => {
    setValueConditional(valueConditional);
  };

  return {
    selectedField,
    onChangeField,
    typeFieldToValidate,
    onChangeValueConditional,
    valueConditional,
    fieldsParsedToSelect: fields
      .filter((item) => ['list', 'boolean'].includes(item.type))
      .map((item) => ({ value: item.name, label: item.label })),
  };
};
