import { TypeActivityProvider } from '@/context/typeactivity/typeActivityProvider';
import ActivityTypeProvider from '@/context/activityType/activityTypeProvider';

import SubActivityTypeSelector from './SubActivityTypeSelector';
import { SubActivityTypeSelectorProps } from './SubActivityTypeSelector';

function ActivityTypeSelector(props: SubActivityTypeSelectorProps) {
  return (
    <TypeActivityProvider>
      <ActivityTypeProvider>
        <SubActivityTypeSelector {...props} />
      </ActivityTypeProvider>
    </TypeActivityProvider>
  );
}

export default ActivityTypeSelector;
