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

  const findDuplicates = (conditionalFieldsToTable: IConditionalFieldTable[]): IConditionalFieldTable[] => {
    const seen: Record<string, boolean> = {};
    const conditionalFieldsToTableWithDuplicates: IConditionalFieldTable[] = [];
    const duplicates: string[] = [];
    conditionalFieldsToTable.forEach((conditionalField) => {
      const key = `${conditionalField.fieldToValidate}-${conditionalField.value}-${conditionalField.fields
        .sort()
        .join(',')}`;

      if (seen[key]) {
        duplicates.push(key);
        conditionalFieldsToTableWithDuplicates.push({ ...conditionalField, isRepeat: true });
      } else {
        seen[key] = true;
        conditionalFieldsToTableWithDuplicates.push(conditionalField);
      }
    });

    return conditionalFieldsToTableWithDuplicates;
  };

  const fetchConditionalFields = useCallback(
    async (/* isMounted: boolean */) => {
      try {
        setIsLoadingConditionalFields(true);
        const fields = (await EventFieldsApi.getAll(eventId)) as Field[];
        const { data } = await eventFacade.getById(eventId);
        const conditionalFieldsEvents = data.fields_conditions as IConditionalField[];
        const conditionalFieldsTable: IConditionalFieldTable[] = conditionalFieldsEvents.map((conditionalField) => {
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
        setConditionalFields(conditionalFieldsEvents);
        setConditionalFieldsTable(findDuplicates(conditionalFieldsTable));
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
