import React from 'react';
import { CurrentUserContext } from './userContext';
import { CurrentEventContext } from './eventContext';
import { CurrentEventUserContext } from './eventUserContext';
import HelperContext from './HelperContext';
import { MessageController } from './MessageService';

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
                      <MessageController.Consumer>
                        {(controllerMessage) => (
                          <Component
                            cEvent={event}
                            cUser={usercurrent}
                            cEventUser={eventuser}
                            controllerMessage={controllerMessage}
                            {...props}
                            cHelper={helper}
                          />
                        )}
                      </MessageController.Consumer>
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
