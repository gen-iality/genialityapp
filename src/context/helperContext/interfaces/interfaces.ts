export interface controllerLoginVisible {
  visible: boolean;
  idOrganization: string;
  organization: string;
  logo: string;
}

export interface HelperState {
  reloadTemplatesCms: boolean;
  tabsGenerals: {};
  currentAuthScreen: string;
  controllerLoginVisible: controllerLoginVisible;
  currentActivity: object | null;
}

export interface remoteLogoutNotificationInterface {
  type: string;
  userName: string;
  formatMessage: ({}) => {};
}
