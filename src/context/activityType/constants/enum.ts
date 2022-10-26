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

export enum MainUI {
  LIVE = 'liveBroadcast',
  MEETING = 'meeting2',
  VIDEO = 'video',
  QUIZ = 'quizing2',
  SURVEY = 'survey2',
  PDF = 'pdf2',
  HTML = 'html2',
};

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
};

export enum TypeDisplayment {
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
};
