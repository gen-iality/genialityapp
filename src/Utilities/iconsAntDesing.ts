import { logos } from '@/components/menuLanding/utils';
import * as iconComponents from '@ant-design/icons';

interface OptionsGetIconKeys {
  outlined?: boolean;
}

export const ICON_KEYS = Object.keys(iconComponents).filter((key) => !logos.includes(key));

export const iconKeyToComponent = (iconKeys: string[]) => {
  //@ts-ignore
  return iconKeys.map((key) => iconComponents[key]);
};
export const getIconKeys = (options?: OptionsGetIconKeys) => {
  return Object.keys(iconComponents).filter(
    (key) => (options?.outlined ? key.includes('Outlined') : true) && !logos.includes(key)
  );
};
