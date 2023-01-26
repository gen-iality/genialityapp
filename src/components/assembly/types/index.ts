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


export interface AnswerResponse {
  data:  Survey[];
  links: Links;
  meta:  Meta;
}

export interface Survey {
  _id:                       string;
  survey:                    string;
  show_horizontal_bar:       boolean;
  graphyType:                GraphyType;
  allow_vote_value_per_user: boolean | string;
  event_id:                  string;
  activity_id:               string | null;
  points:                    number;
  initialMessage:            null | string;
  time_limit:                number;
  win_Message:               null | string;
  neutral_Message:           null | string;
  lose_Message:              null | string;
  allow_anonymous_answers:   boolean | string;
  allow_gradable_survey:     boolean | string;
  hasMinimumScore:           boolean | string;
  isGlobal:                  boolean | string;
  showNoVotos:               boolean | string;
  freezeGame:                boolean;
  open:                      boolean | string;
  publish:                   boolean | string;
  minimumScore:              number;
  updated_at:                Date;
  created_at:                Date;
  questions?:                Question[];
  displayGraphsInSurveys?:   boolean | string;
  rankingVisible?:           boolean | string;
}

export enum GraphyType {
  Pie = "pie",
  X = "x",
  Y = "y",
}

export interface Question {
  title:               string;
  type:                Type;
  choices:             string[];
  id:                  string;
  image:               null;
  points:              string;
  correctAnswer?:      string;
  correctAnswerIndex?: number;
}

export enum Type {
  Checkbox = "checkbox",
  Radiogroup = "radiogroup",
}

export interface Links {
  first: string;
  last:  string;
  prev:  null;
  next:  null;
}

export interface Meta {
  current_page: number;
  from:         number;
  last_page:    number;
  path:         string;
  per_page:     number;
  to:           number;
  total:        number;
}
