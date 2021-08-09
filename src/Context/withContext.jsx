import React from 'react';
import { CurrentUserContext } from './userContext';
import { CurrentEventContext } from './eventContext';
import { CurrentEventUserContext } from './eventUserContext';
import HelperContext from './HelperContext';

export default function WithEviusContext(Component) {
  return function WithEviusContextComponent(props) {
    return (
      <CurrentEventContext.Consumer>
        {(event) => (
          <CurrentUserContext.Consumer>
            {(usercurrent) => (
              <CurrentEventUserContext.Consumer>
                {(eventuser) => (
                  <HelperContext>
                  {(helper)=>(
                    <Component cEvent={event} cUser={usercurrent} cEventUser={eventuser} {...props} cHelper={helper} />
                  )}
                  </HelperContext>
                )}
              </CurrentEventUserContext.Consumer>
            )}
          </CurrentUserContext.Consumer>
        )}
      </CurrentEventContext.Consumer>
    );
  };
}
