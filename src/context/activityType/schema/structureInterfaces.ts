export type ActivityTypeNameType = 'live' | 'meeting' | 'video';
export type ActivitySubTypeNameType = 'streaming' | 'vimeo' | 'youtube' | 'url' | 'file' | 'meeting';

export type ActivityTypeValueType = 'liveBroadcast' | 'meeting' | 'video';
export type ActivitySubTypeValueType = '' | 'meeting' | 'eviusStreaming' | 'vimeo' | 'youTube' | 'url' | 'cargarvideo' | 'eviusMeet' | 'RTMP';

export type GeneralTypeName = 
  | (ActivitySubTypeNameType & string)
  | (ActivityTypeNameType & string);

export type GeneralTypeValue = 
  | (ActivityTypeValueType & string)
  | (ActivitySubTypeValueType & string);

export enum FormType {
  INFO = 'INFO',
  UPLOAD = 'UPLOAD',
  INPUT = 'INPUT',
};

export enum WidgetType {
  FINAL = 'FINAL', // It is the final widget, after incoming the creation
  CARD_SET = 'CARD_SET', // It can have a cards attribute
  FORM = 'FORM', // It has a form
};

export interface FormStructure {
  formType: FormType,
  key: ActivitySubTypeValueType;
  title?: string;
  MainTitle?: string;
  description?: string;
  image?: string;
  addonBefore?: string;
  subtitle?: string;
  placeholder?: string;
}

interface WidgetStringed {
  // Widget strings
  key: GeneralTypeValue;
  MainTitle: string;
  title: string;
  description: string;
  image: string;
};

interface WidgetStringedModeCardSet extends WidgetStringed {
  widgetType: WidgetType.CARD_SET,
  form?: undefined,
  cards: ActivityTypeCard[],
};

interface WidgetStringedModeFinal extends WidgetStringed {
  widgetType: WidgetType.FINAL,
  form?: undefined,
  cards?: undefined,
};

interface WidgetStringedModeForm extends WidgetStringed {
  widgetType: WidgetType.FORM,
  form: FormStructure,
  cards?: undefined,
};

export type ActivityTypeCard = 
  | WidgetStringedModeFinal
  | WidgetStringedModeForm
  | WidgetStringedModeCardSet;

export interface ActivityTypeData {
  key: 'type';
  MainTitle: string;
  cards: ActivityTypeCard[];
};
