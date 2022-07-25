import { TypeActivityProvider } from '../../../context/typeactivity/typeActivityProvider';

import SubActivityTypeSelector from './SubActivityTypeSelector';
import { SubActivityTypeSelectorProps } from './SubActivityTypeSelector';

function ActivityTypeSelector(props: SubActivityTypeSelectorProps) {
  return (
    <TypeActivityProvider>
      <SubActivityTypeSelector {...props} />
    </TypeActivityProvider>
  );
}

export default ActivityTypeSelector;
