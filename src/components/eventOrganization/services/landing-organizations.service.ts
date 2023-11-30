import { GetTokenUserFirebase } from '@/helpers/HelperAuth';
import privateInstance, { UsersApi } from '@/helpers/request';
import { IResultGet } from '@/types/response-services';
import { IDataNewEventUser } from '../types/landing-organizations.interface';
import { DispatchMessageService } from '@/context/MessageService';
export const getMyEventsIntoOrganization = async (organizationId: string): Promise<IResultGet<any>> => {
  try {
    let token = await GetTokenUserFirebase();
    const { data } = await privateInstance.get(
      `api/organizations/${organizationId}/landing-ceta?order=desc&token=${token}`
    );
    return {
      data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error,
    };
  }
};

export async function createEventUserFree(dataNewEventUser: IDataNewEventUser, eventId: string) {
  let response = null;

  const VALUE_TYPE_USER_CETA = {
    MIXTO: 'Mixto',
    DIFERIDO: 'Diferido',
    EN_VIVO: 'En vivo',
  };

  dataNewEventUser.list_type_user = VALUE_TYPE_USER_CETA.DIFERIDO;

  try {
    let respUser = await UsersApi.createOne({ properties: { ...dataNewEventUser } }, eventId, true);
    if (respUser && respUser._id) {
      response = true;
    }
  } catch (err) {
    DispatchMessageService({
      type: 'error',
      msj: 'Ha ocurrido un error',
      action: 'show',
    });
  }
  return response;
}
