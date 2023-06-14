import { useReducer } from 'react'

const steps = {
  RESTING: 'RESTING',
  REQUIRING_PAYMENT: 'REQUIRING_PAYMENT',
  DISPLAYING_REGISTRATION: 'DISPLAYING_REGISTRATION',
  DISPLAYING_PAYMENT: 'DISPLAYING_PAYMENT',
  PAYING: 'PAYING',
  ERROR: 'ERROR',
  DISPLAYING_SUCCESS: 'DISPLAYING_SUCCESS',
}

const actions = {
  REQUIRE_PAYMENT: 'REQUIRE_PAYMENT',
  DISPLAY_REGISTRATION: 'DISPLAY_REGISTRATION',
  DISPLAY_PAYMENT: 'DISPLAY_PAYMENT',
  ABORT: 'ABORT',
  DISPLAY_SUCCESS: 'DISPLAY_SUCCESS',
}

const usePaymentStatehandler = () => {
  const [state, dispatch] = useReducer(reducer, { paymentstep: steps.RESTING })
  console.log('payment state', state)
  function reducer(state, action) {
    console.log('payment state reducer', state, action)
    try {
      switch (action.type) {
        case actions.ABORT:
          return { paymentstep: steps.RESTING }
        case actions.REQUIRE_PAYMENT:
          return { paymentstep: steps.REQUIRING_PAYMENT }
        case actions.DISPLAY_REGISTRATION:
          return { paymentstep: steps.DISPLAYING_REGISTRATION }
        case actions.DISPLAY_PAYMENT:
          return { paymentstep: steps.DISPLAYING_PAYMENT }
        case actions.DISPLAY_SUCCESS:
          return { paymentstep: steps.DISPLAYING_SUCCESS }
        default:
          return { paymentstep: steps.ERROR }
        //throw new Error()
      }
    } catch (e) {
      console.log('payment error', { e: e, m: e.message })
    }
  }
  return [state, dispatch]
}

export default usePaymentStatehandler
