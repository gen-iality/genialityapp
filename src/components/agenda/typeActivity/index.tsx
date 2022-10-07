// import withContext from '@context/withContext';
import { TypeActivityProvider } from '@context/typeactivity/typeActivityProvider';

import InitialView from './InitialView';

function TipeOfActivity({ eventId, activityId, activityName, tab, onDelete }) {
  return (
    <TypeActivityProvider>
      <InitialView
        eventId={eventId}
        activityId={activityId}
        tab={tab}
        activityName={activityName}
        onDelete={onDelete}
      />
    </TypeActivityProvider>
  );
}
// const TipeOfActivityWithContext = withContext(TipeOfActivity);

export default TipeOfActivity;
