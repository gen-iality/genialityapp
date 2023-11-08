import { logout } from './hooks/logOut'
import { HelperState } from './interfaces/interfaces'
import { HelperAction } from './types/types'

export const helperInitialState: HelperState = {
  reloadTemplatesCms: false,
  tabsGenerals: {},
  currentAuthScreen: 'login',
  controllerLoginVisible: {
    visible: false,
    organizationId: '',
    organization: '',
    logo: '',
    controllerLoginVisible: undefined,
  },
  currentActivity: null,
  showNotification: false,
  params: {},
  eventIsActive: true,
}

export const helperReducer = (state: HelperState, action: HelperAction) => {
  switch (action.type) {
    case 'reloadTemplatesCms':
      return {
        ...state,
        reloadTemplatesCms: true,
      }

    case 'changeTabs':
      return {
        ...state,
        tabsGenerals: action.tabs,
      }

    case 'showLogin':
      return {
        ...state,
        currentAuthScreen: 'login',
        controllerLoginVisible: {
          ...state.controllerLoginVisible,
          visible: action?.visible,
          organizationId: action.organizationId,
          organization: action.organization,
          logo: action.logo,
          customPasswordLabel: action.customPasswordLabel,
        },
      }

    case 'showRegister':
      let defaultPositionIdMod = {}
      if (typeof action.defaultPositionId !== 'undefined') {
        defaultPositionIdMod = { defaultPositionId: action.defaultPositionId }
      }
      return {
        ...state,
        currentAuthScreen: 'register',
        controllerLoginVisible: {
          ...state.controllerLoginVisible,
          visible: action?.visible,
          organizationId: action.organizationId,
          organization: action.organization,
          logo: action.logo,
          ...defaultPositionIdMod,
        },
      }

    case 'currentActivity':
      return {
        ...state,
        currentActivity: action.currentActivity,
      }

    case 'logout':
      const params = {
        showNotification: action.showNotification,
        params: action.params,
      }

      logout(params)

      return { ...state }

    case 'eventIsActive':
      const eventId = action.eventId
      state.eventIsActive = true
      /** RESTRICIONES quitar negacion en action.eventIsActive para dejar el flujo de manera correcta*/
      if (eventId) {
        return {
          ...state,
          // @ts-ignore: Unreachable code error
          eventIsActive: { ...state.eventIsActive, [eventId]: !action.eventIsActive },
        }
      }
      return {
        ...state,
        eventIsActive: true, //!action.eventIsActive,
      }

    //   case 'selectLiveBroadcast':
    //     return {
    //       ...state,
    //     };

    default:
      return state
  }
}
