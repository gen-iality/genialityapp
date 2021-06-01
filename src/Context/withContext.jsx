import React from 'react';
import { CurrentUserContext } from './userContext';
import { CurrentEventContext } from './eventContext';
import { CurrentEventUserContext } from './eventUserContext';

export default function WithEviusContext(Component) {
  return function WithEviusContextComponent(props) {
    return (
      <CurrentEventContext.Consumer>
        {(event) => (
          <CurrentUserContext.Consumer>
            {(user) => <Component cEvent={event} cUser={user} {...props} />}
          </CurrentUserContext.Consumer>
        )}
      </CurrentEventContext.Consumer>
    );
  };
}
