import { useReducer, type Dispatch } from 'react'
import { FunctionComponent, createContext } from 'react'

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
  | { type: 'DISPLAY_SUCCESS'; result?: string }

type OPState = {
  paymentStep: AvailableStep
  result?: string
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

const reducerOP = (state: OPState, action: OPAction): OPState => {
  console.log('payment state reducer', state, action)

  switch (action.type) {
    case 'ABORT':
      return { ...state, paymentStep: steps.RESTING }
    case 'REQUIRE_PAYMENT':
      return { ...state, paymentStep: steps.REQUIRING_PAYMENT }
    case 'DISPLAY_REGISTRATION':
      return { ...state, paymentStep: steps.DISPLAYING_REGISTRATION }
    case 'DISPLAY_PAYMENT':
      return { ...state, paymentStep: steps.DISPLAYING_PAYMENT }
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

  const [state, dispatch] = useReducer(reducerOP, {
    paymentStep: steps.RESTING,
    result: undefined,
    dispatch: null as any,
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
