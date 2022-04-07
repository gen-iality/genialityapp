export type HelperAction = {
  type: string;
  tabs?: any;
  currentAuthScreen?: string;
  visible?: boolean;
  idOrganization?: string;
  organization?: string;
  logo?: string;
  currentActivity?: object;
  showNotification?: boolean | any;
  params?: object | any;
};

export type HelperContextProps = any;
