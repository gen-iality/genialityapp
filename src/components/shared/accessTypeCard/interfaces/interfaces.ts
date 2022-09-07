import { ReactNode } from 'react';

export interface AccessTypeCardInterface {
  index: string;
  icon: ReactNode;
  title: string;
  description?: string;
  extra?: (data: (data: string) => void) => ReactNode;
  infoIcon: ReactNode[];
  callBackSelectedItem?: (data: string) => void;
  itemSelected?: string;
  isCms?: boolean;
}

export type textTooltipType = string | ReactNode;
export type iconTooltipType = ReactNode;
