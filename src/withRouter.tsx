import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

interface WithRouterProps {
  navigate: ReturnType<typeof useNavigate>
  location: ReturnType<typeof useLocation>
}

export const withRouter = <P extends object>(
  WrappedComponent: React.ComponentType<P & WithRouterProps>,
) => {
  return (props: P) => {
    const navigate = useNavigate()
    const location = useLocation()

    return <WrappedComponent {...props} navigate={navigate} location={location} />
  }
}
