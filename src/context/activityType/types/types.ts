import * as React from 'react';
import { ActivityTypeData, ActivityTypeValueType } from '../schema/structureInterfaces';

export type ActivityTypeContextType = {
  isStoppingStreaming: boolean,
  isCreatingActivityType: boolean,

  videoObject: any | null,
  formWidgetFlow: ActivityTypeData,

  activityType: ActivityTypeValueType | null,
  setActivityType: (type: ActivityTypeValueType) => void,
  saveActivityType: () => void,
};

export type ActivityTypeProviderProps = {
  children: React.ReactNode,
};
