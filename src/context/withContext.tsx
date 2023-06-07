import { CurrentUserContext } from './userContext'
import { CurrentEventContext, EventContextState } from './eventContext'
import { CurrentEventUserContext, EventUserContextState } from './eventUserContext'
import { HelperContext } from './helperContext/helperContext'
import { FunctionComponent } from 'react'

export type EviusContextProps = {
  cEvent: EventContextState
  cUser: any
  cEventUser: EventUserContextState
  cHelper: any
}

export type WithEviusContextProps<T> = T & EviusContextProps

// eslint-disable-next-line no-undef
export default function WithEviusContext<K>(
  Component: (props: WithEviusContextProps<K>) => null | JSX.Element,
) {
  // type Props = Omit<K, 'cEvent' | 'cUser' | 'cEventUser' | 'cHelper'>

  const ComponentWithEviusContext: FunctionComponent<K> = (props) => (
    <CurrentEventContext.Consumer>
      {(event) => (
        <CurrentUserContext.Consumer>
          {(usercurrent) => (
            <CurrentEventUserContext.Consumer>
              {(eventuser) => (
                <HelperContext.Consumer>
                  {(helper) => (
                    <Component
                      cEvent={event}
                      cUser={usercurrent}
                      cEventUser={eventuser}
                      cHelper={helper}
                      {...props}
                    />
                  )}
                </HelperContext.Consumer>
              )}
            </CurrentEventUserContext.Consumer>
          )}
        </CurrentUserContext.Consumer>
      )}
    </CurrentEventContext.Consumer>
  )

  return ComponentWithEviusContext
}
