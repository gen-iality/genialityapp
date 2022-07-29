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
      typeName = 'Transmisión';
      break;
    case 'youTube':
      typeName = 'Transmisión';
      break;
    case 'RTMP':
      typeName = 'Transmisión';
      break;
    case 'eviusMeet':
      typeName = 'Transmisión';
      break;
    case 'eviusStreaming':
      typeName = 'GEN.iality Streaming'
      break;
    case 'quiz':
      typeName = 'Quiz'
      break;
    default:
      typeName = inputType;
  }
  return typeName;
}
