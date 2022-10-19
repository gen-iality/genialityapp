import { ActivityType } from "@context/activityType/types/activityType";

export default function lessonTypeToString (inputType: string) {
  let typeName = '';
  switch (inputType as ActivityType.Name & ActivityType.ContentValue & 'quiz') {
    case 'meeting':
    case 'meeting2':
      typeName = 'Reunión';
      break;
    case 'cargarvideo':
    case 'url':
    case 'video':
      typeName = 'Vídeo'; // desde URL
      break;
    case 'vimeo':
    case 'youTube':
    case 'RTMP':
    case 'eviusMeet':
    case 'eviusStreaming':
    case 'liveBroadcast':
      typeName = 'Transmisión';
      break;
    case 'quiz':
    case 'quizing':
    case 'quizing2':
      typeName = 'Quiz'
      break;
    case 'survey':
    case 'survey2':
      typeName = 'Encuesta'
      break;
    default:
      typeName = inputType;
  }
  return typeName;
}
