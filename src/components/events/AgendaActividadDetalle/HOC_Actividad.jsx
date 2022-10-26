import { SurveyProvider } from '@components/events/surveys/surveyContext';

import RenderComponent from './RenderComponent';
import StreamingActivity from './ActivityTypes/StreamingActivity';
import MeetingActivity from './ActivityTypes/MeetingActivity';
import QuizActivity from './ActivityTypes/QuizActivity';
import VideoActivity from './ActivityTypes/VideoActivity';
import GenericActivity from './ActivityTypes/GenericActivity';
import SurveyActivity from './ActivityTypes/SurveyActivity';
import PdfActivity from './ActivityTypes/PdfActivity';
import HtmlActivity from './ActivityTypes/HtmlActivity';

function ActivityTypeSwitch({ activity }) {
  console.debug(activity);
  const activityType = activity.type ? activity.type.name : 'generic';
  console.debug('HOC: activityType', activityType);
  switch (activityType) {
    case 'generic':
      return <GenericActivity />;
    case 'eviusMeet':
    case 'vimeo':
    case 'youTube':
      return <StreamingActivity />;
    case 'meeting':
      return <MeetingActivity />;
    case 'url':
    case 'cargarvideo':
      return <VideoActivity />;
    case 'pdf':
    case 'pdf2':
      return <PdfActivity />;
    case 'quiz':
    case 'quizing':
      return <SurveyProvider><QuizActivity /></SurveyProvider>;
    case 'survey':
      return <SurveyProvider><SurveyActivity /></SurveyProvider>;
    case 'html':
      return <HtmlActivity/>;
    default:
      return <GenericActivity />;
  }
}

const HOCActividad = ({ activity }) => {
  return (
    <header>
      <div>
        <ActivityTypeSwitch activity={activity} />
      </div>
    </header>
  );
};

export default HOCActividad;
