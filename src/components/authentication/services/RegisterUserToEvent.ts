import { DispatchMessageService } from '@/context/MessageService';
import { UsersApi } from '@/helpers/request';
import { defaultBootstrapCss } from 'entries/react';

async function createEventUser(basicDataUser: any, dataEventUser: any, cEvent: any) {
  let response = null;
  let clonBasicDataUser = { ...basicDataUser };
  delete clonBasicDataUser.password;
  delete clonBasicDataUser.picture;

  let datauser = {
    ...clonBasicDataUser,
    ...dataEventUser,
  };

  let propertiesuser = { properties: { ...datauser } };
  try {
    let respUser = await UsersApi.createOne(propertiesuser, cEvent.value?._id);
    if (respUser && respUser._id) {
      response = true;
    }
  } catch (err) {
    console.log(err);

    DispatchMessageService({
      type: 'error',
      msj: 'Ha ocurrido un error',
      action: 'show',
    });
  }
  return response;
}

interface IDataNewEventUser {
  email: string;
  names: string;
  [key: string]: any;
}
export async function createEventUserFree(dataNewEventUser: IDataNewEventUser, eventId: string) {
  let response = null;

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

export default createEventUser;
