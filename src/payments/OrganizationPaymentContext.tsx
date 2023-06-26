import { useReducer, type Dispatch } from 'react'
import { FunctionComponent, createContext } from 'react'
import { useCurrentUser } from '@/context/userContext'
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
  | { type: 'REQUIRE_PAYMENT' }
  | { type: 'DISPLAY_REGISTRATION' }
  | { type: 'DISPLAY_PAYMENT' }
  | { type: 'DISPLAY_SUCCESS'; result?: any }

type OPState = {
  paymentStep: AvailableStep
  result?: any
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
  REQUIRE_PAYMENT: 'REQUIRE_PAYMENT',
  DISPLAY_REGISTRATION: 'DISPLAY_REGISTRATION',
  DISPLAY_PAYMENT: 'DISPLAY_PAYMENT',
  DISPLAY_SUCCESS: 'DISPLAY_SUCCESS',
}

const OrganizationPaymentContext = createContext<OPState>({
  paymentStep: steps.RESTING,
  dispatch: null as any,
})

console.log('usuario arrancando el paymentcontext')

const reducerOP = (state: OPState, action: OPAction): OPState => {
  console.log('payment state reducer', state, action)
  console.log('usuario  en reducer context')
  switch (action.type) {
    case 'ABORT':
      return { ...state, paymentStep: steps.RESTING }
    case 'REQUIRE_PAYMENT':
      console.log('usuario  requoere', state)
      return { ...state, paymentStep: steps.REQUIRING_PAYMENT }
    case 'DISPLAY_REGISTRATION':
      return { ...state, paymentStep: steps.DISPLAYING_REGISTRATION }
    case 'DISPLAY_PAYMENT':
      let newstate = {}
      //Tiene que estar logueado para que esto suceda
      if (!state.cUser?.value) {
        newstate = { ...state, paymentStep: steps.DISPLAYING_REGISTRATION }
      } else {
        newstate = { ...state, paymentStep: steps.DISPLAYING_PAYMENT }
      }
      console.log('usuario status', state, newstate)
      return newstate
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

  const cUser = useCurrentUser()

  {
    console.log('usuario', cUser)
  }

  const [state, dispatch] = useReducer(reducerOP, {
    paymentStep: steps.RESTING,
    result: undefined,
    dispatch: null as any,
    cUser: cUser,
  })

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
