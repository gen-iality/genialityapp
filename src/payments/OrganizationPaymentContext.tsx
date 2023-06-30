import { useReducer, useEffect, useContext, type Dispatch } from 'react'
import { FunctionComponent, createContext } from 'react'

import { useCurrentUser } from '@context/userContext'
import { HelperContext } from '@context/helperContext/helperContext'

type AvailableStep =
  | 'RESTING'
  | 'REQUIRING_PAYMENT'
  | 'DISPLAYING_REGISTRATION'
  | 'DISPLAYING_PAYMENT'
  | 'PAYING'
  | 'ERROR'
  | 'DISPLAYING_SUCCESS'

type OPAction =
  | { type: 'ABORT' }
  | { type: 'SET_ATTENDEE'; payload: { cUser: any } } // That sucks, but they use `payload` so...
  | { type: 'REQUIRE_PAYMENT' }
  | { type: 'DISPLAY_REGISTRATION' }
  | { type: 'DISPLAY_PAYMENT' }
  | { type: 'DISPLAY_SUCCESS'; result?: any }
  | { type: 'GO_REST'; result?: any }

type OPState = {
  paymentStep: AvailableStep
  result?: any
  cUser?: any
  dispatch: Dispatch<OPAction>
}

const steps: { [x: string]: AvailableStep } = {
  RESTING: 'RESTING',

  REQUIRING_PAYMENT: 'REQUIRING_PAYMENT',
  DISPLAYING_REGISTRATION: 'DISPLAYING_REGISTRATION',
  DISPLAYING_PAYMENT: 'DISPLAYING_PAYMENT',
  PAYING: 'PAYING',
  ERROR: 'ERROR',
  DISPLAYING_SUCCESS: 'DISPLAYING_SUCCESS',
}

export const actions: { [x: string]: OPAction['type'] } = {
  ABORT: 'ABORT',
  GO_REST: 'GO_REST',
  SET_ATTENDEE: 'SET_ATTENDEE',
  REQUIRE_PAYMENT: 'REQUIRE_PAYMENT',
  DISPLAY_REGISTRATION: 'DISPLAY_REGISTRATION',
  DISPLAY_PAYMENT: 'DISPLAY_PAYMENT',
  DISPLAY_SUCCESS: 'DISPLAY_SUCCESS',
}

const OrganizationPaymentContext = createContext<OPState>({
  paymentStep: steps.RESTING,
  dispatch: null as any,
})

const reducerOP = (state: OPState, action: OPAction): OPState => {
  console.log('payment state reducer', state, action)

  switch (action.type) {
    case 'SET_ATTENDEE':
      console.log('usuario action', action?.payload?.cUser)
      return { ...state, cUser: action?.payload?.cUser, paymentStep: steps.RESTING }
    case 'ABORT':
      return { ...state, paymentStep: steps.RESTING }
    case 'REQUIRE_PAYMENT':
      return { ...state, paymentStep: steps.REQUIRING_PAYMENT }
    case 'DISPLAY_REGISTRATION':
      return { ...state, paymentStep: steps.DISPLAYING_REGISTRATION }
    case 'DISPLAY_PAYMENT':
      // They have to be logged in to this works
      return {
        ...state,
        paymentStep: !state.cUser
          ? steps.DISPLAYING_REGISTRATION
          : steps.DISPLAYING_PAYMENT,
      }
    case 'DISPLAY_SUCCESS':
      // With the payment result
      return {
        ...state,
        paymentStep: steps.DISPLAYING_SUCCESS,
        result: action.result,
      }
    default:
      return { ...state, paymentStep: steps.ERROR }
  }
}

export const OrganizationPaymentProvider: FunctionComponent = (props) => {
  const { children } = props

  //const { helperDispatch } = cHelper

  const cUser = useCurrentUser()
  const cHelper = useContext(HelperContext)

  {
    console.log('usuario data', cUser, cHelper.helperDispatch)
  }

  useEffect(() => {
    dispatch({ type: 'SET_ATTENDEE', payload: { cUser: cUser.value } })
  }, [cUser.value])

  const [state, dispatch] = useReducer(reducerOP, {
    paymentStep: steps.RESTING,
    result: undefined,
    dispatch: null as any,
    cUser,
  })

  if (state.paymentStep == steps.DISPLAYING_REGISTRATION) {
    cHelper.helperDispatch({
      type: 'showLogin',
      visible: true,
      organization: null,
    })
    dispatch({ type: 'GO_REST' })
  }

  return (
    <OrganizationPaymentContext.Provider
      value={{
        ...state,
        dispatch,
      }}
    >
      {children}
    </OrganizationPaymentContext.Provider>
  )
}

export default OrganizationPaymentContext
