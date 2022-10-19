import { TypeActivityProvider } from '@context/typeactivity/typeActivityProvider';

import InitialView from './InitialView';

function TipeOfActivity({ eventId, activityId, activityName, tab, onDelete }: any) {
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

export default TipeOfActivity;
