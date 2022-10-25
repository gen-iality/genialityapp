export interface EventWhereIs {
  name?: string;
  _id?: string;
}
export interface WhereIs {
  _id: string;
  name: string;
  amount_of_whereIs: string;
  regulation: string;
  event_id: string;
  updated_at: string;
  created_at: string;
  whereIs_values: WhereIsValue[];
}

export interface WhereIsValue {
  id: string;

  map?: (arg0: (whereIsValue: any, index: number) => any) => any;
}
export interface extraFields {
  label?: string;
  title?: string;
  key?: string;
  dataIndex?: string;
  type?: string;
  name: string;
  render?: (text: string, record: any, index: any) => React.ReactNode;
}
export interface ImportModalInterface {
  event: { name?: string; _id?: string };
  openAndCloseImportModal: boolean;
  setOpenAndCloseImportModal: (state: boolean) => void;
  extraFields: extraFields[];
  setFormData: (data: any) => void;
  formData: any;
  whereIs: WhereIs;
}
export interface importedItem {
  map: (data: any) => any;
  key: string;
  list: any[];
}
export interface ImportValuesInterface {
  key?: number;
  templateName: string;
  handleXls: (data: any) => any;
  extraFields: extraFields[];
  event: EventWhereIs;
  setEnableSaveButton: (state: boolean) => void;
  setImportData: (data: any) => void;
}

export interface FormDataWhereIsInterface {
  name: string;
  amount_of_whereIs: number;
  regulation: string;
  whereIs_values: WhereIsValue[];
}

export interface WhereIsDataInterface {
  active: boolean;

  index: number;
  type: string;
}
export interface PlayWhereIsInterface {
  whereIsValues: WhereIsValue[];
  event: EventWhereIs;
  notifications: any;
}

export interface WhereIsByUserInterface {
  _id: string;
  event_user_id: string;
  event_id: string;
  whereIs_id: string;

  updated_at: string;
  created_at: string;
  name_owner: string;
}

export interface DrawerWhereIsInterface {
  openOrClose: boolean;
  setOpenOrClose: (state: boolean) => void;
}

export interface DrawerButtonsInterface {
  arrayLocalStorage: number[];
  postWhereIsByUser: () => void;

  setshowDrawerChat?: (state: boolean) => void;
  setshowDrawerRules?: (state: boolean) => void;
  whereIsData?: WhereIs;
}

export interface PlayWhereIsHeaderInterface {
  whereIsValues: WhereIsValue[];
  playing: boolean;
  startGame: () => void;
  endGame: () => void;
  restartGame: () => void;
}

export interface StartGameInterface {
  event?: EventWhereIs;
  whereIsValues: WhereIsValue[];
}
export interface RestartGameInterface {
  event: EventWhereIs;
  whereIsValues: WhereIsValue[];
}
export interface EndGameInterface {
  event: EventWhereIs;
  whereIsoValues: WhereIsValue[];
}

export interface DrawerChatInterface {
  showDrawerChat: boolean;
  setshowDrawerChat: (state: any) => void;
}

export interface DrawerRulesInterface {
  showDrawerRules: boolean;
  setshowDrawerRules: (state: any) => void;
  WhereIsData?: WhereIs;
}

export interface DrawerHeaderInterface {
  cardboardCode: string;
  backgroundColor: string;
  color: string;
}
