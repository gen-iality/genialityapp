import {
  FormType,
  WidgetType,
} from '../constants/enum';

export namespace ActivityType {
  export type MainUIKey = 'live' | 'meeting' | 'video' | 'quizing' | 'survey';
  export type DeepUIKey = 'streaming' | 'vimeo' | 'youtube' | 'url' | 'file' | 'meeting' | 'meet' | 'rtmp' | 'quizing' | 'survey';

  export type Name = 'liveBroadcast' | 'meeting2' | 'video' | 'quizing2' | 'survey2';
  export type ContentValue = '' | 'meeting' | 'eviusStreaming' | 'vimeo' | 'youTube' | 'url' | 'cargarvideo' | 'eviusMeet' | 'RTMP' | 'quizing' | 'survey';

  export type UIKey = 
    | (MainUIKey & string)
    | (DeepUIKey & string);

  export type GeneralTypeValue = 
    | (Name & string)
    | (ContentValue & string);

  export type TypeAsDisplayment = '' | 'Transmisión' | 'Video' | 'reunión' | 'vimeo' | 'Youtube' | 'EviusMeet' | 'Quizing' | 'Survey';
  export type TypeToDisplaymentMap = { [key in ContentValue]: TypeAsDisplayment } & { video: TypeAsDisplayment };

  export interface FormUI {
    formType: FormType,
    key: ContentValue,
    title?: string,
    MainTitle?: string,
    description?: string,
    image?: string,
    addonBefore?: string,
    subtitle?: string,
    placeholder?: string,
  }

  interface WidgetStringed {
    // Widget strings
    key: GeneralTypeValue,
    MainTitle: string,
    title: string,
    description: string,
    image: string,
  };

  interface WidgetStringedModeCardSet extends WidgetStringed {
    widgetType: WidgetType.CARD_SET,
    form?: undefined,
    cards: CardUI[],
  };

  interface WidgetStringedModeFinal extends WidgetStringed {
    widgetType: WidgetType.FINAL,
    form?: undefined,
    cards?: undefined,
  };

  interface WidgetStringedModeForm extends WidgetStringed {
    widgetType: WidgetType.FORM,
    form: FormUI,
    cards?: undefined,
  };

  export type CardUI = 
    | WidgetStringedModeFinal
    | WidgetStringedModeForm
    | WidgetStringedModeCardSet;

  export interface MainUI {
    key: 'type',
    MainTitle: string,
    cards: CardUI[],
  };
}
