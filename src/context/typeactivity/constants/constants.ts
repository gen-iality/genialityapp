import { OriginOptions, ProviderOptions, TypeActivity } from '../interfaces/interfaces';

/** data para mostrar en vimeo y youtube */
const urlVideoTypeOptions: OriginOptions[] = [
  {
    key: 'url',
    title: 'url Icon',
    image: '',
    addonBefore: '🔗',
    subtitle: 'Descripción del contenido',
    placeholder: 'https://www.ejemplo.com/watch?v=oK88Stdw0DI',
  },
];
/** data para mostrar en vimeo y youtube */
const vimeoAndYotubeType: OriginOptions[] = [
  {
    key: 'vimeo',
    title: 'Vimeo Icon',
    image: '',
    addonBefore: 'https://vimeo.com/event/',
    subtitle: 'Descripción del contenido',
    placeholder: 'vimeo id',
  },
  {
    key: 'youTube',
    title: 'youTube Icon',
    image: '',
    addonBefore: 'https://youtu.be/',
    subtitle: 'Descripción del contenido',
    placeholder: 'youtube id',
  },
];

/** data para la seleccion del origin para transmitir en eviusmeets */
const liveBroadcastTransmissionOriginType: OriginOptions[] = [
  {
    key: 'eviusMeet',
    title: 'eviusMeet',
    description: 'Vivamus magna justo.',
    image: 'https://vilmanunez.com/wp-content/uploads/2019/01/hablar-por-Instagram.png',
  },
  {
    key: 'RTMP',
    title: 'RTMP',
    description: 'Vivamus magna justo.',
    image: 'https://streamyard.com/blog/wp-content/uploads/2021/01/custom-rtmp-live-streaming-facebook.png',
  },
];

/** data de la transmision en vivo */
const liveBroadcastTransmissionType: ProviderOptions[] = [
  {
    key: 'eviusStreaming',
    title: 'Evius streaming',
    MainTitle: 'Escoge el origen de transmisión',
    description: 'Vivamus magna justo.',
    image: 'https://img.freepik.com/vector-gratis/plantilla-banner-contraccion-conexion_52683-42130.jpg',
    typeOptions: liveBroadcastTransmissionOriginType,
  },
  {
    key: 'vimeo',
    title: 'Vimeo',
    MainTitle: 'Ingrese el identificador de la conferencia/streaming',
    description: 'Vivamus magna justo.',
    image: 'https://img.freepik.com/vector-gratis/plantilla-banner-contraccion-conexion_52683-42130.jpg',
    typeOptions: vimeoAndYotubeType,
  },
  {
    key: 'youTube',
    title: 'YouTube',
    MainTitle: 'Ingrese el identificador de la conferencia/streaming',
    description: 'Vivamus magna justo.',
    image: 'https://img.freepik.com/vector-gratis/plantilla-banner-contraccion-conexion_52683-42130.jpg',
    typeOptions: vimeoAndYotubeType,
  },
];
/* Data de la seccion Video*/
const videoActivity: ProviderOptions[] = [
  {
    key: 'url',
    title: 'Url',
    image: 'https://cdn-icons-png.flaticon.com/512/455/455691.png',
    typeOptions: urlVideoTypeOptions,
  },
  {
    key: 'cargarvideo',
    title: 'Cargar video',

    image:
      'https://cdn-icons.flaticon.com/png/512/4929/premium/4929314.png?token=exp=1647648704~hmac=8d8f060ba6014e9443bb80a974645782',
  },
];

/* esta data aparece al momento de escoger un tipo de actividad*/
export const typeActivityData: TypeActivity = {
  key: 'type',
  MainTitle: 'Escoge el tipo de actividad',
  typeOptions: [
    {
      key: 'liveBroadcast',
      MainTitle: 'Escoge el tipo de transmision',
      title: 'Transmision en vivo',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Enim sagittis, faucibus risus diam pretium. Est ligula egestas turpis donec nunc, feugiat in eget. Justo turpis metus quis.',
      image:
        'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Evius_type_activity%2Ftransmision.jpg?alt=media&token=92443401-db41-485f-a411-ae113186fd9c',
      typeOptions: liveBroadcastTransmissionType,
    },
    {
      key: 'meeting',
      MainTitle: 'Crear reuniones interactivas y personalizadas con todo el poder de evius',
      title: 'Reunion',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Enim sagittis, faucibus risus diam pretium. Est ligula egestas turpis donec nunc, feugiat in eget. Justo turpis metus quis.',
      image:
        'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Evius_type_activity%2Freunion.jpg?alt=media&token=1f6ef3db-7436-4b6f-b9bf-eb10925919ad',
    },
    {
      key: 'video',
      MainTitle: 'Asignar video para la actividad',
      title: 'Video',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Enim sagittis, faucibus risus diam pretium. Est ligula egestas turpis donec nunc, feugiat in eget. Justo turpis metus quis.',
      image:
        'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Evius_type_activity%2Fvideo.jpg?alt=media&token=2a6911a5-4b0d-4c74-98e2-0e752b78b903',
      typeOptions: videoActivity,
    },
  ],
};
