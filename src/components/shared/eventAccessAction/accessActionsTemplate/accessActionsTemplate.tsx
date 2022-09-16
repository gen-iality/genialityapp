/**
 *
 * Tipos de acceso al evento(event_access_type):
 * PUBLIC_EVENT_WITH_REGISTRATION_ANONYMOUS = Público con registro sin autenticación
 * PUBLIC_EVENT_WITH_REGISTRATION = Público con registro
 * UN_REGISTERED_PUBLIC_EVENT =Público sin registro
 * Privado = PRIVATE_EVENT
 *
 * event_mode
 * physicalEvent
 * onlineEvent
 * hybridEvent
 *
 * attende_status:
 * NO_USER
 * WITH_USER
 * WITH_ASSISTANT
 *
 * Para ver las combinaciones que nos producen una acción particular referirse a este excel
 * https://docs.google.com/spreadsheets/d/1ZTKPxjz6aWhxoQi5ly6ASGsE9wtd3Cm8wBZdvdC_pm0/edit#gid=0
 */

import { accessActionsInterface } from '../interfaces/interfaces';

const accessActions: accessActionsInterface = {
  PUBLIC_EVENT_WITH_REGISTRATION_ANONYMOUS: {
    /*FIXME: Validacion de flujo cuando ya tengo un registro por cambio de dispositivo o cierre de sesion*/
    physicalEvent: {
      NO_USER: 'ACTION_ONLY_EVENT_REGISTRATION',
      WITH_USER: 'ACTION_REGISTER_FOR_THE_EVENT_ANONYMOUS',
      WITH_ASSISTANT: 'MESSAGE_YOU_ARE_ALREADY_REGISTERED',
    },
    onlineEvent: {
      NO_USER: 'ACTION_ONLY_EVENT_REGISTRATION',
      WITH_USER: 'ACTION_REGISTER_FOR_THE_EVENT_ANONYMOUS',
      WITH_ASSISTANT: 'ACTION_ENTER_THE_EVENT',
    },
    hybridEvent: {
      NO_USER: 'ACTION_ONLY_EVENT_REGISTRATION',
      WITH_USER: 'ACTION_REGISTER_FOR_THE_EVENT_ANONYMOUS',
      WITH_ASSISTANT: 'ACTION_ENTER_THE_EVENT',
    },
  },
  PUBLIC_EVENT_WITH_REGISTRATION: {
    physicalEvent: {
      NO_USER: 'ACTION_LOG_IN_OR_REGISTER_FOR_THE_EVENT',
      WITH_USER: 'ACTION_REGISTER_FOR_THE_EVENT',
      WITH_ASSISTANT: 'MESSAGE_YOU_ARE_ALREADY_REGISTERED',
    },
    onlineEvent: {
      NO_USER: 'ACTION_LOG_IN_OR_REGISTER_FOR_THE_EVENT',
      WITH_USER: 'ACTION_REGISTER_FOR_THE_EVENT',
      WITH_ASSISTANT: 'ACTION_ENTER_THE_EVENT',
    },
    hybridEvent: {
      NO_USER: 'ACTION_LOG_IN_OR_REGISTER_FOR_THE_EVENT',
      WITH_USER: 'ACTION_REGISTER_FOR_THE_EVENT',
      WITH_ASSISTANT: 'ACTION_ENTER_THE_EVENT',
    },
  },
  UN_REGISTERED_PUBLIC_EVENT: {
    physicalEvent: { NO_USER: 'NO_ACTION', WITH_USER: 'NO_ACTION', WITH_ASSISTANT: 'NO_ACTION' },
    onlineEvent: {
      NO_USER: 'ACTION_ENTER_THE_EVENT',
      WITH_USER: 'ACTION_ENTER_THE_EVENT',
      WITH_ASSISTANT: 'ACTION_ENTER_THE_EVENT',
    },
    hybridEvent: {
      NO_USER: 'ACTION_ENTER_THE_EVENT',
      WITH_USER: 'ACTION_ENTER_THE_EVENT',
      WITH_ASSISTANT: 'ACTION_ENTER_THE_EVENT',
    },
  },
  PRIVATE_EVENT: {
    physicalEvent: {
      NO_USER: 'ACTION_LOGIN_AND_PRIVATE_EVENT_MESSAGE',
      WITH_USER: 'PRIVATE_EVENT_MESSAGE_AND_MESSAGE_YOU_ARE_NOT_INVITED',
      WITH_ASSISTANT: 'MESSAGE_YOU_ARE_INVITED',
    },
    onlineEvent: {
      NO_USER: 'ACTION_LOGIN_AND_PRIVATE_EVENT_MESSAGE',
      WITH_USER: 'PRIVATE_EVENT_MESSAGE_AND_MESSAGE_YOU_ARE_NOT_INVITED',
      WITH_ASSISTANT: 'ACTION_ENTER_THE_EVENT',
    },
    hybridEvent: {
      NO_USER: 'ACTION_LOGIN_AND_PRIVATE_EVENT_MESSAGE',
      WITH_USER: 'PRIVATE_EVENT_MESSAGE_AND_MESSAGE_YOU_ARE_NOT_INVITED',
      WITH_ASSISTANT: 'ACTION_ENTER_THE_EVENT',
    },
  },
};

export default accessActions;
