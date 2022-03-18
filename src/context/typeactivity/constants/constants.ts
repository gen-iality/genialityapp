import { TypeActivity } from '../interfaces/interfaces';

export const typeActivityData: TypeActivity = {
  id: 'type',
  nextView: 'provider',
  prevView: 'initial',
  MainTitle: 'Escoge el tipo de transmision',
  typeOptions: [
    {
      key: 'liveBroadcast',
      title: 'Transmision en vivo',
      description: 'Vivamus magna justo.',
      image: 'https://img.freepik.com/vector-gratis/plantilla-banner-contraccion-conexion_52683-42130.jpg',
      providerOptions: [
        {
          key: 'eviusStreaming',
          title: 'Evius streaming',
          description: 'Vivamus magna justo.',
          image: 'https://img.freepik.com/vector-gratis/plantilla-banner-contraccion-conexion_52683-42130.jpg',
        },
        {
          key: 'vimeo',
          title: 'Vimeo',
          description: 'Vivamus magna justo.',
          image: 'https://img.freepik.com/vector-gratis/plantilla-banner-contraccion-conexion_52683-42130.jpg',
        },
        {
          key: 'youTube',
          title: 'YouTube',
          description: 'Vivamus magna justo.',
          image: 'https://img.freepik.com/vector-gratis/plantilla-banner-contraccion-conexion_52683-42130.jpg',
        },
      ],
    },
    {
      key: 'Meeting',
      title: 'Reunion',
      description: 'Vivamus magna justo.',
      image: 'https://img.freepik.com/free-psd/digital-marketing-agency-banner-theme_23-2148631935.jpg?w=1480',
    },
    {
      key: 'Video',
      title: 'Video',
      description: 'Vivamus magna justo.',
      image:
        'https://img.freepik.com/free-psd/banner-template-with-coffee-design_23-2148469134.jpg?t=st=1647617194~exp=1647617794~hmac=935ce116b67c63714ee3aa684b9954c897e4abbca4efac3e5abaf5d47cfb3edb&w=1480',
    },
  ],
};
