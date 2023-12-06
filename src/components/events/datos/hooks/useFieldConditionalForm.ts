import { useMemo, useState } from 'react';
import { Field } from '../types';
import { IConditionalField, TTypeFieldConditional } from '../types/conditional-form.types';
import { conditionalFieldsFacade } from '@/facades/conditionalFields.facode';
import { IResultPost, IResultPut } from '@/types';
import { DispatchMessageService } from '@/context/MessageService';
interface IOptions {
  fields: Field[];
  eventId: string;
}
export const useFieldConditionalForm = ({ fields, eventId }: IOptions) => {
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [typeFieldToValidate, setTypeFieldToValidate] = useState<TTypeFieldConditional | null>(null);
  const [valueConditional, setValueConditional] = useState<string | boolean | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState(false);
  const onCreate = async (conditionalField: IConditionalField): Promise<IResultPost<IConditionalField>> => {
    try {
      setIsSaving(true);
      const { data, status } = await conditionalFieldsFacade.create(eventId, conditionalField);
      DispatchMessageService({
        action: 'show',
        type: 'success',
        msj: 'Se creó con éxito el campo condicional',
      });
      return {
        error: null,
        data,
        status,
      };
    } catch (error) {
      DispatchMessageService({
        action: 'show',
        type: 'error',
        msj: 'Ocurrió un error al guardar el campo condicional',
      });
      return {
        error,
      };
    } finally {
      setIsSaving(false);
    }
  };
  const onUpdate = async (
    fieldId: string,
    conditionalField: IConditionalField
  ): Promise<IResultPut<IConditionalField>> => {
    try {
      setIsSaving(true);
      const { data, status } = await conditionalFieldsFacade.update(eventId, fieldId, conditionalField);
      DispatchMessageService({
        action: 'show',
        type: 'success',
        msj: 'Se modificó con éxito el campo condicional',
      });
      return { data, status, error: null };
    } catch (error) {
      DispatchMessageService({
        action: 'show',
        type: 'error',
        msj: 'Ocurrió un error al modificar el campo condicional',
      });
      return { error };
    } finally {
      setIsSaving(false);
    }
  };

  const onChangeField = (fieldName: string) => {
    const selectedField = fields.find((item) => item.name === fieldName) ?? null;
    setSelectedField(selectedField);
    setTypeFieldToValidate((selectedField?.type as TTypeFieldConditional) ?? null);
    setValueConditional(null);
  };

  const onChangeValueConditional = (valueConditional: string | boolean) => {
    setValueConditional(valueConditional);
  };

  const fieldsFromCondition = useMemo(() => {
    return fields
      .filter((item) => !['email', 'names'].includes(item.name) && selectedField?.name !== item.name)
      .map((item) => ({ value: item.name, label: item.label }));
  }, [fields, selectedField?.name]);

  const fieldsParsedToSelect = useMemo(() => {
    return fields
      .filter((item) => ['list', 'boolean'].includes(item.type) && !['email', 'names'].includes(item.name))
      .map((item) => ({ value: item.name, label: item.label }));
  }, [fields]);

  return {
    selectedField,
    onChangeField,
    typeFieldToValidate,
    onChangeValueConditional,
    valueConditional,
    isSaving,
    onCreate,
    onUpdate,
    fieldsFromCondition,
    fieldsParsedToSelect,
    status,
    setStatus,
  };
};
