import {
  ActivityTypeData,
  ActivityTypeCard,
  FormStructure,
  WidgetType,
  ActivityTypeKey,
  ActivitySubTypeKey,
  FormType,
  ActivityTypeName,
  ActivitySubTypeName,
} from './structureInterfaces';

export const activityTypeKeys: { [key in ActivityTypeKey]: ActivityTypeName } = {
  live: 'liveBroadcast',
  meeting: 'meeting',
  video: 'video',
};

export const activitySubTypeKeys: { [key in ActivitySubTypeKey]: ActivitySubTypeName } = {
  meeting: 'meeting',
  streaming: 'eviusStreaming',
  vimeo: 'vimeo',
  youtube: 'youTube',
  url: 'url',
  file: 'cargarvideo',
  rtmp: 'RTMP',
  meet: 'eviusMeet',
};

const urlInputForms: { [key in keyof typeof activitySubTypeKeys]?: FormStructure } = {
  url: {
    formType: FormType.INPUT,
    key: activitySubTypeKeys.url,
    title: ' ',
    image: '',
    addonBefore: '🔗',
    subtitle: '',
    placeholder: 'www.ejemplo.com/watch?v=oK88Stdw0DI',
  },
  vimeo: {
    formType: FormType.INPUT,
    key: activitySubTypeKeys.vimeo,
    title: 'Vimeo Icon',
    image: 'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Evius_type_activity%2Fvimeo.jpg?alt=media&token=87b4e1e3-99dd-43e8-b6bd-a68fc03db35b',
    addonBefore: 'ID',
    subtitle: 'Coloca aquí el ID de tu transmisión de Vimeo',
    placeholder: 'vimeo id',
  },
  youtube: {
    formType: FormType.INPUT,
    key: activitySubTypeKeys.youtube,
    title: 'youTube Icon',
    image: 'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Evius_type_activity%2Fyoutube.jpg?alt=media&token=b3d20ca7-d1fa-43c7-a260-01f30a800a8a',
    addonBefore: 'https://youtu.be/',
    subtitle: 'Coloca aquí el ID o URL de tu transmisión de YouTube',
    placeholder: 'youtube id',
  },
};

const liveBroadcastTransmissionCards: ActivityTypeCard[] = [
  {
    widgetType: WidgetType.FINAL,
    key: activitySubTypeKeys.meet,
    title: 'EviusMeet',
    description: 'La herramienta ideal para realizar tus transmisiones en vivo.',
    image: 'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Evius_type_activity%2Fevius_streaming.jpg?alt=media&token=3bdcd392-143f-4958-a1c2-f5663ff0f650',
    MainTitle: '',
  },
  {
    widgetType: WidgetType.FINAL,
    key: activitySubTypeKeys.rtmp,
    title: 'RTMP',
    description: 'El Protocolo de mensajería en tiempo real te permite transmitir audio, video y datos a través de Internet.',
    image: 'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Evius_type_activity%2FRTMP.jpg?alt=media&token=d0c74ddc-5ad6-49bf-ad57-c1d0c02a1ee6',
    MainTitle: '',
  },
];

const liveBroadcastCards: ActivityTypeCard[] = [
  {
    widgetType: WidgetType.CARD_SET,
    key: activitySubTypeKeys.streaming,
    title: 'Evius streaming',
    MainTitle: 'Escoge el origen de transmisión',
    description: 'Configura de forma fácil y rápida una transmisión con la tecnología de Evius.',
    image: 'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Evius_type_activity%2Fevius_streaming.jpg?alt=media&token=3bdcd392-143f-4958-a1c2-f5663ff0f650',
    cards: liveBroadcastTransmissionCards,    
  },
  {
    widgetType: WidgetType.FORM,
    key: activitySubTypeKeys.vimeo,
    title: 'Vimeo',
    MainTitle: 'Ingrese el identificador de la conferencia/streaming',
    description: 'Si posees una transmisión ya configurada en Vimeo, puedes enlazarlo a Evius proporcionando el ID de transmisión.',
    image: 'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Evius_type_activity%2Fvimeo.jpg?alt=media&token=87b4e1e3-99dd-43e8-b6bd-a68fc03db35b',
    form: urlInputForms.vimeo as FormStructure,
  },
  {
    widgetType: WidgetType.FORM,
    key: activitySubTypeKeys.youtube,
    title: 'YouTube',
    MainTitle: 'Ingrese el identificador de la conferencia/streaming',
    description: 'Si posees una transmisión ya configurada en Youtube, puedes enlazarlo a Evius proporcionando el ID de transmisión.',
    image: 'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Evius_type_activity%2Fyoutube.jpg?alt=media&token=b3d20ca7-d1fa-43c7-a260-01f30a800a8a',
    form: urlInputForms.youtube as FormStructure,
  },
];

