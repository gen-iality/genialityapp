import { OriginOptions, ProviderOptions, TypeActivity } from '../interfaces/interfaces';

/** data para mostrar en vimeo y youtube */
const urlVideoTypeOptions: OriginOptions[] = [
  {
    key: 'url',
    title: 'url Icon',
    image: '',
    addonBefore: '🔗',
    subtitle: 'Descripción del contenido',
    placeholder: 'llene el campo',
  },
];
/** data para mostrar en vimeo y youtube */
const vimeoAndYotubeType: OriginOptions[] = [
  {
    key: 'vimeo',
    title: 'Vimeo Icon',
    image: '',
    addonBefore: '🔗',
    subtitle: 'Descripción del contenido',
    placeholder: 'llene el campo',
  },
  {
    key: 'youTube',
    title: 'youTube Icon',
    image: '',
    addonBefore: '🔗',
    subtitle: 'Descripción del contenido',
    placeholder: 'llene el campo',
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
      description: 'Vivamus magna justo.',
      image: 'https://img.freepik.com/vector-gratis/plantilla-banner-contraccion-conexion_52683-42130.jpg',
      typeOptions: liveBroadcastTransmissionType,
    },
    {
      key: 'meeting',
      MainTitle: 'Crear reuniones interactivas y personalizadas con todo el poder de evius',
      title: 'Reunion',
      description: 'Vivamus magna justo.',
      image: 'https://img.freepik.com/free-psd/digital-marketing-agency-banner-theme_23-2148631935.jpg?w=1480',
    },
    {
      key: 'video',
      MainTitle: 'Asignar video para la actividad',
      title: 'Video',
      description: 'Vivamus magna justo.',
      image:
        'https://img.freepik.com/free-psd/banner-template-with-coffee-design_23-2148469134.jpg?t=st=1647617194~exp=1647617794~hmac=935ce116b67c63714ee3aa684b9954c897e4abbca4efac3e5abaf5d47cfb3edb&w=1480',
      typeOptions: videoActivity,
    },
  ],
};
