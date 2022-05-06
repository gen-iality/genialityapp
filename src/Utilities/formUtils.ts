import { DispatchMessageService } from '@/context/MessageService';
import getAdditionalFields from '@/components/forms/getAdditionalFields';

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

export const validateButtonText = (editUser: boolean, visibleInCms: boolean) => {
  switch (visibleInCms) {
    case true:
      return editUser ? 'Actualizar usuario' : 'Agregar usuario';
    case false:
      return editUser ? 'Actualizar información' : 'Incribirme al evento';

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
      msj: 'Image must smaller than 5MB!',
      action: 'show',
    });
  }
  return isLt5M ? true : false;
};

export const aditionalFields = (fields: [], editUser: any, visibleInCms: any) => {
  // the email and the names are discriminated so that they are not shown in the form when it is in the edit
  const aditionalFieldsFiltered = fields.filter((field: any) => {
    return field.name !== 'email' && field.name !== 'names';
  });

  //the additionalFields are removed from the componentLoad and the dispatchFormEnrollUserToEvent to make use of the useState within the getAdditionalFields
  const aditionalsFields: any = getAdditionalFields({
    fields: aditionalFieldsFiltered,
    editUser,
    visibleInCms,
  });

  return aditionalsFields;
};

export const saveOrUpdateUser = (values: any, fields: any, saveUser: (values: any) => any) => {
  // values = { ...initialValues, ...values };

  // if (Object.keys(basicDataUser).length > 0) {
  //   setvalidateEventUser({
  //     statusFields: true,
  //     status: false,
  //   });
  //   return;
  // }

  if (values['email']) {
    values['email'] = values['email'].toLowerCase();
  }

  // if (areacodeselected) {
  //   values['code'] = areacodeselected;
  // }

  //OBTENER RUTA ARCHIVOS FILE
  Object.values(fields).map((field: any) => {
    if (field.type == 'file') {
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
