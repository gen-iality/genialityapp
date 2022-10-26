import type { ActivityType } from '../types/activityType';
import {
  FormType,
  WidgetType,
  MainUI,
  DeepUI,
  TypeDisplayment,
} from '@context/activityType/constants/enum';

export const activityTypeNames: { [key in ActivityType.MainUIKey]: ActivityType.Name } = {
  live: MainUI.LIVE,
  meeting: MainUI.MEETING,
  video: MainUI.VIDEO,
  quizing: MainUI.QUIZ,
  survey: MainUI.SURVEY,
  pdf: MainUI.PDF,
  html: MainUI.HTML,
};

export const activityContentValues: { [key in ActivityType.DeepUIKey]: ActivityType.ContentValue } = {
  meeting: DeepUI.MEETING,
  streaming: DeepUI.STREAMING,
  vimeo: DeepUI.VIMEO,
  youtube: DeepUI.YOUTUBE,
  url: DeepUI.URL,
  file: DeepUI.FILE,
  rtmp: DeepUI.RTMP,
  meet: DeepUI.MEET,
  quizing: DeepUI.QUIZ,
  survey: DeepUI.SURVEY,
  pdf: DeepUI.PDF,
  html: DeepUI.HTML,
};

export const typeToDisplaymentMap: ActivityType.TypeToDisplaymentMap = {
  '': '', // What happens?
  eviusStreaming: TypeDisplayment.TRANSMISSION, // ...here
  url: TypeDisplayment.VIDEO,
  meeting: TypeDisplayment.MEETING,
  vimeo: TypeDisplayment.VIMEO,
  youTube: TypeDisplayment.YOUTUBE,
  eviusMeet: TypeDisplayment.EVIUS_MEET,
  RTMP: TypeDisplayment.TRANSMISSION,
  cargarvideo: TypeDisplayment.VIDEO,
  video: TypeDisplayment.VIDEO,
  quizing: TypeDisplayment.EXAM,
  survey: TypeDisplayment.SURVEY,
  pdf: TypeDisplayment.PDF,
  html: TypeDisplayment.HTML,
};

const urlInputForms: { [key in keyof typeof activityContentValues]?: ActivityType.FormUI } = {
  url: {
    formType: FormType.INPUT,
    key: activityContentValues.url,
    title: ' ',
    image: '',
    addonBefore: '🔗',
    subtitle: '',
    placeholder: 'www.ejemplo.com/watch?v=oK88Stdw0DI',
  },
  vimeo: {
    formType: FormType.INPUT,
    key: activityContentValues.vimeo,
    title: 'Vimeo icon',
    image: 'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Evius_type_activity%2Fvimeo.jpg?alt=media&token=87b4e1e3-99dd-43e8-b6bd-a68fc03db35b',
    addonBefore: 'ID',
    subtitle: 'Coloca aquí el ID de tu transmisión de Vimeo',
    placeholder: 'vimeo id',
  },
  youtube: {
    formType: FormType.INPUT,
    key: activityContentValues.youtube,
    title: 'YouTube icon',
    image: 'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Evius_type_activity%2Fyoutube.jpg?alt=media&token=b3d20ca7-d1fa-43c7-a260-01f30a800a8a',
    addonBefore: 'https://youtu.be/',
    subtitle: 'Coloca aquí el ID o URL de tu transmisión de YouTube',
    placeholder: 'youtube id',
  },
};

const liveBroadcastTransmissionCards: ActivityType.CardUI[] = [
  {
    widgetType: WidgetType.FINAL,
    key: activityContentValues.meet,
    title: 'GEN Connect',
    description: 'La herramienta ideal para realizar tus transmisiones en vivo.',
    image: import.meta.env.VITE_IMAGE_MEETING_OPTION,
    // image: 'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Evius_type_activity%2Fevius_streaming.jpg?alt=media&token=3bdcd392-143f-4958-a1c2-f5663ff0f650',
    MainTitle: '',
  },
  {
    widgetType: WidgetType.FINAL,
    key: activityContentValues.rtmp,
    title: 'RTMP',
    description:
      'El Protocolo de mensajería en tiempo real te permite transmitir audio, vídeo y datos a través de Internet.',
    image:
      'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Evius_type_activity%2FRTMP.jpg?alt=media&token=d0c74ddc-5ad6-49bf-ad57-c1d0c02a1ee6',
    MainTitle: '',
  },
];

