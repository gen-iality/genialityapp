import { ReactNode } from 'react';
export interface extraProperties {
  callBackSelectedItem?: (data: string) => void;
  extraState?: boolean;
}
export interface AccessTypeCardInterface {
  index: string;
  icon: ReactNode;
  title: string;
  description?: string;
  extra?: ({ callBackSelectedItem, extraState }: extraProperties) => ReactNode;
  infoIcon: ReactNode[];
  callBackSelectedItem?: (data: string) => void;
  itemSelected?: string;
  extraState?: boolean;
  isCms?: boolean;
}

export type textTooltipType = string | ReactNode;
export type iconTooltipType = ReactNode;
