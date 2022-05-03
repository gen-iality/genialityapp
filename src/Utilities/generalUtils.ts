export const getFieldDataFromAnArrayOfFields = (fields: [], nameOfTheLabelToGet: string) => {
  let defaultData = {
    label: '',
    name: '',
    type: '',
  };

  let fieldsData: {} | undefined = fields?.find((field: { type: string }) => field.type === nameOfTheLabelToGet);

  fieldsData = fieldsData ? fieldsData : defaultData;

  return fieldsData;
};
