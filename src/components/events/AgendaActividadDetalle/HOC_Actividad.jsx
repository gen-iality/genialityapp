import { useHelper } from '../../../context/helperContext/hooks/useHelper';
import ImageComponentwithContext from './ImageComponent';
import RenderComponent from './RenderComponent';

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
