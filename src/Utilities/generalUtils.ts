import { fieldsData } from './types/types';

export const getFieldDataFromAnArrayOfFields = (fields: [], nameOfTheLabelToGet: string) => {
  const defaultData = {
    label: '',
    name: '',
    type: '',
  };

  let fieldsData: fieldsData | undefined = fields?.find(
    (field: { type: string }) => field.type === nameOfTheLabelToGet
  );

  fieldsData = fieldsData ? fieldsData : defaultData;

  return fieldsData;
};
