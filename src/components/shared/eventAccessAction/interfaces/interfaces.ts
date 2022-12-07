import { History } from 'history';
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

export interface EventAccessActionInterface {
	eventAction: string;
}

export interface accessActionsInterface {
	[event_access_type: string]: event_modeInterface;
}
export interface EventAccessActionButtonsInterface {
	label: string;
	action: () => void;
}
export interface informativeMessagesInterface {
	label: string;
}
export interface eventInterface {
	_id: string;
	where_it_run: string;
	url_external: string;
	redirect_activity?: string | null;
}
export interface internalOrExternalEventInterface {
	cEvent: eventInterface;
	history: History;
}
