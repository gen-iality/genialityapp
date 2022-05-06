const AdditionalFieldsToFormEnrollUserToEvent = ({ aditionalFields }: any) => {
  // console.log('🚀 AdditionalFieldsToFormEnrollUserToEvent ', aditionalFields);

  return (
    <>
      {aditionalFields?.length > 0 &&
        aditionalFields.map((field: any) => {
          return field;
        })}
    </>
  );
};

export default AdditionalFieldsToFormEnrollUserToEvent;
