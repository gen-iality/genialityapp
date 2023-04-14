import { TimeParameter } from "./space-requesting.interface";

export interface PropsNetworking {
	eventId: string;
}

export interface MeetConfig {
	openMeet: boolean;
	config: {
		disableInviteFunctions: boolean;
		// enableWelcomePage: boolean;
		welcomePage: {
			disabled: boolean;
			customUrl: string;
		};
		enableClosePage: boolean;
		readOnlyName: boolean;
		disablePolls: boolean;
		disableReactions: boolean;
		disableReactionsModeration: boolean;
		disableProfile: boolean;
		hideConferenceTimer: boolean;
		hideConferenceSubject: boolean;
		screenshotCapture: boolean;
		notifications: string[];
		toolbarButtons: string[];
	};
}

export interface networkingGlobalConfig {
	ConfigMeet?: MeetConfig
	ConfigTime?: TimeParameter
}
export interface IEventUser {
	_id:                      string;
	state_id:                 string;
	checked_in:               boolean;
	rol_id:                   string;
	account_id:               string;
	event_id:                 string;
	model_type:               string;
	properties:               Properties;
	private_reference_number: string;
	updated_at:               string;
	created_at:               string;
	checkedin_at:             string;
	checkedin_type:           string;
	printouts:                number;
	printouts_at:             string;
	printouts_history:        PrintoutsHistory[];
	user?:                    IUser;
	rol:                      Rol;
}
interface IUser {
	_id				: string
	picture			: string
	email				: string
	names				: string
	password			: string
	confirmation_code	: string
	api_token			: string
	uid				: string
	initial_token		: string
	refresh_token		: string
	updated_at		: string
	created_at		: string
}
export interface PrintoutsHistory {
	printouts:    number;
	printouts_at: string;
}

export interface Properties {
	names: string;
	email: string;
}

export interface Rol {
	_id:        string;
	name:       string;
	guard_name: string;
	updated_at: string;
	created_at: string;
	type:       string;
	module:     string;
}

export interface EventProps {
	event : any
}