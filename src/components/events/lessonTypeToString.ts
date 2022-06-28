export default function lessonTypeToString (inputType: string) {
  let typeName = '';
  switch (inputType) {
    case 'cargarvideo':
      typeName = 'Vídeo cargado';
      break;
    case 'meeting':
      typeName = 'Reunión';
      break;
    case 'url':
      typeName = 'Vídeo desde URL';
      break;
    case 'vimeo':
      typeName = 'Transmisión de Vimeo';
      break;
    case 'youTube':
      typeName = 'Transmisión de YouTube';
      break;
    case 'RTMP':
      typeName = 'Transmisión de RTMP';
      break;
    case 'eviusMeet':
      typeName = 'Transmisión de GEN Connect';
      break;
    case 'eviusStreaming':
      typeName = 'GEN.iality Streaming'
      break;
    default:
      typeName = inputType;
  }
  return typeName;
}
