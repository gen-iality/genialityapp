// import withContext from '../../../context/withContext';
import { TypeActivityProvider } from '../../../context/typeactivity/typeActivityProvider';

import SmartInitialView from './SmartInitialView';

function SmartTipeOfActivity({ eventId, activityId, activityName, hasActivityName, onSetType, showForm }) {
  return (
    <TypeActivityProvider>
      <SmartInitialView
        eventId={eventId}
        ready={ready}
        onSetType={onSetType}
        activityId={activityId}
        activityName={activityName}
        showForm={showForm}
      />
    </TypeActivityProvider>
  );
}
// const TipeOfActivityWithContext = withContext(TipeOfActivity);

export default SmartTipeOfActivity;
