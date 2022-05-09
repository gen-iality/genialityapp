const AdditionalFieldsToFormEnrollUserToEvent = ({ aditionalFields }: any) => {
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
