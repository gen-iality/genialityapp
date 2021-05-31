import React from 'react';
//import { userContext } from './eventUserContext';
import { CurrentUserContext } from './userContext';
import { CurrentEventContext } from './eventContext';

export default function WithEviusContext(Component) {
  return function WithEviusContextComponent(props) {
    return (
      <CurrentEventContext.Consumer>
        {(event) => (
          <CurrentUserContext.Consumer>
            {(user) => <Component cEvent={event} cUser={user} {...props} />}
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
      </CurrentEventContext.Consumer>
    );
  };
}
