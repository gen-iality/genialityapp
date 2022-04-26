import { OriginOptions, ProviderOptions, TypeActivity } from '../interfaces/interfaces';

/** data para mostrar en vimeo y youtube */
const urlVideoTypeOptions: OriginOptions[] = [
  {
    key: 'url',
    title: ' ',
    image: '',
    addonBefore: '🔗',
    subtitle: '',
    placeholder: 'www.ejemplo.com/watch?v=oK88Stdw0DI',
  },
];
/** data para mostrar en vimeo y youtube */
const vimeoAndYotubeType: OriginOptions[] = [
  {
    key: 'vimeo',
    title: 'Vimeo Icon',
    image:
      'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Evius_type_activity%2Fvimeo.jpg?alt=media&token=87b4e1e3-99dd-43e8-b6bd-a68fc03db35b',
    addonBefore: 'ID',
    subtitle: 'Coloca aquí el ID de tu transmisión de Vimeo',
    placeholder: 'vimeo id',
  },
  {
    key: 'youTube',
    title: 'youTube Icon',
    image:
      'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Evius_type_activity%2Fyoutube.jpg?alt=media&token=b3d20ca7-d1fa-43c7-a260-01f30a800a8a',
    addonBefore: 'https://youtu.be/',
    subtitle: 'Coloca aquí el ID o URL de tu transmisión de YouTube',
    placeholder: 'youtube id',
  },
];

/** data para la seleccion del origin para transmitir en eviusmeets */
const liveBroadcastTransmissionOriginType: OriginOptions[] = [
  {
    key: 'eviusMeet',
    title: 'EviusMeet',
    description: 'La herramienta ideal para realizar tus transmisiones en vivo.',
    image:
      'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Evius_type_activity%2Fevius_streaming.jpg?alt=media&token=3bdcd392-143f-4958-a1c2-f5663ff0f650',
  },
  {
    key: 'RTMP',
    title: 'RTMP',
    description:
      'El Protocolo de mensajería en tiempo real te permite transmitir audio, video y datos a través de Internet.',
    image:
      'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Evius_type_activity%2FRTMP.jpg?alt=media&token=d0c74ddc-5ad6-49bf-ad57-c1d0c02a1ee6',
  },
];

/** data de la transmision en vivo */
const liveBroadcastTransmissionType: ProviderOptions[] = [
  {
    key: 'eviusStreaming',
    title: 'Evius streaming',
    MainTitle: 'Escoge el origen de transmisión',
    description: 'Configura de forma fácil y rápida una transmisión con la tecnología de Evius.',
    image:
      'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Evius_type_activity%2Fevius_streaming.jpg?alt=media&token=3bdcd392-143f-4958-a1c2-f5663ff0f650',
    typeOptions: liveBroadcastTransmissionOriginType,
  },
  {
    key: 'vimeo',
    title: 'Vimeo',
    MainTitle: 'Ingrese el identificador de la conferencia/streaming',
    description:
      'Si posees una transmisión ya configurada en Vimeo, puedes enlazarlo a Evius proporcionando el ID de transmisión.',
    image:
      'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Evius_type_activity%2Fvimeo.jpg?alt=media&token=87b4e1e3-99dd-43e8-b6bd-a68fc03db35b',
    typeOptions: vimeoAndYotubeType,
  },
  {
    key: 'youTube',
    title: 'YouTube',
    MainTitle: 'Ingrese el identificador de la conferencia/streaming',
    description:
      'Si posees una transmisión ya configurada en Youtube, puedes enlazarlo a Evius proporcionando el ID de transmisión.',
    image:
      'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Evius_type_activity%2Fyoutube.jpg?alt=media&token=b3d20ca7-d1fa-43c7-a260-01f30a800a8a',
    typeOptions: vimeoAndYotubeType,
  },
];
/* Data de la seccion Video*/
const videoActivity: ProviderOptions[] = [
  {
    key: 'url',
    title: 'Url',
    MainTitle: 'Agregar URL del video',
    image:
      'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Evius_type_activity%2Furl.jpg?alt=media&token=9bcff159-2e09-4022-add6-2108ed8c6089',
    typeOptions: urlVideoTypeOptions,
  },
  {
    key: 'cargarvideo',
    title: 'Cargar video',
    MainTitle: 'Cargue un video desde su equipo',
    image:
      'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Evius_type_activity%2Fcargar_video.jpg?alt=media&token=b0990943-3563-4004-9e15-cf9dfea6805c',
  },
];

/* esta data aparece al momento de escoger un tipo de actividad*/
export const typeActivityData: TypeActivity = {
  key: 'type',
  MainTitle: 'Escoge el tipo de actividad',
  typeOptions: [
    {
      key: 'liveBroadcast',
      MainTitle: 'Escoge el tipo de transmisión',
      title: 'Transmisión en vivo',
      description: 'Actividad en la que quieras presentar un en vivo para tus asistentes.',
      image:
        'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Evius_type_activity%2Ftransmision.jpg?alt=media&token=92443401-db41-485f-a411-ae113186fd9c',
      typeOptions: liveBroadcastTransmissionType,
    },
    {
      key: 'meeting',
      MainTitle: 'Crear reuniones interactivas y personalizadas con todo el poder de evius',
      title: 'Reunión',
      description: 'Actividad en la que quieras tener una reunión virtual con tus asistentes.',
      image:
        'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Evius_type_activity%2Freunion.jpg?alt=media&token=79983d40-cb24-4ca2-9a19-794a5eeb825b',
    },
    {
      key: 'video',
      MainTitle: 'Asignar video para la actividad',
      title: 'Video',
      description: 'Actividad en la que solo quieras mostrar un video para tus asistentes.',
      image:
        'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Evius_type_activity%2Fvideo.jpg?alt=media&token=aa83fcb2-293e-4f2a-9d1e-128e70f84200',
      typeOptions: videoActivity,
    },
  ],
};
