import RenderComponent from './RenderComponent';
import StreamingActivity from './ActivityTypes/StreamingActivity';
import MeetingActivity from './ActivityTypes/MeetingActivity';
import QuizActivity from './ActivityTypes/QuizActivity';
import VideoActivity from './ActivityTypes/VideoActivity';
import GenericActivity from './ActivityTypes/GenericActivity';

function ActivityTypeSwitch({ activity }) {
  let activityType = activity.type ? activity.type.name : 'generic';
  switch(activityType) {
    case 'generic':
      return (<GenericActivity />);
    case 'eviusMeet':
      return (<StreamingActivity />);
    case 'meeting':
      return (<MeetingActivity />);
    case 'url':
      return (<VideoActivity />);
    case 'quiz':
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
