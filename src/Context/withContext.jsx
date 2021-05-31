import React from 'react';
import { UsuarioContext } from './eventUserContext';
import { CurrentUserContext } from './userContext';

//const useUser = () => useContext(UsuarioContext);

export const WithEviusContext = (Component) => (
  <UsuarioContext.Consumer>
    {(userContext) => (
      <CurrentUserContext.Consumer>
        {(userEvent) => <Component userEvent={userEvent} userContext={userContext} />}
      </CurrentUserContext.Consumer>
    )}
  </UsuarioContext.Consumer>
);
