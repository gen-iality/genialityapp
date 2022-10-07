import Datos from '@components/events/datos';
import { OrganizationApi } from '../../helpers/request';
import dayjs from 'dayjs';

function MemberSettings(props) {
  const organizationId = props.org._id;

  /** obtenemos los datos del array user_properties */
  async function getFields() {
    const fields = await OrganizationApi.getUserProperties(organizationId);
    return fields;
  }

  /** callback para guardar un campo */
  async function createNewField(fieldData) {
    //FORMATEAR FECHA CREATED Y UPDATED AT
    fieldData = {
      ...fieldData,
      updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    };
    await OrganizationApi.createOneUserProperties(organizationId, fieldData);
  }
  /** callback para editar un campo */
  async function editField(fieldId, fieldData) {
    await OrganizationApi.editOneUserProperties(organizationId, fieldId, fieldData);
  }
  /** callback para eliminar un campo un campo */
  async function deleteField(idFieldToDelete) {
    await OrganizationApi.deleteUserProperties(organizationId, idFieldToDelete);
  }

  /** callback para ordenar los campos */
  async function orderFields(userProperties) {
    console.log('ordenar campos', userProperties);
    await OrganizationApi.editAllUserProperties(organizationId, userProperties);
  }

  return (
    <Datos
      sendprops={props}
      type='configMembers'
      getFields={getFields}
      createNewField={createNewField}
      editField={editField}
      deleteField={deleteField}
      orderFields={orderFields}
    />
  );
}

export default MemberSettings;
