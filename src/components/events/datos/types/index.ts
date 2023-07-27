export interface State {
  modal:                   boolean;
  available:               boolean;
  info:                    Info;
  newField:                boolean;
  loading:                 boolean;
  deleteModal:             boolean;
  edit:                    boolean;
  fields:                  Field[];
  properties:              Properties | null;
  value:                   string;
  visibleModal:            boolean;
  isEditTemplate:          IsEditTemplate;
  checkInExists:           boolean;
  checkInByUserType:       boolean;
  checkInByUserTypeFields: any[]
  checkInFieldsIds:        any[];
  checkInByAssembly:       boolean;
  checkInByAssemblyFields: string[];
  user_properties:         any[];
}

export interface Field {
  name:               string;
  label:              string;
  unique:             boolean;
  mandatory:          boolean;
  type:               string;
  updated_at:         Date;
  created_at:         Date;
  _id:                string;
  author:             null;
  categories:         any[];
  event_type:         null;
  organiser:          null;
  organizer:          null;
  currency:           Currency;
  tickets:            any[];
  index:              number;
  order_weight:       number;
  visibleByAdmin?:    boolean;
  visibleByContacts?: boolean;
}

export interface Currency {
  _id:            string;
  id:             number;
  title:          string;
  symbol_left:    string;
  symbol_right:   string;
  code:           string;
  decimal_place:  number;
  value:          number;
  decimal_point:  string;
  thousand_point: string;
  status:         number;
  created_at:     string;
  updated_at:     string;
}

export interface Info {
}

export interface IsEditTemplate {
  status:     boolean;
  datafields: any[];
  template:   null;
}


export interface Properties {
  user_properties: Field[]
}