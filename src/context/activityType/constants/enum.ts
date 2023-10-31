export enum FormType {
  INFO = 'INFO',
  UPLOAD = 'UPLOAD',
  INPUT = 'INPUT',
}

export enum WidgetType {
  FINAL = 'FINAL', // It is the final widget, after incoming the creation
  CARD_SET = 'CARD_SET', // It can have a cards attribute
  FORM = 'FORM', // It has a form
}

export enum MainUI {
  LIVE = 'live',
  MEETING = 'meeting',
  VIDEO = 'video',
  QUIZ = 'quizing',
  SURVEY = 'survey',
  PDF = 'pdf',
  HTML = 'html',
}

export enum DeepUI {
  MEETING = 'meeting',
  STREAMING = 'eviusStreaming',
  VIMEO = 'vimeo',
  YOUTUBE = 'youTube',
  URL = 'url',
  FILE = 'cargarvideo',
  RTMP = 'RTMP',
  MEET = 'eviusMeet',
  QUIZ = 'quizing',
  SURVEY = 'survey',
  PDF = 'pdf',
  HTML = 'html',
}

export enum TypeDisplayment {
  /** @deprecated it will be removed to be added again and better */
  TRANSMISSION = 'Transmisión',
  VIDEO = 'Video',
  MEETING = 'reunión',
  VIMEO = 'vimeo',
  YOUTUBE = 'Youtube',
  EVIUS_MEET = 'EviusMeet',
  EXAM = 'Quizing',
  SURVEY = 'Survey',
  PDF = 'pdf', // TODO: this should be uppercase, but we have to check where it is used
  HTML = 'HTML',
}
