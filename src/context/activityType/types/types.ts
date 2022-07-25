import * as React from 'react';
import { ActivityTypeData, ActivityTypeValueType } from '../schema/structureInterfaces';

export type ActivityTypeContextType = {
  is: {
    stoppingStreaming: boolean,
    creating: boolean,
    saving: boolean,
    deleting: boolean,
    updatingActivityType: boolean,
  },

  videoObject: any | null,
  formWidgetFlow: ActivityTypeData,

  activityType: ActivityTypeValueType | null,
  setActivityType: (type: ActivityTypeValueType) => void,
  saveActivityType: () => void,
  deleteActivityType: () => void,
};

export type ActivityTypeProviderProps = {
  children: React.ReactNode,
};
