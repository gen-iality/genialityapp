import { FunctionComponent, createContext } from 'react'
import usePaymentStateHandler from './usePaymentStatehandler'

const OrganizationPaymentContext = createContext({})

export const OrganizationPaymentProvider: FunctionComponent = (props) => {
  const { children } = props

  const [state, dispatch] = usePaymentStateHandler()

  const value = {
    ...state,
    dispatch,
  }

  return (
    <OrganizationPaymentContext.Provider value={value}>
      {children}
    </OrganizationPaymentContext.Provider>
  )
}

export default OrganizationPaymentContext
