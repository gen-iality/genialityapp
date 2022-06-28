const AdditionalFieldsToFormEnrollAttendeeToEvent = ({ aditionalFields }: any) => {
  return (
    <>
      {aditionalFields?.length > 0 &&
        aditionalFields.map((field: any) => {
          return field;
        })}
    </>
  );
};

export default AdditionalFieldsToFormEnrollAttendeeToEvent;
