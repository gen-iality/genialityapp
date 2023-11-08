export type HelperAction = {
  type: string
  tabs?: any
  currentAuthScreen?: string
  visible?: boolean
  organizationId?: string
  defaultPositionId?: string
  organization?: string
  onlyAddOrganizationMember?: boolean
  logo?: string
  currentActivity?: object
  showNotification?: boolean | any
  params?: object | any
  eventIsActive?: boolean
  eventId?: string
  customPasswordLabel?: string
}

export type HelperContextProps = any
