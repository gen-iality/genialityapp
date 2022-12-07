export interface Event {
	status: string;
	value: Value;
	nameEvent: string;
	isByname: boolean;
	_id: string;
}

export interface Value {
	_id: string;
	name: string;
	address: null;
	datetime_from: Date;
	datetime_to: Date;
	picture: null;
	venue: null;
	location: null;
	visibility: string;
	description: null;
	allow_register: boolean;
	type_event: string;
	where_it_run: string;
	url_external: null;
	styles: Styles;
	author_id: string;
	organizer_id: string;
	updated_at: Date;
	created_at: Date;
	user_properties: UserProperty[];
	itemsMenu: ItemsMenu;
	countdownFinalMessage: string;
	countdownMessage: string;
	dateLimit: Date;
	useCountdown: boolean;
	author: Author;
	categories: any[];
	event_type: null;
	organiser: Organi;
	organizer: Organi;
	currency: Currency;
	tickets: any[];
}

export interface Author {
	_id: string;
	picture: string;
	email: string;
	names: string;
	password: string;
	confirmation_code: string;
	api_token: string;
	uid: string;
	initial_token: string;
	refresh_token: string;
	updated_at: Date;
	created_at: Date;
}

export interface Currency {
	_id: string;
	id: number;
	title: string;
	symbol_left: string;
	symbol_right: string;
	code: string;
	decimal_place: number;
	value: number;
	decimal_point: string;
	thousand_point: string;
	status: number;
	created_at: string;
	updated_at: string;
}

export interface ItemsMenu {
	evento: Agenda;
	agenda: Agenda;
}

export interface Agenda {
	name: string;
	position: number | null;
	section: string;
	icon: string;
	checked: boolean;
	permissions: string;
}

export interface Organi {
	_id: string;
	name: string;
	styles: Styles;
	author: string;
	updated_at: Date;
	created_at: Date;
	user_properties: UserProperty[];
}

export interface Styles {
	buttonColor: string;
	banner_color: string;
	menu_color: string;
	event_image: null | string;
	banner_image: null | string;
	menu_image: null;
	banner_image_email: null;
	footer_image_email: string;
	brandPrimary: string;
	brandSuccess: string;
	brandInfo: string;
	brandDanger: string;
	containerBgColor: string;
	brandWarning: string;
	toolbarDefaultBg: string;
	brandDark: string;
	brandLight: string;
	textMenu: string;
	activeText: string;
	bgButtonsEvent: string;
	BackgroundImage: null | string;
	FooterImage: null;
	banner_footer: null | string;
	mobile_banner: null;
	banner_footer_email: null;
	show_banner: string;
	show_card_banner: boolean;
	show_inscription: boolean;
	hideDatesAgenda: boolean;
	hideDatesAgendaItem: boolean;
	hideHoursAgenda: boolean;
	hideBtnDetailAgenda: boolean;
	loader_page: string;
	data_loader_page: null;
	show_title?: boolean;
}

export interface UserProperty {
	name: string;
	label: string;
	unique: boolean;
	mandatory: boolean;
	type: string;
	updated_at: AtedAt;
	created_at: AtedAt;
	_id: ID;
}

export interface ID {
	$oid: string;
}

export interface AtedAt {
	$date: DateClass;
}

export interface DateClass {
	$numberLong: string;
}
