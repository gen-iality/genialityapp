import { HelperState } from '../interfaces/interfaces';

export type HelperAction = {
  type: string;
  tabs?: any;
  currentAuthScreen?: string;
  visible?: boolean;
  idOrganization?: string;
  organization?: string;
  logo?: string;
  currentActivity?: object;
};

export type HelperContextProps = any;
