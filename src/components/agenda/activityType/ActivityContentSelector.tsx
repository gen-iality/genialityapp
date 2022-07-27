import * as React from 'react';
import { useState } from 'react';

import SubActivityContentSelector from './SubActivityContentSelector';
import { SubActivityContentSelectorProps } from './SubActivityContentSelector';

function ActivityContentSelector(props: SubActivityContentSelectorProps) {
  return (
    <SubActivityContentSelector {...props}/>
  );
}

export default ActivityContentSelector;
