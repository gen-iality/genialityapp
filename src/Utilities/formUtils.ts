import { DispatchMessageService } from '@/context/MessageService';
import getAdditionalFields from '@/components/forms/getAdditionalFields';
import { UsersApi } from '@/helpers/request';
import { aditionalFieldsPropsTypes, updateFieldsVisibilityPropsTypes } from './types/types';

export const textLeft: {} = {
  textAlign: 'left',
  width: '100%',
  padding: '20px',
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

type editUser = { _id: string } | null;

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

export const validateButtonText = (editUser: editUser, visibleInCms: boolean) => {
  switch (visibleInCms) {
    case true:
      return editUser?._id ? 'Actualizar usuario' : 'Agregar usuario';
    case false:
      return editUser?._id ? 'Actualizar información' : 'Incribirme al evento';

    default:
      return 'Aceptar';
  }
};

export function getImagename(fileUrl: string) {
  if (typeof fileUrl == 'string') {
    let splitUrl = fileUrl?.split('/');
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

export const aditionalFields = ({ validatedFields, editUser, visibleInCms }: aditionalFieldsPropsTypes) => {
  // the email and the names are discriminated so that they are not shown in the form when it is in the edit
  const aditionalFieldsFiltered = validatedFields.filter((field: any) => {
    return field.name !== 'email' && field.name !== 'names' && field.name !== 'checked_in';
  });

  //the additionalFields are removed from the componentLoad and the dispatchFormEnrollUserToEvent to make use of the useState within the getAdditionalFields
  const aditionalsFields: any = getAdditionalFields({
    fields: aditionalFieldsFiltered,
    editUser,
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

export const saveOrUpdateUser = (values: any, fields: any, saveUser: (values: any) => any) => {
  // values = { ...initialValues, ...values };

  if (values['email']) {
    values['email'] = values['email'].toLowerCase();
  }

  //OBTENER RUTA ARCHIVOS FILE
  Object.values(fields).map((field: any) => {
    if (field.type == 'file') {
      if (values[field.name]?.file?.status === 'removed') {
        values[field.name] = null;
      }
      values[field.name] = values[field.name]?.fileList
        ? values[field.name]?.fileList[0]?.response.trim()
        : typeof values[field.name] == 'string'
        ? values[field.name]
        : null;
    }
  });

  // validacion para campo tipo avatar se deja al momento sin embargo se probo y no se afecta nada
  // if (imageAvatar) {
  //   if (imageAvatar.fileList[0]) {
  //     values.picture = imageAvatar.fileList[0].response;
  //   } else {
  //     values.picture = '';
  //   }
  // } else {
  //   delete values.picture;
  // }

  if (saveUser) {
    saveUser(values);
  } else {
    // se deja el else para cuando re reemplaze el form original 'FormRegister' por este
    console.log('saveUser not exist');
  }
};

/** function to create or edit an eventuser from the cms */
export const saveOrUpdateUserInAEvent = async ({
  values,
  shouldBeEdited,
  handleModal = false,
  setLoadingregister,
  updateView,
  eventID,
  eventUserId,
}: any) => {
  setLoadingregister(true);

  let resp;
  let respActivity = true;
  if (values) {
    const body = { properties: values };

    if (!shouldBeEdited) {
      try {
        resp = await UsersApi.createOne(body, eventID);
      } catch (e) {
        DispatchMessageService({
          type: 'error',
          msj: 'Usuario ya registrado en el evento',
          action: 'show',
        });
        respActivity = false;
      }
    } else {
      try {
        resp = await UsersApi.editEventUser(body, eventID, eventUserId);
      } catch (e) {
        resp = false;
        respActivity = false;
      }
    }

    if (updateView) {
      updateView();
    }
  }

  if (resp || respActivity) {
    setLoadingregister(false);
    DispatchMessageService({
      type: 'success',
      msj: shouldBeEdited ? 'Usuario editado correctamente' : 'Usuario agregado correctamente',
      action: 'show',
    });
    if (handleModal) handleModal();
    return resp;
  } else {
    setLoadingregister(false);
    DispatchMessageService({
      type: 'error',
      msj: 'Error al guardar el usuario',
      action: 'show',
    });
    return resp;
  }
};
