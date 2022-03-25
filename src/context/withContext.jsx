import { CurrentUserContext } from './userContext';
import { CurrentEventContext } from './eventContext';
import { CurrentEventUserContext } from './eventUserContext';
import { HelperContext } from './helperContext/helperContext';

export default function WithEviusContext(Component) {
  return function WithEviusContextComponent(props) {
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
                        {...props}
                        cHelper={helper}
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
