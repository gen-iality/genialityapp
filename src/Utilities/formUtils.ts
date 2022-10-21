import { DispatchMessageService } from '@context/MessageService';
import getAdditionalFields from '@components/forms/getAdditionalFields';
import { aditionalFieldsPropsTypes, updateFieldsVisibilityPropsTypes } from './types/types';

export const textLeft: {} = {
  textAlign: 'left',
  width: '100%',
};

export const center: {} = {
  margin: '0 auto',
  textAlign: 'center',
};

export const cardStyles: {} = {
  height: 'auto',
  maxHeight: '50vh',
  overflowY: 'auto',
  paddingRight: '0px',
  borderRadius: '8px',
};

export const alertStyles: {} = {
  boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  backgroundColor: '#FFFFFF',
  color: '#000000',
  borderLeft: '5px solid #FAAD14',
  fontSize: '14px',
  borderRadius: '5px',
};

type attendee = { _id: string } | null;

export const thereAreExtraFields = (fields: []) => {
  if (fields) {
    const countFields = fields.filter(
      (field: any) =>
        field.name !== 'names' && field.name !== 'email' && (field.type !== 'password' || field.name === 'contrasena')
    );
    return countFields.length;
  }
  return 0;
};

export const validateButtonText = (attendee: attendee, visibleInCms: boolean) => {
  switch (visibleInCms) {
    case true:
      return attendee?._id ? 'Actualizar usuario' : 'Agregar usuario';
    case false:
      return attendee?._id ? 'Actualizar información' : 'Incribirme al curso';

    default:
      return 'Aceptar';
  }
};

export function getImagename(fileUrl: string) {
  if (typeof fileUrl == 'string') {
    const splitUrl = fileUrl?.split('/');
    return splitUrl[splitUrl.length - 1];
  } else {
    return null;
  }
}

export const beforeUpload = (file: any) => {
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    DispatchMessageService({
      type: 'error',
      msj: 'The file must be less than 5MB, delete it and upload again',
      action: 'show',
    });
  }
  return isLt5M ? true : false;
};

export const aditionalFields = ({ validatedFields, attendee, visibleInCms }: aditionalFieldsPropsTypes) => {
  // the email and the names are discriminated so that they are not shown in the form when it is in the edit
  const aditionalFieldsFiltered = validatedFields.filter((field: any) => {
    return field.name !== 'email' && field.name !== 'names' && field.name !== 'checked_in';
  });

  //the additionalFields are removed from the componentLoad and the dispatchFormEnrollAttendeeToEvent to make use of the useState within the getAdditionalFields
  const aditionalsFields: any = getAdditionalFields({
    fields: aditionalFieldsFiltered,
    attendee,
    visibleInCms,
  });

  return aditionalsFields;
};

export const assignmentOfConditionsToAdditionalFields = ({
  conditionalFields,
  allValues,
  fields,
  setValidatedFields,
}: updateFieldsVisibilityPropsTypes) => {
  let validatingConditionalFields: Array<any> = [...fields];

  validatingConditionalFields = validatingConditionalFields.filter((field) => {
    let fieldShouldBeDisplayed = false;
    let fieldHasCondition = false;

    conditionalFields.map((conditional: any) => {
      /** We verify if a field is within the conditions */
      const theFieldHasNoCondition: boolean = conditional.fields.indexOf(field.name) === -1;

      if (theFieldHasNoCondition) return;
      fieldHasCondition = true;

      /** We validate if the conditioned field has information */
      const valueToValidate = allValues[conditional.fieldToValidate];

      /** We check if the conditions of the field have the appropriate values for it to be displayed */
      fieldShouldBeDisplayed = conditional.value === valueToValidate;
    });
    return fieldShouldBeDisplayed || !fieldHasCondition;
  });

  setValidatedFields(validatingConditionalFields);
};
