import React from 'react';
//import { userContext } from './eventUserContext';
import { CurrentUserContext } from './userContext';
import { EventContext } from './eventContext';

export default function WithEviusContext(Component) {
  return function WithEviusContextComponent(props) {
    return (
      <EventContext.Consumer>
        {(eventContext) => (
          <CurrentUserContext.Consumer>
            {(userContext) => <Component eventa={eventContext} usera={userContext} {...props} />}
          </CurrentUserContext.Consumer>
        )}
        {/* {(userContext) => (
      <CurrentUserContext.Consumer>
        {(userEvent) => <Component userEvent={userEvent} userContext={userContext} />}
      </CurrentUserContext.Consumer>

              if (context === undefined) {
          throw new Error('CountConsumer must be used within a CountProvider');
        }
    )} */}
      </EventContext.Consumer>
    );
  };
}
