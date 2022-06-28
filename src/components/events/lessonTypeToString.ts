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
      typeName = 'Vídeo'; // desde URL
      break;
    case 'vimeo':
      typeName = 'Transmisión (Vimeo)';
      break;
    case 'youTube':
      typeName = 'Transmisión (YouTube)';
      break;
    case 'RTMP':
      typeName = 'Transmisión (RTMP)';
      break;
    case 'eviusMeet':
      typeName = 'Transmisión (GEN Connect)';
      break;
    case 'eviusStreaming':
      typeName = 'GEN.iality Streaming'
      break;
    default:
      typeName = inputType;
  }
  return typeName;
}
