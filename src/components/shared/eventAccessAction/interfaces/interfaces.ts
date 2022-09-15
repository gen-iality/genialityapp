export interface useEventAccessActionInterface {
  event_access_type: string;
  type_event: string;
  current_attendee_status: string;
}

export interface attende_statusInterface {
  [current_attendee_status: string]: string;
}

export interface event_modeInterface {
  [type_event: string]: attende_statusInterface;
}

export interface accessActionsInterface {
  [event_access_type: string]: event_modeInterface;
}