const liveBroadcastCards: ActivityType.CardUI[] = [
  {
    widgetType: WidgetType.CARD_SET,
    key: activityContentValues.streaming,
    title: 'GEN.iality streaming',
    MainTitle: 'Escoge el origen de transmisión',
    description: 'Configura de forma fácil y rápida una transmisión con la tecnología de GEN.iality.',
    image: import.meta.env.VITE_IMAGE_STREAMING_OPTION,
    // image: 'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Evius_type_activity%2Fevius_streaming.jpg?alt=media&token=3bdcd392-143f-4958-a1c2-f5663ff0f650',
    cards: liveBroadcastTransmissionCards,    
  },
  {
    widgetType: WidgetType.FORM,
    key: activityContentValues.vimeo,
    title: 'Vimeo',
    MainTitle: 'Ingrese el identificador de la conferencia/streaming',
    description: 'Si posees una transmisión ya configurada en Vimeo, puedes enlazarlo a GEN.iality proporcionando el ID de transmisión.',
    image: 'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Evius_type_activity%2Fvimeo.jpg?alt=media&token=87b4e1e3-99dd-43e8-b6bd-a68fc03db35b',
    form: urlInputForms.vimeo as ActivityType.FormUI,
  },
  {
    widgetType: WidgetType.FORM,
    key: activityContentValues.youtube,
    title: 'YouTube',
    MainTitle: 'Ingrese el identificador de la conferencia/streaming',
    description: 'Si posees una transmisión ya configurada en Youtube, puedes enlazarlo a GEN.iality proporcionando el ID de transmisión.',
    image: 'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Evius_type_activity%2Fyoutube.jpg?alt=media&token=b3d20ca7-d1fa-43c7-a260-01f30a800a8a',
    form: urlInputForms.youtube as ActivityType.FormUI,
  },
];

const videoActivityTypeCards: ActivityType.CardUI[] = [
  {
    widgetType: WidgetType.FORM,
    key: activityContentValues.url,
    title: 'URL',
    MainTitle: 'Agregar URL del vídeo',
    image: 'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Evius_type_activity%2Furl.jpg?alt=media&token=9bcff159-2e09-4022-add6-2108ed8c6089',
    description: '',
    form: urlInputForms.url as ActivityType.FormUI,
  },
  {
    widgetType: WidgetType.FORM,
    key: activityContentValues.file,
    title: 'Cargar vídeo',
    description: '',
    MainTitle: 'Cargue un video desde su equipo',
    image: 'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Evius_type_activity%2Fcargar_video.jpg?alt=media&token=b0990943-3563-4004-9e15-cf9dfea6805c',
    form: { formType: FormType.UPLOAD, key: activityContentValues.file, MainTitle: 'Cargue un vídeo desde su equipo'}
  },
];

const pdfForm: ActivityType.FormUI = {
  formType: FormType.INFO,
  key: activityContentValues.pdf,
  MainTitle: '',
  title: 'PDF interactivo',
  description: 'Carga un PDF iteractivo',
  image:
    'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Evius_type_activity%2Fmeeting.png?alt=media&token=02a6259b-3c30-436f-b0b0-f4cf1eecdfd6',
};

