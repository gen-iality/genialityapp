export interface ControllerLoginVisible {
  visible: boolean
  organizationId: string
  organization: string
  logo: string
  controllerLoginVisible?: string
  onlyAddOrganizationMember?: boolean
}

export interface HelperState {
  reloadTemplatesCms: boolean
  tabsGenerals: object
  currentAuthScreen: string
  controllerLoginVisible: ControllerLoginVisible
  currentActivity: object | null
  showNotification: boolean
  params: object
  eventIsActive: boolean
}

export interface logoutUser {
  uid: string
  names: string
}
export interface logoutParams {
  formatMessage: ({}) => any
  user: logoutUser
  handleChangeTypeModal: any
  /** @deprecated use resetEventUser instead */
  setuserEvent: ({}) => any
  resetEventUser: () => void
  setCurrentUser: ({}) => any
  history: any
}

export interface logoutInterface {
  showNotification: boolean
  params: logoutParams
}

export interface remoteLogoutNotificationInterface {
  type: string
  names: string
  formatMessage: ({}) => any
}
