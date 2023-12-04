import { EventFieldsApi } from '@/helpers/request';
import { useEffect, useState } from 'react';
import { Field } from '../types';
import { IConditionalField, IConditionalFieldTable } from '../types/conditional-form.types';
import { UseEventContext } from '@/context/eventContext';

interface IOptions {
  eventId: string;
}

export const useGetConditionalFields = ({ eventId }: IOptions) => {
  const conditionalFieldsEvents = UseEventContext()?.value?.fields_conditions as IConditionalField[];
  const [conditionalFields, setConditionalFields] = useState<IConditionalField[]>([]);
  const [conditionalFieldsTable, setConditionalFieldsTable] = useState<IConditionalFieldTable[]>([]);
  const [isLoadingConditionalFields, setIsLoadingConditionalFields] = useState(true);
  const [error, setError] = useState<any | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setIsLoadingConditionalFields(true);

        const fields = (await EventFieldsApi.getAll(eventId)) as Field[];

        const conditionalFieldsTable = conditionalFieldsEvents.map((conditionalField) => {
          const currentField = fields.find((field) => field.name === conditionalField.fieldToValidate);
          const fieldToValidateLabel = currentField?.label ?? conditionalField.fieldToValidate;

          const fieldLabels = conditionalField.fields.map((fieldName) => {
            const currentField = fields.find((field) => field.name === fieldName);
            return currentField?.label ?? fieldName;
          });

          return {
            ...conditionalField,
            fieldToValidateLabel,
            fieldLabels,
          };
        });

        if (isMounted) {
          setConditionalFields(conditionalFieldsEvents);
          setConditionalFieldsTable(conditionalFieldsTable);
        }
      } catch (err) {
        setError(err);
      } finally {
        setIsLoadingConditionalFields(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [eventId, conditionalFieldsEvents]);

  return { conditionalFields, isLoadingConditionalFields, error, conditionalFieldsTable };
};
