export interface controllerLoginVisible {
  visible: boolean
  idOrganization: string
  organization: string
  logo: string
}

export interface HelperState {
  reloadTemplatesCms: boolean
  tabsGenerals: object
  currentAuthScreen: string
  controllerLoginVisible: controllerLoginVisible
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
  setuserEvent: ({}) => any
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
