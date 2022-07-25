import * as React from 'react';
import { useState } from 'react';

import { TypeActivityProvider } from '../../../context/typeactivity/typeActivityProvider';
import SubActivityContentSelector from './SubActivityContentSelector';
import { SubActivityContentSelectorProps } from './SubActivityContentSelector';

function ActivityContentSelector(props: SubActivityContentSelectorProps) {
  return (
    <TypeActivityProvider>
      <SubActivityContentSelector {...props}/>
    </TypeActivityProvider>
  );
}

export default ActivityContentSelector;