const meetingForm: ActivityType.FormUI = {
  formType: FormType.INFO,
  key: activityContentValues.meeting,
  MainTitle: '',
  title: 'GEN Connect',
  description: 'La herramienta para videoconferencias, comparte tu cámara, habla con tus participantes y presenta lo que quieras desde tu PC. Puedes personalizar el escenario a tu gusto, imágenes de fondo, recuadros o marcos para el escenario, muestra mensajes para todos, usa los colores de tu marca. Controla el acceso y lo que comparten tus participantes. Descubre esto y mucho más con GEN Connect.',
  image: 'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Evius_type_activity%2Fmeeting.png?alt=media&token=02a6259b-3c30-436f-b0b0-f4cf1eecdfd6',
};

const surveyForm: ActivityType.FormUI = {
  formType: FormType.INFO,
  key: activityContentValues.survey,
  MainTitle: '',
  title: 'Encuesta',
  description: 'Configura la encuesta.',
  image: 'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Evius_type_activity%2Fmeeting.png?alt=media&token=02a6259b-3c30-436f-b0b0-f4cf1eecdfd6',
};

const quizingForm: ActivityType.FormUI = {
  formType: FormType.INFO,
  key: activityContentValues.quizing,
  MainTitle: '',
  title: 'Quiz',
  description: 'Agrega un quiz.',
  image:
    'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Evius_type_activity%2Furl.jpg?alt=media&token=9bcff159-2e09-4022-add6-2108ed8c6089',
};

export const formWidgetFlow: ActivityType.MainUI = {
  key: 'type',
  MainTitle: 'Escoge el tipo de lección',
  cards: [
    {
      widgetType: WidgetType.CARD_SET,
      key: activityTypeNames.live,
      MainTitle: 'Escoge el tipo de transmisión',
      title: 'Transmisión en vivo',
      description: 'Lección en la que quieras presentar un en vivo para tus asistentes.',
      image: 'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Evius_type_activity%2Ftransmision.jpg?alt=media&token=92443401-db41-485f-a411-ae113186fd9c',
      cards: liveBroadcastCards,
    },
    {
      widgetType: WidgetType.FORM,
      key: activityTypeNames.meeting,
      MainTitle: 'Crear reuniones interactivas y personalizadas con todo el poder de GEN.iality',
      title: 'Reunión',
      description: 'Lección en la que quieras tener una reunión virtual con tus asistentes.',
      image: 'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Evius_type_activity%2Freunion.jpg?alt=media&token=79983d40-cb24-4ca2-9a19-794a5eeb825b',
      form: meetingForm,
    },
    {
      widgetType: WidgetType.CARD_SET,
      key: activityTypeNames.video,
      MainTitle: 'Asignar vídeo para la lección',
      title: 'Vídeo',
      description: 'Lección en la que solo quieras mostrar un vídeo para tus asistentes.',
      image: 'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Evius_type_activity%2Fvideo.jpg?alt=media&token=aa83fcb2-293e-4f2a-9d1e-128e70f84200',
      cards: videoActivityTypeCards,
    },
    {
      widgetType: WidgetType.FORM,
      key:  activityTypeNames.quizing,
      MainTitle: 'Agrega un quiz',
      title: 'Quizzes',
      description: 'Quiz para evaluar el conocimiento de tus asistentes.',
      image: 'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Evius_type_activity%2Ftransmision.jpg?alt=media&token=92443401-db41-485f-a411-ae113186fd9c',
      form: quizingForm,
    },
    {
      widgetType: WidgetType.FORM,
      key:  activityTypeNames.survey,
      MainTitle: 'Agrega una encuesta',
      title: 'Encuestas',
      description: 'En esta opción podrás agregar encuestas.',
      image: 'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Evius_type_activity%2Freunion.jpg?alt=media&token=79983d40-cb24-4ca2-9a19-794a5eeb825b',
      form: surveyForm,
    },
    {
      widgetType: WidgetType.FORM,
      key: activityTypeNames.pdf,
      MainTitle: 'Agrega un PDF interactivo',
      title: 'PDF',
      description: 'En esta opción podrás agregar PDFs interactivos',
      image:
        'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Evius_type_activity%2Freunion.jpg?alt=media&token=79983d40-cb24-4ca2-9a19-794a5eeb825b',
      form: pdfForm,
    },
  ],
};
