export type ActivityTypeKey = 'live' | 'meeting' | 'video' | 'quizing' | 'survey';
export type ActivitySubTypeKey = 'streaming' | 'vimeo' | 'youtube' | 'url' | 'file' | 'meeting' | 'meet' | 'rtmp' | 'quizing' | 'survey';

export type ActivityTypeName = 'liveBroadcast' | 'meeting2' | 'video' | 'quizing2' | 'survey2';
export type ActivitySubTypeName = '' | 'meeting' | 'eviusStreaming' | 'vimeo' | 'youTube' | 'url' | 'cargarvideo' | 'eviusMeet' | 'RTMP' | 'quizing' | 'survey';

export type GeneralTypeName = 
  | (ActivityTypeKey & string)
  | (ActivitySubTypeKey & string);

export type GeneralTypeValue = 
  | (ActivityTypeName & string)
  | (ActivitySubTypeName & string);

export type SimplifiedActivityTypeValue = '' | 'Transmisión' | 'Video' | 'reunión' | 'vimeo' | 'Youtube' | 'EviusMeet' | 'Quizing' | 'Survey';
export type SimplifiedActivityTypeMap = { [key in ActivitySubTypeName]: SimplifiedActivityTypeValue } & { video: SimplifiedActivityTypeValue };

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
  key: ActivitySubTypeName;
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
