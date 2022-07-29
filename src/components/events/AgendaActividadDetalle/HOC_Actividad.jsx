import RenderComponent from './RenderComponent';
import StreamingActivity from './ActivityTypes/StreamingActivity';
import MeetingActivity from './ActivityTypes/MeetingActivity';
import QuizActivity from './ActivityTypes/QuizActivity';
import VideoActivity from './ActivityTypes/VideoActivity';
import GenericActivity from './ActivityTypes/GenericActivity';

function ActivityTypeSwitch({ activity }) {
  console.debug(activity)
  let activityType = activity.type ? activity.type.name : 'generic';
  console.debug('HOC: activityType', activityType);
  switch(activityType) {
    case 'generic':
      return (<GenericActivity />);
    case 'eviusMeet':
    case 'vimeo':
    case 'youTube':
      return (<StreamingActivity />);
    case 'meeting':
      return (<MeetingActivity />);
    case 'url':
    case 'cargarvideo':
      return (<VideoActivity />);
    case 'quiz':
    case 'quizing':
      return (<QuizActivity />);
    default: return <GenericActivity />;
  }
}

const HCOActividad = ({ activity }) => {

  return (
    <header>
      <div>
        <ActivityTypeSwitch activity={activity} />
      </div>
    </header>
  );
};

export default HCOActividad;
