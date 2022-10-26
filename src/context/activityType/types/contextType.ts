import { ReactNode } from 'react';
import type { ActivityType } from './activityType';

export type ProcessingType = {
  stoppingStreaming: boolean,
  creating: boolean,
  saving: boolean,
  deleting: boolean,
  updatingActivityType: boolean,
  updatingActivityContent: boolean,
};

export type OpenedWidget = ActivityType.CardUI | ActivityType.FormUI;

export type ActivityTypeContextType = {
  is: ProcessingType,
  videoObject: any | null,
  contentSource: string | null,
  formWidgetFlow: ActivityType.MainUI,
  activityType: ActivityType.Name | null,
  activityContentType: ActivityType.ContentValue | null,

  setActivityType: (type: ActivityType.Name | null) => void,
  setActivityContentType: (type: ActivityType.ContentValue | null) => void,
  setContentSource: (input: string) => void,
  saveActivityType: () => Promise<void>,
  deleteActivityType: () => Promise<void>,
  resetActivityType: (type: ActivityType.Name) => Promise<void>,
  saveActivityContent: (type?: ActivityType.ContentValue, data?: string |  null) => Promise<void>,
  translateActivityType: (type: string) => ActivityType.TypeAsDisplayment | null,
  visualizeVideo: (url: string | null, created_at: string | null, name: string | null) => void,
  executer_stopStream: () => void,
  humanizeActivityType: (type: string) => string,
};

export type ActivityTypeProviderProps = {
  children: ReactNode,
};
