import React from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'

type RouterContextProps = {
  navigate: ReturnType<typeof useNavigate>
  location: ReturnType<typeof useLocation>
  params: ReturnType<typeof useParams<any>>
}
export type WithRouterProps<T = any> = T & RouterContextProps

export const withRouter = <P extends object>(
  WrappedComponent: React.ComponentType<P & WithRouterProps>,
) => {
  return (props: P) => {
    const navigate = useNavigate()
    const location = useLocation()
    const params = useParams()

    return (
      <WrappedComponent
        {...props}
        navigate={navigate}
        location={location}
        params={params}
      />
    )
  }
}
