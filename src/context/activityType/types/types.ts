import * as React from 'react';
import { ActivitySubTypeValueType, ActivityTypeData, ActivityTypeValueType } from '../schema/structureInterfaces';

export type ProcessingType = {
  stoppingStreaming: boolean,
  creating: boolean,
  saving: boolean,
  deleting: boolean,
  updatingActivityType: boolean,
  updatingActivityContent: boolean,
};

export type ActivityTypeContextType = {
  is: ProcessingType,
  videoObject: any | null,
  contentSource: string | null,
  formWidgetFlow: ActivityTypeData,
  activityType: ActivityTypeValueType | null,
  activityContentType: ActivitySubTypeValueType | null,

  setActivityType: (type: ActivityTypeValueType | null) => void,
  setActivityContentType: (type: ActivitySubTypeValueType | null) => void,
  setContentSource: (input: string) => void,
  saveActivityType: () => void,
  deleteActivityType: () => void,
  saveActivityContent: () => void,
};

export type ActivityTypeProviderProps = {
  children: React.ReactNode,
};
