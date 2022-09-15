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

import { PieChartOutlined } from '@ant-design/icons';
import { accessActionsInterface } from '../interfaces/interfaces';

const accessActions: accessActionsInterface = {
  PUBLIC_EVENT_WITH_REGISTRATION_ANONYMOUS: {
    physicalEvent: {
      NO_USER: 'REGISTER_EVENT',
      WITH_USER: 'REGISTER',
      WITH_ASSISTANT: 'YOU_ARE_ALREADY_REGISTERED',
    },
    onlineEvent: {
      NO_USER: 'REGISTER_EVENT',
      WITH_USER: 'REGISTER',
      WITH_ASSISTANT: 'JOIN_OR_EXTERNAL_LINK',
    },
    hybridEvent: {
      NO_USER: 'REGISTER_EVENT',
      WITH_USER: 'REGISTER',
      WITH_ASSISTANT: 'JOIN_OR_EXTERNAL_LINK',
    },
  },
  PUBLIC_EVENT_WITH_REGISTRATION: {
    physicalEvent: {
      NO_USER: 'REGISTER_USER_OR_SIGN_UP_FOR_THE_EVENT',
      WITH_USER: 'REGISTER',
      WITH_ASSISTANT: 'YOU_ARE_ALREADY_REGISTERED',
    },
    onlineEvent: {
      NO_USER: 'REGISTER_USER_OR_SIGN_UP_FOR_THE_EVENT',
      WITH_USER: 'REGISTER',
      WITH_ASSISTANT: 'JOIN_OR_EXTERNAL_LINK',
    },
    hybridEvent: {
      NO_USER: 'REGISTER_USER_OR_SIGN_UP_FOR_THE_EVENT',
      WITH_USER: 'REGISTER',
      WITH_ASSISTANT: 'JOIN_OR_EXTERNAL_LINK',
    },
  },
  UN_REGISTERED_PUBLIC_EVENT: {
    physicalEvent: { NO_USER: 'ANY', WITH_USER: 'ANY', WITH_ASSISTANT: 'ANY' },
    onlineEvent: {
      NO_USER: 'REGISTER_EVENT',
      WITH_USER: 'REGISTER',
      WITH_ASSISTANT: 'JOIN_OR_EXTERNAL_LINK',
    },
    hybridEvent: {
      NO_USER: 'REGISTER_EVENT',
      WITH_USER: 'REGISTER',
      WITH_ASSISTANT: 'JOIN_OR_EXTERNAL_LINK',
    },
  },
  PRIVATE_EVENT: {
    physicalEvent: {
      NO_USER: 'PRIVATE_EVENT',
      WITH_USER: 'PRIVATE_EVENT',
      WITH_ASSISTANT: 'JOIN_OR_EXTERNAL_LINK',
    },
    onlineEvent: {
      NO_USER: 'PRIVATE_EVENT',
      WITH_USER: 'PRIVATE_EVENT',
      WITH_ASSISTANT: 'JOIN_OR_EXTERNAL_LINK',
    },
    hybridEvent: {
      NO_USER: 'PRIVATE_EVENT',
      WITH_USER: 'PRIVATE_EVENT',
      WITH_ASSISTANT: 'JOIN_OR_EXTERNAL_LINK',
    },
  },
};

export default accessActions;
