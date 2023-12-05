import { EventFieldsApi } from '@/helpers/request';
import { useCallback, useEffect, useState } from 'react';
import { Field } from '../types';
import { IConditionalField, IConditionalFieldTable } from '../types/conditional-form.types';
import { eventFacade } from '@/facades/event.facade';

interface IOptions {
  eventId: string;
}

export const useGetConditionalFields = ({ eventId }: IOptions) => {
  const [conditionalFields, setConditionalFields] = useState<IConditionalField[]>([]);
  const [conditionalFieldsTable, setConditionalFieldsTable] = useState<IConditionalFieldTable[]>([]);
  const [isLoadingConditionalFields, setIsLoadingConditionalFields] = useState(true);
  const [error, setError] = useState<any | null>(null);

  const fetchConditionalFields = useCallback(
    async (/* isMounted: boolean */) => {
      try {
        setIsLoadingConditionalFields(true);
        const fields = (await EventFieldsApi.getAll(eventId)) as Field[];
        const { data } = await eventFacade.getById(eventId);
        const conditionalFieldsEvents = data.fields_conditions as IConditionalField[];
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

        /*  if (isMounted) {
          setConditionalFields(conditionalFieldsEvents);
          setConditionalFieldsTable(conditionalFieldsTable);
        } */

        setConditionalFields(conditionalFieldsEvents);
        setConditionalFieldsTable(conditionalFieldsTable);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoadingConditionalFields(false);
      }
    },
    [eventId]
  );
  useEffect(() => {
    // let isMounted = true;
    fetchConditionalFields(/* isMounted */);

    /* return () => {
      isMounted = false;
    }; */
  }, [fetchConditionalFields]);

  return { conditionalFields, isLoadingConditionalFields, error, conditionalFieldsTable, fetchConditionalFields };
};