const videoActivityTypeCards: ActivityTypeCard[] = [
  {
    widgetType: WidgetType.FORM,
    key: activitySubTypeKeys.url,
    title: 'Url',
    MainTitle: 'Agregar URL del video',
    image: 'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Evius_type_activity%2Furl.jpg?alt=media&token=9bcff159-2e09-4022-add6-2108ed8c6089',
    description: '',
    form: urlInputForms.url as FormStructure,
  },
  {
    widgetType: WidgetType.FORM,
    key: activitySubTypeKeys.file,
    title: 'Cargar video',
    description: '',
    MainTitle: 'Cargue un video desde su equipo',
    image: 'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Evius_type_activity%2Fcargar_video.jpg?alt=media&token=b0990943-3563-4004-9e15-cf9dfea6805c',
    form: { formType: FormType.UPLOAD, key: activitySubTypeKeys.file, MainTitle: 'Cargue un video desde su equipo'}
  },
];

const meetingForm: FormStructure = {
  formType: FormType.INFO,
  key: activitySubTypeKeys.meeting,
  MainTitle: '',
  title: 'EviusMeet',
  description: 'La herramienta para videoconferencias, comparte tu cámara, habla con tus participantes y presenta lo que quieras desde tu PC. Puedes personalizar el escenario a tu gusto, imágenes de fondo, recuadros o marcos para el escenario, muestra mensajes para todos, usa los colores de tu marca. Controla el acceso y lo que comparten tus participantes. Descubre esto y mucho más con EviusMeet.',
  image: 'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Evius_type_activity%2Fmeeting.png?alt=media&token=02a6259b-3c30-436f-b0b0-f4cf1eecdfd6',
};

export const activityTypeData: ActivityTypeData = {
  key: 'type',
  MainTitle: 'Escoge el tipo de actividad',
  cards: [
    {
      widgetType: WidgetType.CARD_SET,
      key: activityTypeKeys.live,
      MainTitle: 'Escoge el tipo de transmisión',
      title: 'Transmisión en vivo',
      description: 'Actividad en la que quieras presentar un en vivo para tus asistentes.',
      image: 'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Evius_type_activity%2Ftransmision.jpg?alt=media&token=92443401-db41-485f-a411-ae113186fd9c',
      cards: liveBroadcastCards,
    },
    {
      widgetType: WidgetType.FORM,
      key: activityTypeKeys.meeting,
      MainTitle: 'Crear reuniones interactivas y personalizadas con todo el poder de evius',
      title: 'Reunión',
      description: 'Actividad en la que quieras tener una reunión virtual con tus asistentes.',
      image: 'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Evius_type_activity%2Freunion.jpg?alt=media&token=79983d40-cb24-4ca2-9a19-794a5eeb825b',
      form: meetingForm,
    },
    {
      widgetType: WidgetType.CARD_SET,
      key: activityTypeKeys.video,
      MainTitle: 'Asignar video para la actividad',
      title: 'Video',
      description: 'Actividad en la que solo quieras mostrar un video para tus asistentes.',
      image: 'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Evius_type_activity%2Fvideo.jpg?alt=media&token=aa83fcb2-293e-4f2a-9d1e-128e70f84200',
      cards: videoActivityTypeCards,
    },
  ],
};
