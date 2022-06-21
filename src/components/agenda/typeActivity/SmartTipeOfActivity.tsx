// import withContext from '../../../context/withContext';
import { TypeActivityProvider } from '../../../context/typeactivity/typeActivityProvider';

import SmartInitialView from './SmartInitialView';

export interface SmartTipeOfActivityProps {
  eventId: string,
  activityId: string,
  activityName: string,
  hasActivityName: boolean,
  onSetType: (typeString: string) => void,
  showForm: boolean,
};

function SmartTipeOfActivity(props: SmartTipeOfActivityProps) {
  const {
    eventId,
    activityId,
    activityName,
    hasActivityName,
    onSetType,
    showForm,
  } = props;

  return (
    <TypeActivityProvider>
      <SmartInitialView
        eventId={eventId}
        hasActivityName={hasActivityName}
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
