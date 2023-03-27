import { accessActionsTemplate } from './accessActionsTemplate';
import { accessActionsInterface, useEventAccessActionInterface } from './interfaces/interfaces';

function eventAccessAction({
  event_access_type,
  type_event,
  current_attendee_status,
}: useEventAccessActionInterface) {
  let accessAction: string = accessActionsTemplate[event_access_type][type_event][current_attendee_status];

  return accessAction;
}

export default eventAccessAction;
