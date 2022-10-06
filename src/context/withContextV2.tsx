
import { CurrentUserContext } from './userContext';
import { CurrentEventContext } from './eventContext';
import { CurrentEventUserContext } from './eventUserContext';
import { HelperContext } from './helperContext/helperContext';

// eslint-disable-next-line no-undef
export default function WithEviusContext<T>(Component: (props: any) => JSX.Element) {
  type Props = Omit<T, 'cEvent' | 'cUser' | 'cEventUser' | 'cHelper'>

  return function WithEviusContextComponent(props: Props) {
    return (
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
    );
  };
}
