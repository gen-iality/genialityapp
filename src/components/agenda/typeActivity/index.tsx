;
// import withContext from '../../../context/withContext';
import { TypeActivityProvider } from '../../../context/typeactivity/typeActivityProvider';

import InitialView from './InitialView';

function TipeOfActivity({ eventId, activityId, activityName }) {
  return (
    <TypeActivityProvider>
      <InitialView eventId={eventId} activityId={activityId} activityName={activityName}/>
    </TypeActivityProvider>
  );
}
// const TipeOfActivityWithContext = withContext(TipeOfActivity);

export default TipeOfActivity;
