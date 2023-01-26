export interface EventContext {
  status:    string;
  value:     Value;
  nameEvent: string;
  idEvent:   string;
  isByname:  boolean;
}

export interface Value {
  _id:                   string;
  name:                  string;
  address:               null;
  datetime_from:         Date;
  datetime_to:           Date;
  picture:               null;
  venue:                 null;
  location:              null;
  visibility:            string;
  description:           null;
  allow_register:        boolean;
  type_event:            string;
  where_it_run:          string;
  url_external:          null;
  styles:                Styles;
  author_id:             string;
  organizer_id:          string;
  updated_at:            Date;
  created_at:            Date;
  user_properties:       ValueUserProperty[];
  itemsMenu:             ItemsMenu;
  countdownFinalMessage: string;
  countdownMessage:      string;
  dateLimit:             Date;
  useCountdown:          boolean;
  author:                Author;
  categories:            any[];
  event_type:            null;
  organiser:             Organi;
  organizer:             Organi;
  currency:              Currency;
  tickets:               any[];
}

export interface Author {
  _id:               string;
  picture:           string;
  email:             string;
  names:             string;
  password:          string;
  confirmation_code: string;
  api_token:         string;
  uid:               string;
  initial_token:     string;
  refresh_token:     string;
  updated_at:        Date;
  created_at:        Date;
}

export interface Currency {
  _id:            string;
  id:             number;
  title:          string;
  symbol_left:    string;
  symbol_right:   null | string;
  code:           string;
  decimal_place:  number;
  value:          number;
  decimal_point:  string;
  thousand_point: string;
  status:         number;
  created_at:     string;
  updated_at:     string;
}

export interface ItemsMenu {
  evento: Agenda;
  agenda: Agenda;
}

export interface Agenda {
  name:        string;
  position:    number | null;
  section:     string;
  icon:        string;
  checked:     boolean;
  permissions: string;
}

export interface Organi {
  _id:             string;
  name:            string;
  styles:          Styles;
  author:          string;
  updated_at:      Date;
  created_at:      Date;
  user_properties: OrganiserUserProperty[];
}

export interface Styles {
  buttonColor:         string;
  banner_color:        string;
  menu_color:          string;
  event_image:         null | string;
  banner_image:        null | string;
  menu_image:          null;
  banner_image_email:  null;
  footer_image_email:  string;
  brandPrimary:        string;
  brandSuccess:        string;
  brandInfo:           string;
  brandDanger:         string;
  containerBgColor:    string;
  brandWarning:        string;
  toolbarDefaultBg:    string;
  brandDark:           string;
  brandLight:          string;
  textMenu:            string;
  activeText:          string;
  bgButtonsEvent:      string;
  BackgroundImage:     null | string;
  FooterImage:         null;
  banner_footer:       null | string;
  mobile_banner:       null;
  banner_footer_email: null;
  show_banner:         string;
  show_card_banner:    boolean;
  show_inscription:    boolean;
  hideDatesAgenda:     boolean;
  hideDatesAgendaItem: boolean;
  hideHoursAgenda:     boolean;
  hideBtnDetailAgenda: boolean;
  loader_page:         string;
  data_loader_page:    null;
  show_title?:         boolean;
}

export interface OrganiserUserProperty {
  name:       string;
  label:      string;
  unique:     boolean;
  mandatory:  boolean;
  type:       string;
  updated_at: AtedAt;
  created_at: AtedAt;
  _id:        ID;
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

export interface ValueUserProperty {
  name:            string;
  label:           string;
  unique?:         boolean;
  mandatory?:      boolean;
  type:            string;
  updated_at:      AtedAt;
  created_at:      AtedAt;
  _id:             ID;
  visibleByAdmin?: boolean;
  author?:         null;
  categories?:     any[];
  currency?:       Currency;
  event_type?:     null;
  index?:          number;
  order_weight?:   number;
  organiser?:      null;
  organizer?:      null;
  tickets?:        any[];
}


export interface Survey {
  id:                       string;
  account_id:               string;
  checked_in:               boolean;
  _id:                      string;
  checkedin_type:           string;
  printouts_history:        PrintoutsHistory[];
  created_at:               At;
  model_type?:              string;
  checkedin_at:             At;
  activityProperties:       ActivityProperty[];
  event_id:                 string;
  private_reference_number: string;
  rol:                      Rol;
  properties:               SurveyProperties;
  printouts:                number;
  rol_id:                   string;
  printouts_at:             Date;
  state_id:                 string;
  user:                     User;
  updated_at:               At;
}

export interface ActivityProperty {
  checkedin_type: string;
  activity_id:    string;
  checkedin_at:   Date;
  checked_in:     boolean;
}

export interface At {
  seconds:     number;
  nanoseconds: number;
}

export interface PrintoutsHistory {
  printouts_at: Date;
  printouts:    number;
}

export interface SurveyProperties {
  code:                 string;
  typeRegister:         string;
  email:                string;
  names:                string;
  voteWeight:           string;
  rol_id:               string;
  pesovoto?:            string;
  uid?:                 string;
  _id?:                 string;
  created_at?:          Date;
  password?:            string;
  confirmation_code?:   string;
  refresh_token?:       string;
  updated_at?:          Date;
  initial_token?:       string;
  api_token?:           string;
  numericoAVerQuePasa?: string;
}

export interface Rol {
  guard_name: string;
  created_at: Date;
  name:       string;
  type:       string;
  updated_at: Date;
  module:     string;
  _id:        string;
}

export interface User {
  names:             string;
  created_at:        Date;
  password:          string;
  initial_token:     string;
  api_token:         string;
  _id:               string;
  updated_at:        Date;
  confirmation_code: string;
  refresh_token:     string;
  uid:               string;
  email:             string;
  picture:           string;
}



export type CardStatus = 'closed' | 'opened' | 'finished';

export interface CardStatusProps {
	label: string;
	color: string;
}


export interface Attendee {
  id:                       string;
  account_id:               string;
  checked_in:               boolean;
  _id:                      string;
  checkedin_type:           string;
  printouts_history:        PrintoutsHistory[];
  created_at:               At;
  model_type:               string;
  checkedin_at:             At;
  activityProperties:       ActivityProperty[];
  event_id:                 string;
  private_reference_number: string;
  rol:                      Rol;
  properties:               AttendeeProperties;
  printouts:                number;
  rol_id:                   string;
  printouts_at:             Date;
  state_id:                 string;
  user:                     User;
  updated_at:               At;
}

export interface ActivityProperty {
  checkedin_type: string;
  activity_id:    string;
  checkedin_at:   Date;
  checked_in:     boolean;
}

export interface At {
  seconds:     number;
  nanoseconds: number;
}

export interface PrintoutsHistory {
  printouts_at: Date;
  printouts:    number;
}

export interface AttendeeProperties {
  code:         string;
  typeRegister: string;
  email:        string;
  names:        string;
  voteWeight:   string;
  rol_id:       string;
  pesovoto:     string;
}

export interface Rol {
  guard_name: string;
  created_at: Date;
  name:       string;
  type:       string;
  updated_at: Date;
  module:     string;
  _id:        string;
}

export interface User {
  names:             string;
  created_at:        Date;
  password:          string;
  initial_token:     string;
  api_token:         string;
  _id:               string;
  updated_at:        Date;
  confirmation_code: string;
  refresh_token:     string;
  uid:               string;
  email:             string;
  picture:           string;
}
