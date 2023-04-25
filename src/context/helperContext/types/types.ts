export type HelperAction = {
  type: string;
  tabs?: any;
  currentAuthScreen?: string;
  visible?: boolean;
  idOrganization?: string;
  defaultPositionId?: string;
  organization?: string;
  logo?: string;
  currentActivity?: object;
  showNotification?: boolean | any;
  params?: object | any;
  eventIsActive?: boolean;
  eventId?: string;
};

export type HelperContextProps = any;
