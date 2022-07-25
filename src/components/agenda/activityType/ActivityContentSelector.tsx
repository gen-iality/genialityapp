import * as React from 'react';
import { useState } from 'react';

import { TypeActivityProvider } from '@/context/typeactivity/typeActivityProvider';
import SubActivityContentSelector from './SubActivityContentSelector';
import { SubActivityContentSelectorProps } from './SubActivityContentSelector';
import ActivityTypeProvider from '@/context/activityType/activityTypeProvider';

function ActivityContentSelector(props: SubActivityContentSelectorProps) {
  return (
    <TypeActivityProvider>
      <ActivityTypeProvider>
        <SubActivityContentSelector {...props}/>
      </ActivityTypeProvider>
    </TypeActivityProvider>
  );
}

export default ActivityContentSelector;
