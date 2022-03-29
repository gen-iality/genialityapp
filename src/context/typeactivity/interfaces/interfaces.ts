export interface OriginOptions {
  key: string;
  title?: string;
  description?: string;
  image?: string;
  addonBefore?: string;
  subtitle?: string;
  placeholder?: string;
}
export interface ProviderOptions {
  key: string;
  title?: string;
  MainTitle?: string;
  description?: string;
  image?: string;
  typeOptions?: OriginOptions[];
  addonBefore?: string;
  subtitle?: string;
  placeholder?: string;
}
export interface TypeOptions {
  key: string;
  MainTitle: string;
  title: string;
  description: string;
  image: string;
  typeOptions?: ProviderOptions[] | string;
}

export interface TypeActivity {
  key: string;
  MainTitle: string;
  typeOptions: TypeOptions[];
}

export interface TypeActivityState {
  openModal: boolean;
  disableNextButton: boolean;
  typeOptions: TypeActivity | any;
  selectedKey: string;
  previewKey: string;
  data:string;
  buttonsTextNextOrCreate: string;
  buttonTextPreviousOrCancel: string;
}
