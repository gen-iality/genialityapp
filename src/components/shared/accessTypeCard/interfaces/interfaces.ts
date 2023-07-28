import { ReactNode } from 'react';
export interface extraProperties {
  callBackSelectedItem?: (data: string) => void;
  extraState?: boolean;
  valueInput?: number
  changeValue?: (data : any) => void;
  payment?: boolean
  currency?: 'USD' | 'COP'
  changeCurrency?: (data : string) => void;
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
  redirect?: string;
  payment?: boolean;
  valueInput?: number
  changeValue?: (data : any) => void;
  currency?: 'USD' | 'COP'
  changeCurrency?: (data : string) => void;
}

export type textTooltipType = string | ReactNode;
export type iconTooltipType = ReactNode;
